import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from "@firebase/rules-unit-testing";
import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { createCloudStore } from "../../src/services/training-store.js";
import { PLANS, EXERCISES } from "../../shared/training.mjs";

const workout = () => ({
  id: "test-cloud-workout-001",
  week: "2026-09-28",
  days: 4,
  dayId: "upper-a",
  title: "Upper body A",
  status: "completed",
  notes: "Test fixture",
  finishedAt: "2026-09-28T12:00:00.000Z",
  exercises: PLANS[4][0].exercises.map((ex) => ({
    id: ex.id,
    prescription: { sets: ex.sets, reps: ex.min, weight: 20 },
    sets: Array.from({ length: ex.sets }, () => ({
      reps: ex.min,
      weight: 20,
      done: true,
    })),
  })),
});

test("an existing account can save custom weekdays after upgrading older published rules", async (t) => {
  const currentRules = await readFile("firestore.rules", "utf8");
  const oldRules = currentRules.replace(
    "hasOnly(['days','strategy','weekdays'])",
    "hasOnly(['days','strategy'])",
  );
  assert.notEqual(oldRules, currentRules);
  const env = await initializeTestEnvironment({
    projectId: "demo-form",
    firestore: { host: "127.0.0.1", port: 8080, rules: oldRules },
  });
  t.after(() => env.cleanup());
  const database = env.authenticatedContext("rules-upgrade-user").firestore();
  const store = createCloudStore(database, "rules-upgrade-user");
  await store.saveSettings({ days: 4, strategy: "weight" });
  const ref = doc(database, "users/rules-upgrade-user/preferences/main");
  await assertSucceeds(getDoc(ref));
  const settings = { days: 4, strategy: "weight", weekdays: [1, 2, 4, 6] };
  await assert.rejects(
    () => store.saveSettings(settings),
    /latest firestore.rules.*custom weekdays/,
  );
  assert.deepEqual((await getDoc(ref)).data(), { days: 4, strategy: "weight" });
  const upgraded = await initializeTestEnvironment({
    projectId: "demo-form",
    firestore: { host: "127.0.0.1", port: 8080, rules: currentRules },
  });
  t.after(() => upgraded.cleanup());
  await store.saveSettings(settings);
  assert.deepEqual((await getDoc(ref)).data(), settings);
});

test("Firestore rules isolate accounts and validate customized plans and workout corrections", async (t) => {
  const env = await initializeTestEnvironment({
    projectId: "demo-form",
    firestore: {
      host: "127.0.0.1",
      port: 8080,
      rules: await readFile("firestore.rules", "utf8"),
    },
  });
  t.after(() => env.cleanup());
  await env.clearFirestore();
  const alice = env.authenticatedContext("alice").firestore();
  const bob = env.authenticatedContext("bob").firestore();
  const anonymous = env.unauthenticatedContext().firestore();
  const prefs = (database) => doc(database, "users/alice/preferences/main");
  const target = (database) => doc(database, "users/alice/targets/bench");
  const log = (database) =>
    doc(database, "users/alice/workouts/test-cloud-workout-001");
  const routine = (database) => doc(database, "users/alice/routines/upper-a");
  const appearance = (database) =>
    doc(database, "users/alice/preferences/appearance");
  for (const theme of ["dark", "light", "system"])
    await assertSucceeds(setDoc(appearance(alice), { theme }));
  for (const value of [
    {},
    { theme: "blue" },
    { theme: null },
    { theme: "light", days: 3 },
  ])
    await assertFails(setDoc(appearance(alice), value));
  await assertSucceeds(getDoc(appearance(alice)));
  for (const database of [bob, anonymous]) {
    await assertFails(getDoc(appearance(database)));
    await assertFails(setDoc(appearance(database), { theme: "light" }));
  }
  await assertFails(deleteDoc(appearance(alice)));
  await assertSucceeds(
    setDoc(routine(alice), {
      id: "upper-a",
      exerciseIds: ["curl", "bench", "squat"],
    }),
  );
  for (const exerciseIds of [
    [],
    ["bench", "bench"],
    ["unknown"],
    Object.keys(EXERCISES).slice(0, 11),
  ]) {
    await assertFails(setDoc(routine(alice), { id: "upper-a", exerciseIds }));
  }
  await assertFails(
    setDoc(routine(alice), { id: "upper-b", exerciseIds: ["bench"] }),
  );
  await assertSucceeds(setDoc(prefs(alice), { days: 4, strategy: "weight" }));
  for (const days of [3, 4, 5]) {
    await assertSucceeds(
      setDoc(prefs(alice), {
        days,
        strategy: "weight",
        weekdays: Array.from({ length: days }, (_, i) => 7 - days + i),
      }),
    );
  }
  for (const weekdays of [
    [0, 1],
    [0, 0, 2],
    [-1, 1, 2],
    [0, 1, 7],
    [0, 1, 2.5],
    [0, 1, "2"],
    [2, 0, 1],
    null,
  ]) {
    await assertFails(
      setDoc(prefs(alice), { days: 3, strategy: "weight", weekdays }),
    );
  }
  await assertSucceeds(
    setDoc(target(alice), {
      id: "bench",
      sets: 3,
      reps: 10,
      weight: 50,
      week: "2026-09-28",
    }),
  );
  await assertSucceeds(setDoc(log(alice), workout()));
  const maximum = workout();
  maximum.id = "maximum-workout-005";
  maximum.exercises = Object.values(EXERCISES)
    .slice(0, 8)
    .map((exercise) => ({
      id: exercise.id,
      prescription: { sets: 5, reps: 10, weight: 20 },
      sets: Array.from({ length: 5 }, () => ({
        reps: 10,
        weight: 20,
        done: true,
      })),
    }));
  await assertSucceeds(
    setDoc(doc(alice, "users/alice/workouts/maximum-workout-005"), maximum),
  );
  await assertSucceeds(
    setDoc(doc(alice, "users/alice/workouts/maximum-workout-005"), {
      ...maximum,
      revision: 1,
      notes: "Corrected maximum-size session",
    }),
  );
  for (const foreign of [bob, anonymous]) {
    await assertFails(getDoc(prefs(foreign)));
    await assertFails(getDoc(target(foreign)));
    await assertFails(getDoc(log(foreign)));
    await assertFails(getDoc(routine(foreign)));
    await assertFails(
      setDoc(routine(foreign), { id: "upper-a", exerciseIds: ["bench"] }),
    );
    await assertFails(setDoc(log(foreign), { ...workout(), revision: 1 }));
    await assertFails(deleteDoc(log(foreign)));
    await assertFails(getDocs(collection(foreign, "users/alice/workouts")));
    await assertFails(setDoc(prefs(foreign), { days: 5, strategy: "sets" }));
    await assertFails(
      setDoc(target(foreign), { id: "bench", sets: 3, reps: 10, weight: 70 }),
    );
    await assertFails(
      setDoc(doc(foreign, "users/alice/workouts/forged-workout-002"), {
        ...workout(),
        id: "forged-workout-002",
      }),
    );
  }
  await assertFails(setDoc(prefs(alice), { days: 99, strategy: "weight" }));
  await assertFails(
    setDoc(prefs(alice), { days: 4, strategy: "weight", admin: true }),
  );
  await assertFails(
    setDoc(target(alice), { id: "bench", sets: 3, reps: 10, weight: -1 }),
  );
  await assertFails(
    setDoc(log(alice), { ...workout(), notes: "Overwrite existing history" }),
  );
  const invalid = workout();
  invalid.id = "invalid-workout-002";
  invalid.exercises[0].prescription.sets = -1;
  await assertFails(
    setDoc(doc(alice, "users/alice/workouts/invalid-workout-002"), invalid),
  );
  assert.equal((await getDoc(log(alice))).data().notes, "Test fixture");
  await assertFails(
    setDoc(log(alice), {
      ...workout(),
      revision: 1,
      finishedAt: "2026-09-29T12:00:00.000Z",
    }),
  );
  await assertSucceeds(
    setDoc(log(alice), { ...workout(), revision: 1, notes: "Corrected" }),
  );
  await assertFails(
    setDoc(log(alice), {
      ...workout(),
      revision: 1,
      notes: "Stale correction",
    }),
  );
  await assertSucceeds(deleteDoc(log(alice)));
});

test("cloud store saves idempotently, streams changes, and rejects stale workout changes", async (t) => {
  const env = await initializeTestEnvironment({
    projectId: "demo-form",
    firestore: { host: "127.0.0.1", port: 8080 },
  });
  t.after(() => env.cleanup());
  const database = env.authenticatedContext("store-test-user").firestore();
  const store = createCloudStore(database, "store-test-user");
  await store.saveSettings({ days: 3, strategy: "reps", weekdays: [1, 3, 6] });
  await store.saveTarget({ id: "bench", sets: 2, reps: 8, weight: 30 });
  const saved = await store.saveWorkout(workout());
  const duplicate = await store.saveWorkout(workout());
  assert.equal(saved.finishedAt, duplicate.finishedAt);
  const state = await new Promise((resolve, reject) => {
    let unsubscribe;
    const timeout = setTimeout(
      () => reject(new Error("Snapshot did not arrive")),
      10000,
    );
    unsubscribe = store.subscribe((value) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(value);
    }, reject);
  });
  assert.equal(state.workouts.length, 1);
  assert.equal(state.settings.days, 3);
  assert.deepEqual(state.settings.weekdays, [1, 3, 6]);
  assert.equal(state.targets.bench.weight, 30);
  assert.equal(state.workouts[0].finishedAt, saved.finishedAt);
  await assert.rejects(() =>
    store.saveTarget({ id: "bench", sets: 0, reps: 10, weight: 50 }),
  );
  await store.saveRoutine({ id: "upper-a", exerciseIds: ["curl", "bench"] });
  const corrected = structuredClone(saved);
  corrected.exercises[0].sets[0].weight = 80;
  corrected.notes = "Corrected load";
  const updated = await store.updateWorkout(corrected);
  assert.equal(updated.revision, 1);
  assert.equal(updated.finishedAt, saved.finishedAt);
  await assert.rejects(
    () => store.updateWorkout(corrected),
    /changed in another tab/,
  );
  await assert.rejects(
    () => store.deleteWorkout(saved),
    /changed in another tab/,
  );
  await store.deleteWorkout(updated);
  await store.deleteWorkout(updated);
  assert.equal(
    (
      await getDoc(doc(database, `users/store-test-user/workouts/${saved.id}`))
    ).exists(),
    false,
  );
  await assert.rejects(() => store.updateWorkout(updated), /no longer exists/);
  assert.deepEqual(
    (
      await getDoc(doc(database, "users/store-test-user/routines/upper-a"))
    ).data().exerciseIds,
    ["curl", "bench"],
  );
});
