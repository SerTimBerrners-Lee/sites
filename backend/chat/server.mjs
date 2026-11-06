import nodemailer from "nodemailer";
import { readConfig } from "./config.mjs";
import { LeadStore } from "./store.mjs";
import { createLeadServer } from "./app.mjs";

// Also protects the SQLite file/WAL containing keyed hashes, never raw lead data.
process.umask(0o077);
let server;
let store;
let transport;
try {
  const config = readConfig();
  store = new LeadStore(config.database);
  transport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    requireTLS: !config.smtp.secure,
    auth: { user: config.smtp.user, pass: config.smtp.password },
    tls: { minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
    disableFileAccess: true,
    disableUrlAccess: true,
    logger: false,
    debug: false,
  });
  server = createLeadServer({ config, store, mailer: transport });
  server.on("error", () => {
    console.error("Chat backend listen error");
    process.exitCode = 1;
    store.close();
  });
  server.listen(config.port, config.host, () =>
    console.log("Chat leads backend listening"),
  );
} catch {
  // Deliberately never serialize configuration/SMTP errors (may contain credentials).
  console.error(
    "Chat backend startup failed; check server ENV, Node version and database permissions",
  );
  process.exitCode = 1;
}
let closing = false;
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => {
    if (closing) return;
    closing = true;
    server?.close(() => {
      transport?.close();
      store?.close();
    });
  });
