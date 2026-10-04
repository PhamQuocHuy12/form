import { ActionRow } from "../../common/ActionRow/ActionRow.jsx";
import { bright, formError } from "../../common/styles/FormFeedback.styles.js";
import { Button } from "../../common/Button/Button.jsx";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";

import { Modal } from "../../common/Modal/Modal.jsx";

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
        <strong className={`${bright} bright`}>{workout.title}</strong> ·{" "}
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
        <p role="alert" className={`${formError} form-error`}>
          {error}
        </p>
      )}
      <ActionRow>
        <Button variant="secondary" disabled={busy} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" disabled={busy} onClick={submit}>
          <Trash2 size={17} />
          {busy ? "Deleting…" : "Delete permanently"}
        </Button>
      </ActionRow>
    </Modal>
  );
}
