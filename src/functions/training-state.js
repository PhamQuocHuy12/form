import { DEFAULT_SETTINGS } from "../../shared/catalog/plans.mjs";
import {
  validateRoutine,
  validateSettings,
  validateTarget,
  validateWorkout,
} from "../../shared/functions/validation.mjs";

export function emptyTrainingState() {
  return {
    settings: { ...DEFAULT_SETTINGS },
    targets: {},
    workouts: [],
    routines: {},
  };
}

export function checkedState(state) {
  const settings = validateSettings(state.settings);
  const targets = Object.fromEntries(
    Object.entries(state.targets).map(([id, value]) => {
      if (value.id !== id) throw new Error("Invalid saved target.");
      return [id, validateTarget(value)];
    }),
  );
  const workouts = state.workouts
    .map((value) => {
      const valid = validateWorkout(value);
      if (
        typeof value.finishedAt !== "string" ||
        !Number.isFinite(Date.parse(value.finishedAt))
      )
        throw new Error("Invalid saved workout date.");
      if (
        value.revision !== undefined &&
        (!Number.isSafeInteger(value.revision) || value.revision < 0)
      )
        throw new Error("Invalid saved workout version.");
      return {
        ...valid,
        finishedAt: value.finishedAt,
        revision: value.revision ?? 0,
      };
    })
    .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt));
  const routines = Object.fromEntries(
    Object.entries(state.routines ?? {}).map(([id, value]) => {
      if (value.id !== id) throw new Error("Invalid saved exercise list.");
      return [id, validateRoutine(value)];
    }),
  );
  return { settings, targets, workouts, routines };
}
