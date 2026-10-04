import { EXERCISES } from "./exercises.mjs";

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
