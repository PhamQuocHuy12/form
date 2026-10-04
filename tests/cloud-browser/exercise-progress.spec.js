import { randomUUID } from "node:crypto";
import { initializeTestEnvironment } from "@firebase/rules-unit-testing";
import { doc, setDoc } from "firebase/firestore";
import { test, expect } from "./fixtures.js";
import { monday, shiftDate } from "../../shared/training.mjs";

test("exercise charts display real history, ranges, keyboard inspection, bodyweight and live corrections", async ({
  page,
  cloud,
}) => {
  const week = monday();
  const environment = await initializeTestEnvironment({
    projectId: "demo-form",
    firestore: { host: "127.0.0.1", port: 8080 },
  });
  const database = environment.authenticatedContext(cloud.uid).firestore();
  const make = (offset, weight, reps) => ({
    id: randomUUID(),
    week: shiftDate(week, offset * 7),
    days: 3,
    dayId: "full-a",
    title: "Full body A",
    finishedAt: new Date(
      Math.min(
        Date.parse(`${shiftDate(week, offset * 7)}T12:00:00.000Z`),
        Date.now() - 1000,
      ),
    ).toISOString(),
    notes: "Chart history",
    status: "partial",
    exercises: [
      {
        id: "bench",
        prescription: { sets: 3, reps: 10, weight },
        sets: [
          { weight: weight - 5, reps: 15, done: true },
          { weight, reps, done: true },
          { weight: 999, reps: 99, done: false },
        ],
      },
      {
        id: "deadbug",
        prescription: { sets: 1, reps: 12, weight: null },
        sets: [{ weight: null, reps: 12 + offset + 6, done: true }],
      },
    ],
  });
  const logs = [
    make(-6, 40, 12),
    make(-4, 45, 10),
    make(-2, 50, 8),
    make(0, 52.5, 9),
  ];
  try {
    for (const workout of logs)
      await setDoc(
        doc(database, "users", cloud.uid, "workouts", workout.id),
        workout,
      );
    await page
      .getByRole("button", { name: "My progress", exact: true })
      .click();
    const card = page.getByRole("region", {
      name: "Exercise progress",
      exact: true,
    });
    await card.getByLabel("Progress exercise").selectOption("bench");
    const weight = card.getByRole("region", {
      name: "Weight over time",
      exact: true,
    });
    const reps = card.getByRole("region", {
      name: "Reps over time",
      exact: true,
    });
    await expect(weight.getByRole("button")).toHaveCount(3);
    await expect(reps.getByRole("button")).toHaveCount(3);
    await expect(card.locator(".exercise-trend-selection")).toContainText(
      "52.5 kg × 9 reps",
    );
    await weight.getByRole("button").first().focus();
    await expect(card.locator(".exercise-trend-selection")).toContainText(
      "45 kg × 10 reps",
    );
    await weight.getByRole("button").first().press("ArrowRight");
    await expect(card.locator(".exercise-trend-selection")).toContainText(
      "50 kg × 8 reps",
    );
    await card.getByLabel("Progress range").selectOption("12");
    await expect(weight.getByRole("button")).toHaveCount(4);
    await card.getByLabel("Progress range").selectOption("all");
    await expect(weight.getByRole("button")).toHaveCount(4);
    await card.getByText("View chart data", { exact: false }).click();
    await expect(card.locator("tbody tr")).toHaveCount(4);
    await expect(card.locator("tbody tr").last()).toContainText("52.5 kg");
    await expect(card.locator("tbody tr").last()).toContainText("Partial");
    await expect(card).not.toContainText("999");

    await page.setViewportSize({ width: 1280, height: 1000 });
    await card.scrollIntoViewIfNeeded();
    await card.screenshot({ path: "data/exercise-progress-desktop.png" });
    await page.setViewportSize({ width: 390, height: 844 });
    await card.screenshot({ path: "data/exercise-progress-mobile.png" });
    await page.setViewportSize({ width: 320, height: 740 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const firstPoint = weight.getByRole("button").first();
    await firstPoint.scrollIntoViewIfNeeded();
    const marker = await firstPoint.locator(".trend-point").boundingBox();
    // The larger invisible tap area also accepts a press beside the tiny marker.
    await page.mouse.click(
      marker.x + marker.width / 2 + 10,
      marker.y + marker.height / 2 + 10,
    );
    await expect(card.locator(".exercise-trend-selection")).toContainText(
      "40 kg × 12 reps",
    );

    const latest = logs.at(-1);
    const corrected = await cloud.store.updateWorkout({
      ...latest,
      exercises: latest.exercises.map((exercise) => ({
        ...exercise,
        sets: exercise.sets.map((set, index) =>
          exercise.id === "bench" && index === 1
            ? { ...set, weight: 55, reps: 7 }
            : set,
        ),
      })),
    });
    await expect(card.locator("tbody tr").last()).toContainText("55 kg");
    await expect(card.locator("tbody tr").last()).toContainText("7");
    await cloud.store.deleteWorkout(corrected);
    await expect(weight.getByRole("button")).toHaveCount(3);
    await expect(card.locator("tbody tr")).toHaveCount(3);
    await card.getByLabel("Progress exercise").selectOption("deadbug");
    await expect(
      weight.getByText("Bodyweight only", { exact: true }),
    ).toBeVisible();
    await expect(reps.getByRole("button")).toHaveCount(3);
    await expect(card.locator(".exercise-trend-selection")).toContainText(
      "BW × 16 reps",
    );
    await card.getByLabel("Progress exercise").selectOption("fly");
    await expect(card).toContainText("No logged sets in this range");

    // A selected historic week excludes workouts assigned to later weeks.
    await card.getByLabel("Progress exercise").selectOption("bench");
    for (let index = 0; index < 5; index++)
      await page
        .getByRole("button", { name: "Previous week", exact: true })
        .click();
    await expect(weight.getByRole("button")).toHaveCount(1);
    await expect(card).toContainText("Your first benchmark");
  } finally {
    await environment.cleanup();
  }
});
