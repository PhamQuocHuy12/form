import React from "react";
import { Activity, Flame, LayoutGrid, Plus, TrendingUp } from "lucide-react";
import { MUSCLES } from "../../../shared/catalog/exercises.mjs";
import { prescriptions } from "../../../shared/functions/progression.mjs";

export function PlannerInsights({
  plan,
  state,
  week,
  completedDays,
  count,
  onSettings,
}) {
  return (
    <aside className="insight-column">
      <section className="weekly-card">
        <div className="small-label">
          WEEKLY CHECK-IN <Activity size={16} />
        </div>
        <div className="completion-count">
          {count}
          <span>/ {state.settings.days}</span>
        </div>
        <p>workouts completed</p>
        <div className="progress-segments">
          {plan.map((p, i) => (
            <span
              key={p.id}
              className={completedDays.has(p.id) ? "filled" : ""}
            />
          ))}
        </div>
        <div className="weekly-card-foot">
          <Flame size={16} />
          Your next chapter starts with one set.
        </div>
      </section>
      <section className="balance-card">
        <h3>
          A balanced week <LayoutGrid size={17} />
        </h3>
        <p>Every major muscle group, covered.</p>
        <div className="muscle-list">
          {MUSCLES.map((muscle) => {
            const total = plan
              .flatMap((d) => d.exercises)
              .filter((e) => e.muscle === muscle)
              .reduce((n, e) => n + prescriptions(e, week, state).sets, 0);
            return (
              <div key={muscle}>
                <span>{muscle}</span>
                <div className="muscle-track">
                  <i
                    style={{
                      width: Math.min(100, (total / 24) * 100) + "%",
                    }}
                  />
                </div>
                <strong>
                  {total}
                  <small> sets</small>
                </strong>
              </div>
            );
          })}
        </div>
      </section>
      <section className="progression-card">
        <span className="progression-icon">
          <TrendingUp size={23} />
        </span>
        <div className="small-label">PROGRESS, NOT PERFECTION</div>
        <h3>
          Small steps.
          <br />
          Stronger weeks.
        </h3>
        <p>
          Hit your rep targets with good form. We’ll suggest your next step each
          week.
        </p>
        <button onClick={onSettings}>
          Your progression plan <Plus size={16} />
        </button>
      </section>
    </aside>
  );
}
