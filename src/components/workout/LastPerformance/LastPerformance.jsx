import {
  lastPerformance,
  lastPerformanceHeading,
  lastPerformanceSets,
} from "./LastPerformance.styles.js";
import React from "react";

export function LastPerformance({ exercise, previous }) {
  return (
    <section
      className={`${lastPerformance} last-performance`}
      aria-label={`Last time for ${exercise.name}`}
    >
      <div className={`${lastPerformanceHeading} last-performance-heading`}>
        <strong>Last time</strong>
        {previous && (
          <span>
            <time dateTime={previous.finishedAt}>
              {new Date(previous.finishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            {previous.status === "partial" && " · Partial workout"}
          </span>
        )}
      </div>
      {previous ? (
        <ul className={`${lastPerformanceSets} last-performance-sets`}>
          {previous.sets.map((set) => (
            <li key={set.number}>
              <span>Set {set.number}</span>
              <strong>
                {set.weight === null || set.weight === 0
                  ? "BW"
                  : `${set.weight} kg`}{" "}
                × {set.reps} reps
              </strong>
            </li>
          ))}
        </ul>
      ) : (
        <p>No previous logged sets.</p>
      )}
    </section>
  );
}
