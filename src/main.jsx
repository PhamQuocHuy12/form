import React, { useCallback, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Dumbbell,
  Flame,
  History,
  LayoutGrid,
  Leaf,
  Plus,
  Settings2,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import {
  PLANS,
  MUSCLES,
  DEFAULT_SETTINGS,
  dateKey,
  monday,
  shiftDate,
  prescriptions,
} from "../shared/training.mjs";
import "./styles.css";
import {
  SettingsModal,
  TargetModal,
  SessionModal,
  createSession,
  HistoryView,
  ProgressView,
} from "./components.jsx";

const empty = { settings: DEFAULT_SETTINGS, targets: {}, workouts: [] };
const weekdayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const formatDate = (key, options) =>
  new Date(`${key}T12:00:00`).toLocaleDateString("en-US", options);
async function api(route, method = "GET", value) {
  const response = await fetch(`/api/${route}`, {
    method,
    headers: { "Content-Type": "application/json" },
    ...(value ? { body: JSON.stringify(value) } : {}),
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Something went wrong. Please try again.");
  return data;
}
function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Dumbbell size={22} strokeWidth={2.5} />
      </span>
      FORM<span className="brand-dot">®</span>
    </div>
  );
}
function App() {
  const [state, setState] = useState(empty);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [week, setWeek] = useState(monday());
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState("planner");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [session, setSession] = useState(() => {
    try {
      const draft = JSON.parse(sessionStorage.getItem("form-session"));
      return draft?.id &&
        Array.isArray(draft.exercises) &&
        PLANS[draft.days]?.some((d) => d.id === draft.dayId)
        ? draft
        : null;
    } catch {
      return null;
    }
  });
  const [sessionOpen, setSessionOpen] = useState(false);
  const [toast, setToast] = useState("");
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const closeTarget = useCallback(() => setTarget(null), []);
  const closeSession = useCallback(() => setSessionOpen(false), []);
  useEffect(() => {
    api("state")
      .then((data) => {
        setState(data);
        setLoaded(true);
        setSession((s) =>
          data.workouts.some((w) => w.id === s?.id) ? null : s,
        );
      })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    try {
      if (session)
        sessionStorage.setItem("form-session", JSON.stringify(session));
      else sessionStorage.removeItem("form-session");
    } catch {
      /* Completed workouts still use the database. */
    }
  }, [session]);
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);
  async function saveSettings(settings) {
    const saved = await api("settings", "PUT", settings);
    setState((s) => ({ ...s, settings: saved }));
    setSelected(0);
    setToast("Your training plan is ready.");
  }
  async function saveTarget(value) {
    const saved = await api("targets", "PUT", value);
    setState((s) => ({ ...s, targets: { ...s.targets, [saved.id]: saved } }));
    setToast("Exercise target saved.");
  }
  async function saveWorkout(value) {
    const saved = await api("workouts", "POST", value);
    setState((s) => ({
      ...s,
      workouts: [saved, ...s.workouts.filter((w) => w.id !== saved.id)],
    }));
    setSession(null);
    setSessionOpen(false);
    setToast(
      saved.status === "completed"
        ? "Workout complete. One session stronger."
        : "Your completed sets have been saved.",
    );
  }
  function startWorkout() {
    if (!session) setSession(createSession(workout, week, state));
    setSessionOpen(true);
  }
  const plan = PLANS[state.settings.days];
  const workout = plan[selected] || plan[0];
  const completedDays = new Set(
    state.workouts
      .filter(
        (w) =>
          w.week === week &&
          w.days === state.settings.days &&
          w.status === "completed",
      )
      .map((w) => w.dayId),
  );
  const count = plan.filter((d) => completedDays.has(d.id)).length;
  const legDay = workout.exercises.some((e) => e.muscle === "Legs");
  useEffect(() => {
    const context = document.modelContext;
    if (!loaded || !context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      Promise.resolve(
        context.registerTool(
          {
            name: "read_training_plan",
            title: "Read training plan",
            description:
              "Read the selected week, exercise targets, and saved workout count.",
            inputSchema: {
              type: "object",
              properties: {},
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute(input) {
              if (!input || Object.keys(input).length)
                throw new Error("No arguments expected.");
              return {
                week,
                days: state.settings.days,
                completed: count,
                plan: plan.map((d) => ({
                  title: d.title,
                  weekday: d.weekday,
                  exercises: d.exercises.map((e) => ({
                    name: e.name,
                    ...prescriptions(e, week, state),
                  })),
                })),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional browser capability. */
    }
    return () => lifecycle.abort();
  }, [loaded, state, week, count]);
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Brand />
        <div className="workspace-label">YOUR WORKSPACE</div>
        <nav aria-label="Main navigation">
          {[
            ["planner", CalendarDays, "Weekly planner"],
            ["history", History, "Workout history"],
            ["progress", TrendingUp, "My progress"],
          ].map(([id, Icon, label]) => (
            <button
              key={id}
              aria-current={view === id ? "page" : undefined}
              className={view === id ? "nav-item active" : "nav-item"}
              onClick={() => setView(id)}
            >
              <Icon size={19} />
              <span>{label}</span>
              {id === view && <span className="nav-indicator" />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="small-label">THE LONG GAME</div>
          <p>
            A little stronger.
            <br />
            Every single week.
          </p>
          <div className="mini-bars">
            {[25, 36, 32, 48, 57, 70, 90].map((h, i) => (
              <i key={i} style={{ height: h + "%" }} />
            ))}
          </div>
          <div className="local-label">
            <span />
            Saved on this computer
          </div>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <span className="desktop-breadcrumb">
            Workspace <ChevronRight size={14} />{" "}
            <strong>
              {view === "planner"
                ? "Weekly planner"
                : view === "history"
                  ? "Workout history"
                  : "My progress"}
            </strong>
          </span>
          <div className="mobile-brand">
            <Brand />
          </div>
          <span className="topbar-right">
            <span className="today-label">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="avatar">YOU</span>
          </span>
        </header>
        <main>
          <div className="page-heading">
            <div>
              <div className="eyebrow">
                <span /> MAKE ROOM FOR PROGRESS
              </div>
              <h1>
                {view === "planner"
                  ? "Your week. Your work."
                  : view === "history"
                    ? "The work you’ve put in."
                    : "See how far you’ve come."}
              </h1>
              <p>
                {view === "planner"
                  ? "A clear plan. Consistent effort. Stronger you."
                  : view === "history"
                    ? "Your sets, your notes, your story so far."
                    : "Small wins become lasting strength."}
              </p>
            </div>
            <button
              className="button secondary"
              aria-label="Customize plan"
              disabled={!loaded}
              onClick={() => setSettingsOpen(true)}
            >
              <Settings2 size={17} /> Customize plan
            </button>
          </div>
          {error && (
            <div role="alert" className="error-banner">
              {error}
              <button onClick={() => window.location.reload()}>Retry</button>
            </div>
          )}
          {!loaded ? (
            <div className="loading">Loading your training plan…</div>
          ) : (
            <>
              {view !== "history" && (
                <section className="week-toolbar">
                  <div className="week-title">
                    <div className="week-icon">
                      <CalendarDays size={20} />
                    </div>
                    <div>
                      <strong>
                        {formatDate(week, { month: "long", day: "numeric" })} –{" "}
                        {formatDate(shiftDate(week, 6), {
                          day: "numeric",
                          month: "short",
                        })}
                      </strong>
                      <span>
                        {week === monday() ? "This week" : "Training week"} ·{" "}
                        {state.settings.days}-day split
                      </span>
                    </div>
                  </div>
                  <div className="week-controls">
                    <button
                      aria-label="Previous week"
                      onClick={() => setWeek(shiftDate(week, -7))}
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      className="today-button"
                      onClick={() => setWeek(monday())}
                    >
                      Today
                    </button>
                    <button
                      aria-label="Next week"
                      onClick={() => setWeek(shiftDate(week, 7))}
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </section>
              )}
              {view === "history" && (
                <HistoryView
                  workouts={state.workouts}
                  onPlan={() => setView("planner")}
                />
              )}
              {view === "progress" && (
                <ProgressView
                  state={state}
                  week={week}
                  onPlan={() => setView("planner")}
                  onSettings={() => setSettingsOpen(true)}
                />
              )}
              {view === "planner" && (
                <>
                  <div className="week-strip">
                    {weekdayNames.map((label, index) => {
                      const day = plan.find((d) => d.weekday === index);
                      const key = shiftDate(week, index);
                      const chosen = day?.id === workout.id;
                      return (
                        <button
                          key={label}
                          aria-label={`${label}: ${day?.title || "Recovery"}${day && completedDays.has(day.id) ? ", completed" : ""}`}
                          aria-pressed={chosen}
                          className={`day-tile ${chosen ? "selected" : ""} ${!day ? "rest" : ""}`}
                          onClick={() => day && setSelected(plan.indexOf(day))}
                          disabled={!day}
                        >
                          <div className="day-top">
                            <span>{label}</span>
                            {key === dateKey() && (
                              <span className="today-dot" />
                            )}
                          </div>
                          <strong>{formatDate(key, { day: "2-digit" })}</strong>
                          <span className="day-description">
                            {day?.title || "Recovery"}
                          </span>
                          <div className="day-footer">
                            {day && completedDays.has(day.id) ? (
                              <>
                                <Check size={13} />
                                <span>Completed</span>
                              </>
                            ) : day ? (
                              <>
                                <Dumbbell size={13} />
                                <span>{day.exercises.length} exercises</span>
                              </>
                            ) : (
                              <>
                                <Leaf size={13} />
                                <span>Rest day</span>
                              </>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="content-grid">
                    <section className="workout-panel">
                      <div className="section-kicker">
                        THE PLAN FOR{" "}
                        {weekdayNames[workout.weekday].toUpperCase()}
                      </div>
                      <div className="workout-heading">
                        <div>
                          <h2>
                            {workout.title}
                            <span className="tag">Strength</span>
                          </h2>
                          <p>{workout.subtitle}</p>
                        </div>
                        <span className="workout-duration">
                          <Clock3 size={16} />
                          45–60 min
                        </span>
                        <button
                          className="button primary mobile-session-button"
                          aria-label={
                            session ? "Resume workout" : "Start workout"
                          }
                          onClick={startWorkout}
                        >
                          <Dumbbell size={17} />
                          {session ? "Resume" : "Start"}
                        </button>
                      </div>
                      <details className="session-recommendation">
                        <summary className="session-strip">
                          <Flame size={20} />
                          <div>
                            <strong>
                              Warm up <span>· 5–8 min</span>
                            </strong>
                            <p>
                              Easy cardio, dynamic mobility, then light practice
                              sets.
                            </p>
                          </div>
                          <Plus size={15} />
                        </summary>
                        <div className="recommendation-content">
                          <ol>
                            <li>
                              3–5 minutes of easy cycling or brisk walking.
                            </li>
                            <li>
                              {legDay
                                ? "8 bodyweight squats, 8 hip hinges, and gentle leg swings."
                                : "10 shoulder circles each way and 10 light band pull-aparts."}
                            </li>
                            <li>
                              1–2 light practice sets before your first compound
                              exercises, separate from your working sets.
                            </li>
                          </ol>
                        </div>
                      </details>
                      <div className="exercise-list">
                        {workout.exercises.map((ex, index) => {
                          const p = prescriptions(ex, week, state);
                          return (
                            <div className="exercise-row" key={ex.id}>
                              <span className="exercise-number">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span className="exercise-symbol">
                                <Dumbbell size={23} />
                              </span>
                              <div className="exercise-info">
                                <h3>{ex.name}</h3>
                                <span>
                                  {ex.muscle}
                                  <b>·</b>
                                  {ex.equipment}
                                </span>
                              </div>
                              <div
                                className={`exercise-target ${p.increased ? "target-increased" : ""}`}
                                title={p.reason}
                              >
                                <strong>
                                  {p.sets} × {p.reps}
                                  {p.increased && <TrendingUp size={11} />}
                                </strong>
                                <span>sets × reps</span>
                              </div>
                              <div className="exercise-rest">
                                <strong>{ex.rest}s</strong>
                                <span>rest</span>
                              </div>
                              <button
                                className="weight-button"
                                aria-label={`Edit ${ex.name} target`}
                                onClick={() =>
                                  setTarget({ exercise: ex, prescription: p })
                                }
                              >
                                {p.weight === null && <Plus size={14} />}
                                {p.weight ?? "Weight"}
                                {p.weight !== null && " kg"}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                      <details className="session-recommendation">
                        <summary className="session-strip cooldown">
                          <Leaf size={20} />
                          <div>
                            <strong>
                              Cool down <span>· 5 min</span>
                            </strong>
                            <p>
                              Slow your breathing. Gently stretch the muscles
                              you trained.
                            </p>
                          </div>
                          <Plus size={15} />
                        </summary>
                        <div className="recommendation-content">
                          <ol>
                            <li>
                              2 minutes of easy walking and relaxed breathing.
                            </li>
                            <li>
                              {legDay
                                ? "Gently stretch quads, hamstrings, glutes, and calves for 20–30 seconds each."
                                : "Gently stretch chest, lats, shoulders, and arms for 20–30 seconds each."}
                            </li>
                            <li>
                              Stay in a comfortable range and finish with water
                              and a moment to recover.
                            </li>
                          </ol>
                        </div>
                      </details>
                      <div className="workout-bottom">
                        <span>
                          <Target size={16} />
                          Show up. Build the habit.
                        </span>
                        <button
                          className="button primary"
                          onClick={startWorkout}
                        >
                          <Dumbbell size={18} />
                          {session
                            ? "Resume workout"
                            : completedDays.has(workout.id)
                              ? "Log another session"
                              : "Start workout"}
                        </button>
                      </div>
                    </section>
                    <aside className="insight-column">
                      <section className="weekly-card">
                        <div className="small-label">
                          WEEKLY CHECK-IN <Activity size={16} />
                        </div>
                        <div className="completion-count">
                          {count}
                          <span>/ {state.settings.days}</span>
                        </div>
                        <p>workouts completed</p>
                        <div className="progress-segments">
                          {plan.map((p, i) => (
                            <span
                              key={p.id}
                              className={
                                completedDays.has(p.id) ? "filled" : ""
                              }
                            />
                          ))}
                        </div>
                        <div className="weekly-card-foot">
                          <Flame size={16} />
                          Your next chapter starts with one set.
                        </div>
                      </section>
                      <section className="balance-card">
                        <h3>
                          A balanced week <LayoutGrid size={17} />
                        </h3>
                        <p>Every major muscle group, covered.</p>
                        <div className="muscle-list">
                          {MUSCLES.map((muscle) => {
                            const total = plan
                              .flatMap((d) => d.exercises)
                              .filter((e) => e.muscle === muscle)
                              .reduce(
                                (n, e) =>
                                  n + prescriptions(e, week, state).sets,
                                0,
                              );
                            return (
                              <div key={muscle}>
                                <span>{muscle}</span>
                                <div className="muscle-track">
                                  <i
                                    style={{
                                      width:
                                        Math.min(100, (total / 24) * 100) + "%",
                                    }}
                                  />
                                </div>
                                <strong>
                                  {total}
                                  <small> sets</small>
                                </strong>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                      <section className="progression-card">
                        <span className="progression-icon">
                          <TrendingUp size={23} />
                        </span>
                        <div className="small-label">
                          PROGRESS, NOT PERFECTION
                        </div>
                        <h3>
                          Small steps.
                          <br />
                          Stronger weeks.
                        </h3>
                        <p>
                          Hit your rep targets with good form. We’ll suggest
                          your next step each week.
                        </p>
                        <button onClick={() => setSettingsOpen(true)}>
                          Your progression plan <Plus size={16} />
                        </button>
                      </section>
                    </aside>
                  </div>
                </>
              )}
            </>
          )}
          <footer className="page-footer">
            <span>FORM / BUILT ONE REP AT A TIME</span>
            <span>Make consistency your personal best.</span>
          </footer>
        </main>
      </div>
      {settingsOpen && (
        <SettingsModal
          settings={state.settings}
          save={saveSettings}
          onClose={closeSettings}
        />
      )}
      {target && (
        <TargetModal
          exercise={target.exercise}
          target={target.prescription}
          week={week}
          save={saveTarget}
          onClose={closeTarget}
        />
      )}
      {sessionOpen && session && (
        <SessionModal
          session={session}
          setSession={setSession}
          save={saveWorkout}
          onClose={closeSession}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
