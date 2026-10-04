import React, { useState } from "react";
import { Trash2 } from "lucide-react";

import { Modal } from "../common/Modal.jsx";

export function DeleteWorkoutModal({ workout, remove, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit() {
    setBusy(true);
    setError("");
    try {
      await remove(workout);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Delete workout?" onClose={busy ? () => {} : onClose}>
      <p>
        <strong className="bright">{workout.title}</strong> ·{" "}
        {new Date(workout.finishedAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
        <br />
        This removes the workout from your history and recalculates your
        progress and personal records. This cannot be undone.
      </p>
      {error && (
        <p role="alert" className="form-error">
          {error}
        </p>
      )}
      <div className="history-actions">
        <button className="button secondary" disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button className="button danger" disabled={busy} onClick={submit}>
          <Trash2 size={17} />
          {busy ? "Deleting…" : "Delete permanently"}
        </button>
      </div>
    </Modal>
  );
}
