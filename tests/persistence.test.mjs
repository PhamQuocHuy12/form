import test from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { PLANS } from "../shared/training.mjs";

test("SQLite history survives a server restart without duplicate records", async (t) => {
  const directory = path.resolve("data", `persistence-test-${randomUUID()}`);
  let child;
  async function start() {
    child = spawn(process.execPath, ["server.mjs"], {
      env: { ...process.env, PORT: "5175", DATA_DIR: directory },
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("Test server did not start")),
        10000,
      );
      child.stdout.on("data", (data) => {
        if (data.toString().includes("FORM is ready")) {
          clearTimeout(timeout);
          resolve();
        }
      });
      child.once("error", (error) => {
        clearTimeout(timeout);
        reject(error);
      });
      child.once("exit", (code) => {
        if (code) {
          clearTimeout(timeout);
          reject(new Error(`Test server exited ${code}`));
        }
      });
    });
  }
  async function stop() {
    if (child && child.exitCode === null)
      await new Promise((resolve) => {
        child.once("exit", resolve);
        child.kill();
      });
  }
  t.after(stop);
  await start();
  const workout = {
    id: randomUUID(),
    week: "2026-09-28",
    days: 4,
    dayId: "upper-a",
    notes: "Persist after restart",
    status: "completed",
    exercises: PLANS[4][0].exercises.map((e) => ({
      id: e.id,
      prescription: { sets: e.sets, reps: e.min, weight: 25 },
      sets: Array.from({ length: e.sets }, () => ({
        reps: e.min,
        weight: 25,
        done: true,
      })),
    })),
  };
  const saved = await fetch("http://localhost:5175/api/workouts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(workout),
  });
  assert.equal(saved.status, 201);
  await stop();
  await start();
  const state = await (await fetch("http://localhost:5175/api/state")).json();
  assert.equal(state.workouts.length, 1);
  assert.equal(state.workouts[0].notes, workout.notes);
  assert.equal(state.workouts[0].exercises[0].sets[0].weight, 25);
});
