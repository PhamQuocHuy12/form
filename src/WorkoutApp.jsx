import React from "react";
import { Check } from "lucide-react";
import { HistoryPage } from "./pages/HistoryPage.jsx";
import { ProgressPage } from "./pages/ProgressPage.jsx";
import { AppLayout } from "./components/layout/AppLayout.jsx";
import { PageHeading } from "./components/layout/PageHeading.jsx";
import { WeekToolbar } from "./components/planner/WeekToolbar.jsx";
import { DraftRecovery } from "./components/workout/DraftRecovery.jsx";
import { PlannerPage } from "./pages/PlannerPage.jsx";
import { useWorkoutPlanner } from "./hooks/useWorkoutPlanner.js";
import { useTrainingPlanTool } from "./hooks/useTrainingPlanTool.js";
import { WorkoutDialogs } from "./components/dialogs/WorkoutDialogs.jsx";

export function WorkoutApp({ store, user }) {
  const planner = useWorkoutPlanner(store, user);
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
      >
        <PageHeading
          view={view}
          loaded={loaded}
          onSettings={() => setSettingsOpen(true)}
        />
        {error && (
          <div role="alert" className="error-banner">
            {error}
            <button onClick={retryLoading}>Retry</button>
          </div>
        )}
        {draftWarning && (
          <div role="alert" className="error-banner">
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
            <div className="loading">Loading your training plan…</div>
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
      {toast && (
        <div className="toast" role="status">
          <Check size={18} />
          {toast}
        </div>
      )}
    </>
  );
}
