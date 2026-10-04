import {
  chartCard,
  barChart,
  chartColumn,
  chartBarSpace,
} from "./ConsistencyChart.styles.js";
import React from "react";

export function ConsistencyChart({ weeks, completed, week }) {
  return (
    <section className={`${chartCard} chart-card`}>
      <h3>Consistency over time</h3>
      <p>Completed workouts · last 6 training weeks</p>
      <div
        className={`${barChart} bar-chart`}
        role="img"
        aria-label={weeks
          .map(
            (key) =>
              `Week ${key}: ${completed.filter((w) => w.week === key).length} completed`,
          )
          .join("; ")}
      >
        {weeks.map((key) => {
          const count = completed.filter((w) => w.week === key).length;
          const max = Math.max(
            5,
            ...weeks.map((k) => completed.filter((w) => w.week === k).length),
          );
          return (
            <div className={`${chartColumn} chart-column`} key={key}>
              <span>{count}</span>
              <div className={`${chartBarSpace} chart-bar-space`}>
                <i
                  style={{
                    height: count ? `${(count / max) * 100}%` : "3px",
                  }}
                  className={key === week ? "current-bar" : ""}
                />
              </div>
              <small>
                {new Date(`${key}T12:00:00`).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
