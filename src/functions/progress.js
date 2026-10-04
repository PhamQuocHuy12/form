import { EXERCISES } from "../../shared/catalog/exercises.mjs";
import { shiftDate } from "../../shared/utils/dates.mjs";
import { trainingPlan } from "../../shared/functions/plans.mjs";
import { prescriptions } from "../../shared/functions/progression.mjs";
import { records, volume } from "../../shared/functions/metrics.mjs";

export function progressOverview(state, week) {
  const prs = records(state.workouts);
  const completed = state.workouts.filter((w) => w.status === "completed");
  const totalVolume = state.workouts.reduce((n, w) => n + volume(w), 0);
  const weeks = Array.from({ length: 6 }, (_, i) =>
    shiftDate(week, (i - 5) * 7),
  );
  const unique = [
    ...new Set(
      trainingPlan(state.settings, state.routines).flatMap((d) =>
        d.exercises.map((e) => e.id),
      ),
    ),
  ];
  const suggestions = unique
    .map((id) => ({
      exercise: EXERCISES[id],
      target: prescriptions(EXERCISES[id], week, state),
    }))
    .filter((s) => s.target.increased);

  return { prs, completed, totalVolume, weeks, suggestions, unique };
}
