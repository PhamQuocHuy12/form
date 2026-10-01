import {
  collection,
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import {
  DEFAULT_SETTINGS,
  validateSettings,
  validateTarget,
  validateWorkout,
  validateWorkoutUpdate,
  validateRoutine,
  assertWorkoutVersion,
} from "../shared/training.mjs";

export function emptyTrainingState() {
  return {
    settings: { ...DEFAULT_SETTINGS },
    targets: {},
    workouts: [],
    routines: {},
  };
}

export function cloudError(error, operation) {
  if (error?.code === "permission-denied" && operation === "plan")
    return "Plan saving was denied. Check that the latest firestore.rules are published in Firebase Console → Firestore Database → Rules, including support for custom weekdays and exercises. Your selections are still open; retry after publishing.";
  if (error?.code === "permission-denied" && operation === "workout")
    return "This workout could not be changed. Publish the latest firestore.rules in Firebase Console → Firestore Database → Rules to enable editing and deletion, then retry.";
  if (error?.code === "permission-denied")
    return "Cloud access was denied. Publish the latest firestore.rules in Firebase Console → Firestore Database → Rules, including the routines path for custom exercises, then retry.";
  if (error?.code === "unavailable")
    return "Cloud storage is unavailable. Check your connection and try again.";
  return "Your cloud data could not be loaded or saved. Please try again.";
}

function confirmWrite(promise, operation) {
  // Firestore queues writes offline. Keep the draft if server acknowledgement is delayed.
  let timeout;
  const deadline = new Promise((_, reject) => {
    timeout = setTimeout(
      () =>
        reject(
          new Error(
            "Saving could not be confirmed. Keep your workout open and retry when you’re connected.",
          ),
        ),
      15000,
    );
  });
  return Promise.race([promise, deadline])
    .catch((error) => {
      if (error.code) throw new Error(cloudError(error, operation));
      throw error;
    })
    .finally(() => clearTimeout(timeout));
}

function checkedState(state) {
  const settings = validateSettings(state.settings);
  const targets = Object.fromEntries(
    Object.entries(state.targets).map(([id, value]) => {
      if (value.id !== id) throw new Error("Invalid saved target.");
      return [id, validateTarget(value)];
    }),
  );
  const workouts = state.workouts
    .map((value) => {
      const valid = validateWorkout(value);
      if (
        typeof value.finishedAt !== "string" ||
        !Number.isFinite(Date.parse(value.finishedAt))
      )
        throw new Error("Invalid saved workout date.");
      if (
        value.revision !== undefined &&
        (!Number.isSafeInteger(value.revision) || value.revision < 0)
      )
        throw new Error("Invalid saved workout version.");
      return {
        ...valid,
        finishedAt: value.finishedAt,
        revision: value.revision ?? 0,
      };
    })
    .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt));
  const routines = Object.fromEntries(
    Object.entries(state.routines ?? {}).map(([id, value]) => {
      if (value.id !== id) throw new Error("Invalid saved exercise list.");
      return [id, validateRoutine(value)];
    }),
  );
  return { settings, targets, workouts, routines };
}

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
