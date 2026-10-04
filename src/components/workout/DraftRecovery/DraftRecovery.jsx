import { draftRecovery, draftRecoveryActions } from "./DraftRecovery.styles.js";
import { textButton } from "../../common/styles/ViewControls.styles.js";
import { Button } from "../../common/Button/Button.jsx";
import React from "react";
import { sessionCounts } from "../../../functions/session.js";
import { formatDate } from "../../../utils/format.js";

export function DraftRecovery({ session, warning, onContinue, onDiscard }) {
  const { completed: draftSetsLogged } = sessionCounts(session);
  return (
    <section
      className={`${draftRecovery} draft-recovery`}
      aria-label="Unfinished workout"
    >
      <div>
        <strong>Unfinished workout · {session.title}</strong>
        <p>
          Week of{" "}
          {formatDate(session.week, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {" · "}
          {draftSetsLogged} {draftSetsLogged === 1 ? "set" : "sets"} logged
        </p>
        <small>
          {warning
            ? "Keep this tab open until you save."
            : "Saved in this browser. You can close it and continue later."}
        </small>
      </div>
      <div className={`${draftRecoveryActions} draft-recovery-actions`}>
        <Button variant="primary" onClick={onContinue}>
          Continue saved workout
        </Button>
        <button className={`${textButton} text-button`} onClick={onDiscard}>
          Discard draft
        </button>
      </div>
    </section>
  );
}
