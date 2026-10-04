import { ActionRow } from "../../common/ActionRow/ActionRow.jsx";
import { bright } from "../../common/styles/FormFeedback.styles.js";
import { Button } from "../../common/Button/Button.jsx";
import React from "react";
import { Trash2 } from "lucide-react";
import { Modal } from "../../common/Modal/Modal.jsx";

export function DiscardDraftModal({ session, discard, onClose }) {
  return (
    <Modal title="Discard unfinished workout?" onClose={onClose}>
      <p>
        This removes your unfinished{" "}
        <strong className={`${bright} bright`}>{session.title}</strong> workout,
        including its sets and notes. Saved workout history is kept.
      </p>
      <ActionRow>
        <Button variant="secondary" onClick={onClose}>
          Keep workout
        </Button>
        <Button variant="danger" onClick={discard}>
          <Trash2 size={17} />
          Discard unfinished workout
        </Button>
      </ActionRow>
    </Modal>
  );
}
