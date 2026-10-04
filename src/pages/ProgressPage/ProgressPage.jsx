import { progressView, progressColumns } from "./ProgressPage.styles.js";
import { viewToolbar } from "../../components/common/styles/ViewControls.styles.js";
import { Button } from "../../components/common/Button/Button.jsx";
import React from "react";
import { Target } from "lucide-react";
import { progressOverview } from "../../functions/progress.js";
import { ProgressStats } from "../../components/progress/ProgressStats/ProgressStats.jsx";
import { ConsistencyChart } from "../../components/progress/ConsistencyChart/ConsistencyChart.jsx";
import { NextStepCard } from "../../components/progress/NextStepCard/NextStepCard.jsx";
import { PersonalRecords } from "../../components/progress/PersonalRecords/PersonalRecords.jsx";
import { ExerciseProgress } from "../../components/progress/ExerciseProgress/ExerciseProgress.jsx";

export function ProgressPage({ state, week, onPlan, onSettings }) {
  const { prs, completed, totalVolume, weeks, suggestions, unique } =
    progressOverview(state, week);
  return (
    <section className={`${progressView} progress-view`}>
      <div className={`${viewToolbar} view-toolbar`}>
        <div>
          <h2>Built one rep at a time</h2>
          <p>Your training, adding up.</p>
        </div>
        <Button variant="secondary" onClick={onSettings}>
          <Target size={16} />
          Progression settings
        </Button>
      </div>
      <ProgressStats
        completed={completed}
        totalVolume={totalVolume}
        prs={prs}
      />
      <div className={`${progressColumns} progress-columns`}>
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
