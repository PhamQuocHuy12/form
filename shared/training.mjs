export const MUSCLES = ["Chest", "Back", "Shoulders", "Arms", "Legs", "Core"];
export const MAX_EXERCISES = 8;
const ex = (id, name, muscle, equipment, sets, min, max, rest, tip) => ({
  id,
  name,
  muscle,
  equipment,
  sets,
  min,
  max,
  rest,
  tip,
});
export const EXERCISES = {
  bench: ex(
    "bench",
    "Barbell bench press",
    "Chest",
    "Barbell",
    3,
    8,
    10,
    90,
    "Keep your feet planted and lower the bar with control.",
  ),
  incline: ex(
    "incline",
    "Incline dumbbell press",
    "Chest",
    "Dumbbells",
    3,
    10,
    12,
    75,
    "Use a low incline. Keep your shoulder blades gently back.",
  ),
  fly: ex(
    "fly",
    "Cable chest fly",
    "Chest",
    "Cable",
    2,
    12,
    15,
    60,
    "Keep a soft bend in your elbows throughout the movement.",
  ),
  row: ex(
    "row",
    "Seated cable row",
    "Back",
    "Cable",
    3,
    10,
    12,
    75,
    "Pull toward your lower ribs without rocking your torso.",
  ),
  pulldown: ex(
    "pulldown",
    "Lat pulldown",
    "Back",
    "Cable",
    3,
    10,
    12,
    75,
    "Drive your elbows down and keep your chest tall.",
  ),
  dbrow: ex(
    "dbrow",
    "Dumbbell row",
    "Back",
    "Dumbbells",
    3,
    8,
    12,
    75,
    "Support your torso and complete each side with control.",
  ),
  press: ex(
    "press",
    "Dumbbell shoulder press",
    "Shoulders",
    "Dumbbells",
    3,
    8,
    10,
    90,
    "Keep your ribs down and press through a comfortable range.",
  ),
  lateral: ex(
    "lateral",
    "Dumbbell lateral raise",
    "Shoulders",
    "Dumbbells",
    2,
    12,
    15,
    60,
    "Lead with your elbows and avoid swinging the weight.",
  ),
  facepull: ex(
    "facepull",
    "Cable face pull",
    "Shoulders",
    "Cable",
    2,
    12,
    15,
    60,
    "Pull toward eye level while keeping your shoulders relaxed.",
  ),
  curl: ex(
    "curl",
    "Dumbbell biceps curl",
    "Arms",
    "Dumbbells",
    2,
    10,
    12,
    60,
    "Keep your elbows close to your sides.",
  ),
  triceps: ex(
    "triceps",
    "Rope triceps pushdown",
    "Arms",
    "Cable",
    2,
    10,
    12,
    60,
    "Keep your upper arms still and extend your elbows smoothly.",
  ),
  squat: ex(
    "squat",
    "Barbell back squat",
    "Legs",
    "Barbell",
    3,
    8,
    10,
    120,
    "Brace your trunk and use a depth you can control.",
  ),
  rdl: ex(
    "rdl",
    "Romanian deadlift",
    "Legs",
    "Barbell",
    3,
    8,
    10,
    120,
    "Push your hips back with a slight bend in your knees.",
  ),
  legpress: ex(
    "legpress",
    "Leg press",
    "Legs",
    "Machine",
    3,
    10,
    12,
    90,
    "Keep your hips on the pad and avoid locking your knees.",
  ),
  lunge: ex(
    "lunge",
    "Reverse dumbbell lunge",
    "Legs",
    "Dumbbells",
    3,
    10,
    12,
    90,
    "Reps are per side. Step back and keep the front foot planted.",
  ),
  legcurl: ex(
    "legcurl",
    "Seated leg curl",
    "Legs",
    "Machine",
    3,
    10,
    12,
    75,
    "Keep your hips down and control the return.",
  ),
  calf: ex(
    "calf",
    "Standing calf raise",
    "Legs",
    "Machine",
    2,
    12,
    15,
    60,
    "Pause briefly at the top and lower your heels slowly.",
  ),
  deadbug: ex(
    "deadbug",
    "Dead bug",
    "Core",
    "Bodyweight",
    3,
    10,
    12,
    45,
    "Reps are per side. Keep your lower back gently against the floor.",
  ),
  crunch: ex(
    "crunch",
    "Cable crunch",
    "Core",
    "Cable",
    3,
    12,
    15,
    60,
    "Curl through your trunk without pulling with your arms.",
  ),
};
const day = (id, weekday, title, subtitle, ids) => ({
  id,
  weekday,
  title,
  subtitle,
  exercises: ids.map((id) => EXERCISES[id]),
});
export const PLANS = {
  3: [
    day("full-a", 0, "Full body A", "Chest, back & legs", [
      "squat",
      "bench",
      "row",
      "lateral",
      "curl",
      "deadbug",
    ]),
    day("full-b", 2, "Full body B", "Posterior chain & shoulders", [
      "rdl",
      "pulldown",
      "press",
      "lunge",
      "triceps",
      "crunch",
    ]),
    day("full-c", 4, "Full body C", "Balanced strength", [
      "legpress",
      "incline",
      "dbrow",
      "legcurl",
      "facepull",
      "deadbug",
    ]),
  ],
  4: [
    day("upper-a", 0, "Upper body A", "Chest, back & arms", [
      "bench",
      "row",
      "press",
      "pulldown",
      "curl",
      "triceps",
    ]),
    day("lower-a", 1, "Lower body A", "Quads, hamstrings & core", [
      "squat",
      "rdl",
      "legcurl",
      "calf",
      "deadbug",
    ]),
    day("upper-b", 3, "Upper body B", "Back, chest & shoulders", [
      "incline",
      "dbrow",
      "pulldown",
      "lateral",
      "curl",
      "triceps",
    ]),
    day("lower-b", 4, "Lower body B", "Glutes, legs & core", [
      "legpress",
      "lunge",
      "legcurl",
      "calf",
      "crunch",
    ]),
  ],
  5: [
    day("push", 0, "Push day", "Chest, shoulders & triceps", [
      "bench",
      "incline",
      "press",
      "lateral",
      "triceps",
    ]),
    day("pull", 1, "Pull day", "Back, biceps & rear delts", [
      "pulldown",
      "row",
      "dbrow",
      "facepull",
      "curl",
    ]),
    day("legs", 2, "Leg day", "Quads, hamstrings & core", [
      "squat",
      "rdl",
      "legcurl",
      "calf",
      "deadbug",
    ]),
    day("upper", 4, "Upper body", "Chest, back & arms", [
      "incline",
      "row",
      "lateral",
      "curl",
      "triceps",
    ]),
    day("lower", 5, "Lower body", "Glutes, legs & core", [
      "legpress",
      "lunge",
      "legcurl",
      "calf",
      "crunch",
    ]),
  ],
};
export const DEFAULT_SETTINGS = { days: 4, strategy: "weight" };
export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
export function trainingPlan(settings, routines = {}) {
  const weekdays =
    settings.weekdays ?? PLANS[settings.days].map((day) => day.weekday);
  return PLANS[settings.days].map((day, index) => ({
    ...day,
    weekday: weekdays[index],
    ...(routines[day.id]
      ? {
          exercises: routines[day.id].exerciseIds.map((id) => EXERCISES[id]),
          subtitle: [
            ...new Set(
              routines[day.id].exerciseIds.map((id) => EXERCISES[id].muscle),
            ),
          ].join(", "),
        }
      : {}),
  }));
}
export function validateRoutine(value) {
  if (
    !value ||
    !Object.values(PLANS)
      .flat()
      .some((day) => day.id === value.id) ||
    !Array.isArray(value.exerciseIds) ||
    value.exerciseIds.length < 1 ||
    value.exerciseIds.length > MAX_EXERCISES ||
    new Set(value.exerciseIds).size !== value.exerciseIds.length ||
    !value.exerciseIds.every((id) => Object.hasOwn(EXERCISES, id))
  )
    throw new Error(
      `Choose 1–${MAX_EXERCISES} different exercises from the exercise library.`,
    );
  return { id: value.id, exerciseIds: [...value.exerciseIds] };
}
export function assertWorkoutVersion(value, existing) {
  const revision = value.revision ?? 0;
  if (
    !Number.isSafeInteger(revision) ||
    revision < 0 ||
    revision !== (existing.revision ?? 0)
  )
    throw new Error(
      "This workout changed in another tab. Close this dialog and open it again before saving or deleting.",
    );
}
export function validateWorkoutUpdate(value, existing) {
  if (!existing)
    throw new Error(
      "This workout no longer exists. Close this dialog and refresh your history.",
    );
  assertWorkoutVersion(value, existing);
  for (const key of ["id", "week", "days", "dayId", "title", "finishedAt"])
    if (value[key] !== existing[key])
      throw new Error(
        "A workout’s original date and session details cannot be changed.",
      );
  return {
    ...validateWorkout(value),
    finishedAt: existing.finishedAt,
    revision: (existing.revision ?? 0) + 1,
  };
}
export function dateKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
export function monday(date = new Date()) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dateKey(d);
}
export function shiftDate(key, days) {
  const date = new Date(`${key}T12:00:00`);
  date.setDate(date.getDate() + days);
  return dateKey(date);
}
export function isDateKey(key) {
  return (
    typeof key === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(key) &&
    dateKey(new Date(`${key}T12:00:00`)) === key
  );
}
export function prescriptions(exercise, week, state) {
  const target = state.targets[exercise.id] ?? {};
  const base = {
    sets: target.sets ?? exercise.sets,
    reps: target.reps ?? exercise.min,
    weight: target.weight ?? null,
    increased: false,
    reason: "Set a comfortable starting point",
  };
  if (target.week === week)
    return { ...base, reason: "Your custom target for this week" };
  const priorWeek = shiftDate(week, -7);
  const previousWorkout = state.workouts
    .filter(
      (w) =>
        w.week < week &&
        w.status === "completed" &&
        w.exercises.some((e) => e.id === exercise.id),
    )
    .sort(
      (a, b) =>
        b.week.localeCompare(a.week) ||
        b.finishedAt.localeCompare(a.finishedAt),
    )[0];
  const previous = previousWorkout?.exercises.find((e) => e.id === exercise.id);
  if (!previous || previous.sets.length === 0) return base;
  const sets = previous.sets;
  const commonWeight = sets.every((s) => s.weight === sets[0].weight);
  const reps = Math.min(...sets.map((s) => s.reps));
  const prescribed = previous.prescription ?? base;
  const metTarget =
    sets.every((s) => s.done && s.reps >= prescribed.reps) &&
    sets.length >= prescribed.sets;
  const held = {
    ...base,
    sets: prescribed.sets,
    reps: prescribed.reps,
    weight: commonWeight ? sets[0].weight : prescribed.weight,
    reason: "Repeat last week’s target with good form",
  };
  if (!metTarget || !commonWeight || previousWorkout.week !== priorWeek)
    return held;
  const strategy = state.settings.strategy;
  if (strategy === "sets")
    return {
      ...held,
      sets: Math.min(5, prescribed.sets + 1),
      increased: prescribed.sets < 5,
      reason:
        prescribed.sets < 5
          ? "Add one set after completing last week’s target"
          : "Five-set cap reached. Maintain your quality",
    };
  if (strategy === "reps" || sets[0].weight === null || sets[0].weight === 0)
    return {
      ...held,
      reps: Math.max(prescribed.reps, Math.min(exercise.max, reps + 1)),
      increased: reps < exercise.max,
      reason:
        reps < exercise.max
          ? "Add one rep per set this week"
          : "Top of rep range reached. Maintain or set a load",
    };
  if (reps >= exercise.max) {
    const increment =
      Math.floor(
        Math.min(exercise.muscle === "Legs" ? 5 : 2.5, sets[0].weight * 0.1) *
          4,
      ) / 4;
    if (!increment || sets[0].weight + increment > 1000)
      return {
        ...held,
        reason: "Maintain your load or choose a custom target",
      };
    return {
      ...held,
      weight: Math.round((sets[0].weight + increment) * 100) / 100,
      reps: exercise.min,
      increased: true,
      reason: "Top of rep range reached last week. Try a small load increase",
    };
  }
  return {
    ...held,
    reps: Math.min(exercise.max, reps + 1),
    increased: true,
    reason: "Build reps before increasing the weight",
  };
}
export function records(workouts) {
  const best = {};
  for (const workout of workouts)
    for (const e of workout.exercises)
      for (const s of e.sets.filter((s) => s.done)) {
        const score = s.weight ?? 0;
        const previous = best[e.id];
        if (
          !previous ||
          score > (previous.weight ?? 0) ||
          (score === (previous.weight ?? 0) && s.reps > previous.reps)
        )
          best[e.id] = {
            id: e.id,
            name: EXERCISES[e.id].name,
            weight: s.weight,
            reps: s.reps,
            date: workout.finishedAt,
          };
      }
  return Object.values(best);
}
export function volume(workout) {
  return workout.exercises.reduce(
    (sum, e) =>
      sum +
      e.sets.reduce((n, s) => n + (s.done ? (s.weight ?? 0) * s.reps : 0), 0),
    0,
  );
}
export function validateSettings(value) {
  if (
    !value ||
    ![3, 4, 5].includes(value.days) ||
    !["weight", "reps", "sets"].includes(value.strategy)
  )
    throw new Error("Choose 3–5 days and a valid progression method.");
  if (
    value.weekdays !== undefined &&
    (!Array.isArray(value.weekdays) ||
      value.weekdays.length !== value.days ||
      new Set(value.weekdays).size !== value.days ||
      !value.weekdays.every(
        (day) => Number.isInteger(day) && day >= 0 && day <= 6,
      ))
  )
    throw new Error(
      `Choose exactly ${value.days} different weekdays for your plan.`,
    );
  return {
    days: value.days,
    strategy: value.strategy,
    ...(value.weekdays !== undefined
      ? { weekdays: [...value.weekdays].sort((a, b) => a - b) }
      : {}),
  };
}
export function validateTarget(value) {
  if (
    !value ||
    !Object.hasOwn(EXERCISES, value.id) ||
    !Number.isInteger(value.sets) ||
    value.sets < 1 ||
    value.sets > 5 ||
    !Number.isInteger(value.reps) ||
    value.reps < 1 ||
    value.reps > 50 ||
    !(
      value.weight === null ||
      (Number.isFinite(value.weight) &&
        value.weight >= 0 &&
        value.weight <= 1000)
    )
  )
    throw new Error(
      "Enter 1–5 sets, 1–50 reps, and an optional weight from 0–1,000 kg.",
    );
  if (value.week !== undefined && !isDateKey(value.week))
    throw new Error("Invalid target week.");
  return {
    id: value.id,
    sets: value.sets,
    reps: value.reps,
    weight: value.weight,
    ...(value.week ? { week: value.week } : {}),
  };
}
export function validateWorkout(value) {
  if (
    !value ||
    typeof value.id !== "string" ||
    !/^[a-zA-Z0-9-]{8,80}$/.test(value.id) ||
    !isDateKey(value.week) ||
    monday(new Date(`${value.week}T12:00:00`)) !== value.week ||
    ![3, 4, 5].includes(value.days)
  )
    throw new Error("Invalid workout.");
  const planDay = PLANS[value.days].find((d) => d.id === value.dayId);
  if (
    !planDay ||
    !Array.isArray(value.exercises) ||
    value.exercises.length < 1 ||
    value.exercises.length > MAX_EXERCISES ||
    new Set(value.exercises.map((exercise) => exercise?.id)).size !==
      value.exercises.length ||
    !["completed", "partial"].includes(value.status) ||
    typeof value.notes !== "string" ||
    value.notes.length > 2000
  )
    throw new Error("Invalid workout details.");
  let doneCount = 0;
  let setCount = 0;
  const exercises = value.exercises.map((e) => {
    if (
      !e ||
      !Object.hasOwn(EXERCISES, e.id) ||
      !Array.isArray(e.sets) ||
      e.sets.length < 1 ||
      e.sets.length > 5
    )
      throw new Error("Invalid exercise sets.");
    const p = validateTarget({ id: e.id, ...e.prescription });
    if (e.sets.length !== p.sets)
      throw new Error("Set count does not match the target.");
    const sets = e.sets.map((s) => {
      if (
        !Number.isInteger(s.reps) ||
        s.reps < 1 ||
        s.reps > 100 ||
        typeof s.done !== "boolean" ||
        !(
          s.weight === null ||
          (Number.isFinite(s.weight) && s.weight >= 0 && s.weight <= 1000)
        )
      )
        throw new Error("Enter valid reps and weight for every set.");
      setCount++;
      if (s.done) doneCount++;
      return { reps: s.reps, weight: s.weight, done: s.done };
    });
    return {
      id: e.id,
      prescription: { sets: p.sets, reps: p.reps, weight: p.weight },
      sets,
    };
  });
  if (!doneCount || (value.status === "completed" && doneCount !== setCount))
    throw new Error("Check off your completed sets before saving.");
  return {
    id: value.id,
    week: value.week,
    days: value.days,
    dayId: value.dayId,
    title: planDay.title,
    status: doneCount === setCount ? "completed" : "partial",
    notes: value.notes.trim(),
    exercises,
  };
}
