import { resolve } from "node:path";

const integer = (env, key, fallback, min, max) => {
  const value = Number(env[key] ?? fallback);
  if (!Number.isInteger(value) || value < min || value > max)
    throw new Error(`Invalid ${key}`);
  return value;
};
const boolean = (env, key, fallback) => {
  const value = env[key] ?? String(fallback);
  if (!["true", "false"].includes(value)) throw new Error(`Invalid ${key}`);
  return value === "true";
};

export function readConfig(env = process.env) {
  for (const key of [
    "SMTP_HOST",
    "SMTP_USER",
    "SMTP_PASSWORD",
    "LEADS_HMAC_SECRET",
    "ALLOWED_ORIGINS",
  ]) {
    if (!env[key]?.trim()) throw new Error(`Missing ${key}`);
  }
  if (env.LEADS_HMAC_SECRET.length < 32)
    throw new Error("LEADS_HMAC_SECRET must have at least 32 characters");
  for (const key of ["MAIL_FROM", "MAIL_TO"]) {
    if (env[key] && env[key] !== "info@pksep.ru")
      throw new Error(`${key} must be info@pksep.ru`);
  }
  const origins = env.ALLOWED_ORIGINS.split(",").map((value) => value.trim());
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.origin !== origin || !["https:", "http:"].includes(url.protocol))
      throw new Error("Invalid ALLOWED_ORIGINS");
    if (
      url.protocol !== "https:" &&
      !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    )
      throw new Error("Public origins require HTTPS");
  }
  return {
    host: env.HOST ?? "127.0.0.1",
    port: integer(env, "PORT", 3002, 1, 65535),
    origins,
    trustProxy: boolean(env, "TRUST_PROXY", false),
    secret: env.LEADS_HMAC_SECRET,
    database: resolve(env.LEADS_DB_PATH ?? "data/leads.sqlite"),
    rateWindowMs: 600000,
    rateLimit: integer(env, "LEADS_RATE_LIMIT", 5, 1, 100),
    globalRateLimit: integer(env, "LEADS_GLOBAL_RATE_LIMIT", 100, 1, 10000),
    minFormMs: integer(env, "LEADS_MIN_FORM_MS", 2000, 0, 60000),
    maxConcurrent: integer(env, "LEADS_MAX_CONCURRENT", 3, 1, 10),
    smtp: {
      host: env.SMTP_HOST,
      port: integer(env, "SMTP_PORT", 465, 1, 65535),
      secure: boolean(env, "SMTP_SECURE", true),
      user: env.SMTP_USER,
      password: env.SMTP_PASSWORD,
    },
  };
}
