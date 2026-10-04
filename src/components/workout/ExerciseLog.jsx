import React from "react";
import { Check, CheckCheck, ChevronDown } from "lucide-react";
import { EXERCISES } from "../../../shared/catalog/exercises.mjs";
import { lastExercisePerformance } from "../../../shared/functions/metrics.mjs";
import {
  setExerciseCompletion,
  addExerciseSet,
  removeExerciseSet,
} from "../../functions/session.js";
import { LastPerformance } from "./LastPerformance.jsx";
import { SetLogRow } from "./SetLogRow.jsx";

export function ExerciseLog({
  entry: e,
  index: i,
  session,
  workouts,
  editing,
  busy,
  updateSet,
  setSession,
  onRest: startTimer,
}) {
  const exercise = EXERCISES[e.id];
  const allDone = e.sets.every((s) => s.done);
  const previous = editing
    ? null
    : lastExercisePerformance(e.id, session, workouts);
  return (
    <details className="log-exercise" open>
      <summary>
        <span className={`log-ex-number ${allDone ? "is-done" : ""}`}>
          {allDone ? <Check size={16} /> : String(i + 1).padStart(2, "0")}
        </span>
        <span>
          <strong>{exercise.name}</strong>
          <small>
            {exercise.muscle} · {exercise.rest}s rest
          </small>
        </span>
        <ChevronDown size={17} />
      </summary>
      <div className="log-exercise-body">
        <p>{exercise.tip}</p>
        {!editing && (
          <LastPerformance exercise={exercise} previous={previous} />
        )}
        <div className="set-grid set-labels">
          <span>SET</span>
          <span>KG</span>
          <span>REPS</span>
          <span>DONE</span>
        </div>
        {e.sets.map((set, j) => (
          <SetLogRow
            key={j}
            set={set}
            index={j}
            exercise={exercise}
            onChange={(values) => updateSet(i, j, values)}
            onComplete={() => {
              if (!editing) startTimer(exercise.rest);
            }}
          />
        ))}
        <button
          type="button"
          className="complete-exercise"
          onClick={() => {
            setSession((old) => setExerciseCompletion(old, i, !allDone));
            if (!allDone && !editing) startTimer(exercise.rest);
          }}
        >
          <CheckCheck size={16} />
          {allDone ? "Uncheck all sets" : "Mark all sets complete"}
        </button>
        {editing && (
          <div className="history-actions edit-set-actions">
            <button
              type="button"
              className="button secondary"
              disabled={busy || e.sets.length >= 5}
              onClick={() => setSession((old) => addExerciseSet(old, i))}
            >
              Add set
            </button>
            <button
              type="button"
              className="button secondary"
              disabled={busy || e.sets.length <= 1}
              onClick={() => setSession((old) => removeExerciseSet(old, i))}
            >
              Remove last set
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
