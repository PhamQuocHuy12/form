import {
  exerciseList,
  exerciseListToolbar,
  exerciseRow,
  exerciseNumber,
  exerciseSymbol,
  exerciseInfo,
  exerciseTarget,
  exerciseRest,
  weightButton,
} from "./ExerciseList.styles.js";
import { Button } from "../../common/Button/Button.jsx";
import { ExerciseYoutubeLink } from "../../common/ExerciseYoutubeLink/ExerciseYoutubeLink.jsx";
import React from "react";
import { Dumbbell, Plus, Settings2, TrendingUp } from "lucide-react";
import { prescriptions } from "../../../../shared/functions/progression.mjs";

export function ExerciseList({
  workout,
  week,
  state,
  setRoutineDay,
  setTarget,
}) {
  return (
    <div className={`${exerciseList} exercise-list`}>
      <div className={`${exerciseListToolbar} exercise-list-toolbar`}>
        <span>{workout.exercises.length} exercises</span>
        <Button variant="secondary" onClick={() => setRoutineDay(workout)}>
          Edit exercises <Settings2 size={16} />
        </Button>
      </div>
      {workout.exercises.map((ex, index) => {
        const p = prescriptions(ex, week, state);
        return (
          <div className={`${exerciseRow} exercise-row`} key={ex.id}>
            <span className={`${exerciseNumber} exercise-number`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className={`${exerciseSymbol} exercise-symbol`}>
              <Dumbbell size={23} />
            </span>
            <div className={`${exerciseInfo} exercise-info`}>
              <h3>{ex.name}</h3>
              <span>
                {ex.muscle}
                <b>·</b>
                {ex.equipment}
              </span>
              <ExerciseYoutubeLink exercise={ex} />
            </div>
            <div
              className={`${exerciseTarget} exercise-target ${p.increased ? "target-increased" : ""}`}
              title={p.reason}
            >
              <strong>
                {p.sets} × {p.reps}
                {p.increased && <TrendingUp size={11} />}
              </strong>
              <span>sets × reps</span>
            </div>
            <div className={`${exerciseRest} exercise-rest`}>
              <strong>{ex.rest}s</strong>
              <span>rest</span>
            </div>
            <button
              className={`${weightButton} weight-button`}
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
