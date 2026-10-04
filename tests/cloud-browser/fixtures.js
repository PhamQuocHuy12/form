import { randomUUID } from "node:crypto";
import { test as base, expect } from "@playwright/test";
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { createCloudStore } from "../../src/services/training-store.js";
import { DEFAULT_SETTINGS, PLANS, monday } from "../../shared/training.mjs";

export async function signIn(page, account) {
  await page.goto("/");
  await page.getByLabel("Email", { exact: true }).fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Your week. Your work." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start workout", exact: true }),
  ).toBeVisible();
}

export const test = base.extend({
  cloud: async ({ request }, use) => {
    const account = {
      email: `planner-${randomUUID()}@example.test`,
      password: "TestPassword123!",
    };
    const response = await request.post(
      "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-api-key",
      { data: { ...account, returnSecureToken: true } },
    );
    expect(response.ok()).toBe(true);
    const { localId: uid } = await response.json();
    const environment = await initializeTestEnvironment({
      projectId: "demo-form",
      firestore: { host: "127.0.0.1", port: 8080 },
    });
    const database = environment.authenticatedContext(uid).firestore();
    const store = createCloudStore(database, uid);
    try {
      await use({
        ...account,
        uid,
        store,
        async load() {
          const [settings, targets, workouts, routines] = await Promise.all([
            getDoc(doc(database, "users", uid, "preferences", "main")),
            getDocs(collection(database, "users", uid, "targets")),
            getDocs(collection(database, "users", uid, "workouts")),
            getDocs(collection(database, "users", uid, "routines")),
          ]);
          const map = (snapshot) =>
            Object.fromEntries(
              snapshot.docs.map((item) => [item.id, item.data()]),
            );
          return {
            settings: settings.exists() ? settings.data() : DEFAULT_SETTINGS,
            targets: map(targets),
            routines: map(routines),
            workouts: workouts.docs
              .map((item) => item.data())
              .sort((a, b) => b.finishedAt.localeCompare(a.finishedAt)),
          };
        },
        async seedWorkout() {
          const day = PLANS[3][0];
          return store.saveWorkout({
            id: randomUUID(),
            week: monday(),
            days: 3,
            dayId: day.id,
            title: day.title,
            status: "completed",
            notes: "Earlier workout",
            exercises: day.exercises.map((exercise) => {
              const weight = exercise.id === "bench" ? 50 : null;
              return {
                id: exercise.id,
                prescription: {
                  sets: exercise.sets,
                  reps: exercise.min,
                  weight,
                },
                sets: Array.from({ length: exercise.sets }, () => ({
                  reps: exercise.min,
                  weight,
                  done: true,
                })),
              };
            }),
          });
        },
      });
    } finally {
      await environment.cleanup();
    }
  },
  page: async ({ page, cloud }, use) => {
    await signIn(page, cloud);
    await use(page);
  },
});

export { expect };
