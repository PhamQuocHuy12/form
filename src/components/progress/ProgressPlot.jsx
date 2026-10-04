import React from "react";
import { formatDate, formatWeight } from "../../utils/format.js";

export function ProgressPlot({ points, metric, selected, onSelect, name }) {
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
            ? formatWeight(points[selected].weight)
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
              aria-label={`Workout ${index + 1}, ${formatDate(point.finishedAt, { month: "long", day: "numeric", year: "numeric" })}: ${formatWeight(point.weight)}, ${point.reps} reps`}
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
                {formatDate(point.finishedAt)} · {formatWeight(point.weight)} ×{" "}
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
