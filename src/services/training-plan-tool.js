import { prescriptions } from "../../shared/functions/progression.mjs";

export function registerTrainingPlanTool(
  { state, week, count, plan },
  context,
) {
  if (!context?.registerTool) return;
  const lifecycle = new AbortController();
  try {
    Promise.resolve(
      context.registerTool(
        {
          name: "read_training_plan",
          title: "Read training plan",
          description:
            "Read the selected week, exercise targets, and saved workout count.",
          inputSchema: {
            type: "object",
            properties: {},
            additionalProperties: false,
          },
          annotations: { readOnlyHint: true },
          execute(input) {
            if (!input || Object.keys(input).length)
              throw new Error("No arguments expected.");
            return {
              week,
              days: state.settings.days,
              completed: count,
              plan: plan.map((d) => ({
                title: d.title,
                weekday: d.weekday,
                exercises: d.exercises.map((e) => ({
                  name: e.name,
                  ...prescriptions(e, week, state),
                })),
              })),
            };
          },
        },
        { signal: lifecycle.signal },
      ),
    ).catch(() => {});
  } catch {
    /* Optional browser capability. */
  }
  return () => lifecycle.abort();
}
