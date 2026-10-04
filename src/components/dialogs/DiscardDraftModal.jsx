import React from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "../common/Modal.jsx";

export function DiscardDraftModal({ session, discard, onClose }) {
  return (
    <Modal title="Discard unfinished workout?" onClose={onClose}>
      <p>
        This removes your unfinished{" "}
        <strong className="bright">{session.title}</strong> workout, including
        its sets and notes. Saved workout history is kept.
      </p>
      <div className="history-actions">
        <button className="button secondary" onClick={onClose}>
          Keep workout
        </button>
        <button className="button danger" onClick={discard}>
          <Trash2 size={17} />
          Discard unfinished workout
        </button>
      </div>
    </Modal>
  );
}
