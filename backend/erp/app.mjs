import { createServer } from "node:http";
import { createHmac, randomUUID } from "node:crypto";
import { isIP } from "node:net";

const MAILBOX = "info@pksep.ru";
const sources = {
  "demo-middle": "Форма в середине страницы",
  "demo-bottom": "Форма внизу страницы",
  "demo-modal": "Модальное окно",
};
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const email =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i;
const controls = /[\u0000-\u001f\u007f]/;
class RequestError extends Error {
  constructor(status, code, retryAfter) {
    super(code);
    Object.assign(this, { status, code, retryAfter });
  }
}

function validate(body, minFormMs) {
  if (!body || typeof body !== "object" || Array.isArray(body))
    throw new RequestError(422, "invalid_fields");
  const { name, contact, consent, source, company, elapsedMs } = body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.length > 100 ||
    controls.test(name) ||
    typeof contact !== "string" ||
    contact.length > 150 ||
    controls.test(contact) ||
    !(
      email.test(contact.trim()) ||
      (/^[+\d\s()−-]+$/.test(contact.trim()) &&
        /^\d{10,15}$/.test(contact.replace(/\D/g, "")))
    ) ||
    consent !== true ||
    typeof source !== "string" ||
    !Object.hasOwn(sources, source) ||
    typeof company !== "string" ||
    company.length > 200
  )
    throw new RequestError(422, "invalid_fields");
  if (company.trim()) throw new RequestError(422, "spam_rejected");
  if (
    !Number.isFinite(elapsedMs) ||
    elapsedMs < minFormMs ||
    elapsedMs > 7 * 86400000
  )
    throw new RequestError(422, "too_fast");
  return { name: name.trim(), contact: contact.trim(), consent: true, source };
}

async function readBody(request) {
  const type = request.headers["content-type"]
    ?.split(";")[0]
    .trim()
    .toLowerCase();
  if (type !== "application/json") throw new RequestError(415, "json_required");
  const length = request.headers["content-length"];
  if (length && (!/^\d+$/.test(length) || Number(length) > 8192))
    throw new RequestError(413, "request_too_large");
  // Do not use async-iterator early return: it destroys the socket before a 413.
  const bytes = await new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    const cleanup = () => {
      request.off("data", data);
      request.off("end", end);
      request.off("error", error);
      request.off("aborted", aborted);
    };
    const error = () => {
      cleanup();
      reject(new RequestError(400, "invalid_body"));
    };
    const aborted = () => error();
    const data = (chunk) => {
      size += chunk.length;
      if (size > 8192) {
        cleanup();
        request.resume();
        reject(new RequestError(413, "request_too_large"));
      } else chunks.push(chunk);
    };
    const end = () => {
      cleanup();
      resolve(Buffer.concat(chunks));
    };
    request
      .on("data", data)
      .once("end", end)
      .once("error", error)
      .once("aborted", aborted);
  });
  try {
    return JSON.parse(bytes.toString("utf8"));
  } catch {
    throw new RequestError(400, "invalid_json");
  }
}

export function createLeadServer({
  config,
  store,
  mailer,
  logger = (entry) => console.log(JSON.stringify(entry)),
}) {
  const hash = (value) =>
    createHmac("sha256", config.secret).update(value).digest("hex");
  let active = 0;
  let readiness;
  let readinessUntil = 0;
  let readinessCheck;
  const server = createServer(async (request, response) => {
    const requestId = randomUUID();
    const send = (status, body, headers = {}) => {
      if (response.destroyed || response.writableEnded) return;
      response.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Request-Id": requestId,
        ...headers,
      });
      response.end(JSON.stringify(body));
    };
    const path = request.url?.split("?")[0];
    if (path === "/healthz" && request.method === "GET")
      return send(200, { status: "ok" });
    if (path === "/readyz" && request.method === "GET") {
      if (Date.now() > readinessUntil) {
        readinessCheck ??= Promise.resolve()
          .then(() => mailer.verify())
          .then(
            () => {
              readiness = true;
            },
            () => {
              readiness = false;
            },
          )
          .finally(() => {
            readinessUntil = Date.now() + 30000;
            readinessCheck = null;
          });
        await readinessCheck;
      }
      return send(readiness ? 200 : 503, {
        status: readiness ? "ready" : "unavailable",
      });
    }
    if (path !== "/api/leads")
      return send(404, { ok: false, code: "not_found" });
    if (request.method !== "POST")
      return send(
        405,
        { ok: false, code: "method_not_allowed" },
        { Allow: "POST" },
      );
    let key;
    let claimed = false;
    try {
      const origin = request.headers.origin;
      if (
        !config.origins.includes(origin) ||
        request.headers["sec-fetch-site"] === "cross-site"
      )
        throw new RequestError(403, "origin_denied");
      let ip = request.socket.remoteAddress ?? "unknown";
      const realIp = request.headers["x-real-ip"];
      if (
        config.trustProxy &&
        ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(ip) &&
        typeof realIp === "string" &&
        isIP(realIp)
      )
        ip = realIp;
      for (const [bucket, limit] of [
        ["global", config.globalRateLimit],
        [hash(ip), config.rateLimit],
      ]) {
        const rate = store.rate(bucket, limit, config.rateWindowMs, Date.now());
        if (!rate.allowed)
          throw new RequestError(429, "rate_limited", rate.retryAfter);
      }
      const idempotencyKey = request.headers["idempotency-key"];
      if (typeof idempotencyKey !== "string" || !uuid.test(idempotencyKey))
        throw new RequestError(400, "idempotency_required");
      const lead = validate(await readBody(request), config.minFormMs);
      key = hash(idempotencyKey);
      const normalizedContact = email.test(lead.contact)
        ? lead.contact.toLowerCase()
        : lead.contact.replace(/\D/g, "");
      // Deduplicate identical content even when submitted from another form.
      const fingerprint = hash(
        JSON.stringify([
          lead.name.toLowerCase(),
          normalizedContact,
          lead.consent,
        ]),
      );
      if (active >= config.maxConcurrent)
        throw new RequestError(503, "busy", 10);
      const claim = store.claim(key, fingerprint, Date.now());
      if (claim === "sent")
        return send(200, { ok: true, status: "sent", requestId });
      if (claim === "sending") throw new RequestError(409, "in_progress", 5);
      if (claim === "unknown") throw new RequestError(503, "delivery_unknown");
      if (claim === "conflict")
        throw new RequestError(409, "idempotency_conflict");
      claimed = true;
      active++;
      let result;
      try {
        result = await mailer.sendMail({
          from: { name: "СЭП ERP", address: MAILBOX },
          to: MAILBOX,
          envelope: { from: MAILBOX, to: [MAILBOX] },
          ...(email.test(lead.contact)
            ? { replyTo: { address: lead.contact } }
            : {}),
          subject: "Заявка на демонстрацию СЭП ERP",
          messageId: `<erp-${key}@pksep.ru>`,
          text: `Новая заявка СЭП ERP\n\nИмя: ${lead.name}\nКонтакт: ${lead.contact}\nСогласие на обработку персональных данных: да\nИсточник: ${sources[lead.source]} (${lead.source})\nВремя: ${new Date().toISOString()}\nИдентификатор: ${requestId}`,
          disableFileAccess: true,
          disableUrlAccess: true,
        });
      } catch (error) {
        // A DATA timeout/disconnect can happen after acceptance. Retrying could send twice.
        const uncertain =
          !Number.isInteger(error.responseCode) &&
          ![
            "CONN",
            "EHLO",
            "HELO",
            "STARTTLS",
            "AUTH",
            "AUTH PLAIN",
            "AUTH LOGIN",
            "MAIL FROM",
            "RCPT TO",
          ].includes(error.command);
        store.finish(key, uncertain ? "unknown" : "failed", Date.now());
        claimed = false;
        throw new RequestError(
          503,
          uncertain ? "delivery_unknown" : "mail_unavailable",
        );
      } finally {
        active--;
      }
      if (
        !result.accepted?.some(
          (address) => String(address).toLowerCase() === MAILBOX,
        ) ||
        result.rejected?.length
      ) {
        store.finish(key, "failed", Date.now());
        claimed = false;
        throw new RequestError(503, "mail_unavailable");
      }
      store.finish(key, "sent", Date.now());
      claimed = false;
      logger({ event: "lead_sent", requestId });
      return send(200, { ok: true, status: "sent", requestId });
    } catch (error) {
      // No raw SMTP error, body, IP, contact or credentials are ever logged.
      if (claimed) {
        try {
          store.finish(key, "unknown", Date.now());
        } catch {
          /* Keep durable sending state. */
        }
      }
      const status = error instanceof RequestError ? error.status : 503;
      const code = error instanceof RequestError ? error.code : "unavailable";
      logger({ event: "lead_rejected", requestId, code });
      request.resume();
      return send(
        status,
        { ok: false, code, requestId },
        error.retryAfter ? { "Retry-After": String(error.retryAfter) } : {},
      );
    }
  });
  server.requestTimeout = 10000;
  server.headersTimeout = 10000;
  server.keepAliveTimeout = 5000;
  return server;
}
