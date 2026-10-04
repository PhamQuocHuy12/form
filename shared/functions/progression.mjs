import { shiftDate } from "../utils/dates.mjs";

export function prescriptions(exercise, week, state) {
  const target = state.targets[exercise.id] ?? {};
  const base = {
    sets: target.sets ?? exercise.sets,
    reps: target.reps ?? exercise.min,
    weight: target.weight ?? null,
    increased: false,
    reason: "Set a comfortable starting point",
  };
  if (target.week === week)
    return { ...base, reason: "Your custom target for this week" };
  const priorWeek = shiftDate(week, -7);
  const previousWorkout = state.workouts
    .filter(
      (w) =>
        w.week < week &&
        w.status === "completed" &&
        w.exercises.some((e) => e.id === exercise.id),
    )
    .sort(
      (a, b) =>
        b.week.localeCompare(a.week) ||
        b.finishedAt.localeCompare(a.finishedAt),
    )[0];
  const previous = previousWorkout?.exercises.find((e) => e.id === exercise.id);
  if (!previous || previous.sets.length === 0) return base;
  const sets = previous.sets;
  const commonWeight = sets.every((s) => s.weight === sets[0].weight);
  const reps = Math.min(...sets.map((s) => s.reps));
  const prescribed = previous.prescription ?? base;
  const metTarget =
    sets.every((s) => s.done && s.reps >= prescribed.reps) &&
    sets.length >= prescribed.sets;
  const held = {
    ...base,
    sets: prescribed.sets,
    reps: prescribed.reps,
    weight: commonWeight ? sets[0].weight : prescribed.weight,
    reason: "Repeat last week’s target with good form",
  };
  if (!metTarget || !commonWeight || previousWorkout.week !== priorWeek)
    return held;
  const strategy = state.settings.strategy;
  if (strategy === "sets")
    return {
      ...held,
      sets: Math.min(5, prescribed.sets + 1),
      increased: prescribed.sets < 5,
      reason:
        prescribed.sets < 5
          ? "Add one set after completing last week’s target"
          : "Five-set cap reached. Maintain your quality",
    };
  if (strategy === "reps" || sets[0].weight === null || sets[0].weight === 0)
    return {
      ...held,
      reps: Math.max(prescribed.reps, Math.min(exercise.max, reps + 1)),
      increased: reps < exercise.max,
      reason:
        reps < exercise.max
          ? "Add one rep per set this week"
          : "Top of rep range reached. Maintain or set a load",
    };
  if (reps >= exercise.max) {
    const increment =
      Math.floor(
        Math.min(exercise.muscle === "Legs" ? 5 : 2.5, sets[0].weight * 0.1) *
          4,
      ) / 4;
    if (!increment || sets[0].weight + increment > 1000)
      return {
        ...held,
        reason: "Maintain your load or choose a custom target",
      };
    return {
      ...held,
      weight: Math.round((sets[0].weight + increment) * 100) / 100,
      reps: exercise.min,
      increased: true,
      reason: "Top of rep range reached last week. Try a small load increase",
    };
  }
  return {
    ...held,
    reps: Math.min(exercise.max, reps + 1),
    increased: true,
    reason: "Build reps before increasing the weight",
  };
}
