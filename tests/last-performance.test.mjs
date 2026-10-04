import test from "node:test";
import assert from "node:assert/strict";
import { lastExercisePerformance } from "../shared/training.mjs";

const session = { id: "current-session", week: "2026-09-28" };
const log = (id, finishedAt, overrides = {}) => ({
  id,
  week: "2026-09-28",
  days: 3,
  status: "completed",
  finishedAt,
  exercises: [{ id: "bench", sets: [{ weight: 50, reps: 10, done: true }] }],
  ...overrides,
});

test("last performance uses the latest saved log across splits and within the same week", () => {
  const latest = log("latest", "2026-09-29T12:00:00Z", { days: 5 });
  const workouts = [
    log("older", "2026-09-28T12:00:00Z"),
    latest,
    log("old-week", "2026-09-21T12:00:00Z", { week: "2026-09-21" }),
  ];
  const original = structuredClone(workouts);
  assert.equal(
    lastExercisePerformance("bench", session, workouts).finishedAt,
    latest.finishedAt,
  );
  assert.deepEqual(workouts, original);
});

test("last performance excludes the current session, later training weeks and future timestamps", () => {
  const prior = log("prior", "2026-09-28T12:00:00Z");
  const workouts = [
    log(session.id, "2026-09-30T12:00:00Z"),
    log("future-week", "2026-09-30T12:00:00Z", { week: "2026-10-05" }),
    log("future-date", new Date(Date.now() + 86400000).toISOString()),
    prior,
  ];
  assert.equal(
    lastExercisePerformance("bench", session, workouts).finishedAt,
    prior.finishedAt,
  );
});

test("partial logs show only performed sets with their original numbers and actual values", () => {
  const previous = log("partial", "2026-09-29T12:00:00Z", {
    status: "partial",
    exercises: [
      {
        id: "bench",
        sets: [
          { weight: 50, reps: 10, done: true },
          { weight: 999, reps: 99, done: false },
          { weight: 47.5, reps: 8, done: true },
        ],
      },
      { id: "deadbug", sets: [{ weight: null, reps: 12, done: true }] },
    ],
  });
  assert.deepEqual(lastExercisePerformance("bench", session, [previous]), {
    finishedAt: previous.finishedAt,
    status: "partial",
    sets: [
      { number: 1, weight: 50, reps: 10 },
      { number: 3, weight: 47.5, reps: 8 },
    ],
  });
  assert.equal(
    lastExercisePerformance("deadbug", session, [previous]).sets[0].weight,
    null,
  );
});

test("an exercise with no completed sets falls back to its earlier log or has no history", () => {
  const skipped = log("skipped", "2026-09-30T12:00:00Z", {
    status: "partial",
    exercises: [{ id: "bench", sets: [{ weight: 80, reps: 10, done: false }] }],
  });
  const earlier = log("earlier", "2026-09-28T12:00:00Z");
  assert.equal(
    lastExercisePerformance("bench", session, [skipped, earlier]).finishedAt,
    earlier.finishedAt,
  );
  assert.equal(lastExercisePerformance("bench", session, [skipped]), null);
  assert.equal(lastExercisePerformance("curl", session, [earlier]), null);
  assert.equal(lastExercisePerformance("bench", session, []), null);
});
