import { EXERCISES } from "../catalog/exercises.mjs";
import { PLANS } from "../catalog/plans.mjs";

export function trainingPlan(settings, routines = {}) {
  const weekdays =
    settings.weekdays ?? PLANS[settings.days].map((day) => day.weekday);
  return PLANS[settings.days].map((day, index) => ({
    ...day,
    weekday: weekdays[index],
    ...(routines[day.id]
      ? {
          exercises: routines[day.id].exerciseIds.map((id) => EXERCISES[id]),
          subtitle: [
            ...new Set(
              routines[day.id].exerciseIds.map((id) => EXERCISES[id].muscle),
            ),
          ].join(", "),
        }
      : {}),
  }));
}
