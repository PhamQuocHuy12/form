import { IconButton } from "../../common/IconButton/IconButton.jsx";
import { ExerciseYoutubeLink } from "../../common/ExerciseYoutubeLink/ExerciseYoutubeLink.jsx";
import { fieldset, field } from "../../common/styles/FormControls.styles.js";
import {
  routineEditor,
  routineChoice,
  routineGrip,
  routineActions,
  routineAdd,
  routineDragPreview,
} from "./ExercisePlanModal.styles.js";
import {
  dangerText,
  formHint,
  formError,
} from "../../common/styles/FormFeedback.styles.js";
import { Button } from "../../common/Button/Button.jsx";
import React, { useState } from "react";
import {
  Check,
  Plus,
  ArrowDown,
  ArrowUp,
  GripVertical,
  Trash2,
} from "lucide-react";
import {
  MUSCLES,
  MAX_EXERCISES,
  EXERCISES,
} from "../../../../shared/catalog/exercises.mjs";
import { PLANS } from "../../../../shared/catalog/plans.mjs";
import { useExerciseDrag } from "../../../hooks/useExerciseDrag.js";
import { Modal } from "../../common/Modal/Modal.jsx";

export function ExercisePlanModal({ day, save, onClose }) {
  const [ids, setIds] = useState(() =>
    day.exercises.map((exercise) => exercise.id),
  );
  const [addition, setAddition] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { listRef, drag, announcement, handleProps } = useExerciseDrag(
    ids,
    setIds,
    busy,
  );
  const options = Object.values(EXERCISES);
  function move(index, offset) {
    setIds((current) => {
      const next = [...current];
      [next[index], next[index + offset]] = [next[index + offset], next[index]];
      return next;
    });
  }
  async function submit(e) {
    e.preventDefault();
    if (drag) return;
    setBusy(true);
    setError("");
    try {
      await save({ id: day.id, exerciseIds: ids });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={`Exercises · ${day.title}`} onClose={onClose} wide>
      <p id="exercise-order-hint">
        Choose 1–{MAX_EXERCISES} exercises. Drag the grip to reorder, or use the
        arrows. New sessions use this list.
      </p>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </p>
      <form onSubmit={submit}>
        <fieldset className={fieldset} disabled={busy}>
          <legend>Exercise order</legend>
          <ol
            className={`${routineEditor} routine-editor ${drag ? "is-reordering" : ""}`}
            ref={listRef}
          >
            {ids.map((id, index) => (
              <li
                key={id}
                className={`${drag?.id === id ? "drag-origin" : ""} ${
                  drag?.targetIndex === index && drag.targetIndex < drag.index
                    ? "drop-before"
                    : ""
                } ${
                  drag?.targetIndex === index && drag.targetIndex > drag.index
                    ? "drop-after"
                    : ""
                }`}
              >
                <div className={`${routineChoice} routine-choice`}>
                  <IconButton
                    type="button"
                    className={`${routineGrip} routine-grip`}
                    aria-label={`Drag ${EXERCISES[id].name} to reorder`}
                    aria-describedby="exercise-order-hint"
                    aria-keyshortcuts="ArrowUp ArrowDown"
                    title="Drag to reorder, or press the up and down arrow keys"
                    disabled={ids.length < 2}
                    {...handleProps(id, index)}
                  >
                    <GripVertical size={19} />
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  </IconButton>
                  <label>
                    <span className="sr-only">Exercise {index + 1}</span>
                    <select
                      className={field}
                      aria-label={`Exercise ${index + 1}`}
                      value={id}
                      disabled={Boolean(drag)}
                      onChange={(e) =>
                        setIds((current) =>
                          current.map((value, i) =>
                            i === index ? e.target.value : value,
                          ),
                        )
                      }
                    >
                      {MUSCLES.map((muscle) => (
                        <optgroup key={muscle} label={muscle}>
                          {options
                            .filter((exercise) => exercise.muscle === muscle)
                            .map((exercise) => (
                              <option
                                key={exercise.id}
                                value={exercise.id}
                                disabled={
                                  exercise.id !== id &&
                                  ids.includes(exercise.id)
                                }
                              >
                                {exercise.name}
                              </option>
                            ))}
                        </optgroup>
                      ))}
                    </select>
                  </label>
                </div>
                <div className={`${routineActions} routine-actions`}>
                  <small>
                    {EXERCISES[id].muscle} · {EXERCISES[id].equipment}
                  </small>
                  <ExerciseYoutubeLink exercise={EXERCISES[id]} />
                  <IconButton
                    type="button"
                    aria-label={`Move ${EXERCISES[id].name} up`}
                    disabled={Boolean(drag) || index === 0}
                    onClick={() => move(index, -1)}
                  >
                    <ArrowUp size={17} />
                  </IconButton>
                  <IconButton
                    type="button"
                    aria-label={`Move ${EXERCISES[id].name} down`}
                    disabled={Boolean(drag) || index === ids.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    <ArrowDown size={17} />
                  </IconButton>
                  <IconButton
                    type="button"
                    className={`${dangerText} danger-text`}
                    aria-label={`Remove ${EXERCISES[id].name}`}
                    disabled={Boolean(drag) || ids.length === 1}
                    onClick={() =>
                      setIds((current) => current.filter((_, i) => i !== index))
                    }
                  >
                    <Trash2 size={17} />
                  </IconButton>
                </div>
              </li>
            ))}
          </ol>
          <div className={`${routineAdd} routine-add`}>
            <label>
              Add a movement
              <select
                className={field}
                aria-label="Add a movement"
                value={addition}
                onChange={(e) => setAddition(e.target.value)}
                disabled={Boolean(drag) || ids.length >= MAX_EXERCISES}
              >
                <option value="">Choose an exercise</option>
                {MUSCLES.map((muscle) => (
                  <optgroup key={muscle} label={muscle}>
                    {options
                      .filter(
                        (exercise) =>
                          exercise.muscle === muscle &&
                          !ids.includes(exercise.id),
                      )
                      .map((exercise) => (
                        <option key={exercise.id} value={exercise.id}>
                          {exercise.name}
                        </option>
                      ))}
                  </optgroup>
                ))}
              </select>
            </label>
            <Button
              type="button"
              variant="secondary"
              disabled={
                Boolean(drag) ||
                !addition ||
                ids.includes(addition) ||
                ids.length >= MAX_EXERCISES
              }
              onClick={() => {
                setIds((current) => [...current, addition]);
                setAddition("");
              }}
            >
              <Plus size={16} />
              Add exercise
            </Button>
          </div>
          <p className={`${formHint} form-hint`}>
            {ids.length} / {MAX_EXERCISES} exercises ·{" "}
            {[...new Set(ids.map((id) => EXERCISES[id].muscle))].join(", ")}
          </p>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            disabled={Boolean(drag)}
            onClick={() => {
              setIds(
                Object.values(PLANS)
                  .flat()
                  .find((value) => value.id === day.id)
                  .exercises.map((exercise) => exercise.id),
              );
              setAddition("");
            }}
          >
            Restore template exercises
          </Button>
        </fieldset>
        {error && (
          <p role="alert" className={`${formError} form-error`}>
            {error}
          </p>
        )}
        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={busy || Boolean(drag)}
        >
          {busy ? "Saving…" : "Save exercises"}
          <Check size={17} />
        </Button>
      </form>
      {drag && (
        <div
          className={`${routineDragPreview} routine-drag-preview`}
          aria-hidden="true"
          style={{ top: drag.top, left: drag.left, width: drag.width }}
        >
          <GripVertical size={22} />
          <div>
            <strong>{EXERCISES[drag.id].name}</strong>
            <small>
              {EXERCISES[drag.id].muscle} · Position {drag.targetIndex + 1} of{" "}
              {ids.length}
            </small>
          </div>
        </div>
      )}
    </Modal>
  );
}
