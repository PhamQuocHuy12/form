import { ActionRow } from "../../components/common/ActionRow/ActionRow.jsx";
import {
  historyView,
  historyList,
  historyItem,
  historyIcon,
  historyTitle,
  statusTag,
  historyDetails,
  historyStats,
  historyExercise,
  savedNotes,
} from "./HistoryPage.styles.js";
import {
  viewToolbar,
  filterLabel,
  emptyState,
} from "../../components/common/styles/ViewControls.styles.js";
import { field } from "../../components/common/styles/FormControls.styles.js";
import { dangerText } from "../../components/common/styles/FormFeedback.styles.js";
import { Button } from "../../components/common/Button/Button.jsx";
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
import { EXERCISES } from "../../../shared/catalog/exercises.mjs";
import { volume } from "../../../shared/functions/metrics.mjs";

export function HistoryPage({ workouts, onPlan, onEdit, onDelete }) {
  const [filter, setFilter] = useState("all");
  const filtered = workouts.filter(
    (w) => filter === "all" || w.status === filter,
  );
  return (
    <section className={`${historyView} history-view`}>
      <div className={`${viewToolbar} view-toolbar`}>
        <div>
          <h2>Your training log</h2>
          <p>Every session is a step forward.</p>
        </div>
        <label className={`${filterLabel} filter-label`}>
          Show
          <select
            className={field}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All sessions</option>
            <option value="completed">Completed</option>
            <option value="partial">Partial</option>
          </select>
        </label>
      </div>
      {!filtered.length ? (
        <div className={`${emptyState} empty-state`}>
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
          <Button variant="primary" onClick={onPlan}>
            Open weekly planner
          </Button>
        </div>
      ) : (
        <div className={`${historyList} history-list`}>
          {filtered.map((w) => (
            <details className={`${historyItem} history-item`} key={w.id}>
              <summary>
                <span className={`${historyIcon} history-icon`}>
                  <Dumbbell size={22} />
                </span>
                <span className={`${historyTitle} history-title`}>
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
                <span className={`${statusTag} status-tag ${w.status}`}>
                  {w.status === "completed" ? (
                    <Check size={13} />
                  ) : (
                    <Activity size={13} />
                  )}{" "}
                  {w.status === "completed" ? "Completed" : "Partial"}
                </span>
                <ChevronDown size={18} />
              </summary>
              <div className={`${historyDetails} history-details`}>
                <div className={`${historyStats} history-stats`}>
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
                  <div
                    className={`${historyExercise} history-exercise`}
                    key={e.id}
                  >
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
                  <div className={`${savedNotes} saved-notes`}>
                    <span>SESSION NOTES</span>
                    <p>{w.notes}</p>
                  </div>
                )}
                <ActionRow>
                  <Button variant="secondary" onClick={() => onEdit(w)}>
                    <Pencil size={16} />
                    Edit workout
                  </Button>
                  <Button
                    variant="secondary"
                    className={`${dangerText} danger-text`}
                    onClick={() => onDelete(w)}
                  >
                    <Trash2 size={16} />
                    Delete workout
                  </Button>
                </ActionRow>
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
