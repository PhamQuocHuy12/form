import React from "react";
import { WeekStrip } from "../components/planner/WeekStrip.jsx";
import { WorkoutPanel } from "../components/planner/WorkoutPanel.jsx";
import { PlannerInsights } from "../components/planner/PlannerInsights.jsx";

export function PlannerPage({
  plan,
  workout,
  week,
  state,
  session,
  completedDays,
  count,
  onSelectDay,
  onStartWorkout,
  onEditTarget,
  onEditRoutine,
  onSettings,
}) {
  return (
    <>
      <WeekStrip
        plan={plan}
        workout={workout}
        week={week}
        completedDays={completedDays}
        setSelected={onSelectDay}
      />
      <div className="content-grid">
        <WorkoutPanel
          workout={workout}
          state={state}
          week={week}
          session={session}
          completedDays={completedDays}
          startWorkout={onStartWorkout}
          setTarget={onEditTarget}
          setRoutineDay={onEditRoutine}
        />
        <PlannerInsights
          plan={plan}
          state={state}
          week={week}
          completedDays={completedDays}
          count={count}
          onSettings={onSettings}
        />
      </div>
    </>
  );
}
