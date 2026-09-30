import http from "node:http";
import { DatabaseSync } from "node:sqlite";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  DEFAULT_SETTINGS,
  validateSettings,
  validateTarget,
  validateWorkout,
} from "./shared/training.mjs";

const root = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 5173);
const dataDirectory = process.env.DATA_DIR || path.join(root, "data");
await mkdir(dataDirectory, { recursive: true });
const db = new DatabaseSync(path.join(dataDirectory, "form.sqlite"));
db.exec(`PRAGMA journal_mode = WAL;
  CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY CHECK (id = 1), value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS targets (id TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS workouts (id TEXT PRIMARY KEY, value TEXT NOT NULL);`);
db.prepare("INSERT OR IGNORE INTO preferences (id, value) VALUES (1, ?)").run(
  JSON.stringify(DEFAULT_SETTINGS),
);
const development = process.argv.includes("--dev");
const vite = development
  ? await (
      await import("vite")
    ).createServer({ root, server: { middlewareMode: true }, appType: "spa" })
  : null;
function json(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}
async function body(req) {
  let text = "";
  for await (const chunk of req) {
    text += chunk;
    if (text.length > 100_000) throw new Error("Request too large.");
  }
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid request.");
  }
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (url.pathname.startsWith("/api/")) {
    const origin = req.headers.origin;
    if (
      origin &&
      ![`http://localhost:${port}`, `http://127.0.0.1:${port}`].includes(origin)
    )
      return json(res, 403, {
        error: "This local app only accepts requests from its own window.",
      });
    if (
      !["localhost", "127.0.0.1"].includes(
        (req.headers.host || "").split(":")[0],
      )
    )
      return json(res, 403, { error: "Invalid host." });
    try {
      if (req.method === "GET" && url.pathname === "/api/state")
        return json(res, 200, {
          settings: JSON.parse(
            db.prepare("SELECT value FROM preferences WHERE id = 1").get()
              .value,
          ),
          targets: Object.fromEntries(
            db
              .prepare("SELECT id, value FROM targets")
              .all()
              .map((r) => [r.id, JSON.parse(r.value)]),
          ),
          workouts: db
            .prepare("SELECT value FROM workouts ORDER BY rowid DESC")
            .all()
            .map((r) => JSON.parse(r.value)),
        });
      if (req.method === "PUT" && url.pathname === "/api/settings") {
        const settings = validateSettings(await body(req));
        db.prepare("UPDATE preferences SET value = ? WHERE id = 1").run(
          JSON.stringify(settings),
        );
        return json(res, 200, settings);
      }
      if (req.method === "PUT" && url.pathname === "/api/targets") {
        const target = validateTarget(await body(req));
        db.prepare(
          "INSERT INTO targets (id, value) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET value = excluded.value",
        ).run(target.id, JSON.stringify(target));
        return json(res, 200, target);
      }
      if (req.method === "POST" && url.pathname === "/api/workouts") {
        const workout = validateWorkout(await body(req));
        const existing = db
          .prepare("SELECT value FROM workouts WHERE id = ?")
          .get(workout.id);
        if (existing) return json(res, 200, JSON.parse(existing.value));
        const saved = { ...workout, finishedAt: new Date().toISOString() };
        db.prepare("INSERT INTO workouts (id, value) VALUES (?, ?)").run(
          saved.id,
          JSON.stringify(saved),
        );
        return json(res, 201, saved);
      }
      return json(res, 404, { error: "Not found." });
    } catch (error) {
      if (
        error.code?.startsWith("SQLITE") ||
        error.code?.startsWith("ERR_SQLITE")
      ) {
        console.error(error);
        return json(res, 500, {
          error: "Your workout could not be saved. Please try again.",
        });
      }
      return json(res, 400, { error: error.message });
    }
  }
  if (vite)
    return vite.middlewares(req, res, () => {
      res.writeHead(404);
      res.end("Not found");
    });
  try {
    const relative =
      decodeURIComponent(url.pathname).replace(/^\/+/, "") || "index.html";
    const base = path.join(root, "dist");
    const resolved = path.resolve(base, relative);
    if (!resolved.startsWith(base + path.sep) && resolved !== base) {
      res.writeHead(403);
      return res.end();
    }
    const data = await readFile(resolved);
    const type =
      {
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
      }[path.extname(resolved)] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "X-Content-Type-Options": "nosniff",
    });
    res.end(data);
  } catch {
    res.writeHead(404);
    res.end("Not found. Run npm run build before npm start.");
  }
});
server.listen(port, "127.0.0.1", () =>
  console.log(`FORM is ready at http://localhost:${port}`),
);
async function close() {
  await vite?.close();
  server.close(() => {
    db.close();
    process.exit(0);
  });
}
process.on("SIGINT", close);
process.on("SIGTERM", close);
