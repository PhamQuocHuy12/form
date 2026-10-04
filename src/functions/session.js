import { prescriptions } from "../../shared/functions/progression.mjs";

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
export function sessionCounts(session) {
  return {
    total: session.exercises.reduce(
      (count, exercise) => count + exercise.sets.length,
      0,
    ),
    completed: session.exercises.reduce(
      (count, exercise) =>
        count + exercise.sets.filter((set) => set.done).length,
      0,
    ),
  };
}
export function normalizeSession(session) {
  const { total, completed } = sessionCounts(session);
  return {
    ...session,
    status: completed === total ? "completed" : "partial",
    exercises: session.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set) => ({
        ...set,
        reps: Number(set.reps),
        weight:
          set.weight === "" || set.weight === null ? null : Number(set.weight),
      })),
    })),
  };
}
export function updateSessionExercise(session, index, update) {
  return {
    ...session,
    exercises: session.exercises.map((exercise, position) =>
      position === index ? update(exercise) : exercise,
    ),
  };
}
export function updateSessionSet(session, exerciseIndex, setIndex, values) {
  return updateSessionExercise(session, exerciseIndex, (exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set, position) =>
      position === setIndex ? { ...set, ...values } : set,
    ),
  }));
}
export function setExerciseCompletion(session, index, done) {
  return updateSessionExercise(session, index, (exercise) => ({
    ...exercise,
    sets: exercise.sets.map((set) => ({ ...set, done })),
  }));
}
export function addExerciseSet(session, index) {
  return updateSessionExercise(session, index, (exercise) => ({
    ...exercise,
    prescription: { ...exercise.prescription, sets: exercise.sets.length + 1 },
    sets: [
      ...exercise.sets,
      {
        reps: exercise.prescription.reps,
        weight: exercise.sets.at(-1).weight,
        done: false,
      },
    ],
  }));
}
export function removeExerciseSet(session, index) {
  return updateSessionExercise(session, index, (exercise) => ({
    ...exercise,
    prescription: { ...exercise.prescription, sets: exercise.sets.length - 1 },
    sets: exercise.sets.slice(0, -1),
  }));
}
