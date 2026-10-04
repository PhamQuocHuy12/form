import React from "react";
import { Target } from "lucide-react";
import { progressOverview } from "../functions/progress.js";
import { ProgressStats } from "../components/progress/ProgressStats.jsx";
import { ConsistencyChart } from "../components/progress/ConsistencyChart.jsx";
import { NextStepCard } from "../components/progress/NextStepCard.jsx";
import { PersonalRecords } from "../components/progress/PersonalRecords.jsx";
import { ExerciseProgress } from "../components/progress/ExerciseProgress.jsx";

export function ProgressPage({ state, week, onPlan, onSettings }) {
  const { prs, completed, totalVolume, weeks, suggestions, unique } =
    progressOverview(state, week);
  return (
    <section className="progress-view">
      <div className="view-toolbar">
        <div>
          <h2>Built one rep at a time</h2>
          <p>Your training, adding up.</p>
        </div>
        <button className="button secondary" onClick={onSettings}>
          <Target size={16} />
          Progression settings
        </button>
      </div>
      <ProgressStats
        completed={completed}
        totalVolume={totalVolume}
        prs={prs}
      />
      <div className="progress-columns">
        <ConsistencyChart weeks={weeks} completed={completed} week={week} />
        <NextStepCard suggestions={suggestions} onPlan={onPlan} />
      </div>
      <ExerciseProgress
        workouts={state.workouts}
        week={week}
        defaultExerciseId={prs[0]?.id || unique[0]}
      />
      <PersonalRecords prs={prs} />
    </section>
  );
}
