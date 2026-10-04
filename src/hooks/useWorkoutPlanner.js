import { useState, useEffect, useCallback } from "react";
import { monday } from "../../shared/utils/dates.mjs";
import { trainingPlan } from "../../shared/functions/plans.mjs";

import { createSession } from "../functions/session.js";
import { emptyTrainingState } from "../functions/training-state.js";
import { authError, signOut } from "../services/auth.js";
import { auth } from "../services/firebase.js";
import { useWorkoutDraft } from "./useWorkoutDraft.js";

export function useWorkoutPlanner(store, user) {
  const [state, setState] = useState(emptyTrainingState);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [week, setWeek] = useState(monday());
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState("planner");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [routineDay, setRoutineDay] = useState(null);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [deletingWorkout, setDeletingWorkout] = useState(null);
  const {
    session,
    setSession,
    warning: draftWarning,
  } = useWorkoutDraft(user.uid);
  const [discardDraftOpen, setDiscardDraftOpen] = useState(false);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [retry, setRetry] = useState(0);
  const closeSettings = useCallback(() => setSettingsOpen(false), []);
  const closeTarget = useCallback(() => setTarget(null), []);
  const closeSession = useCallback(() => setSessionOpen(false), []);
  const closeRoutine = useCallback(() => setRoutineDay(null), []);
  const closeEditWorkout = useCallback(() => setEditingWorkout(null), []);
  const closeDeleteWorkout = useCallback(() => setDeletingWorkout(null), []);
  const closeDiscardDraft = useCallback(() => setDiscardDraftOpen(false), []);
  useEffect(() => {
    if (!session) {
      setSessionOpen(false);
      setDiscardDraftOpen(false);
    }
  }, [session]);
  useEffect(() => {
    setLoaded(false);
    setError("");
    return store.subscribe(
      (data) => {
        setState(data);
        setLoaded(true);
        setError("");
        setSession((s) =>
          data.workouts.some((w) => w.id === s?.id) ? null : s,
        );
      },
      (e) => {
        setError(e.message);
        setLoaded(false);
      },
    );
  }, [store, retry, setSession]);
  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(""), 5000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);
  async function saveSettings(settings) {
    const saved = await store.saveSettings(settings);
    setState((s) => ({ ...s, settings: saved }));
    setSelected(0);
    setToast("Your training plan is ready.");
  }
  async function saveTarget(value) {
    const saved = await store.saveTarget(value);
    setState((s) => ({ ...s, targets: { ...s.targets, [saved.id]: saved } }));
    setToast("Exercise target saved.");
  }
  async function saveWorkout(value) {
    const saved = await store.saveWorkout(value);
    setState((s) => ({
      ...s,
      workouts: [saved, ...s.workouts.filter((w) => w.id !== saved.id)],
    }));
    setSession((draft) => (draft?.id === saved.id ? null : draft));
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
  async function saveRoutine(value) {
    const saved = await store.saveRoutine(value);
    setState((current) => ({
      ...current,
      routines: { ...current.routines, [saved.id]: saved },
    }));
    setToast("Exercise list saved. New sessions will use your changes.");
  }
  async function updateWorkout(value) {
    const saved = await store.updateWorkout(value);
    setState((current) => ({
      ...current,
      workouts: current.workouts.map((workout) =>
        workout.id === saved.id ? saved : workout,
      ),
    }));
    setEditingWorkout(null);
    setToast("Workout updated. Your progress and records are recalculated.");
  }
  async function deleteWorkout(value) {
    await store.deleteWorkout(value);
    setState((current) => ({
      ...current,
      workouts: current.workouts.filter((workout) => workout.id !== value.id),
    }));
    setToast("Workout deleted. Your progress and records are recalculated.");
  }
  async function logout() {
    setSigningOut(true);
    try {
      await signOut(auth);
    } catch (e) {
      setToast(authError(e));
      setSigningOut(false);
    }
  }
  const plan = trainingPlan(state.settings, state.routines);
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

  return {
    state,
    loaded,
    error,
    week,
    setWeek,
    selected,
    setSelected,
    view,
    setView,
    settingsOpen,
    setSettingsOpen,
    target,
    setTarget,
    routineDay,
    setRoutineDay,
    editingWorkout,
    setEditingWorkout,
    deletingWorkout,
    setDeletingWorkout,
    session,
    setSession,
    draftWarning,
    discardDraftOpen,
    setDiscardDraftOpen,
    sessionOpen,
    setSessionOpen,
    toast,
    setToast,
    signingOut,
    retryLoading: () => setRetry((value) => value + 1),
    closeSettings,
    closeTarget,
    closeSession,
    closeRoutine,
    closeEditWorkout,
    closeDeleteWorkout,
    closeDiscardDraft,
    saveSettings,
    saveTarget,
    saveWorkout,
    startWorkout,
    saveRoutine,
    updateWorkout,
    deleteWorkout,
    logout,
    plan,
    workout,
    completedDays,
    count,
  };
}
