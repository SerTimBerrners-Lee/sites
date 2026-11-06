import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { request } from "node:http";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer as createSmtpServer } from "node:net";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { fileURLToPath } from "node:url";
import nodemailer from "nodemailer";
import { createLeadServer } from "../app.mjs";
import { LeadStore } from "../store.mjs";
import { readConfig } from "../config.mjs";

const payload = (overrides = {}) => ({
  name: "Тестовая Анна",
  contact: "anna@example.com",
  consent: true,
  source: "demo-middle",
  company: "",
  elapsedMs: 4000,
  ...overrides,
});
async function fixture(t, options = {}) {
  const messages = [],
    logs = [];
  const store = new LeadStore(":memory:");
  const config = {
    secret: "test-secret-not-a-real-credential-123456",
    origins: ["https://pksep.ru"],
    trustProxy: false,
    rateLimit: 100,
    globalRateLimit: 1000,
    rateWindowMs: 600000,
    minFormMs: 2000,
    maxConcurrent: 3,
    ...options.config,
  };
  const mailer = options.mailer ?? {
    verify: async () => true,
    sendMail: async (mail) => {
      messages.push(mail);
      return { accepted: ["info@pksep.ru"], rejected: [] };
    },
  };
  const server = createLeadServer({
    config,
    store,
    mailer,
    logger: (entry) => logs.push(entry),
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const url = `http://127.0.0.1:${server.address().port}`;
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    store.close();
  });
  const post = async (body = payload(), key = randomUUID(), headers = {}) => {
    const response = await fetch(url + "/api/chat/leads", {
      method: "POST",
      headers: {
        Origin: "https://pksep.ru",
        "Content-Type": "application/json",
        "Idempotency-Key": key,
        ...headers,
      },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
    return { status: response.status, body: await response.json(), response };
  };
  return { post, url, messages, logs, store };
}

test("all three sources send only to/from fixed mailbox; visitor email is Reply-To", async (t) => {
  const f = await fixture(t);
  for (const [index, source] of [
    "demo-middle",
    "demo-bottom",
    "demo-modal",
  ].entries()) {
    assert.equal(
      (await f.post(payload({ source, name: `Анна ${index}` }))).status,
      200,
    );
  }
  assert.equal(f.messages.length, 3);
  for (const mail of f.messages) {
    assert.deepEqual(mail.envelope, {
      from: "info@pksep.ru",
      to: ["info@pksep.ru"],
    });
    assert.equal(mail.from.name, "СЭП:ЧАТ");
    assert.equal(mail.subject, "Заявка на демонстрацию СЭП:ЧАТ");
    assert.match(mail.messageId, /^<chat-/);
    assert.equal(mail.from.address, "info@pksep.ru");
    assert.equal(mail.to, "info@pksep.ru");
    assert.equal(mail.replyTo.address, "anna@example.com");
    assert.equal(mail.disableFileAccess, true);
    assert.match(mail.text, /Согласие на обработку персональных данных: да/);
  }
  assert.equal(
    (await f.post(payload({ contact: "+7 (812) 309-05-42" }))).status,
    200,
  );
  assert.equal(f.messages.at(-1).replyTo, undefined);
  assert.doesNotMatch(
    JSON.stringify(f.logs),
    /anna@example|Тестовая|test-secret/,
  );
  assert.doesNotMatch(
    JSON.stringify(f.store.db.prepare("SELECT * FROM deliveries").all()),
    /anna@example|Тестовая/,
  );
});

test("server validates consent, fields, sources, honeypot, timing and header injection", async (t) => {
  const f = await fixture(t);
  for (const bad of [
    { consent: false },
    { consent: "true" },
    { name: "" },
    { name: "x".repeat(101) },
    { contact: "bad" },
    { contact: "x@example.com\r\nBcc: bad@example.com" },
    { name: "Анна\nBcc:" },
    { contact: "a(b)@example.com" },
    { source: "__proto__" },
    { source: {} },
    { company: "robot" },
    { elapsedMs: 0 },
  ]) {
    assert.equal((await f.post(payload(bad))).status, 422, JSON.stringify(bad));
  }
  assert.equal(f.messages.length, 0);
});

test("API rejects wrong origins, methods, content type, JSON and missing idempotency", async (t) => {
  const f = await fixture(t);
  assert.equal(
    (await f.post(payload(), randomUUID(), { Origin: "https://evil.example" }))
      .status,
    403,
  );
  assert.equal(
    (await f.post(payload(), randomUUID(), { "Sec-Fetch-Site": "cross-site" }))
      .status,
    403,
  );
  assert.equal((await f.post(payload(), "bad-key")).status, 400);
  assert.equal((await f.post("{bad")).status, 400);
  assert.equal(
    (await f.post(payload(), randomUUID(), { "Content-Type": "text/plain" }))
      .status,
    415,
  );
  assert.equal((await fetch(f.url + "/api/chat/leads")).status, 405);
  assert.equal((await fetch(f.url + "/other")).status, 404);
  assert.equal(f.messages.length, 0);
});

test("8KB body limit works with known length and chunked transfer without reset", async (t) => {
  const f = await fixture(t);
  assert.equal((await f.post("x".repeat(8193))).status, 413);
  const response = await new Promise((resolve, reject) => {
    const req = request(
      f.url + "/api/chat/leads",
      {
        method: "POST",
        headers: {
          Origin: "https://pksep.ru",
          "Content-Type": "application/json",
          "Idempotency-Key": randomUUID(),
          "Transfer-Encoding": "chunked",
        },
      },
      (res) => {
        res.resume();
        res.on("end", () => resolve(res));
      },
    );
    req.on("error", reject);
    req.write("x".repeat(4096));
    req.write("y".repeat(4097));
    req.end();
  });
  assert.equal(response.statusCode, 413);
  assert.equal(f.messages.length, 0);
});

test("successful replay and duplicate content from another form never send twice", async (t) => {
  const f = await fixture(t);
  const key = randomUUID();
  for (let i = 0; i < 2; i++)
    assert.equal((await f.post(payload(), key)).body.status, "sent");
  assert.equal(
    (await f.post(payload({ source: "demo-modal" }))).body.status,
    "sent",
  );
  assert.equal(f.messages.length, 1);
  assert.equal(
    (await f.post(payload({ name: "Другой" }), key)).body.code,
    "idempotency_conflict",
  );
});

test("pending requests and identical concurrent payloads cannot send again", async (t) => {
  let release, entered;
  const started = new Promise((resolve) => (entered = resolve));
  const waiting = new Promise((resolve) => (release = resolve));
  let calls = 0;
  const f = await fixture(t, {
    mailer: {
      sendMail: async () => {
        calls++;
        entered();
        await waiting;
        return { accepted: ["info@pksep.ru"] };
      },
    },
  });
  const key = randomUUID();
  const first = f.post(payload(), key);
  await started;
  assert.equal((await f.post(payload(), key)).body.code, "in_progress");
  assert.equal((await f.post(payload())).body.code, "in_progress");
  release();
  assert.equal((await first).status, 200);
  assert.equal(calls, 1);
});

test("known SMTP rejection preserves retry; ambiguous DATA timeout never auto-resends", async (t) => {
  let calls = 0;
  const f = await fixture(t, {
    mailer: {
      sendMail: async () => {
        calls++;
        if (calls === 1)
          throw Object.assign(new Error("private SMTP detail"), {
            command: "AUTH",
            responseCode: 535,
          });
        return { accepted: ["info@pksep.ru"] };
      },
    },
  });
  const key = randomUUID();
  assert.equal((await f.post(payload(), key)).body.code, "mail_unavailable");
  assert.equal((await f.post(payload(), key)).status, 200);
  assert.equal(calls, 2);
  const uncertain = await fixture(t, {
    mailer: {
      sendMail: async () => {
        throw Object.assign(new Error("secret"), { command: "DATA" });
      },
    },
  });
  const uncertainKey = randomUUID();
  assert.equal(
    (await uncertain.post(payload(), uncertainKey)).body.code,
    "delivery_unknown",
  );
  assert.equal(
    (await uncertain.post(payload(), uncertainKey)).body.code,
    "delivery_unknown",
  );
  assert.equal((await uncertain.post(payload())).body.code, "delivery_unknown");
  assert.doesNotMatch(
    JSON.stringify([...f.logs, ...uncertain.logs]),
    /private SMTP|secret|anna@example/,
  );
});

test("SMTP must explicitly accept recipient; rejected results never report success", async (t) => {
  for (const result of [
    { accepted: [], rejected: ["info@pksep.ru"] },
    { accepted: ["other@example.com"] },
    {},
  ]) {
    const f = await fixture(t, { mailer: { sendMail: async () => result } });
    assert.equal((await f.post()).status, 503);
  }
});

test("rate limiting ignores spoofed forwarding unless trusted proxy is configured", async (t) => {
  const f = await fixture(t, { config: { rateLimit: 1 } });
  assert.equal((await f.post()).status, 200);
  const limited = await f.post(payload({ name: "Другой" }), randomUUID(), {
    "X-Real-IP": "203.0.113.12",
    "X-Forwarded-For": "203.0.113.13",
  });
  assert.equal(limited.status, 429);
  assert.ok(Number(limited.response.headers.get("retry-after")) > 0);
  const global = await fixture(t, {
    config: { globalRateLimit: 1, trustProxy: true },
  });
  assert.equal((await global.post()).status, 200);
  assert.equal(
    (
      await global.post(payload(), randomUUID(), {
        "X-Real-IP": "203.0.113.12",
      })
    ).status,
    429,
  );
});

test("health is live independently of SMTP; readiness checks SMTP", async (t) => {
  const f = await fixture(t, {
    mailer: {
      verify: async () => {
        throw new Error("SMTP_PASSWORD must not leak");
      },
    },
  });
  assert.equal((await fetch(f.url + "/healthz")).status, 200);
  const response = await fetch(f.url + "/readyz");
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { status: "unavailable" });
});

test("SQLite retains sent dedupe/rates and fences interrupted sends after restart", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "sep-leads-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const path = join(dir, "leads.sqlite");
  const now = Date.now();
  let store = new LeadStore(path);
  assert.equal(store.claim("key", "content", now), "claimed");
  store.finish("key", "sent", now);
  store.claim("pending", "pending-content", now);
  store.rate("ip", 1, 600000, now);
  store.close();
  store = new LeadStore(path);
  assert.equal(store.claim("key", "content", now), "sent");
  assert.equal(store.claim("new-key", "content", now), "sent");
  assert.equal(store.claim("pending", "pending-content", now), "unknown");
  assert.equal(store.rate("ip", 1, 600000, now).allowed, false);
  store.close();
});

test("configuration fails closed for missing secrets, nonfixed mailboxes or public HTTP", () => {
  const env = {
    SMTP_HOST: "smtp.example.com",
    SMTP_USER: "info@pksep.ru",
    SMTP_PASSWORD: "test-only",
    LEADS_HMAC_SECRET: "x".repeat(32),
    ALLOWED_ORIGINS: "https://pksep.ru",
  };
  assert.equal(readConfig(env).smtp.secure, true);
  for (const overrides of [
    { SMTP_PASSWORD: "" },
    { LEADS_HMAC_SECRET: "short" },
    { MAIL_TO: "other@example.com" },
    { MAIL_FROM: "other@example.com" },
    { ALLOWED_ORIGINS: "http://pksep.ru" },
    { SMTP_SECURE: "yes" },
  ]) {
    assert.throws(() => readConfig({ ...env, ...overrides }));
  }
});

test("real Nodemailer SMTP protocol against local test server only", async (t) => {
  const envelopes = [],
    wire = [];
  const smtp = createSmtpServer((socket) => {
    socket.setEncoding("utf8");
    socket.write("220 localhost test SMTP\r\n");
    let buffer = "",
      inData = false;
    socket.on("data", (chunk) => {
      buffer += chunk;
      while (buffer.includes("\r\n")) {
        const end = buffer.indexOf("\r\n");
        const line = buffer.slice(0, end);
        buffer = buffer.slice(end + 2);
        if (inData) {
          if (line === ".") {
            inData = false;
            socket.write("250 2.0.0 test queued\r\n");
          } else wire.push(line);
        } else if (/^EHLO|^HELO/.test(line))
          socket.write("250-localhost\r\n250 PIPELINING\r\n");
        else if (/^MAIL FROM:|^RCPT TO:/.test(line)) {
          envelopes.push(line);
          socket.write("250 OK\r\n");
        } else if (line === "DATA") {
          inData = true;
          socket.write("354 End data\r\n");
        } else if (line === "QUIT") socket.end("221 Bye\r\n");
        else socket.write("250 OK\r\n");
      }
    });
  });
  await new Promise((resolve) => smtp.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve) => smtp.close(resolve)));
  const mailer = nodemailer.createTransport({
    host: "127.0.0.1",
    port: smtp.address().port,
    secure: false,
    ignoreTLS: true,
  });
  t.after(() => mailer.close());
  const f = await fixture(t, { mailer });
  assert.equal((await f.post()).body.status, "sent");
  assert.deepEqual(envelopes, [
    "MAIL FROM:<info@pksep.ru>",
    "RCPT TO:<info@pksep.ru>",
  ]);
  assert.match(wire.join("\n"), /Reply-To: anna@example.com/);
  assert.match(wire.join("\n"), /To: info@pksep.ru/);
});

test("SMTP concurrency cap rejects excess work until the active send finishes", async t => {
  let release, entered;
  const started = new Promise(resolve => entered = resolve);
  const held = new Promise(resolve => release = resolve);
  const f = await fixture(t, { config: { maxConcurrent: 1 }, mailer: { sendMail: async () => {
    entered(); await held; return { accepted: ["info@pksep.ru"] };
  } } });
  const first = f.post();
  await started;
  const busy = await f.post(payload({ name: "Другая заявка" }));
  assert.equal(busy.status, 503);
  assert.equal(busy.body.code, "busy");
  release();
  assert.equal((await first).status, 200);
});

test("production entrypoint starts from ENV, exposes health and fails closed without secrets", { timeout: 10000 }, async t => {
  const entry = new URL("../server.mjs", import.meta.url);
  const missing = spawnSync(process.execPath, [fileURLToPath(entry)], { env: {}, encoding: "utf8" });
  assert.equal(missing.status, 1);
  assert.match(missing.stderr, /startup failed/);
  const dir = mkdtempSync(join(tmpdir(), "sep-entry-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const reservation = createSmtpServer();
  await new Promise(resolve => reservation.listen(0, "127.0.0.1", resolve));
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn(process.execPath, [fileURLToPath(entry)], { env: {
    HOST: "127.0.0.1", PORT: String(port), ALLOWED_ORIGINS: "https://pksep.ru",
    SMTP_HOST: "127.0.0.1", SMTP_USER: "info@pksep.ru", SMTP_PASSWORD: "test-only-not-real-password",
    LEADS_HMAC_SECRET: "test-only-not-real-secret-123456789", LEADS_DB_PATH: join(dir, "leads.sqlite"),
  } });
  t.after(() => { if (child.exitCode === null) child.kill("SIGTERM"); });
  let output = "";
  child.stderr.on("data", chunk => output += chunk);
  await new Promise((resolve, reject) => {
    child.on("error", reject);
    child.once("exit", () => reject(new Error("backend exited before health check")));
    child.stdout.on("data", chunk => { output += chunk; if (output.includes("backend listening")) resolve(); });
  });
  const response = await fetch(`http://127.0.0.1:${port}/healthz`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: "ok" });
  const exit = once(child, "exit");
  child.kill("SIGTERM");
  assert.equal((await exit)[0], 0);
  assert.doesNotMatch(output, /test-only-not-real/);
});
