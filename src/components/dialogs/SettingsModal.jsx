import React, { useState } from "react";
import { Check } from "lucide-react";
import { PLANS, WEEKDAYS } from "../../../shared/catalog/plans.mjs";
import { trainingPlan } from "../../../shared/functions/plans.mjs";

import { Modal } from "../common/Modal.jsx";

export function SettingsModal({ settings, save, onClose }) {
  const [draft, setDraft] = useState(() => ({
    ...settings,
    weekdays: trainingPlan(settings).map((day) => day.weekday),
  }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const scheduleReady = draft.weekdays.length === draft.days;
  function toggleWeekday(day) {
    setDraft((current) => ({
      ...current,
      weekdays: current.weekdays.includes(day)
        ? current.weekdays.filter((value) => value !== day)
        : [...current.weekdays, day].sort((a, b) => a - b),
    }));
  }
  async function submit(e) {
    e.preventDefault();
    if (!scheduleReady) return;
    setBusy(true);
    setError("");
    try {
      await save(draft);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title="Your training rhythm" onClose={onClose}>
      <p>
        Build a week you can show up for. Your workout history stays with you
        when your plan changes.
      </p>
      <form onSubmit={submit}>
        <fieldset>
          <legend>Training days per week</legend>
          <div className="day-options">
            {[3, 4, 5].map((days) => (
              <button
                type="button"
                key={days}
                aria-pressed={days === draft.days}
                onClick={() => {
                  if (days !== draft.days)
                    setDraft({
                      ...draft,
                      days,
                      weekdays: PLANS[days].map((day) => day.weekday),
                    });
                }}
                className={days === draft.days ? "chosen" : ""}
              >
                <strong>{days}</strong>
                <span>
                  {days === 3
                    ? "Full body"
                    : days === 4
                      ? "Upper / lower"
                      : "Push / pull +"}{" "}
                </span>
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="schedule-options">
          <legend>Your training weekdays</legend>
          <p className="form-hint" id="weekday-hint">
            Choose {draft.days} days. Workouts follow the order shown below,
            every week.
          </p>
          <div className="weekday-options" aria-describedby="weekday-hint">
            {WEEKDAYS.map((name, index) => (
              <button
                type="button"
                key={name}
                aria-label={name}
                aria-pressed={draft.weekdays.includes(index)}
                className={draft.weekdays.includes(index) ? "chosen" : ""}
                onClick={() => toggleWeekday(index)}
              >
                {name.slice(0, 3)}
              </button>
            ))}
          </div>
          <p
            className={`schedule-count ${scheduleReady ? "ready" : ""}`}
            role="status"
          >
            {draft.weekdays.length} of {draft.days} days selected
            {!scheduleReady && ` — select exactly ${draft.days} to save.`}
          </p>
          {scheduleReady && (
            <ul
              className="schedule-preview"
              aria-label="Weekly schedule preview"
            >
              {trainingPlan(draft).map((day) => (
                <li key={day.id}>
                  <span>{WEEKDAYS[day.weekday]}</span>
                  <strong>{day.title}</strong>
                </li>
              ))}
            </ul>
          )}
        </fieldset>
        <fieldset className="strategy-options">
          <legend>How you want to progress</legend>
          {[
            [
              "weight",
              "Build weight",
              "Add reps first, then 2.5 kg for upper body or 5 kg for legs.",
            ],
            [
              "reps",
              "Build reps",
              "Add one rep per set, up to the exercise’s rep range.",
            ],
            ["sets", "Build volume", "Add one set per exercise, up to 5 sets."],
          ].map(([value, title, description]) => (
            <label key={value}>
              <input
                type="radio"
                name="strategy"
                value={value}
                checked={draft.strategy === value}
                onChange={() => setDraft({ ...draft, strategy: value })}
              />
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </label>
          ))}
        </fieldset>
        <p className="form-hint">
          Suggestions use completed workouts from the previous week. Keep the
          same target if your form or recovery needs more time. All weights are
          in kilograms.
        </p>
        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="button primary full-width"
          disabled={busy || !scheduleReady}
        >
          {busy ? "Saving…" : "Save my plan"}
          <Check size={17} />
        </button>
      </form>
    </Modal>
  );
}
