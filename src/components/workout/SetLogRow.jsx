import React from "react";
import { Check } from "lucide-react";

export function SetLogRow({ set, index: j, exercise, onChange, onComplete }) {
  return (
    <div className={`set-grid ${set.done ? "set-done" : ""}`}>
      <span>{j + 1}</span>
      <input
        aria-label={`${exercise.name} set ${j + 1} weight`}
        type="number"
        inputMode="decimal"
        min="0"
        max="1000"
        step="0.25"
        placeholder="—"
        value={set.weight ?? ""}
        onChange={(ev) => onChange({ weight: ev.target.value })}
      />
      <input
        aria-label={`${exercise.name} set ${j + 1} reps`}
        type="number"
        inputMode="numeric"
        min="1"
        max="100"
        required
        value={set.reps}
        onChange={(ev) => onChange({ reps: ev.target.value })}
      />
      <label className="set-check">
        <input
          type="checkbox"
          aria-label={`Complete ${exercise.name} set ${j + 1}`}
          checked={set.done}
          onChange={(ev) => {
            onChange({ done: ev.target.checked });
            if (ev.target.checked) onComplete();
          }}
        />
        <span>
          <Check size={17} />
        </span>
      </label>
    </div>
  );
}
