import {
  emptyExerciseProgress,
  singleProgressHint,
  exerciseTrendGrid,
  exerciseTrendSelection,
  exerciseProgressData,
  exerciseProgressTableWrap,
} from "./ExerciseTrends.styles.js";
import React, { useState } from "react";
import { formatDate, formatWeight } from "../../../utils/format.js";
import { ProgressPlot } from "../ProgressPlot/ProgressPlot.jsx";

export function ExerciseTrends({ points, exercise }) {
  const [selection, setSelection] = useState(null);
  const selected = Math.max(
    0,
    Math.min(selection ?? points.length - 1, points.length - 1),
  );
  const point = points[selected];
  if (!point)
    return (
      <div className={`${emptyExerciseProgress} empty-exercise-progress`}>
        No logged sets in this range. Log {exercise.name.toLowerCase()} or
        choose another exercise or range to see your progress.
      </div>
    );
  return (
    <>
      {points.length === 1 && (
        <p className={`${singleProgressHint} single-progress-hint`}>
          Your first benchmark. Log another workout to see a trend.
        </p>
      )}
      <div className={`${exerciseTrendGrid} exercise-trend-grid`}>
        {["weight", "reps"].map((metric) => (
          <ProgressPlot
            key={metric}
            points={points}
            metric={metric}
            selected={selected}
            onSelect={setSelection}
            name={exercise.name}
          />
        ))}
      </div>
      <div
        className={`${exerciseTrendSelection} exercise-trend-selection`}
        aria-live="polite"
        aria-atomic="true"
      >
        <span>
          {formatDate(point.finishedAt, {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
        <strong>
          {formatWeight(point.weight)} × {point.reps} reps
        </strong>
        <span>
          Set {point.setNumber} · {point.completedSets}{" "}
          {point.completedSets === 1 ? "set" : "sets"} logged
          {point.status === "partial" ? " · Partial workout" : ""}
        </span>
      </div>
      <details className={`${exerciseProgressData} exercise-progress-data`}>
        <summary>
          View chart data · {points.length}{" "}
          {points.length === 1 ? "workout" : "workouts"}
        </summary>
        <div
          className={`${exerciseProgressTableWrap} exercise-progress-table-wrap`}
        >
          <table>
            <caption className="sr-only">
              {exercise.name}: heaviest completed set in each workout
            </caption>
            <thead>
              <tr>
                <th scope="col">Logged</th>
                <th scope="col">Weight</th>
                <th scope="col">Reps</th>
                <th scope="col">Workout</th>
              </tr>
            </thead>
            <tbody>
              {points.map((item) => (
                <tr key={item.id}>
                  <td>
                    <time dateTime={item.finishedAt}>
                      {formatDate(item.finishedAt, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </time>
                  </td>
                  <td>{formatWeight(item.weight)}</td>
                  <td>{item.reps}</td>
                  <td>{item.status === "partial" ? "Partial" : "Completed"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}
