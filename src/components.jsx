import React, { useEffect, useRef, useState } from "react";
import {
  Activity,
  Check,
  CheckCheck,
  ChevronDown,
  Clock3,
  Dumbbell,
  History,
  Pause,
  Play,
  RotateCcw,
  Save,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import {
  EXERCISES,
  PLANS,
  MUSCLES,
  prescriptions,
  records,
  volume,
  shiftDate,
} from "../shared/training.mjs";

export function Modal({ title, onClose, children, wide = false }) {
  const panel = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector("button,input,textarea")?.focus();
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const items = [
        ...panel.current.querySelectorAll(
          'button:not(:disabled),input:not(:disabled),textarea,select,[tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
      if (!items.length) return;
      if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault();
        items.at(-1).focus();
      } else if (!e.shiftKey && document.activeElement === items.at(-1)) {
        e.preventDefault();
        items[0].focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <section
        ref={panel}
        className={`modal ${wide ? "wide-modal" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
      >
        <div className="modal-header">
          <h2 id="dialog-title">{title}</h2>
          <button
            className="icon-button"
            aria-label="Close dialog"
            onClick={onClose}
          >
            <X size={21} />
          </button>
        </div>
        {children}
      </section>
    </div>
  );
}
export function SettingsModal({ settings, save, onClose }) {
  const [draft, setDraft] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
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
                onClick={() => setDraft({ ...draft, days })}
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
        <button className="button primary full-width" disabled={busy}>
          {busy ? "Saving…" : "Save my plan"}
          <Check size={17} />
        </button>
      </form>
    </Modal>
  );
}
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
export function createSession(day, week, state) {
  return {
    id: crypto.randomUUID(),
    dayId: day.id,
    days: state.settings.days,
    week,
    title: day.title,
    notes: "",
    exercises: day.exercises.map((e) => {
      const p = prescriptions(e, week, state);
      return {
        id: e.id,
        prescription: { sets: p.sets, reps: p.reps, weight: p.weight },
        sets: Array.from({ length: p.sets }, () => ({
          reps: p.reps,
          weight: p.weight,
          done: false,
        })),
      };
    }),
  };
}
export function SessionModal({ session, setSession, save, onClose }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setTimer(remaining);
      if (!remaining) setRunning(false);
    }, 250);
    return () => clearInterval(interval);
  }, [running]);
  const total = session.exercises.reduce((n, e) => n + e.sets.length, 0);
  const completed = session.exercises.reduce(
    (n, e) => n + e.sets.filter((s) => s.done).length,
    0,
  );
  function startTimer(seconds) {
    deadline.current = Date.now() + seconds * 1000;
    setTimer(seconds);
    setRunning(true);
  }
  function updateSet(exIndex, setIndex, values) {
    setSession((old) => ({
      ...old,
      exercises: old.exercises.map((e, i) =>
        i === exIndex
          ? {
              ...e,
              sets: e.sets.map((s, j) =>
                j === setIndex ? { ...s, ...values } : s,
              ),
            }
          : e,
      ),
    }));
  }
  async function finish(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const normalized = {
        ...session,
        status: completed === total ? "completed" : "partial",
        exercises: session.exercises.map((e) => ({
          ...e,
          sets: e.sets.map((s) => ({
            ...s,
            reps: Number(s.reps),
            weight:
              s.weight === "" || s.weight === null ? null : Number(s.weight),
          })),
        })),
      };
      await save(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal title={session.title} onClose={onClose} wide>
      <div className="session-intro">
        <span>
          <span className="live-dot" /> WORKOUT IN PROGRESS
        </span>
        <span>
          {completed} / {total} sets
        </span>
      </div>
      <div className="session-progress">
        <span style={{ width: `${(completed / total) * 100}%` }} />
      </div>
      <p className="form-hint">
        Enter what you actually lift, then check off each set. Your unfinished
        session stays in this tab when you close it.
      </p>
      <div className="rest-timer">
        <Clock3 size={18} />
        <strong>
          {String(Math.floor(timer / 60)).padStart(2, "0")}:
          {String(timer % 60).padStart(2, "0")}
        </strong>
        <span>
          {running
            ? "Rest. Breathe. Reset."
            : timer
              ? "Timer paused"
              : "Rest timer"}
        </span>
        <button
          type="button"
          className="icon-button"
          aria-label={running ? "Pause timer" : "Start timer"}
          onClick={() =>
            running ? setRunning(false) : startTimer(timer || 60)
          }
        >
          {running ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button
          type="button"
          className="icon-button"
          aria-label="Reset timer"
          onClick={() => {
            setRunning(false);
            setTimer(0);
          }}
        >
          <RotateCcw size={17} />
        </button>
      </div>
      <form onSubmit={finish}>
        {session.exercises.map((e, i) => {
          const exercise = EXERCISES[e.id];
          const allDone = e.sets.every((s) => s.done);
          return (
            <details className="log-exercise" key={e.id} open>
              <summary>
                <span className={`log-ex-number ${allDone ? "is-done" : ""}`}>
                  {allDone ? (
                    <Check size={16} />
                  ) : (
                    String(i + 1).padStart(2, "0")
                  )}
                </span>
                <span>
                  <strong>{exercise.name}</strong>
                  <small>
                    {exercise.muscle} · {exercise.rest}s rest
                  </small>
                </span>
                <ChevronDown size={17} />
              </summary>
              <div className="log-exercise-body">
                <p>{exercise.tip}</p>
                <div className="set-grid set-labels">
                  <span>SET</span>
                  <span>KG</span>
                  <span>REPS</span>
                  <span>DONE</span>
                </div>
                {e.sets.map((set, j) => (
                  <div
                    className={`set-grid ${set.done ? "set-done" : ""}`}
                    key={j}
                  >
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
                      onChange={(ev) =>
                        updateSet(i, j, { weight: ev.target.value })
                      }
                    />
                    <input
                      aria-label={`${exercise.name} set ${j + 1} reps`}
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="100"
                      required
                      value={set.reps}
                      onChange={(ev) =>
                        updateSet(i, j, { reps: ev.target.value })
                      }
                    />
                    <label className="set-check">
                      <input
                        type="checkbox"
                        aria-label={`Complete ${exercise.name} set ${j + 1}`}
                        checked={set.done}
                        onChange={(ev) => {
                          updateSet(i, j, { done: ev.target.checked });
                          if (ev.target.checked) startTimer(exercise.rest);
                        }}
                      />
                      <span>
                        <Check size={17} />
                      </span>
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  className="complete-exercise"
                  onClick={() => {
                    setSession((old) => ({
                      ...old,
                      exercises: old.exercises.map((item, j) =>
                        i === j
                          ? {
                              ...item,
                              sets: item.sets.map((s) => ({
                                ...s,
                                done: !allDone,
                              })),
                            }
                          : item,
                      ),
                    }));
                    if (!allDone) startTimer(exercise.rest);
                  }}
                >
                  <CheckCheck size={16} />
                  {allDone ? "Uncheck all sets" : "Mark all sets complete"}
                </button>
              </div>
            </details>
          );
        })}
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
              : completed === total
                ? "Finish workout"
                : "Save partial workout"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
export function HistoryView({ workouts, onPlan }) {
  const [filter, setFilter] = useState("all");
  const filtered = workouts.filter(
    (w) => filter === "all" || w.status === filter,
  );
  return (
    <section className="history-view">
      <div className="view-toolbar">
        <div>
          <h2>Your training log</h2>
          <p>Every session is a step forward.</p>
        </div>
        <label className="filter-label">
          Show
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All sessions</option>
            <option value="completed">Completed</option>
            <option value="partial">Partial</option>
          </select>
        </label>
      </div>
      {!filtered.length ? (
        <div className="empty-state">
          <span>
            <History size={31} />
          </span>
          <h3>
            {workouts.length
              ? "No matching sessions"
              : "Your first session starts here"}
          </h3>
          <p>
            {workouts.length
              ? "Try a different filter to see your workouts."
              : "Log your sets, weights, and notes. Your workout history will appear here."}
          </p>
          <button className="button primary" onClick={onPlan}>
            Open weekly planner
          </button>
        </div>
      ) : (
        <div className="history-list">
          {filtered.map((w) => (
            <details className="history-item" key={w.id}>
              <summary>
                <span className="history-icon">
                  <Dumbbell size={22} />
                </span>
                <span className="history-title">
                  <strong>{w.title}</strong>
                  <small>
                    {new Date(w.finishedAt).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}{" "}
                    · Week of {w.week}
                  </small>
                </span>
                <span className={`status-tag ${w.status}`}>
                  {w.status === "completed" ? (
                    <Check size={13} />
                  ) : (
                    <Activity size={13} />
                  )}{" "}
                  {w.status === "completed" ? "Completed" : "Partial"}
                </span>
                <ChevronDown size={18} />
              </summary>
              <div className="history-details">
                <div className="history-stats">
                  <span>
                    <strong>
                      {w.exercises.reduce(
                        (n, e) => n + e.sets.filter((s) => s.done).length,
                        0,
                      )}
                    </strong>{" "}
                    sets logged
                  </span>
                  <span>
                    <strong>{volume(w).toLocaleString()}</strong> kg total
                    volume
                  </span>
                </div>
                {w.exercises.map((e) => (
                  <div className="history-exercise" key={e.id}>
                    <strong>{EXERCISES[e.id].name}</strong>
                    <span>
                      {e.sets
                        .filter((s) => s.done)
                        .map((s, i) => (
                          <small key={i}>
                            {s.weight === null ? "BW" : `${s.weight} kg`} ×{" "}
                            {s.reps}
                          </small>
                        ))}
                      {!e.sets.some((s) => s.done) && (
                        <small>Not completed</small>
                      )}
                    </span>
                  </div>
                ))}
                {w.notes && (
                  <div className="saved-notes">
                    <span>SESSION NOTES</span>
                    <p>{w.notes}</p>
                  </div>
                )}
              </div>
            </details>
          ))}
        </div>
      )}
    </section>
  );
}
export function ProgressView({ state, week, onPlan, onSettings }) {
  const prs = records(state.workouts);
  const completed = state.workouts.filter((w) => w.status === "completed");
  const totalVolume = state.workouts.reduce((n, w) => n + volume(w), 0);
  const weeks = Array.from({ length: 6 }, (_, i) =>
    shiftDate(week, (i - 5) * 7),
  );
  const unique = [
    ...new Set(
      PLANS[state.settings.days].flatMap((d) => d.exercises.map((e) => e.id)),
    ),
  ];
  const suggestions = unique
    .map((id) => ({
      exercise: EXERCISES[id],
      target: prescriptions(EXERCISES[id], week, state),
    }))
    .filter((s) => s.target.increased);
  return (
    <section className="progress-view">
      <div className="view-toolbar">
        <div>
          <h2>Built one rep at a time</h2>
          <p>Your training, adding up.</p>
        </div>
        <button className="button secondary" onClick={onSettings}>
          <Target size={16} />
          Progression settings
        </button>
      </div>
      <div className="stat-grid">
        <div>
          <Dumbbell size={20} />
          <strong>{completed.length}</strong>
          <span>Workouts completed</span>
        </div>
        <div>
          <Activity size={20} />
          <strong>
            {totalVolume.toLocaleString()}
            <small> kg</small>
          </strong>
          <span>Total logged volume</span>
        </div>
        <div>
          <Trophy size={20} />
          <strong>{prs.length}</strong>
          <span>Exercise records</span>
        </div>
      </div>
      <div className="progress-columns">
        <section className="chart-card">
          <h3>Consistency over time</h3>
          <p>Completed workouts · last 6 training weeks</p>
          <div
            className="bar-chart"
            role="img"
            aria-label={weeks
              .map(
                (key) =>
                  `Week ${key}: ${completed.filter((w) => w.week === key).length} completed`,
              )
              .join("; ")}
          >
            {weeks.map((key) => {
              const count = completed.filter((w) => w.week === key).length;
              const max = Math.max(
                5,
                ...weeks.map(
                  (k) => completed.filter((w) => w.week === k).length,
                ),
              );
              return (
                <div className="chart-column" key={key}>
                  <span>{count}</span>
                  <div className="chart-bar-space">
                    <i
                      style={{
                        height: count ? `${(count / max) * 100}%` : "3px",
                      }}
                      className={key === week ? "current-bar" : ""}
                    />
                  </div>
                  <small>
                    {new Date(`${key}T12:00:00`).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </div>
              );
            })}
          </div>
        </section>
        <section className="next-step-card">
          <TrendingUp size={24} />
          <h3>Your next step</h3>
          <p>
            {suggestions.length
              ? `${suggestions.length} exercise targets are ready to progress for the selected week.`
              : "Complete this week’s workouts to earn next week’s suggestions."}
          </p>
          <div className="suggestion-list">
            {suggestions.slice(0, 3).map(({ exercise, target }) => (
              <div key={exercise.id}>
                <strong>{exercise.name}</strong>
                <span>
                  {target.sets} × {target.reps}
                  {target.weight !== null && ` · ${target.weight} kg`}
                </span>
              </div>
            ))}
          </div>
          <button className="text-button" onClick={onPlan}>
            See targets in your planner
          </button>
        </section>
      </div>
      <section className="records-card">
        <div className="view-toolbar">
          <div>
            <h3>
              <Trophy size={19} />
              Personal records
            </h3>
            <p>
              Highest logged weight, then best reps at that weight. BW =
              bodyweight.
            </p>
          </div>
          <span className="tag">ALL TIME</span>
        </div>
        {!prs.length ? (
          <div className="empty-records">
            Your first logged set becomes your first benchmark.
          </div>
        ) : (
          <div className="record-grid">
            {prs.map((pr) => (
              <div className="record" key={pr.id}>
                <span>
                  <strong>{pr.name}</strong>
                  <small>
                    {new Date(pr.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </small>
                </span>
                <span className="record-value">
                  {pr.weight === null || pr.weight === 0 ? "BW" : pr.weight}
                  <small>
                    {pr.weight ? " kg" : ""} × {pr.reps}
                  </small>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
