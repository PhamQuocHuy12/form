# FORM — Weekly workout planner

A mobile-first gym planner for 3–5 training days. Built with React, Vite, Lucide icons, and a small Node.js server with SQLite. No account or cloud service is required.

## Run locally

Requires **Node.js 24 or newer** (uses the built-in `node:sqlite` module).

```sh
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173). The development server listens only on this computer. To use the production build locally:

```sh
npm run build
npm start
```

Stop the development server before starting the production server on the same port. Set `PORT` to use a different port.

## Features

- 3-day full-body, 4-day upper/lower, and 5-day push/pull/legs plus upper/lower schedules.
- Chest, back, shoulders, arms, legs, and core coverage, with training and recovery days.
- Exercise-specific sets, reps, rest intervals, equipment, form cues, and optional target weights.
- Expandable warm-up and cool-down recommendations for each session.
- Per-set actual weights and reps, completed-set checkboxes, a rest timer, and session notes.
- Partial session logging and completed-workout tracking, including multiple sessions per day.
- Persistent workout history, best weight/repetition records, and six-week consistency charts.
- Adjustable progression by weight, reps, or sets.
- Keyboard-accessible dialogs, responsive layouts, and mobile bottom navigation.

## Progression rules

Targets are suggestions that can be edited. The planner looks at the latest completed session containing an exercise in the previous calendar week. It only progresses when all prescribed sets reached the target and the same weight was used throughout.

- **Weight:** add a rep until the upper end of the exercise range is reached, then suggest up to 2.5 kg for upper-body exercises or 5 kg for legs, capped at 10% of the previous load and rounded down to a 0.25 kg increment. Reps return to the exercise’s starting range after a weight increase.
- **Reps:** add one rep per set up to the exercise’s range.
- **Sets:** add one set, with a five-set maximum.
- Unweighted movements progress by reps. Incomplete sessions do not trigger increases. Missed weeks retain the previous completed target without increasing it. Future workouts do not affect historical weeks.
- A custom target for the selected week overrides the suggestion. Targets also act as starting defaults when there is no completed history for an exercise.

All weights are kilograms. Log one dumbbell’s weight consistently for dumbbell exercises. Bodyweight-only sets do not contribute to the external-load volume total. These are general-purpose editable templates, not individualized coaching. The bounded load-increase approach is informed by [ACSM’s resistance-training progression position stand](https://pubmed.ncbi.nlm.nih.gov/19204579/); the exact app rules are implementation choices.

## Data and privacy

Saved settings, exercise targets, and workouts live in `data/form.sqlite` on this computer. `data/` is excluded from Git. Stop the server before copying the database as a backup. Set `DATA_DIR` to use another storage directory.

An unfinished workout is kept in the current browser tab’s session storage until it is saved. It survives refreshes, but closing the tab can discard it. Completed workouts survive closing the browser and restarting the server. Browser history and database history are not synchronized across computers. This is a single-user local app, with no authentication; the server intentionally binds to loopback.

## Verification

```sh
npm test
npm run build
npx playwright test
```

Browser tests use installed Microsoft Edge, run an isolated server on port 5174, and save screenshots in `test-results/`. Each run has a separate database under ignored `data/browser-test-*`; it never writes to the user’s database. Change `channel` in `playwright.config.js` to use another supported browser.

## Project map

- `src/main.jsx` — planner, navigation, state, and persistence actions.
- `src/components.jsx` — workout logging, target/settings dialogs, history, and progress.
- `src/styles.css` — responsive dark theme.
- `shared/training.mjs` — schedules, validation, progression, records, and date helpers.
- `server.mjs` — local HTTP API, SQLite persistence, and development/production serving.
- `tests/` — training-rule and browser-flow tests.

The optional `read_training_plan` WebMCP browser tool is feature-detected. Regular browsers do not need WebMCP support.
