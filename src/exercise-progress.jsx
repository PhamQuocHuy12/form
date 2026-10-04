import React, { useState } from "react";
import { EXERCISES, exerciseProgress } from "../shared/training.mjs";

const formatDate = (date, options = { month: "short", day: "numeric" }) =>
  new Date(date).toLocaleDateString("en-US", options);
const load = (weight) => (weight === 0 ? "BW" : `${weight} kg`);

function ProgressPlot({ points, metric, selected, onSelect, name }) {
  const title = metric === "weight" ? "Weight over time" : "Reps over time";
  const step =
    metric === "weight"
      ? Math.max(...points.map((point) => point.weight)) > 10
        ? 5
        : 1
      : 2;
  const maximum = Math.max(
    step,
    Math.ceil(Math.max(...points.map((point) => point[metric])) / step) * step,
  );
  const x = (index) =>
    points.length === 1 ? 196 : 44 + (index / (points.length - 1)) * 304;
  const y = (value) => 174 - (value / maximum) * 156;
  const ticks = [
    ...new Set([0, Math.floor((points.length - 1) / 2), points.length - 1]),
  ];
  const bodyweight =
    metric === "weight" && points.every((point) => point.weight === 0);
  return (
    <section className={`exercise-trend ${metric}`} aria-label={title}>
      <div className="exercise-trend-heading">
        <h4>{title}</h4>
        <strong>
          {metric === "weight"
            ? load(points[selected].weight)
            : `${points[selected].reps} reps`}
        </strong>
      </div>
      {bodyweight ? (
        <div className="bodyweight-trend">
          <strong>Bodyweight only</strong>
          <p>No external load logged. Follow the rep chart.</p>
        </div>
      ) : (
        <svg
          viewBox="0 0 360 218"
          className="exercise-trend-plot"
          role="group"
          aria-label={`${name}: ${title.toLowerCase()}`}
        >
          <title>{title} · each point is one workout</title>
          {[0, maximum / 2, maximum].map((value) => (
            <g key={value}>
              <line
                x1="44"
                x2="348"
                y1={y(value)}
                y2={y(value)}
                className="trend-gridline"
              />
              <text x="36" y={y(value) + 4} textAnchor="end">
                {value}
              </text>
            </g>
          ))}
          <polyline
            fill="none"
            points={points
              .map((point, index) => `${x(index)},${y(point[metric])}`)
              .join(" ")}
            className="trend-line"
          />
          {points.map((point, index) => (
            <g
              key={point.id}
              className="trend-point-control"
              tabIndex="0"
              role="button"
              aria-pressed={index === selected}
              aria-label={`Workout ${index + 1}, ${formatDate(point.finishedAt, { month: "long", day: "numeric", year: "numeric" })}: ${load(point.weight)}, ${point.reps} reps`}
              onMouseEnter={() => onSelect(index)}
              onFocus={() => onSelect(index)}
              onClick={() => onSelect(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelect(index);
                }
                if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
                  event.preventDefault();
                  const next = Math.max(
                    0,
                    Math.min(
                      points.length - 1,
                      index + (event.key === "ArrowLeft" ? -1 : 1),
                    ),
                  );
                  event.currentTarget.parentElement
                    .querySelectorAll('[role="button"]')
                    [next].focus();
                }
              }}
            >
              <title>
                {formatDate(point.finishedAt)} · {load(point.weight)} ×{" "}
                {point.reps} reps
              </title>
              <circle
                cx={x(index)}
                cy={y(point[metric])}
                r="8"
                fill="transparent"
                stroke="transparent"
                strokeWidth="28"
                vectorEffect="non-scaling-stroke"
                pointerEvents="all"
                aria-hidden="true"
              />
              <circle
                cx={x(index)}
                cy={y(point[metric])}
                r={index === selected ? 6 : 4}
                className={`trend-point ${index === selected ? "selected" : ""}`}
                pointerEvents="none"
                aria-hidden="true"
              />
            </g>
          ))}
          {ticks.map((index) => (
            <text
              key={index}
              x={x(index)}
              y="204"
              textAnchor={
                points.length === 1
                  ? "middle"
                  : index === 0
                    ? "start"
                    : index === points.length - 1
                      ? "end"
                      : "middle"
              }
            >
              {formatDate(points[index].finishedAt)}
            </text>
          ))}
        </svg>
      )}
    </section>
  );
}

function ExerciseTrends({ points, exercise }) {
  const [selection, setSelection] = useState(null);
  const selected = Math.max(
    0,
    Math.min(selection ?? points.length - 1, points.length - 1),
  );
  const point = points[selected];
  if (!point)
    return (
      <div className="empty-exercise-progress">
        No logged sets in this range. Log {exercise.name.toLowerCase()} or
        choose another exercise or range to see your progress.
      </div>
    );
  return (
    <>
      {points.length === 1 && (
        <p className="single-progress-hint">
          Your first benchmark. Log another workout to see a trend.
        </p>
      )}
      <div className="exercise-trend-grid">
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
        className="exercise-trend-selection"
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
          {load(point.weight)} × {point.reps} reps
        </strong>
        <span>
          Set {point.setNumber} · {point.completedSets}{" "}
          {point.completedSets === 1 ? "set" : "sets"} logged
          {point.status === "partial" ? " · Partial workout" : ""}
        </span>
      </div>
      <details className="exercise-progress-data">
        <summary>
          View chart data · {points.length}{" "}
          {points.length === 1 ? "workout" : "workouts"}
        </summary>
        <div className="exercise-progress-table-wrap">
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
                  <td>{load(item.weight)}</td>
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
      className="exercise-progress-card"
      aria-labelledby="exercise-progress-title"
    >
      <div className="exercise-progress-toolbar">
        <div>
          <h3 id="exercise-progress-title">Exercise progress</h3>
          <p>
            Heaviest completed set per workout. Reps come from that same set;
            partial workouts count.
          </p>
        </div>
        <div className="exercise-progress-controls">
          <label>
            Exercise
            <select
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
      <p className="exercise-progress-period">
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
