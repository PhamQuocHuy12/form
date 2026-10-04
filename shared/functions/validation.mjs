import { MAX_EXERCISES, EXERCISES } from "../catalog/exercises.mjs";
import { PLANS } from "../catalog/plans.mjs";
import { monday, isDateKey } from "../utils/dates.mjs";

export function validateRoutine(value) {
  if (
    !value ||
    !Object.values(PLANS)
      .flat()
      .some((day) => day.id === value.id) ||
    !Array.isArray(value.exerciseIds) ||
    value.exerciseIds.length < 1 ||
    value.exerciseIds.length > MAX_EXERCISES ||
    new Set(value.exerciseIds).size !== value.exerciseIds.length ||
    !value.exerciseIds.every((id) => Object.hasOwn(EXERCISES, id))
  )
    throw new Error(
      `Choose 1–${MAX_EXERCISES} different exercises from the exercise library.`,
    );
  return { id: value.id, exerciseIds: [...value.exerciseIds] };
}
export function assertWorkoutVersion(value, existing) {
  const revision = value.revision ?? 0;
  if (
    !Number.isSafeInteger(revision) ||
    revision < 0 ||
    revision !== (existing.revision ?? 0)
  )
    throw new Error(
      "This workout changed in another tab. Close this dialog and open it again before saving or deleting.",
    );
}
export function validateWorkoutUpdate(value, existing) {
  if (!existing)
    throw new Error(
      "This workout no longer exists. Close this dialog and refresh your history.",
    );
  assertWorkoutVersion(value, existing);
  for (const key of ["id", "week", "days", "dayId", "title", "finishedAt"])
    if (value[key] !== existing[key])
      throw new Error(
        "A workout’s original date and session details cannot be changed.",
      );
  return {
    ...validateWorkout(value),
    finishedAt: existing.finishedAt,
    revision: (existing.revision ?? 0) + 1,
  };
}
export function validateSettings(value) {
  if (
    !value ||
    ![3, 4, 5].includes(value.days) ||
    !["weight", "reps", "sets"].includes(value.strategy)
  )
    throw new Error("Choose 3–5 days and a valid progression method.");
  if (
    value.weekdays !== undefined &&
    (!Array.isArray(value.weekdays) ||
      value.weekdays.length !== value.days ||
      new Set(value.weekdays).size !== value.days ||
      !value.weekdays.every(
        (day) => Number.isInteger(day) && day >= 0 && day <= 6,
      ))
  )
    throw new Error(
      `Choose exactly ${value.days} different weekdays for your plan.`,
    );
  return {
    days: value.days,
    strategy: value.strategy,
    ...(value.weekdays !== undefined
      ? { weekdays: [...value.weekdays].sort((a, b) => a - b) }
      : {}),
  };
}
export function validateTarget(value) {
  if (
    !value ||
    !Object.hasOwn(EXERCISES, value.id) ||
    !Number.isInteger(value.sets) ||
    value.sets < 1 ||
    value.sets > 5 ||
    !Number.isInteger(value.reps) ||
    value.reps < 1 ||
    value.reps > 50 ||
    !(
      value.weight === null ||
      (Number.isFinite(value.weight) &&
        value.weight >= 0 &&
        value.weight <= 1000)
    )
  )
    throw new Error(
      "Enter 1–5 sets, 1–50 reps, and an optional weight from 0–1,000 kg.",
    );
  if (value.week !== undefined && !isDateKey(value.week))
    throw new Error("Invalid target week.");
  return {
    id: value.id,
    sets: value.sets,
    reps: value.reps,
    weight: value.weight,
    ...(value.week ? { week: value.week } : {}),
  };
}
export function validateWorkout(value) {
  if (
    !value ||
    typeof value.id !== "string" ||
    !/^[a-zA-Z0-9-]{8,80}$/.test(value.id) ||
    !isDateKey(value.week) ||
    monday(new Date(`${value.week}T12:00:00`)) !== value.week ||
    ![3, 4, 5].includes(value.days)
  )
    throw new Error("Invalid workout.");
  const planDay = PLANS[value.days].find((d) => d.id === value.dayId);
  if (
    !planDay ||
    !Array.isArray(value.exercises) ||
    value.exercises.length < 1 ||
    value.exercises.length > MAX_EXERCISES ||
    new Set(value.exercises.map((exercise) => exercise?.id)).size !==
      value.exercises.length ||
    !["completed", "partial"].includes(value.status) ||
    typeof value.notes !== "string" ||
    value.notes.length > 2000
  )
    throw new Error("Invalid workout details.");
  let doneCount = 0;
  let setCount = 0;
  const exercises = value.exercises.map((e) => {
    if (
      !e ||
      !Object.hasOwn(EXERCISES, e.id) ||
      !Array.isArray(e.sets) ||
      e.sets.length < 1 ||
      e.sets.length > 5
    )
      throw new Error("Invalid exercise sets.");
    const p = validateTarget({ id: e.id, ...e.prescription });
    if (e.sets.length !== p.sets)
      throw new Error("Set count does not match the target.");
    const sets = e.sets.map((s) => {
      if (
        !Number.isInteger(s.reps) ||
        s.reps < 1 ||
        s.reps > 100 ||
        typeof s.done !== "boolean" ||
        !(
          s.weight === null ||
          (Number.isFinite(s.weight) && s.weight >= 0 && s.weight <= 1000)
        )
      )
        throw new Error("Enter valid reps and weight for every set.");
      setCount++;
      if (s.done) doneCount++;
      return { reps: s.reps, weight: s.weight, done: s.done };
    });
    return {
      id: e.id,
      prescription: { sets: p.sets, reps: p.reps, weight: p.weight },
      sets,
    };
  });
  if (!doneCount || (value.status === "completed" && doneCount !== setCount))
    throw new Error("Check off your completed sets before saving.");
  return {
    id: value.id,
    week: value.week,
    days: value.days,
    dayId: value.dayId,
    title: planDay.title,
    status: doneCount === setCount ? "completed" : "partial",
    notes: value.notes.trim(),
    exercises,
  };
}
