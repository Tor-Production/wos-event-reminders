import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { DatabaseSync } from "node:sqlite";
import worker, {
  deliverEvent,
  renderReminderMessage,
} from "../src/index.js";

const origin = "https://preview.example.test";
const appSource = await readFile(new URL("../public/app.js", import.meta.url), "utf8");
const indexSource = await readFile(new URL("../public/index.html", import.meta.url), "utf8");
const migrationPaths = [
  "../migrations/0001_initial.sql",
  "../migrations/0002_one_time_reminders.sql",
  "../migrations/0003_reminder_archive.sql",
  "../migrations/0004_preserve_deleted_delivery_history.sql",
  "../migrations/0005_delivery_schedule_type.sql",
];

test("canonical renderer formats recurring and one-time reminders", () => {
  const recurring = validInput({
    name: "Bear Trap 1",
    message: "🐻 Bear Trap 1 starts in 10 minutes!",
  });
  const oneTime = validInput({
    schedule_type: "one_time",
    interval_days: 1,
    name: "Foundry upgrade",
    message: "Foundry upgrade starts in 15 minutes!",
  });

  assert.equal(
    renderReminderMessage(recurring),
    "🐻 Bear Trap 1 starts in 10 minutes!",
  );
  assert.equal(
    renderReminderMessage(oneTime),
    "Foundry upgrade starts in 15 minutes!",
  );
  assert.equal(
    renderReminderMessage(recurring, { isTest: true }),
    "[TEST] 🐻 Bear Trap 1 starts in 10 minutes!",
  );
});

test("dashboard preview and scheduled recurring delivery use the canonical renderer", async (t) => {
  const context = await createContext();
  const input = validInput({ message: "Recurring message for Discord" });
  const eventId = insertEvent(context.database, input);
  const contents = captureDiscordMessages(t);

  const previewResponse = await api(context, "/api/reminder-preview", {
    method: "POST",
    body: input,
  });
  assert.equal(previewResponse.status, 200);
  const preview = await previewResponse.json();
  assert.equal(preview.message, renderReminderMessage(input));

  await deliverEvent(context.env, scheduledEvent(context.database, eventId));
  assert.deepEqual(contents, [preview.message]);
  assert.equal(deliveryCount(context.database, eventId), 1);
});

test("dashboard preview and scheduled one-time delivery use the canonical renderer", async (t) => {
  const context = await createContext();
  const input = validInput({
    schedule_type: "one_time",
    interval_days: 1,
    message: "One-time event starts in 10 minutes!",
  });
  const eventId = insertEvent(context.database, input);
  const contents = captureDiscordMessages(t);

  const response = await api(context, "/api/reminder-preview", {
    method: "POST",
    body: input,
  });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    message: renderReminderMessage(input),
  });
  await deliverEvent(context.env, scheduledEvent(context.database, eventId));
  assert.deepEqual(contents, [renderReminderMessage(input)]);
  assert.equal(eventState(context.database, eventId).terminal_status, "completed");
});

test("event test send uses unsaved values and leaves scheduling and idempotency state untouched", async (t) => {
  const context = await createContext();
  const persisted = validInput({ message: "Persisted scheduled message" });
  const eventId = insertEvent(context.database, persisted);
  const before = eventState(context.database, eventId);
  const contents = captureDiscordMessages(t);
  const unsaved = validInput({
    name: "Unsaved rename",
    message: "Unsaved preview message",
  });

  const response = await api(context, "/api/reminder-test", {
    method: "POST",
    body: unsaved,
  });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.deepEqual(contents, ["[TEST] Unsaved preview message"]);
  assert.deepEqual(eventState(context.database, eventId), before);
  assert.equal(deliveryCount(context.database, eventId), 0);

  await deliverEvent(context.env, scheduledEvent(context.database, eventId));
  assert.deepEqual(contents, [
    "[TEST] Unsaved preview message",
    "Persisted scheduled message",
  ]);
  assert.equal(deliveryCount(context.database, eventId), 1);
});

test("event preview and test endpoints require an authenticated dashboard session", async () => {
  const input = validInput();
  for (const path of ["/api/reminder-preview", "/api/reminder-test"]) {
    const response = await worker.fetch(new Request(`${origin}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin },
      body: JSON.stringify(input),
    }), {
      DASHBOARD_PASSWORD: "preview-password",
      SESSION_SECRET: "preview-session-secret",
    });
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { error: "Authentication required" });
  }
});

test("event test rejects invalid input before Discord delivery", async (t) => {
  const context = await createContext();
  let sends = 0;
  t.mock.method(globalThis, "fetch", async () => {
    sends += 1;
    return new Response(null, { status: 204 });
  });

  const response = await api(context, "/api/reminder-test", {
    method: "POST",
    body: validInput({ name: "" }),
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Name must be 1–100 characters" });
  assert.equal(sends, 0);
  assert.equal(deliveryCount(context.database), 0);
});

test("event test reports Discord delivery failures without recording a scheduled delivery", async (t) => {
  const context = await createContext();
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async () => new Response("unavailable", { status: 503 }));

  const response = await api(context, "/api/reminder-test", {
    method: "POST",
    body: validInput(),
  });

  assert.equal(response.status, 500);
  assert.deepEqual(await response.json(), {
    error: "Discord returned 503: unavailable",
  });
  assert.equal(deliveryCount(context.database), 0);
});

test("dashboard preview delegates rendering and test delivery to Worker endpoints", () => {
  assert.match(indexSource, /<h3 id="reminder-preview-title">Reminder Preview<\/h3>/);
  assert.match(indexSource, /id="event-test-button"/);
  assert.match(appSource, /const REMINDER_PREVIEW_API_PATH = "\/api\/reminder-preview"/);
  assert.match(appSource, /const REMINDER_TEST_API_PATH = "\/api\/reminder-test"/);
  assert.match(appSource, /api\(REMINDER_PREVIEW_API_PATH/);
  assert.match(appSource, /api\(REMINDER_TEST_API_PATH/);
  assert.match(appSource, /event-test-button.*disabled/s);
});

function validInput(overrides = {}) {
  return {
    name: "Reminder",
    schedule_type: "recurring",
    anchor_date: "2099-01-01",
    start_time_utc: "12:00",
    interval_days: 2,
    reminder_minutes: 10,
    message: "Reminder starts in 10 minutes!",
    enabled: true,
    ...overrides,
  };
}

async function createContext() {
  const database = new DatabaseSync(":memory:");
  database.exec("PRAGMA foreign_keys = ON");
  for (const path of migrationPaths) {
    database.exec(await readFile(new URL(path, import.meta.url), "utf8"));
  }
  database.exec("DELETE FROM deliveries; DELETE FROM events;");

  const env = {
    DB: new D1Adapter(database),
    DASHBOARD_PASSWORD: "preview-password",
    SESSION_SECRET: "preview-session-secret",
    DISCORD_WEBHOOK_URL: "https://example.test/webhook",
  };
  const login = await worker.fetch(new Request(`${origin}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: origin },
    body: JSON.stringify({ password: env.DASHBOARD_PASSWORD }),
  }), env);
  assert.equal(login.status, 200);

  return {
    database,
    env,
    cookie: login.headers.get("Set-Cookie").split(";", 1)[0],
  };
}

async function api(context, path, options = {}) {
  return worker.fetch(new Request(`${origin}${path}`, {
    method: options.method || "GET",
    headers: {
      Cookie: context.cookie,
      Origin: origin,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  }), context.env);
}

function insertEvent(database, input) {
  const nextReminderAt = "2099-01-01T11:50:00.000Z";
  return Number(database.prepare(
    `INSERT INTO events
       (name, anchor_date, start_time_utc, interval_days, reminder_minutes,
        message, enabled, next_reminder_at, schedule_type)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    input.name,
    input.anchor_date,
    input.start_time_utc,
    input.interval_days,
    input.reminder_minutes,
    input.message,
    input.enabled ? 1 : 0,
    nextReminderAt,
    input.schedule_type,
  ).lastInsertRowid);
}

function scheduledEvent(database, id) {
  return database.prepare(
    `SELECT id, name, interval_days, message, next_reminder_at, schedule_type
       FROM events WHERE id = ?`,
  ).get(id);
}

function eventState(database, id) {
  return database.prepare(
    `SELECT name, anchor_date, start_time_utc, interval_days, reminder_minutes,
            message, enabled, next_reminder_at, schedule_type, last_sent_at,
            terminal_status, completed_at, failed_at, archived_at, archived_reason
       FROM events WHERE id = ?`,
  ).get(id);
}

function deliveryCount(database, eventId = null) {
  return database.prepare(eventId === null
    ? "SELECT COUNT(*) AS count FROM deliveries"
    : "SELECT COUNT(*) AS count FROM deliveries WHERE event_id = ?",
  ).get(...(eventId === null ? [] : [eventId])).count;
}

function captureDiscordMessages(t) {
  const contents = [];
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    contents.push(JSON.parse(options.body).content);
    return new Response(null, { status: 204 });
  });
  return contents;
}

class D1Adapter {
  constructor(database) {
    this.database = database;
  }

  prepare(sql) {
    return new D1Statement(this.database, sql);
  }

  async batch(statements) {
    this.database.exec("BEGIN");
    try {
      const results = [];
      for (const statement of statements) results.push(await statement.run());
      this.database.exec("COMMIT");
      return results;
    } catch (error) {
      this.database.exec("ROLLBACK");
      throw error;
    }
  }
}

class D1Statement {
  constructor(database, sql, args = []) {
    this.database = database;
    this.sql = sql;
    this.args = args;
  }

  bind(...args) {
    return new D1Statement(this.database, this.sql, args);
  }

  async run() {
    const result = this.database.prepare(this.sql).run(...this.args);
    return { meta: { changes: result.changes } };
  }

  async first() {
    return this.database.prepare(this.sql).get(...this.args) ?? null;
  }

  async all() {
    return { results: this.database.prepare(this.sql).all(...this.args) };
  }
}
