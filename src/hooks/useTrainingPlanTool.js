import { useEffect } from "react";
import { trainingPlan } from "../../shared/functions/plans.mjs";
import { registerTrainingPlanTool } from "../services/training-plan-tool.js";

export function useTrainingPlanTool({ loaded, state, week, count }) {
  useEffect(() => {
    if (!loaded) return;
    return registerTrainingPlanTool(
      {
        state,
        week,
        count,
        plan: trainingPlan(state.settings, state.routines),
      },
      document.modelContext,
    );
  }, [loaded, state, week, count]);
}
