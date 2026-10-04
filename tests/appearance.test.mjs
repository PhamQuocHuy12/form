import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_APPEARANCE,
  validateAppearance,
} from "../shared/functions/appearance.mjs";
import {
  cacheAppearance,
  readAppearanceCache,
} from "../src/services/appearance.js";

test("existing accounts default to dark and appearance accepts only supported themes", () => {
  assert.deepEqual(DEFAULT_APPEARANCE, { theme: "dark" });
  for (const theme of ["dark", "light", "system"])
    assert.deepEqual(validateAppearance({ theme, days: 3 }), { theme });
  for (const value of [null, {}, { theme: "blue" }, { theme: 1 }])
    assert.throws(() => validateAppearance(value), /Choose Dark/);
});

test("startup theme hints stay account scoped and tolerate corrupt or blocked storage", (t) => {
  const values = new Map();
  const original = globalThis.localStorage;
  t.after(() => {
    if (original === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = original;
  });
  globalThis.localStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  cacheAppearance("alice", { theme: "light" });
  assert.deepEqual(readAppearanceCache("alice"), { theme: "light" });
  assert.deepEqual(readAppearanceCache("bob"), DEFAULT_APPEARANCE);
  values.set("form:appearance:alice", "broken");
  assert.deepEqual(readAppearanceCache("alice"), DEFAULT_APPEARANCE);
  globalThis.localStorage = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
  };
  assert.doesNotThrow(() => cacheAppearance("alice", { theme: "system" }));
  assert.deepEqual(readAppearanceCache("alice"), DEFAULT_APPEARANCE);
});
