import test from "node:test";
import assert from "node:assert/strict";
import {
  EXERCISES,
  PLANS,
  MUSCLES,
  DEFAULT_SETTINGS,
  prescriptions,
  records,
  validateWorkout,
  validateTarget,
  validateSettings,
  monday,
  shiftDate,
  trainingPlan,
  validateRoutine,
  validateWorkoutUpdate,
} from "../shared/training.mjs";
const week = "2026-09-28";
function stateFor({
  strategy = "weight",
  weight = 50,
  reps = 10,
  done = true,
  status = "completed",
  sets = 3,
  previousWeek = "2026-09-21",
} = {}) {
  return {
    settings: { days: 4, strategy },
    targets: {},
    workouts: [
      {
        week: previousWeek,
        status,
        finishedAt: "2026-09-21T12:00:00Z",
        exercises: [
          {
            id: "bench",
            prescription: { sets, reps: 10, weight },
            sets: Array.from({ length: sets }, () => ({ weight, reps, done })),
          },
        ],
      },
    ],
  };
}
export function sampleWorkout() {
  return {
    id: "test-workout-001",
    week,
    days: 4,
    dayId: "upper-a",
    status: "completed",
    notes: "Felt strong.",
    exercises: PLANS[4][0].exercises.map((e) => ({
      id: e.id,
      prescription: { sets: e.sets, reps: e.min, weight: 20 },
      sets: Array.from({ length: e.sets }, () => ({
        reps: e.min,
        weight: 20,
        done: true,
      })),
    })),
  };
}
test("every schedule balances all major muscle groups and has distinct training days", () => {
  for (const days of [3, 4, 5]) {
    const plan = PLANS[days];
    assert.equal(plan.length, days);
    assert.equal(new Set(plan.map((d) => d.weekday)).size, days);
    assert.deepEqual(
      new Set(plan.flatMap((d) => d.exercises.map((e) => e.muscle))),
      new Set(MUSCLES),
    );
  }
});
test("dates cross year boundaries using local Monday weeks", () => {
  assert.equal(monday(new Date("2027-01-01T12:00:00")), "2026-12-28");
  assert.equal(shiftDate("2026-12-28", 7), "2027-01-04");
});
test("custom weekdays preserve workout order and exercises for every split", () => {
  for (const days of [3, 4, 5]) {
    const weekdays = Array.from(
      { length: days },
      (_, index) => 7 - days + index,
    );
    const settings = validateSettings({
      days,
      strategy: "weight",
      weekdays: [...weekdays].reverse(),
    });
    const plan = trainingPlan(settings);
    assert.deepEqual(
      plan.map((day) => day.weekday),
      weekdays,
    );
    assert.deepEqual(
      plan.map((day) => day.id),
      PLANS[days].map((day) => day.id),
    );
    assert.deepEqual(
      plan.map((day) => day.exercises),
      PLANS[days].map((day) => day.exercises),
    );
    assert.deepEqual(
      trainingPlan({ days }).map((day) => day.weekday),
      PLANS[days].map((day) => day.weekday),
    );
  }
  assert.deepEqual(
    PLANS[4].map((day) => day.weekday),
    [0, 1, 3, 4],
  );
});
test("weekday settings reject duplicates, wrong counts, and invalid weekday values", () => {
  for (const weekdays of [
    [0, 1],
    [0, 0, 2],
    [-1, 1, 2],
    [0, 1, 7],
    [0, 1, 2.5],
    [0, 1, "2"],
    null,
  ]) {
    assert.throws(
      () => validateSettings({ days: 3, strategy: "weight", weekdays }),
      /different weekdays/,
    );
  }
});
test("hitting the rep ceiling increases load and resets reps", () => {
  const p = prescriptions(EXERCISES.bench, week, stateFor());
  assert.equal(p.weight, 52.5);
  assert.equal(p.reps, 8);
  assert.equal(p.increased, true);
});
test("load increases do not exceed ten percent", () => {
  const p = prescriptions(EXERCISES.bench, week, stateFor({ weight: 5 }));
  assert.equal(p.weight, 5.5);
});
test("missing the rep target holds the prescription", () => {
  const p = prescriptions(EXERCISES.bench, week, stateFor({ reps: 7 }));
  assert.equal(p.weight, 50);
  assert.equal(p.reps, 10);
  assert.equal(p.increased, false);
});
test("partial sessions do not trigger progression", () => {
  const p = prescriptions(
    EXERCISES.bench,
    week,
    stateFor({ status: "partial" }),
  );
  assert.equal(p.weight, null);
  assert.equal(p.increased, false);
});
test("skipped weeks retain the previous load without increasing it", () => {
  const p = prescriptions(
    EXERCISES.bench,
    week,
    stateFor({ previousWeek: "2026-09-14" }),
  );
  assert.equal(p.weight, 50);
  assert.equal(p.increased, false);
});
test("future workouts do not affect past prescriptions", () => {
  const p = prescriptions(
    EXERCISES.bench,
    week,
    stateFor({ previousWeek: "2026-10-05" }),
  );
  assert.equal(p.weight, null);
});
test("custom targets override suggestions for their selected week", () => {
  const state = stateFor();
  state.targets.bench = { week, sets: 2, reps: 8, weight: 40 };
  const p = prescriptions(EXERCISES.bench, week, state);
  assert.equal(p.weight, 40);
  assert.equal(p.sets, 2);
  assert.equal(p.increased, false);
});
test("rep progression respects exercise ceiling", () => {
  const p = prescriptions(
    EXERCISES.bench,
    week,
    stateFor({ strategy: "reps" }),
  );
  assert.equal(p.reps, 10);
  assert.equal(p.increased, false);
});
test("set progression is bounded to five sets", () => {
  const p = prescriptions(
    EXERCISES.bench,
    week,
    stateFor({ strategy: "sets", sets: 5 }),
  );
  assert.equal(p.sets, 5);
  assert.equal(p.increased, false);
});
test("bodyweight movements gain reps, not invented weight", () => {
  const state = stateFor({ weight: null, reps: 8 });
  state.workouts[0].exercises[0].prescription.reps = 8;
  const p = prescriptions(EXERCISES.bench, week, state);
  assert.equal(p.weight, null);
  assert.equal(p.reps, 9);
});
test("mixed set weights do not trigger an automatic increase", () => {
  const state = stateFor();
  state.workouts[0].exercises[0].sets[1].weight = 40;
  assert.equal(prescriptions(EXERCISES.bench, week, state).increased, false);
});
test("records include only completed sets and use reps as a tiebreaker", () => {
  const state = stateFor();
  state.workouts[0].exercises[0].sets.push(
    { weight: 100, reps: 10, done: false },
    { weight: 50, reps: 12, done: true },
  );
  assert.equal(records(state.workouts)[0].weight, 50);
  assert.equal(records(state.workouts)[0].reps, 12);
});
test("validates completed workouts and rejects forged or incomplete logs", () => {
  const valid = sampleWorkout();
  assert.equal(validateWorkout(valid).title, "Upper body A");
  valid.exercises[0].sets[0].done = false;
  assert.throws(() => validateWorkout(valid));
  valid.status = "partial";
  assert.equal(validateWorkout(valid).status, "partial");
  valid.exercises[0].id = "not-an-exercise";
  assert.throws(() => validateWorkout(valid));
});
test("rejects out-of-range, nonnumeric and invalid date input", () => {
  assert.throws(() =>
    validateTarget({ id: "bench", sets: 0, reps: 10, weight: 50 }),
  );
  assert.throws(() =>
    validateTarget({ id: "bench", sets: 3, reps: 10, weight: Infinity }),
  );
  assert.throws(() => validateSettings({ days: 6, strategy: "weight" }));
  assert.throws(() =>
    validateWorkout({ ...sampleWorkout(), week: "2026-02-30" }),
  );
  assert.deepEqual(validateSettings(DEFAULT_SETTINGS), DEFAULT_SETTINGS);
});

test("custom exercise lists persist order and allow sessions independent of the current template", () => {
  const routine = validateRoutine({
    id: "upper-a",
    exerciseIds: ["curl", "bench", "squat"],
  });
  const settings = { days: 4, strategy: "weight" };
  const plan = trainingPlan(settings, { "upper-a": routine });
  assert.deepEqual(
    plan[0].exercises.map((exercise) => exercise.id),
    routine.exerciseIds,
  );
  assert.equal(plan[0].subtitle, "Arms, Chest, Legs");
  const customized = sampleWorkout();
  customized.exercises = [customized.exercises[4], customized.exercises[0]];
  assert.deepEqual(
    validateWorkout(customized).exercises.map((exercise) => exercise.id),
    ["curl", "bench"],
  );
  assert.equal(validateWorkout(sampleWorkout()).exercises.length, 6);
  for (const exerciseIds of [
    [],
    ["bench", "bench"],
    ["unknown"],
    ["__proto__"],
    Object.keys(EXERCISES).slice(0, 11),
  ]) {
    assert.throws(() => validateRoutine({ id: "upper-a", exerciseIds }));
  }
  assert.throws(() =>
    validateRoutine({ id: "unknown", exerciseIds: ["bench"] }),
  );
  assert.throws(() =>
    validateWorkout({
      ...customized,
      exercises: [customized.exercises[0], customized.exercises[0]],
    }),
  );
});
test("workout corrections preserve identity, reject stale edits, and recalculate records", () => {
  const original = {
    ...sampleWorkout(),
    finishedAt: "2026-09-28T12:00:00.000Z",
  };
  const correction = structuredClone(original);
  correction.notes = "Corrected weight";
  correction.exercises[0].sets[0].weight = 40;
  const saved = validateWorkoutUpdate(correction, original);
  assert.equal(saved.revision, 1);
  assert.equal(saved.finishedAt, original.finishedAt);
  assert.equal(
    records([saved]).find((record) => record.id === "bench").weight,
    40,
  );
  assert.equal(
    records([original]).find((record) => record.id === "bench").weight,
    20,
  );
  assert.throws(
    () => validateWorkoutUpdate(correction, saved),
    /changed in another tab/,
  );
  assert.throws(
    () => validateWorkoutUpdate(correction, null),
    /no longer exists/,
  );
  for (const key of ["id", "week", "days", "dayId", "title", "finishedAt"]) {
    assert.throws(
      () =>
        validateWorkoutUpdate({ ...correction, [key]: "changed" }, original),
      /cannot be changed/,
    );
  }
  assert.deepEqual(records([]), []);
});
