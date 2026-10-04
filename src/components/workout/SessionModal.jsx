import React, { useState } from "react";
import { Save } from "lucide-react";
import {
  sessionCounts,
  normalizeSession,
  updateSessionSet,
} from "../../functions/session.js";
import { Modal } from "../common/Modal.jsx";
import { useRestTimer } from "../../hooks/useRestTimer.js";
import { RestTimer } from "./RestTimer.jsx";
import { ExerciseLog } from "./ExerciseLog.jsx";

export function SessionModal({
  session,
  setSession,
  save,
  onClose,
  editing = false,
  workouts = [],
  draftWarning = "",
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const { timer, running, startTimer, pauseTimer, resetTimer } = useRestTimer();
  const { total, completed } = sessionCounts(session);
  function updateSet(exIndex, setIndex, values) {
    setSession((old) => updateSessionSet(old, exIndex, setIndex, values));
  }
  async function finish(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const normalized = normalizeSession(session);
      await save(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={editing ? `Edit ${session.title}` : session.title}
      onClose={onClose}
      wide
    >
      <div className="session-intro">
        <span>
          <span className="live-dot" />{" "}
          {editing ? "EDITING SAVED WORKOUT" : "WORKOUT IN PROGRESS"}
        </span>
        <span>
          {completed} / {total} sets
        </span>
      </div>
      <div className="session-progress">
        <span style={{ width: `${(completed / total) * 100}%` }} />
      </div>
      <p className="form-hint">
        {editing
          ? `Correct your sets, weights, reps, and notes. Originally logged ${new Date(session.finishedAt).toLocaleDateString()}.`
          : draftWarning
            ? "Enter what you actually lift, then check off each set. Keep this workout open until you save."
            : "Enter what you actually lift, then check off each set. Your draft saves automatically in this browser so you can close it and continue later."}
      </p>
      {!editing && draftWarning && (
        <p role="alert" className="form-error">
          {draftWarning}
        </p>
      )}
      {!editing && (
        <RestTimer
          timer={timer}
          running={running}
          startTimer={startTimer}
          pauseTimer={pauseTimer}
          resetTimer={resetTimer}
        />
      )}
      <form onSubmit={finish}>
        <fieldset disabled={busy} className="session-fields">
          {session.exercises.map((entry, index) => (
            <ExerciseLog
              key={entry.id}
              entry={entry}
              index={index}
              session={session}
              workouts={workouts}
              editing={editing}
              busy={busy}
              updateSet={updateSet}
              setSession={setSession}
              onRest={startTimer}
            />
          ))}
          <label className="notes-label">
            Session notes
            <textarea
              maxLength="2000"
              rows="3"
              placeholder="How did it feel? Anything to remember next time?"
              value={session.notes}
              onChange={(e) =>
                setSession((old) => ({ ...old, notes: e.target.value }))
              }
            />
          </label>
        </fieldset>
        {error && (
          <p role="alert" className="form-error">
            {error}
          </p>
        )}
        <div className="save-session">
          <p>
            {completed === total
              ? "All sets done. Great work showing up."
              : `${completed} completed sets will be saved as a partial workout.`}
          </p>
          <button className="button primary" disabled={busy || completed === 0}>
            <Save size={17} />
            {busy
              ? "Saving…"
              : editing
                ? "Save changes"
                : completed === total
                  ? "Finish workout"
                  : "Save partial workout"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
