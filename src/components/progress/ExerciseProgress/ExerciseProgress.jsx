import {
  exerciseProgressCard,
  exerciseProgressToolbar,
  exerciseProgressControls,
  exerciseProgressPeriod,
} from "./ExerciseProgress.styles.js";
import { field } from "../../common/styles/FormControls.styles.js";
import React, { useState } from "react";
import { EXERCISES } from "../../../../shared/catalog/exercises.mjs";
import { exerciseProgress } from "../../../../shared/functions/metrics.mjs";
import { formatDate } from "../../../utils/format.js";
import { ExerciseTrends } from "../ExerciseTrends/ExerciseTrends.jsx";

export function ExerciseProgress({ workouts, week, defaultExerciseId }) {
  const [exerciseId, setExerciseId] = useState(defaultExerciseId || "bench");
  const [range, setRange] = useState("6");
  const exercise = EXERCISES[exerciseId];
  const points = exerciseProgress(
    exerciseId,
    workouts,
    week,
    range === "all" ? "all" : Number(range),
  );
  return (
    <section
      className={`${exerciseProgressCard} exercise-progress-card`}
      aria-labelledby="exercise-progress-title"
    >
      <div className={`${exerciseProgressToolbar} exercise-progress-toolbar`}>
        <div>
          <h3 id="exercise-progress-title">Exercise progress</h3>
          <p>
            Heaviest completed set per workout. Reps come from that same set;
            partial workouts count.
          </p>
        </div>
        <div
          className={`${exerciseProgressControls} exercise-progress-controls`}
        >
          <label>
            Exercise
            <select
              className={field}
              aria-label="Progress exercise"
              value={exerciseId}
              onChange={(event) => setExerciseId(event.target.value)}
            >
              {Object.values(EXERCISES)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
          </label>
          <label>
            Range
            <select
              className={field}
              aria-label="Progress range"
              value={range}
              onChange={(event) => setRange(event.target.value)}
            >
              <option value="6">Last 6 weeks</option>
              <option value="12">Last 12 weeks</option>
              <option value="all">All history</option>
            </select>
          </label>
        </div>
      </div>
      <p className={`${exerciseProgressPeriod} exercise-progress-period`}>
        Training history through the week of{" "}
        {formatDate(`${week}T12:00:00`, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        . Select a point to inspect a workout.
      </p>
      <ExerciseTrends
        key={`${exerciseId}:${range}:${week}`}
        points={points}
        exercise={exercise}
      />
    </section>
  );
}
