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
