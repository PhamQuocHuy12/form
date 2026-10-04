import React from "react";
import { SettingsModal } from "../SettingsModal/SettingsModal.jsx";
import { ExercisePlanModal } from "../ExercisePlanModal/ExercisePlanModal.jsx";
import { DeleteWorkoutModal } from "../DeleteWorkoutModal/DeleteWorkoutModal.jsx";
import { DiscardDraftModal } from "../DiscardDraftModal/DiscardDraftModal.jsx";
import { TargetModal } from "../TargetModal/TargetModal.jsx";
import { SessionModal } from "../../workout/SessionModal/SessionModal.jsx";

export function WorkoutDialogs({ planner }) {
  const {
    settingsOpen,
    state,
    saveSettings,
    closeSettings,
    target,
    week,
    saveTarget,
    closeTarget,
    routineDay,
    saveRoutine,
    closeRoutine,
    editingWorkout,
    setEditingWorkout,
    updateWorkout,
    closeEditWorkout,
    deletingWorkout,
    deleteWorkout,
    closeDeleteWorkout,
    sessionOpen,
    session,
    setSession,
    saveWorkout,
    closeSession,
    draftWarning,
    discardDraftOpen,
    closeDiscardDraft,
    setSessionOpen,
    setDiscardDraftOpen,
    setToast,
  } = planner;
  return (
    <>
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
      {routineDay && (
        <ExercisePlanModal
          day={routineDay}
          save={saveRoutine}
          onClose={closeRoutine}
        />
      )}
      {editingWorkout && (
        <SessionModal
          key={editingWorkout.id}
          session={editingWorkout}
          setSession={setEditingWorkout}
          save={updateWorkout}
          onClose={closeEditWorkout}
          editing
        />
      )}
      {deletingWorkout && (
        <DeleteWorkoutModal
          workout={deletingWorkout}
          remove={deleteWorkout}
          onClose={closeDeleteWorkout}
        />
      )}
      {sessionOpen && session && (
        <SessionModal
          key={session.id}
          session={session}
          setSession={setSession}
          save={saveWorkout}
          onClose={closeSession}
          workouts={state.workouts}
          draftWarning={draftWarning}
        />
      )}
      {discardDraftOpen && session && (
        <DiscardDraftModal
          session={session}
          onClose={closeDiscardDraft}
          discard={() => {
            setSession(null);
            setSessionOpen(false);
            setDiscardDraftOpen(false);
            setToast("Unfinished workout discarded.");
          }}
        />
      )}
    </>
  );
}
