import React, { useState } from "react";
import {
  Activity,
  Check,
  Dumbbell,
  History,
  ChevronDown,
  Pencil,
  Trash2,
} from "lucide-react";
import { EXERCISES } from "../../shared/catalog/exercises.mjs";
import { volume } from "../../shared/functions/metrics.mjs";

export function HistoryPage({ workouts, onPlan, onEdit, onDelete }) {
  const [filter, setFilter] = useState("all");
  const filtered = workouts.filter(
    (w) => filter === "all" || w.status === filter,
  );
  return (
    <section className="history-view">
      <div className="view-toolbar">
        <div>
          <h2>Your training log</h2>
          <p>Every session is a step forward.</p>
        </div>
        <label className="filter-label">
          Show
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All sessions</option>
            <option value="completed">Completed</option>
            <option value="partial">Partial</option>
          </select>
        </label>
      </div>
      {!filtered.length ? (
        <div className="empty-state">
          <span>
            <History size={31} />
          </span>
          <h3>
            {workouts.length
              ? "No matching sessions"
              : "Your first session starts here"}
          </h3>
          <p>
            {workouts.length
              ? "Try a different filter to see your workouts."
              : "Log your sets, weights, and notes. Your workout history will appear here."}
          </p>
          <button className="button primary" onClick={onPlan}>
            Open weekly planner
          </button>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map((w) => (
            <details className="history-item" key={w.id}>
              <summary>
                <span className="history-icon">
                  <Dumbbell size={22} />
                </span>
                <span className="history-title">
                  <strong>{w.title}</strong>
                  <small>
                    {new Date(w.finishedAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · Week of {w.week}
                  </small>
                </span>
                <span className={`status-tag ${w.status}`}>
                  {w.status === "completed" ? (
                    <Check size={13} />
                  ) : (
                    <Activity size={13} />
                  )}{" "}
                  {w.status === "completed" ? "Completed" : "Partial"}
                </span>
                <ChevronDown size={18} />
              </summary>
              <div className="history-details">
                <div className="history-stats">
                  <span>
                    <strong>
                      {w.exercises.reduce(
                        (n, e) => n + e.sets.filter((s) => s.done).length,
                        0,
                      )}
                    </strong>{" "}
                    sets logged
                  </span>
                  <span>
                    <strong>{volume(w).toLocaleString()}</strong> kg total
                    volume
                  </span>
                </div>
                {w.exercises.map((e) => (
                  <div className="history-exercise" key={e.id}>
                    <strong>{EXERCISES[e.id].name}</strong>
                    <span>
                      {e.sets
                        .filter((s) => s.done)
                        .map((s, i) => (
                          <small key={i}>
                            {s.weight === null ? "BW" : `${s.weight} kg`} ×{" "}
                            {s.reps}
                          </small>
                        ))}
                      {!e.sets.some((s) => s.done) && (
                        <small>Not completed</small>
                      )}
                    </span>
                  </div>
                ))}
                {w.notes && (
                  <div className="saved-notes">
                    <span>SESSION NOTES</span>
                    <p>{w.notes}</p>
                  </div>
                )}
                <div className="history-actions">
                  <button
                    className="button secondary"
                    onClick={() => onEdit(w)}
                  >
                    <Pencil size={16} />
                    Edit workout
                  </button>
                  <button
                    className="button secondary danger-text"
                    onClick={() => onDelete(w)}
                  >
                    <Trash2 size={16} />
                    Delete workout
                  </button>
                </div>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
