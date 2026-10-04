# Code organization

FORM separates screens, UI pieces, React state, training calculations, and external storage. The refactor preserves the existing data formats, storage keys, routes, and user flows.

## Folder responsibilities

| Location              | Responsibility                                                                                                                     |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.jsx`        | Mount React and load the stylesheet entry point.                                                                                   |
| `src/App.jsx`         | Choose the setup, sign-in, or signed-in application.                                                                               |
| `src/WorkoutApp.jsx`  | Connect the planner controller to navigation, pages, recovery, and dialogs.                                                        |
| `src/pages/`          | Full screens: authentication, setup, planner, history, and progress.                                                               |
| `src/components/`     | UI grouped by feature: `layout`, `planner`, `workout`, `progress`, `dialogs`, and reusable `common` elements.                      |
| `src/hooks/`          | React state, effects, subscriptions, drag gestures, draft synchronization, and the rest timer.                                     |
| `src/functions/`      | Pure application calculations and immutable session edits. These functions do not access React, Firebase, or browser storage.      |
| `src/utils/`          | General display helpers, such as dates and weights.                                                                                |
| `src/services/`       | Firebase initialization, authentication, validated cloud writes, browser draft storage, and the optional browser tool integration. |
| `src/styles/`         | Existing CSS grouped by area. `src/styles.css` imports these files in the original cascade order.                                  |
| `shared/catalog/`     | Exercise definitions, split templates, weekdays, and default settings.                                                             |
| `shared/functions/`   | Training plans, progression, metrics, and validation, usable outside the browser.                                                  |
| `shared/utils/`       | Date-key and training-week utilities.                                                                                              |
| `shared/training.mjs` | Stable public entry point for the shared training API; named re-exports only.                                                      |

## Data flow

`App` restores authentication through `useAuthAccount`. The signed-in `WorkoutApp` creates its controller with `useWorkoutPlanner`, which subscribes to the cloud service and manages navigation, dialogs, and save operations. Pages receive data and callbacks; small components render individual sections.

The workout logger uses `SessionModal` for submission, `ExerciseLog` for each movement, `SetLogRow` for inputs, and `LastPerformance` for comparisons. Immutable changes and save normalization live in `src/functions/session.js`. `useRestTimer` owns timer state; `RestTimer` renders it.

`useWorkoutDraft` connects React to the browser-storage service. Draft persistence remains account scoped, supports legacy migration and cross-tab updates, and clears after an acknowledged save or explicit discard. The cloud service validates data before writing and after loading.

Progress pages calculate an overview with `src/functions/progress.js`. Shared metrics produce the chart data, while progress components handle presentation and point selection.

## Dependency rules

- Pages compose components and call pure calculations; persistence goes through callbacks from their controller.
- Hooks connect state to services and handle lifecycle cleanup.
- Services may use shared validation and pure state helpers; they do not import UI components or hooks.
- Pure functions and utilities do not call Firebase, access browser storage, or use React.
- Shared modules do not import anything from `src/`. Frontend code imports focused shared modules; tests and other consumers may use the stable `shared/training.mjs` entry point.
- Keep related code together. Extract a component when it represents a coherent UI responsibility, rather than splitting every element into a file.

## Where to make changes

| Change                        | Start here                                                                                                |
| ----------------------------- | --------------------------------------------------------------------------------------------------------- |
| Add an exercise               | `shared/catalog/exercises.mjs` (and update Firestore's exercise allowlist if needed)                      |
| Change default schedules      | `shared/catalog/plans.mjs`                                                                                |
| Change progression rules      | `shared/functions/progression.mjs` and training tests                                                     |
| Change validation             | `shared/functions/validation.mjs`, relevant tests, and `firestore.rules` when the server boundary changes |
| Change workout input behavior | `src/components/workout/`, `src/functions/session.js`                                                     |
| Change draft recovery         | `src/hooks/useWorkoutDraft.js`, `src/services/workout-draft.js`                                           |
| Change cloud saving           | `src/services/training-store.js`                                                                          |
| Change a screen               | Its file in `src/pages/` and its feature components                                                       |
| Change chart calculations     | `shared/functions/metrics.mjs`                                                                            |
| Change chart presentation     | `src/components/progress/` and `src/styles/progress.css`                                                  |
| Add a dialog                  | `src/components/dialogs/`, then connect it through `WorkoutDialogs` and `useWorkoutPlanner`               |

## Verification

Run `npm test` for pure training and draft-storage behavior, `npm run build` for the production bundle, and `npm run test:firebase` for cloud rules, real SDK operations, and browser flows. The emulator suite includes the setup-screen test and never uses production Firebase configuration. See the README for emulator prerequisites.
