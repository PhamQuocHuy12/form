import { MAX_EXERCISES, EXERCISES } from "../../shared/catalog/exercises.mjs";
import { PLANS } from "../../shared/catalog/plans.mjs";
import { monday, isDateKey } from "../../shared/utils/dates.mjs";
import { validateTarget } from "../../shared/functions/validation.mjs";

export const DRAFT_STORAGE_WARNING =
  "Your browser could not protect this draft after closing. Keep this tab open until you save your workout, and allow site storage to enable recovery.";

// Drafts can contain blank inputs and incomplete sets; saved-workout validation
// deliberately requires more. Preserve input strings exactly while recovering.
export function validateDraft(value) {
  if (
    !value ||
    typeof value.id !== "string" ||
    !/^[a-zA-Z0-9-]{8,80}$/.test(value.id) ||
    !isDateKey(value.week) ||
    monday(new Date(`${value.week}T12:00:00`)) !== value.week ||
    ![3, 4, 5].includes(value.days) ||
    !PLANS[value.days]?.some((day) => day.id === value.dayId) ||
    typeof value.notes !== "string" ||
    value.notes.length > 2000 ||
    !Array.isArray(value.exercises) ||
    value.exercises.length < 1 ||
    value.exercises.length > MAX_EXERCISES ||
    new Set(value.exercises.map((exercise) => exercise?.id)).size !==
      value.exercises.length
  )
    throw new Error("Invalid workout draft.");
  const input = (entry) =>
    entry === null ||
    (typeof entry === "number" && Number.isFinite(entry)) ||
    typeof entry === "string";
  const exercises = value.exercises.map((exercise) => {
    if (
      !exercise ||
      !Object.hasOwn(EXERCISES, exercise.id) ||
      !Array.isArray(exercise.sets) ||
      exercise.sets.length < 1 ||
      exercise.sets.length > 5
    )
      throw new Error("Invalid draft exercise.");
    const prescription = validateTarget({
      id: exercise.id,
      ...exercise.prescription,
    });
    if (prescription.sets !== exercise.sets.length)
      throw new Error("Invalid draft set count.");
    const sets = exercise.sets.map((set) => {
      if (
        !set ||
        typeof set.done !== "boolean" ||
        !input(set.weight) ||
        set.reps === null ||
        !input(set.reps)
      )
        throw new Error("Invalid draft set.");
      return { weight: set.weight, reps: set.reps, done: set.done };
    });
    return {
      id: exercise.id,
      prescription: {
        sets: prescription.sets,
        reps: prescription.reps,
        weight: prescription.weight,
      },
      sets,
    };
  });
  return {
    id: value.id,
    week: value.week,
    days: value.days,
    dayId: value.dayId,
    title: PLANS[value.days].find((day) => day.id === value.dayId).title,
    notes: value.notes,
    exercises,
  };
}

export function createDraftStorage(uid, persistentStorage, tabStorage) {
  const key = `form-session:${uid}`;
  const get = (storage) => {
    try {
      return { raw: storage().getItem(key), available: true };
    } catch {
      return { raw: null, available: false };
    }
  };
  const decode = (raw) => {
    if (raw === null) return null;
    const value = JSON.parse(raw);
    if (value.version !== 1) throw new Error("Unsupported draft version.");
    return {
      session: value.session === null ? null : validateDraft(value.session),
      updatedAt: Number.isSafeInteger(value.updatedAt) ? value.updatedAt : 0,
    };
  };
  function read() {
    const stored = get(persistentStorage);
    let saved = null;
    if (stored.raw !== null) {
      try {
        saved = decode(stored.raw);
      } catch {
        return {
          session: null,
          warning:
            "A saved workout draft could not be recovered. Start a new workout when you’re ready.",
        };
      }
    }
    const legacy = get(tabStorage);
    if (legacy.raw !== null) {
      try {
        const value = JSON.parse(legacy.raw);
        const candidate = value.version === 1 ? value.session : value;
        const session = candidate === null ? null : validateDraft(candidate);
        const updatedAt = Number.isSafeInteger(value.updatedAt)
          ? value.updatedAt
          : 0;
        // A failed persistent update may have a newer per-tab backup. Never
        // silently restore the older weights/notes when refreshing that tab.
        if (!saved || updatedAt > saved.updatedAt)
          return { session, warning: write(session) };
      } catch {
        if (!saved)
          return {
            session: null,
            warning:
              "A saved workout draft could not be recovered. Start a new workout when you’re ready.",
          };
      }
    }
    if (saved) return { session: saved.session, warning: "" };
    return {
      session: null,
      warning: stored.available ? "" : DRAFT_STORAGE_WARNING,
    };
  }
  function write(session) {
    const timestamp = (storage) => {
      try {
        return decode(get(storage).raw)?.updatedAt ?? 0;
      } catch {
        return 0;
      }
    };
    // A cleared marker prevents a leftover legacy copy in another tab from
    // bringing back a completed/discarded workout. It contains no workout data.
    const raw = JSON.stringify({
      version: 1,
      updatedAt: Math.max(
        Date.now(),
        timestamp(persistentStorage) + 1,
        timestamp(tabStorage) + 1,
      ),
      session: session ? validateDraft(session) : null,
    });
    try {
      persistentStorage().setItem(key, raw);
      // Remove the old per-tab copy so a completed/discarded draft cannot return.
      try {
        tabStorage().removeItem(key);
      } catch {
        /* Persistent copy is safe. */
      }
      return "";
    } catch {
      try {
        tabStorage().setItem(key, raw);
      } catch {
        /* In-memory editing stays available with a visible warning. */
      }
      return DRAFT_STORAGE_WARNING;
    }
  }
  return { key, read, write };
}
