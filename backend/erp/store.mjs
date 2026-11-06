import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

export class LeadStore {
  constructor(path) {
    if (path !== ":memory:")
      mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    this.db = new DatabaseSync(path);
    this.db.exec(`
      PRAGMA journal_mode=WAL;
      PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS deliveries (
        key TEXT PRIMARY KEY, fingerprint TEXT NOT NULL,
        status TEXT NOT NULL, updated INTEGER NOT NULL, expires INTEGER NOT NULL
      );
      CREATE INDEX IF NOT EXISTS deliveries_fingerprint ON deliveries(fingerprint);
      CREATE TABLE IF NOT EXISTS rates (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
    `);
    // A crash may have happened after SMTP accepted the message. Never resend blindly.
    this.db
      .prepare("UPDATE deliveries SET status='unknown' WHERE status='sending'")
      .run();
  }
  rate(key, limit, windowMs, now) {
    this.db.prepare("DELETE FROM rates WHERE expires <= ?").run(now);
    const row = this.db
      .prepare(
        `INSERT INTO rates(key,count,expires) VALUES (?,1,?)
      ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count,expires`,
      )
      .get(key, now + windowMs);
    return {
      allowed: row.count <= limit,
      retryAfter: Math.max(1, Math.ceil((row.expires - now) / 1000)),
    };
  }
  claim(key, fingerprint, now) {
    this.db.exec("BEGIN IMMEDIATE");
    try {
      this.db
        .prepare(
          "DELETE FROM deliveries WHERE expires <= ? AND status != 'sending'",
        )
        .run(now);
      const existing = this.db
        .prepare("SELECT * FROM deliveries WHERE key=?")
        .get(key);
      let result;
      if (existing && existing.fingerprint !== fingerprint) result = "conflict";
      else if (existing && existing.status !== "failed")
        result = existing.status;
      else {
        const duplicate = this.db
          .prepare(
            `SELECT status FROM deliveries WHERE fingerprint=?
          AND ((status='sent' AND updated>?) OR status IN ('sending','unknown')) LIMIT 1`,
          )
          .get(fingerprint, now - 600000);
        if (duplicate) result = duplicate.status;
        else {
          this.db
            .prepare(
              `INSERT INTO deliveries(key,fingerprint,status,updated,expires) VALUES (?,?,'sending',?,?)
            ON CONFLICT(key) DO UPDATE SET status='sending',updated=excluded.updated,expires=excluded.expires`,
            )
            .run(key, fingerprint, now, now + 7 * 86400000);
          result = "claimed";
        }
      }
      this.db.exec("COMMIT");
      return result;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
  finish(key, status, now) {
    this.db
      .prepare("UPDATE deliveries SET status=?,updated=?,expires=? WHERE key=?")
      .run(status, now, now + (status === "unknown" ? 7 : 1) * 86400000, key);
  }
  close() {
    this.db.close();
  }
}
