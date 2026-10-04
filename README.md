# FORM — Weekly workout planner

A mobile-first gym planner for 3–5 training days. Built with React, Vite, Lucide icons, Firebase Authentication and Cloud Firestore. Firebase configuration and sign-in are required for all workout storage.

## Run locally

Requires **Node.js 24 or newer**.

```sh
npm install
npm run dev
```

Open [localhost:5173](http://localhost:5173). Vite serves the app on this computer; workouts and plans save to Firebase. To use the production build locally:

```sh
npm run build
npm start
```

Stop the development server before starting the production server on the same port. Use `npm run dev -- --port 5178` or `npm run preview -- --port 5178` to choose a different port.

## Publish to GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys on pushes to `main`, or manually from **Actions → Deploy FORM to GitHub Pages → Run workflow**. It runs the training tests and publishes only `dist`, using Node.js 24. GitHub's Pages metadata sets the asset base path automatically for repository URLs and custom domains. No manual change to the local Vite base is needed.

For `PhamQuocHuy12/form`, the default site URL is `https://phamquochuy12.github.io/form/` after the first successful deployment.

1. In the GitHub repository, open **Settings → Secrets and variables → Actions → New repository secret**. Copy each corresponding value from your local Firebase web configuration, without a `NAME=` prefix or surrounding quotes:

   ```text
   VITE_FIREBASE_API_KEY
   VITE_FIREBASE_AUTH_DOMAIN
   VITE_FIREBASE_PROJECT_ID
   VITE_FIREBASE_STORAGE_BUCKET
   VITE_FIREBASE_MESSAGING_SENDER_ID
   VITE_FIREBASE_APP_ID
   ```

   API key, auth domain, project ID, and app ID are required; the workflow fails with the missing names if they are absent. Storage bucket and messaging sender ID are optional for this app. The workflow disables Firebase emulators. Keep `.env` files uncommitted; the workflow passes values directly to the build and never prints them.

2. Under **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. In Firebase **Authentication → Settings → Authorized domains**, add `phamquochuy12.github.io` (the hostname only), or your custom hostname. Enable Email/Password and publish the full latest `firestore.rules` in that Firebase project.
4. Commit and push the workflow and app changes to `main`. Open the Actions run to see the build/deploy result and its site URL. Changing a repository secret requires a new workflow run to rebuild the browser bundle.

GitHub Pages hosts the browser app; Firebase provides sign-in and workout storage. Local development uses the same Firebase sign-in and storage as the hosted app. Firebase web configuration is included in the public browser bundle even when supplied through GitHub secrets; never put service-account credentials or server private keys in `VITE_` values. The workflow does not deploy Firestore rules or change Firebase settings.

Deployment references: [Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy#github-pages), [GitHub Actions secrets](https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets).

## Firebase setup

The client uses the `VITE_FIREBASE_*` environment variables listed in `.env.example`, through `src/firebase-config.js`. Vite loads `.env` or `.env.local`; restart development after changing those values and rebuild for production. Environment files are ignored by Git.

In the Firebase project corresponding to those values:

1. Enable **Email/Password** under **Authentication → Sign-in method**.
2. Add `localhost` to **Authentication → Settings → Authorized domains**, along with the domain used for any future deployment.
3. Create a **Cloud Firestore Standard edition** database with the default database ID, in production mode. Choose your region before creation.
4. Publish the included `firestore.rules` through the Firestore rules editor, or use the Firebase CLI:

```sh
npx firebase login
npx firebase deploy --only firestore:rules --project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your project ID. Review these rules before publishing them to a project containing other applications: they grant access only to this app’s account-scoped paths and deny all other paths. This repository does not automatically provision or change your live Firebase project.

If signup returns `CONFIGURATION_NOT_FOUND`, open Authentication in the project associated with your web API key, click **Get started** if shown, and enable **Email/Password** under **Sign-in method**. Confirm all web configuration values belong to the same project. If you change environment values, restart the development server. If only the Console provider setup changes, refresh and retry signup.

If the planner opens but **Save my plan** returns permission denied after adding custom weekdays, republish the latest `firestore.rules` in the same project’s **Firestore Database → Rules** tab. Earlier rules allowed only `days` and `strategy`; plan settings now also contain `weekdays`. Publish the full file, then retry saving. Your selections remain in the open dialog on failure.

With configuration present, the app opens on email/password sign-in. It supports account creation, password recovery, persistent sign-in, and sign-out. Each account stores its own settings, exercise targets, and workouts. Live listeners update open tabs and devices. Firestore saves must be acknowledged before the app clears a workout draft or reports success; delayed saves retain the draft and can be safely retried.

Cloud paths:

```text
users/{uid}/preferences/main
users/{uid}/targets/{exerciseId}
users/{uid}/workouts/{workoutId}
users/{uid}/routines/{dayId}
```

Duplicate workout submissions return the existing record. Workouts can be corrected or deleted from history. Corrections preserve the original session identity and completion date, and use a revision check to reject stale edits from another tab. Deletion requires an in-app confirmation and is permanent. Missing or incomplete Firebase setup produces an actionable error instead of silently saving to local storage. Missing Firebase configuration shows a setup screen instead of opening the planner.

After upgrading to exercise customization and history editing, publish the **full latest `firestore.rules`** before using cloud mode. The app now reads and writes `users/{uid}/routines/{dayId}`, and workout rules allow owner-only corrections and deletion. Earlier rules deny those operations. Publishing only the preferences rule is insufficient.

## Features

- 3-day full-body, 4-day upper/lower, and 5-day push/pull/legs plus upper/lower schedules.
- Choose your own Monday–Sunday training weekdays under **Customize plan**. Pick exactly 3, 4, or 5 days; workouts follow their existing order across the selected days, repeating each week. Other days are recovery days. Older settings retain their default schedule. Switching split length starts with that split’s default weekdays.
- Chest, back, shoulders, arms, legs, and core coverage, with training and recovery days.
- Exercise-specific sets, reps, rest intervals, equipment, form cues, and optional target weights.
- Expandable warm-up and cool-down recommendations for each session.
- Per-set actual weights and reps, completed-set checkboxes, a rest timer, and session notes.
- **Last time** in the workout logger shows each exercise’s most recently saved completed sets, including weights, reps, and the log date. Partial workouts contribute only checked-off sets; bodyweight displays as BW. Comparisons work across splits and custom exercise lists, include earlier logs in the same week, and exclude logs assigned to later training weeks. Exercises without logged sets show an empty-history hint. Corrections and deletions update comparisons automatically.
- Partial session logging and completed-workout tracking, including multiple sessions per day.
- Persistent workout history, best weight/repetition records, and six-week consistency charts.
- **Exercise progress** adds interactive weight and rep charts under **My progress**, with an exercise picker, 6-week/12-week/all-history ranges through the selected training week, and a readable chart-data table. Each point is one saved workout’s heaviest completed set (best reps break ties at the same load); both charts use that same set. Checked-off sets from partial workouts count, unperformed sets do not, and bodyweight-only logs show rep progress without inventing load. Select a point by touch, mouse, or keyboard to inspect its date and values. Corrections and deletions recalculate the charts, including movements no longer in the current plan.
- Edit saved weights, reps, sets, completion checkboxes, and notes from **Workout history → Edit workout**. Progress, personal records, and future progression reflect corrections. Delete a log with confirmation.
- Use **Edit exercises** on each workout day to swap, add, remove, and reorder 1–8 distinct movements from the exercise library. Drag a grip with touch or a mouse to reorder; the editor scrolls near its edges. Arrow buttons and the up/down keys on a focused grip also reorder, and Escape cancels a drag. Save exercises to keep the new order. Changes persist separately for each split’s day and apply to new sessions. Existing sessions and saved history keep their original exercise list. Restore template exercises from the editor.
- Adjustable progression by weight, reps, or sets.
- Keyboard-accessible dialogs, responsive layouts, and mobile bottom navigation.
- Email/password sign-in, account creation, password recovery, and sign-out.
- Cloud history and plan settings scoped to the signed-in user, with live updates.
- Custom weekdays save with plan settings in Firestore. After updating from an earlier version, republish `firestore.rules` to allow the new optional `weekdays` field.

## Progression rules

Targets are suggestions that can be edited. The planner looks at the latest completed session containing an exercise in the previous calendar week. It only progresses when all prescribed sets reached the target and the same weight was used throughout.

- **Weight:** add a rep until the upper end of the exercise range is reached, then suggest up to 2.5 kg for upper-body exercises or 5 kg for legs, capped at 10% of the previous load and rounded down to a 0.25 kg increment. Reps return to the exercise’s starting range after a weight increase.
- **Reps:** add one rep per set up to the exercise’s range.
- **Sets:** add one set, with a five-set maximum.
- Unweighted movements progress by reps. Incomplete sessions do not trigger increases. Missed weeks retain the previous completed target without increasing it. Future workouts do not affect historical weeks.
- A custom target for the selected week overrides the suggestion. Targets also act as starting defaults when there is no completed history for an exercise.

All weights are kilograms. Log one dumbbell’s weight consistently for dumbbell exercises. Bodyweight-only sets do not contribute to the external-load volume total. These are general-purpose editable templates, not individualized coaching. The bounded load-increase approach is informed by [ACSM’s resistance-training progression position stand](https://pubmed.ncbi.nlm.nih.gov/19204579/); the exact app rules are implementation choices.

## Data and privacy

Saved settings, exercise targets, custom exercise lists, and workouts live in Firestore under the signed-in account’s UID. Firestore rules require a matching authenticated UID and validate document shape, exercise IDs, target-document ranges, bounded exercise/set counts, and preserved workout metadata and revisions. Workout prescription weights/reps, per-set values, completion status, and schedule consistency are validated by the shared application validators before saving and after loading; those detailed checks are client-side, not a trusted server boundary. Passwords are handled by Firebase Authentication. The app does not log environment values or passwords. Firebase web configuration is shipped in the browser build; server credentials must not use a `VITE_` prefix.

Unfinished workouts save automatically to this browser’s local storage on every edit. Reopening the app on the same browser and device restores the original exercise list, training week, weights, reps, checked sets, and notes. A recovery banner offers **Continue saved workout** and **Discard draft**; discarding requires confirmation. Each account has its own draft, retained through sign-out and restored on signing back in. Open tabs share changes and draft removal. Existing session-storage drafts migrate automatically. Drafts clear only after an acknowledged cloud save or explicit discard; failed saves retain them. If browser storage is blocked or full, the app warns that recovery after closing is unavailable and keeps editing in memory with a per-tab backup when possible. Clearing site data or using private browsing can remove drafts. Drafts are local to this browser, while completed workouts use Firestore and survive closing the browser. Cloud access uses the Firebase client and Firestore rules directly.

## Verification

```sh
npm test
npm run build
npm run test:firebase
npm run test:setup
```

Browser tests use installed Microsoft Edge and static Vite previews. Firebase tests use port 5176 with Authentication on 9099 and Firestore on 8080; setup-screen tests use port 5174 with Firebase configuration intentionally absent. Each planner browser test has its own emulator account. Screenshots are saved to `test-results/`. Change `channel` in the Playwright configs to use another supported browser.

The Firebase emulator tests require **Java 21 or newer** on your PATH. They use the `demo-form` project, exercise real Auth and Firestore SDK calls, and verify owner-only rules, invalid writes, preserved workout dates, stale-edit protection, editing/deletion, custom exercise lists, idempotent saves, sign-in/out, account isolation, cross-tab updates, and draft retention after failed saves. Test builds disable `.env` loading and inject synthetic configuration; they never connect to the configured production project. `VITE_FIREBASE_USE_EMULATORS=true` can be used for manual local development against the emulators. It is rejected in normal production builds and on non-local hosts.

## Project map

- `src/main.jsx`, `src/App.jsx`, `src/WorkoutApp.jsx` — mounting, authentication entry, and application composition.
- `src/pages/` — authentication, setup, planner, history, and progress screens, each with its own folder and nearby Linaria styles.
- `src/components/` — feature groups containing a folder per component and its styles; shared style-only modules live in `common/styles/`.
- `src/hooks/` — planner state, authentication, draft recovery, drag gestures, and timer lifecycle.
- `src/functions/` — pure session edits, normalization, state validation, and progress calculations.
- `src/utils/` — reusable formatting helpers.
- `src/services/` — Firebase, authentication, cloud storage, browser drafts, and optional browser integration.
- `src/styles.css`, `src/styles/` — plain CSS for fonts, theme variables, resets, and global accessibility; component appearance and responsive rules live in nearby Linaria files.
- `firestore.rules` — account isolation and document validation.
- `firebase.json` — rule deployment and local emulator configuration.
- `.github/workflows/deploy-pages.yml` — build, Firebase configuration checks, and GitHub Pages deployment.
- `shared/catalog/`, `shared/functions/`, `shared/utils/` — exercise/schedule definitions, training rules, validation, metrics, and date helpers.
- `shared/training.mjs` — stable named exports for the shared training API.
- `tests/` — training-rule and browser-flow tests.

See [Code organization](docs/architecture.md) for dependency rules, data flow, and where to make future changes.

The optional `read_training_plan` WebMCP browser tool is feature-detected. Regular browsers do not need WebMCP support.
