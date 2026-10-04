import React from "react";
import { Dumbbell, Plus, Settings2, TrendingUp } from "lucide-react";
import { prescriptions } from "../../../shared/functions/progression.mjs";

export function ExerciseList({
  workout,
  week,
  state,
  setRoutineDay,
  setTarget,
}) {
  return (
    <div className="exercise-list">
      <div className="exercise-list-toolbar">
        <span>{workout.exercises.length} exercises</span>
        <button
          className="button secondary"
          onClick={() => setRoutineDay(workout)}
        >
          Edit exercises <Settings2 size={16} />
        </button>
      </div>
      {workout.exercises.map((ex, index) => {
        const p = prescriptions(ex, week, state);
        return (
          <div className="exercise-row" key={ex.id}>
            <span className="exercise-number">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="exercise-symbol">
              <Dumbbell size={23} />
            </span>
            <div className="exercise-info">
              <h3>{ex.name}</h3>
              <span>
                {ex.muscle}
                <b>·</b>
                {ex.equipment}
              </span>
            </div>
            <div
              className={`exercise-target ${p.increased ? "target-increased" : ""}`}
              title={p.reason}
            >
              <strong>
                {p.sets} × {p.reps}
                {p.increased && <TrendingUp size={11} />}
              </strong>
              <span>sets × reps</span>
            </div>
            <div className="exercise-rest">
              <strong>{ex.rest}s</strong>
              <span>rest</span>
            </div>
            <button
              className="weight-button"
              aria-label={`Edit ${ex.name} target`}
              onClick={() => setTarget({ exercise: ex, prescription: p })}
            >
              {p.weight === null && <Plus size={14} />}
              {p.weight ?? "Weight"}
              {p.weight !== null && " kg"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
