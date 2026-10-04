import React, { useState } from "react";
import { Check, TrendingUp } from "lucide-react";
import { Modal } from "../common/Modal.jsx";

export function TargetModal({ exercise, target, week, save, onClose }) {
  const [draft, setDraft] = useState({
    sets: target.sets,
    reps: target.reps,
    weight: target.weight ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await save({
        id: exercise.id,
        week,
        sets: Number(draft.sets),
        reps: Number(draft.reps),
        weight: draft.weight === "" ? null : Number(draft.weight),
      });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Set your target" onClose={onClose}>
      <p>
        <strong className="bright">{exercise.name}</strong>
        <br />
        {exercise.tip}
      </p>
      <form onSubmit={submit}>
        <div className="target-inputs">
          <label>
            Sets
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="5"
              required
              value={draft.sets}
              onChange={(e) => setDraft({ ...draft, sets: e.target.value })}
            />
          </label>
          <label>
            Reps
            <input
              type="number"
              inputMode="numeric"
              min="1"
              max="50"
              required
              value={draft.reps}
              onChange={(e) => setDraft({ ...draft, reps: e.target.value })}
            />
          </label>
          <label>
            Weight (kg)
            <input
              type="number"
              inputMode="decimal"
              min="0"
              max="1000"
              step="0.25"
              placeholder="Optional"
              value={draft.weight}
              onChange={(e) => setDraft({ ...draft, weight: e.target.value })}
            />
          </label>
        </div>
        <p className="form-hint">
          Suggested range: {exercise.min}–{exercise.max} reps · Rest{" "}
          {exercise.rest} seconds. Leave weight blank for unweighted movements.
          For dumbbells, log the weight of one dumbbell consistently.
        </p>
        <div className="suggestion-note">
          <TrendingUp size={17} />
          {target.reason}
        </div>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <button className="button primary full-width" disabled={busy}>
          {busy ? "Saving…" : "Save target"}
          <Check size={17} />
        </button>
      </form>
    </Modal>
  );
}
