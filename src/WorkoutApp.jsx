import {
  errorBanner,
  loading,
  toast,
} from "./components/common/styles/Feedback.styles.js";
import React, { useState, useCallback } from "react";
import { Check } from "lucide-react";
import { HistoryPage } from "./pages/HistoryPage/HistoryPage.jsx";
import { ProgressPage } from "./pages/ProgressPage/ProgressPage.jsx";
import { AppLayout } from "./components/layout/AppLayout/AppLayout.jsx";
import { PageHeading } from "./components/layout/PageHeading/PageHeading.jsx";
import { WeekToolbar } from "./components/planner/WeekToolbar/WeekToolbar.jsx";
import { DraftRecovery } from "./components/workout/DraftRecovery/DraftRecovery.jsx";
import { PlannerPage } from "./pages/PlannerPage/PlannerPage.jsx";
import { useWorkoutPlanner } from "./hooks/useWorkoutPlanner.js";
import { useTrainingPlanTool } from "./hooks/useTrainingPlanTool.js";
import { WorkoutDialogs } from "./components/dialogs/WorkoutDialogs/WorkoutDialogs.jsx";
import { AppearanceModal } from "./components/dialogs/AppearanceModal/AppearanceModal.jsx";
import { useAppearance } from "./hooks/useAppearance.js";

export function WorkoutApp({ store, user }) {
  const planner = useWorkoutPlanner(store, user);
  const appearance = useAppearance(store, user.uid);
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const closeAppearance = useCallback(() => setAppearanceOpen(false), []);
  const {
    state,
    loaded,
    error,
    retryLoading,
    week,
    setWeek,
    view,
    setView,
    session,
    draftWarning,
    setDiscardDraftOpen,
    setSettingsOpen,
    startWorkout,
    signingOut,
    logout,
    toast,
  } = planner;
  useTrainingPlanTool(planner);
  return (
    <>
      <AppLayout
        view={view}
        setView={setView}
        user={user}
        signingOut={signingOut}
        logout={logout}
        onAppearance={() => setAppearanceOpen(true)}
      >
        <PageHeading
          view={view}
          loaded={loaded}
          onSettings={() => setSettingsOpen(true)}
        />
        {error && (
          <div role="alert" className={`${errorBanner} error-banner`}>
            {error}
            <button onClick={retryLoading}>Retry</button>
          </div>
        )}
        {draftWarning && (
          <div role="alert" className={`${errorBanner} error-banner`}>
            {draftWarning}
          </div>
        )}
        {loaded && session && (
          <DraftRecovery
            session={session}
            warning={draftWarning}
            onContinue={startWorkout}
            onDiscard={() => setDiscardDraftOpen(true)}
          />
        )}
        {!loaded ? (
          error ? null : (
            <div className={`${loading} loading`}>
              Loading your training plan…
            </div>
          )
        ) : (
          <>
            {view !== "history" && (
              <WeekToolbar
                week={week}
                days={state.settings.days}
                setWeek={setWeek}
              />
            )}
            {view === "history" && (
              <HistoryPage
                workouts={state.workouts}
                onPlan={() => setView("planner")}
                onEdit={(workout) =>
                  planner.setEditingWorkout(structuredClone(workout))
                }
                onDelete={planner.setDeletingWorkout}
              />
            )}
            {view === "progress" && (
              <ProgressPage
                state={state}
                week={week}
                onPlan={() => setView("planner")}
                onSettings={() => setSettingsOpen(true)}
              />
            )}
            {view === "planner" && (
              <PlannerPage
                plan={planner.plan}
                workout={planner.workout}
                week={week}
                state={state}
                session={session}
                completedDays={planner.completedDays}
                count={planner.count}
                onSelectDay={planner.setSelected}
                onStartWorkout={startWorkout}
                onEditTarget={planner.setTarget}
                onEditRoutine={planner.setRoutineDay}
                onSettings={() => setSettingsOpen(true)}
              />
            )}
          </>
        )}
      </AppLayout>
      <WorkoutDialogs planner={planner} />
      {appearanceOpen && (
        <AppearanceModal controller={appearance} onClose={closeAppearance} />
      )}
      {toast && (
        <div className={`${toast} toast`} role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
    </>
  );
}
