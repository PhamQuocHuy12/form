import { DEFAULT_SETTINGS } from "../../shared/catalog/plans.mjs";
import {
  validateRoutine,
  assertWorkoutVersion,
  validateWorkoutUpdate,
  validateSettings,
  validateTarget,
  validateWorkout,
} from "../../shared/functions/validation.mjs";
import {
  emptyTrainingState,
  checkedState,
} from "../functions/training-state.js";
import { cloudError, confirmWrite } from "./cloud-errors.js";
import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
} from "firebase/firestore";

export function createCloudStore(database, uid) {
  if (!uid || uid.includes("/"))
    throw new Error("Sign in to access your training data.");
  const reference = (...segments) => doc(database, "users", uid, ...segments);
  const docs = (name) => collection(database, "users", uid, name);
  async function saveWorkout(value) {
    const valid = validateWorkout(value);
    const finishedAt = new Date().toISOString();
    return confirmWrite(
      runTransaction(database, async (transaction) => {
        const ref = reference("workouts", valid.id);
        const existing = await transaction.get(ref);
        if (existing.exists()) return existing.data();
        const saved = { ...valid, finishedAt };
        transaction.set(ref, saved);
        return saved;
      }),
    );
  }
  return {
    async updateWorkout(value) {
      return confirmWrite(
        runTransaction(database, async (transaction) => {
          const ref = reference("workouts", value.id);
          const existing = await transaction.get(ref);
          const saved = validateWorkoutUpdate(
            value,
            existing.exists() ? existing.data() : null,
          );
          transaction.set(ref, saved);
          return saved;
        }),
        "workout",
      );
    },
    async deleteWorkout(value) {
      if (!/^[a-zA-Z0-9-]{8,80}$/.test(value.id))
        throw new Error("Invalid workout.");
      return confirmWrite(
        runTransaction(database, async (transaction) => {
          const ref = reference("workouts", value.id);
          const existing = await transaction.get(ref);
          if (existing.exists()) {
            assertWorkoutVersion(value, existing.data());
            transaction.delete(ref);
          }
          return { id: value.id };
        }),
        "workout",
      );
    },
    async saveRoutine(value) {
      const routine = validateRoutine(value);
      await confirmWrite(
        setDoc(reference("routines", routine.id), routine),
        "plan",
      );
      return routine;
    },
    subscribe(next, error) {
      let active = true;
      const state = emptyTrainingState();
      const loaded = new Set();
      const timeout = setTimeout(() => {
        if (active && loaded.size < 4)
          error(
            new Error(
              "Your cloud data is taking too long to load. Check your connection and retry.",
            ),
          );
      }, 15000);
      const report = (err) => {
        if (active) {
          clearTimeout(timeout);
          error(new Error(cloudError(err)));
        }
      };
      const emit = (part) => {
        loaded.add(part);
        if (active && loaded.size === 4) {
          clearTimeout(timeout);
          try {
            next(checkedState(state));
          } catch {
            error(
              new Error(
                "Some saved training data is invalid. Check your Firestore data before retrying.",
              ),
            );
          }
        }
      };
      const subscriptions = [
        onSnapshot(
          docs("routines"),
          { includeMetadataChanges: true },
          (snapshot) => {
            if (!active || snapshot.metadata.fromCache) return;
            state.routines = Object.fromEntries(
              snapshot.docs.map((item) => [item.id, item.data()]),
            );
            emit("routines");
          },
          report,
        ),
        onSnapshot(
          reference("preferences", "main"),
          { includeMetadataChanges: true },
          (snapshot) => {
            if (!active || snapshot.metadata.fromCache) return;
            state.settings = snapshot.exists()
              ? snapshot.data()
              : { ...DEFAULT_SETTINGS };
            emit("settings");
          },
          report,
        ),
        onSnapshot(
          docs("targets"),
          { includeMetadataChanges: true },
          (snapshot) => {
            if (!active || snapshot.metadata.fromCache) return;
            state.targets = Object.fromEntries(
              snapshot.docs.map((item) => [item.id, item.data()]),
            );
            emit("targets");
          },
          report,
        ),
        onSnapshot(
          docs("workouts"),
          { includeMetadataChanges: true },
          (snapshot) => {
            if (!active || snapshot.metadata.fromCache) return;
            state.workouts = snapshot.docs.map((item) => item.data());
            emit("workouts");
          },
          report,
        ),
      ];
      return () => {
        active = false;
        clearTimeout(timeout);
        subscriptions.forEach((unsubscribe) => unsubscribe());
      };
    },
    async saveSettings(value) {
      const settings = validateSettings(value);
      await confirmWrite(
        setDoc(reference("preferences", "main"), settings),
        "plan",
      );
      return settings;
    },
    async saveTarget(value) {
      const target = validateTarget(value);
      await confirmWrite(setDoc(reference("targets", target.id), target));
      return target;
    },
    saveWorkout,
  };
}
