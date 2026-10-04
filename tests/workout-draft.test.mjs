import test from "node:test";
import assert from "node:assert/strict";
import {
  createDraftStorage,
  validateDraft,
  DRAFT_STORAGE_WARNING,
} from "../src/services/workout-draft.js";

function memoryStorage() {
  const items = new Map();
  return {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, value),
    removeItem: (key) => items.delete(key),
  };
}
function draft() {
  return {
    id: "recover-workout-001",
    days: 4,
    dayId: "upper-a",
    week: "2026-09-28",
    title: "Upper body A",
    notes: "Keep these notes exactly.  ",
    exercises: [
      {
        id: "bench",
        prescription: { sets: 2, reps: 8, weight: 50 },
        sets: [
          { weight: "52.5", reps: "9", done: true },
          { weight: "", reps: "", done: false },
        ],
      },
    ],
  };
}

test("persistent drafts recover exact inputs after the tab storage is gone and remain account scoped", () => {
  const local = memoryStorage();
  const first = createDraftStorage(
    "one",
    () => local,
    () => memoryStorage(),
  );
  assert.equal(first.write(draft()), "");
  const reopened = createDraftStorage(
    "one",
    () => local,
    () => memoryStorage(),
  );
  assert.deepEqual(reopened.read(), { session: draft(), warning: "" });
  assert.equal(
    createDraftStorage(
      "two",
      () => local,
      () => memoryStorage(),
    ).read().session,
    null,
  );
});

test("legacy per-tab drafts migrate without changing their workout identity or entered values", () => {
  const local = memoryStorage();
  const tab = memoryStorage();
  const storage = createDraftStorage(
    "one",
    () => local,
    () => tab,
  );
  tab.setItem(storage.key, JSON.stringify(draft()));
  assert.deepEqual(storage.read(), { session: draft(), warning: "" });
  assert.equal(tab.getItem(storage.key), null);
  assert.deepEqual(JSON.parse(local.getItem(storage.key)).session, draft());
});

test("a cleared draft cannot be revived by a leftover legacy copy", () => {
  const local = memoryStorage();
  const tab = memoryStorage();
  const storage = createDraftStorage(
    "one",
    () => local,
    () => tab,
  );
  storage.write(draft());
  storage.write(null);
  tab.setItem(storage.key, JSON.stringify(draft()));
  assert.equal(storage.read().session, null);
  assert.equal(local.getItem(storage.key).includes("Keep these notes"), false);
});

test("unavailable persistent storage retains a per-tab fallback and explains recovery limitations", () => {
  const tab = memoryStorage();
  const blocked = () => {
    throw new Error("Storage blocked");
  };
  const storage = createDraftStorage("one", blocked, () => tab);
  assert.equal(storage.write(draft()), DRAFT_STORAGE_WARNING);
  assert.deepEqual(storage.read(), {
    session: draft(),
    warning: DRAFT_STORAGE_WARNING,
  });
  storage.write(null);
  assert.equal(storage.read().session, null);
  const noStorage = createDraftStorage("one", blocked, blocked);
  assert.equal(noStorage.write(draft()), DRAFT_STORAGE_WARNING);
});

test("a newer fallback beats an older persistent draft after storage fills up", () => {
  const local = memoryStorage();
  const tab = memoryStorage();
  const storage = createDraftStorage(
    "one",
    () => local,
    () => tab,
  );
  storage.write(draft());
  const originalWrite = local.setItem;
  local.setItem = () => {
    throw new Error("Full");
  };
  const newer = {
    ...draft(),
    notes: "The newest notes",
    exercises: draft().exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({ ...set, weight: "60" })),
    })),
  };
  assert.equal(storage.write(newer), DRAFT_STORAGE_WARNING);
  assert.deepEqual(storage.read().session, newer);
  local.setItem = originalWrite;
  assert.deepEqual(storage.read(), { session: newer, warning: "" });
  assert.equal(tab.getItem(storage.key), null);
});

test("malformed, unknown-version and unsafe drafts produce a recovery error without throwing or deleting data", () => {
  const local = memoryStorage();
  const storage = createDraftStorage(
    "one",
    () => local,
    () => memoryStorage(),
  );
  for (const raw of [
    "{",
    "null",
    JSON.stringify({ version: 99, session: draft() }),
    JSON.stringify({
      version: 1,
      session: { ...draft(), exercises: [{ id: "unknown" }] },
    }),
  ]) {
    local.setItem(storage.key, raw);
    assert.equal(storage.read().session, null);
    assert.match(storage.read().warning, /could not be recovered/);
    assert.equal(local.getItem(storage.key), raw);
  }
});

test("draft validation accepts incomplete entries but rejects unusable identities, dates and exercise shapes", () => {
  assert.deepEqual(validateDraft(draft()), draft());
  for (const overrides of [
    { id: "bad" },
    { week: "2026-09-29" },
    { days: "4" },
    { dayId: "missing" },
    { notes: null },
    { exercises: [] },
    { exercises: [draft().exercises[0], draft().exercises[0]] },
    {
      exercises: [
        {
          ...draft().exercises[0],
          sets: [{ weight: {}, reps: 8, done: true }],
        },
      ],
    },
  ])
    assert.throws(() => validateDraft({ ...draft(), ...overrides }));
});
