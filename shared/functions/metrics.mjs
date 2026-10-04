import { EXERCISES } from "../catalog/exercises.mjs";
import { shiftDate } from "../utils/dates.mjs";

export function lastExercisePerformance(exerciseId, session, workouts) {
  const now = Date.now();
  const previous = workouts
    .filter(
      (workout) =>
        workout.id !== session.id &&
        workout.week <= session.week &&
        Date.parse(workout.finishedAt) <= now &&
        workout.exercises.some(
          (exercise) =>
            exercise.id === exerciseId && exercise.sets.some((set) => set.done),
        ),
    )
    .sort((a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt))[0];
  if (!previous) return null;
  const exercise = previous.exercises.find((item) => item.id === exerciseId);
  return {
    finishedAt: previous.finishedAt,
    status: previous.status,
    sets: exercise.sets.flatMap((set, index) =>
      set.done
        ? [{ number: index + 1, weight: set.weight, reps: set.reps }]
        : [],
    ),
  };
}
export function exerciseProgress(exerciseId, workouts, week, range = 6) {
  const firstWeek = range === "all" ? null : shiftDate(week, -(range - 1) * 7);
  const now = Date.now();
  return workouts
    .filter(
      (workout) =>
        workout.week <= week &&
        (!firstWeek || workout.week >= firstWeek) &&
        Date.parse(workout.finishedAt) <= now,
    )
    .flatMap((workout) => {
      const exercise = workout.exercises.find((item) => item.id === exerciseId);
      const sets =
        exercise?.sets.flatMap((set, index) =>
          set.done ? [{ ...set, number: index + 1 }] : [],
        ) ?? [];
      if (!sets.length) return [];
      const best = sets.reduce((top, set) =>
        (set.weight ?? 0) > (top.weight ?? 0) ||
        ((set.weight ?? 0) === (top.weight ?? 0) && set.reps > top.reps)
          ? set
          : top,
      );
      return [
        {
          id: workout.id,
          finishedAt: workout.finishedAt,
          status: workout.status,
          weight: best.weight ?? 0,
          reps: best.reps,
          setNumber: best.number,
          completedSets: sets.length,
        },
      ];
    })
    .sort(
      (a, b) =>
        Date.parse(a.finishedAt) - Date.parse(b.finishedAt) ||
        a.id.localeCompare(b.id),
    );
}
export function records(workouts) {
  const best = {};
  for (const workout of workouts)
    for (const e of workout.exercises)
      for (const s of e.sets.filter((s) => s.done)) {
        const score = s.weight ?? 0;
        const previous = best[e.id];
        if (
          !previous ||
          score > (previous.weight ?? 0) ||
          (score === (previous.weight ?? 0) && s.reps > previous.reps)
        )
          best[e.id] = {
            id: e.id,
            name: EXERCISES[e.id].name,
            weight: s.weight,
            reps: s.reps,
            date: workout.finishedAt,
          };
      }
  return Object.values(best);
}
export function volume(workout) {
  return workout.exercises.reduce(
    (sum, e) =>
      sum +
      e.sets.reduce((n, s) => n + (s.done ? (s.weight ?? 0) * s.reps : 0), 0),
    0,
  );
}
