# Code organization

FORM separates screens, UI pieces, React state, training calculations, and external storage. The refactor preserves the existing data formats, storage keys, routes, and user flows.

## Folder responsibilities

| Location                        | Responsibility                                                                                                                     |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.jsx`                  | Mount React and load the stylesheet entry point.                                                                                   |
| `src/App.jsx`                   | Choose the setup, sign-in, or signed-in application.                                                                               |
| `src/WorkoutApp.jsx`            | Connect the planner controller to navigation, pages, recovery, and dialogs.                                                        |
| `src/pages/`                    | Full screens, each in a named folder containing the page and its styles.                                                           |
| `src/components/`               | UI grouped by feature, then by component: `layout`, `planner`, `workout`, `progress`, `dialogs`, and reusable `common` elements.   |
| `src/components/common/styles/` | Shared style-only modules for form controls, feedback, typography, and view controls.                                              |
| `src/hooks/`                    | React state, effects, subscriptions, drag gestures, draft synchronization, and the rest timer.                                     |
| `src/functions/`                | Pure application calculations and immutable session edits. These functions do not access React, Firebase, or browser storage.      |
| `src/utils/`                    | General display helpers, such as dates and weights.                                                                                |
| `src/services/`                 | Firebase initialization, authentication, validated cloud writes, browser draft storage, and the optional browser tool integration. |
| `src/styles/`                   | Plain CSS for fonts, theme tokens, resets, and global accessibility. `src/styles.css` imports `theme.css` and `base.css`.          |
| `*.styles.js`                   | Linaria appearance and responsive rules in the owning component or page folder; shared style-only modules live in `common/styles`. |
| `shared/catalog/`               | Exercise definitions, split templates, weekdays, and default settings.                                                             |
| `shared/functions/`             | Training plans, progression, metrics, and validation, usable outside the browser.                                                  |
| `shared/utils/`                 | Date-key and training-week utilities.                                                                                              |
| `shared/training.mjs`           | Stable public entry point for the shared training API; named re-exports only.                                                      |

## Component folders

Keep each component and its styles in a folder named after the component, within its existing feature group. Pages use the same convention:

```text
src/
  components/
    common/
      Button/
        Button.jsx
        Button.styles.js
      IconButton/
        IconButton.jsx
        IconButton.styles.js
      styles/
        FormControls.styles.js
        Typography.styles.js
    planner/
      ExerciseList/
        ExerciseList.jsx
        ExerciseList.styles.js
  pages/
    HistoryPage/
      HistoryPage.jsx
      HistoryPage.styles.js
```

Use explicit file imports, such as `../Button/Button.jsx`, without barrel `index.js` files. Import the component's own styles with `./ComponentName.styles.js`. Components that use only shared styles do not need an empty local style file. The application entry points, hooks, functions, utilities, and services retain their existing locations.

## Data flow

`App` restores authentication through `useAuthAccount`. The signed-in `WorkoutApp` creates its controller with `useWorkoutPlanner`, which subscribes to the cloud service and manages navigation, dialogs, and save operations. Pages receive data and callbacks; small components render individual sections.

The workout logger uses `SessionModal` for submission, `ExerciseLog` for each movement, `SetLogRow` for inputs, and `LastPerformance` for comparisons. Immutable changes and save normalization live in `src/functions/session.js`. `useRestTimer` owns timer state; `RestTimer` renders it.

`useWorkoutDraft` connects React to the browser-storage service. Draft persistence remains account scoped, supports legacy migration and cross-tab updates, and clears after an acknowledged save or explicit discard. The cloud service validates data before writing and after loading.

Progress pages calculate an overview with `src/functions/progress.js`. Shared metrics produce the chart data, while progress components handle presentation and point selection.

`useAppearance` subscribes independently to `users/{uid}/preferences/appearance` through the cloud store. Appearance failures do not block training data. The validated theme choice is account scoped; a best-effort browser cache gives a startup hint, and acknowledged Firestore snapshots replace it. The hook applies `data-theme` to the document root, observes device color-scheme changes for System mode, and cleans up on sign-out. Components use semantic CSS variables from `src/styles/theme.css` for surfaces, text, status colors, and charts. Theme and plan writes use separate documents so they cannot overwrite each other.

## Dependency rules

- Pages compose components and call pure calculations; persistence goes through callbacks from their controller.
- Hooks connect state to services and handle lifecycle cleanup.
- Services may use shared validation and pure state helpers; they do not import UI components or hooks.
- Pure functions and utilities do not call Firebase, access browser storage, or use React.
- Shared modules do not import anything from `src/`. Frontend code imports focused shared modules; tests and other consumers may use the stable `shared/training.mjs` entry point.
- Keep related code together. Extract a component when it represents a coherent UI responsibility, rather than splitting every element into a file.

## Component styles and Linaria

Component and page appearance uses Linaria's `css` tag in nearby `ComponentName.styles.js` files. Import named class exports into the JSX and attach them to the existing native elements. Linaria extracts CSS through `@wyw-in-js/vite`, which processes only `src/**/*.styles.js`. Style modules must be pure: they may import Linaria and other pure styling constants, but must not import components, hooks, Firebase, browser storage, services, or modules with application effects.

Keep base appearance, state selectors, and media queries with their owner. Contextual adjustments belong to the component that creates the context: for example, planner card label overrides live in `PlannerInsights/PlannerInsights.styles.js`, and sidebar branding adjustments live in `AppLayout/AppLayout.styles.js`. Shared styling modules in `components/common/styles` cover native form controls, feedback, typography, and view controls without adding wrappers around every element.

Keep fonts, resets, theme variables, universal keyboard focus, disabled-control behavior, screen-reader utilities, details-marker resets, and reduced-motion rules in plain CSS. The former area-wide stylesheets have been removed. Inline styles remain appropriate for data-dependent values such as chart bar heights, workout completion percentages, and drag-preview coordinates.

Retain semantic class hooks alongside extracted classes, including classes used by browser tests and contextual selectors:

```jsx
import { exerciseRow } from "./ExerciseList.styles.js";

<div className={`${exerciseRow} exercise-row`}>...</div>;
```

Use modifier hooks such as `selected`, `rest`, `set-done`, and `wide-modal` for state. Match the original selector specificity when combining an extracted class with a modifier; `:where(...)` is used where the extra class must not increase specificity. Do not rely on import order to override shared controls. Use a contextual selector or an explicit modifier, and verify all affected breakpoints when changing the cascade.

`Button.jsx` is the shared action button. Its base, primary, secondary, danger, and full-width styles live in `Button.styles.js`. `IconButton.jsx` shares native icon-button styling and semantics; `ActionRow.jsx` shares the wrapping action layout used in dialogs, workout editing, and history. Extract components when they represent meaningful reuse, rather than creating one for every HTML element.

```jsx
<Button variant="primary" onClick={startWorkout}>
  Start workout
</Button>

<Button variant="primary" type="submit" fullWidth disabled={busy}>
  Save target
</Button>
```

`Button` and `IconButton` default to `type="button"`; form submissions must explicitly use `type="submit"`. Native attributes, events, children, and React 19 refs pass through to the underlying button. Use `className` for local layout adjustments. The `button`, `icon-button`, and variant classes remain available for contextual and responsive rules. Navigation and text controls retain their native elements and use the appropriate nearby style module.

Native inputs, selects, textareas, and fieldsets import classes from `FormControls.styles.js`; their attributes, events, validation, and refs remain directly on the native elements. Shared form appearance stays lower in specificity than component-specific input adjustments. After changing a style module, verify development style reloads and the production build, as well as mobile and desktop rendering.

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
| Change chart presentation     | `src/components/progress/` and the corresponding nearby `*.styles.js`                                     |
| Add a dialog                  | `src/components/dialogs/`, then connect it through `WorkoutDialogs` and `useWorkoutPlanner`               |

## Verification

Run `npm test` for pure training and draft-storage behavior, `npm run build` for the production bundle, and `npm run test:firebase` for cloud rules, real SDK operations, and browser flows. The emulator suite includes the setup-screen test and never uses production Firebase configuration. See the README for emulator prerequisites.

Validate meaningful styling stages with the existing tests for the affected feature, then run the full suite, formatting checks, and `git diff --check`. Check desktop and mobile layouts, dialog focus trapping and restoration, input validation, disabled controls, and development style reloads. Temporary browser servers must use separate ports and leave user-owned development servers running. Test builds use the isolated `demo-form` Firebase project.
