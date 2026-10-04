import test from "node:test";
import assert from "node:assert/strict";
import { exerciseProgress } from "../shared/training.mjs";

const week = "2026-09-28";
const log = (id, finishedAt, sets, overrides = {}) => ({
  id,
  week,
  finishedAt,
  status: "completed",
  exercises: [{ id: "bench", sets }],
  ...overrides,
});
const set = (weight, reps, done = true) => ({ weight, reps, done });

test("exercise charts pair the heaviest performed set with its own reps and break equal-load ties by reps", () => {
  const workouts = [
    log(
      "one",
      "2026-09-28T12:00:00Z",
      [set(40, 15), set(50, 6), set(50, 8), set(999, 99, false)],
      { status: "partial" },
    ),
  ];
  assert.deepEqual(exerciseProgress("bench", workouts, week), [
    {
      id: "one",
      finishedAt: workouts[0].finishedAt,
      status: "partial",
      weight: 50,
      reps: 8,
      setNumber: 3,
      completedSets: 3,
    },
  ]);
});

test("exercise charts retain separate workouts on the same day and sort without mutating history", () => {
  const workouts = [
    log("late", "2026-09-28T13:00:00Z", [set(55, 8)]),
    log("early", "2026-09-28T12:00:00Z", [set(50, 10)]),
  ];
  const original = structuredClone(workouts);
  assert.deepEqual(
    exerciseProgress("bench", workouts, week).map((point) => point.id),
    ["early", "late"],
  );
  assert.deepEqual(workouts, original);
});

test("chart ranges include their boundary weeks and exclude later training weeks and future timestamps", () => {
  const workouts = [
    log("boundary", "2026-08-24T12:00:00Z", [set(40, 8)], {
      week: "2026-08-24",
    }),
    log("older", "2026-08-17T12:00:00Z", [set(35, 10)], { week: "2026-08-17" }),
    log("future-week", "2026-09-28T12:00:00Z", [set(99, 8)], {
      week: "2026-10-05",
    }),
    log("future-date", new Date(Date.now() + 86400000).toISOString(), [
      set(99, 8),
    ]),
  ];
  assert.deepEqual(
    exerciseProgress("bench", workouts, week, 6).map((point) => point.id),
    ["boundary"],
  );
  assert.equal(exerciseProgress("bench", workouts, week, 12).length, 2);
  assert.equal(exerciseProgress("bench", workouts, week, "all").length, 2);
});

test("bodyweight progress uses performed reps at zero external load and skips exercises with no logged sets", () => {
  const workouts = [
    log("bodyweight", "2026-09-28T12:00:00Z", [set(null, 10), set(0, 12)]),
    log("skipped", "2026-09-29T12:00:00Z", [set(60, 10, false)], {
      status: "partial",
    }),
  ];
  const [point] = exerciseProgress("bench", workouts, week);
  assert.equal(point.weight, 0);
  assert.equal(point.reps, 12);
  assert.equal(exerciseProgress("fly", workouts, week).length, 0);
  assert.deepEqual(exerciseProgress("bench", [], week), []);
});

test("corrections and deletion replace chart values rather than keeping obsolete best sets", () => {
  const original = log("one", "2026-09-28T12:00:00Z", [
    set(50, 10),
    set(45, 8),
  ]);
  const corrected = {
    ...original,
    exercises: [{ id: "bench", sets: [set(50, 10, false), set(45, 8)] }],
  };
  assert.equal(exerciseProgress("bench", [original], week)[0].weight, 50);
  assert.equal(exerciseProgress("bench", [corrected], week)[0].weight, 45);
  assert.equal(exerciseProgress("bench", [], week).length, 0);
});
