import { ActionRow } from "../../common/ActionRow/ActionRow.jsx";
import {
  logExercise,
  logExNumber,
  logExerciseBody,
  completeExercise,
} from "./ExerciseLog.styles.js";
import { setGrid } from "../SetLogRow/SetLogRow.styles.js";
import { Button } from "../../common/Button/Button.jsx";
import React from "react";
import { Check, CheckCheck, ChevronDown } from "lucide-react";
import { EXERCISES } from "../../../../shared/catalog/exercises.mjs";
import { lastExercisePerformance } from "../../../../shared/functions/metrics.mjs";
import {
  setExerciseCompletion,
  addExerciseSet,
  removeExerciseSet,
} from "../../../functions/session.js";
import { LastPerformance } from "../LastPerformance/LastPerformance.jsx";
import { SetLogRow } from "../SetLogRow/SetLogRow.jsx";

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
    <details className={`${logExercise} log-exercise`} open>
      <summary>
        <span
          className={`${logExNumber} log-ex-number ${allDone ? "is-done" : ""}`}
        >
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
      <div className={`${logExerciseBody} log-exercise-body`}>
        <p>{exercise.tip}</p>
        {!editing && (
          <LastPerformance exercise={exercise} previous={previous} />
        )}
        <div className={`${setGrid} set-grid set-labels`}>
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
          className={`${completeExercise} complete-exercise`}
          onClick={() => {
            setSession((old) => setExerciseCompletion(old, i, !allDone));
            if (!allDone && !editing) startTimer(exercise.rest);
          }}
        >
          <CheckCheck size={16} />
          {allDone ? "Uncheck all sets" : "Mark all sets complete"}
        </button>
        {editing && (
          <ActionRow className="edit-set-actions">
            <Button
              type="button"
              variant="secondary"
              disabled={busy || e.sets.length >= 5}
              onClick={() => setSession((old) => addExerciseSet(old, i))}
            >
              Add set
            </Button>
            <Button
              type="button"
              variant="secondary"
              disabled={busy || e.sets.length <= 1}
              onClick={() => setSession((old) => removeExerciseSet(old, i))}
            >
              Remove last set
            </Button>
          </ActionRow>
        )}
      </div>
    </details>
  );
}
