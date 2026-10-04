import { randomUUID } from "node:crypto";
import { test, expect } from "./fixtures.js";
import { monday } from "../../shared/training.mjs";

test("last time shows actual sets on mobile, survives resume and reflects history corrections", async ({
  page,
  cloud,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await cloud.store.saveRoutine({
    id: "upper-a",
    exerciseIds: ["bench", "deadbug", "fly"],
  });
  await page.reload();
  await expect(page.locator(".exercise-row h3")).toHaveText([
    "Barbell bench press",
    "Dead bug",
    "Cable chest fly",
  ]);
  const start = page.getByRole("button", {
    name: "Start workout",
    exact: true,
  });
  await start.click();
  await expect(page.getByText("No previous logged sets.")).toHaveCount(3);
  await page.getByRole("button", { name: "Close dialog" }).click();

  // The previous workout uses another split and unequal, partially completed sets.
  const saved = await cloud.store.saveWorkout({
    id: randomUUID(),
    week: monday(),
    days: 3,
    dayId: "full-a",
    status: "partial",
    notes: "Previous session",
    exercises: [
      {
        id: "bench",
        prescription: { sets: 3, reps: 10, weight: 50 },
        sets: [
          { weight: 50, reps: 10, done: true },
          { weight: 999, reps: 99, done: false },
          { weight: 47.5, reps: 8, done: true },
        ],
      },
      {
        id: "deadbug",
        prescription: { sets: 1, reps: 12, weight: null },
        sets: [{ weight: null, reps: 12, done: true }],
      },
    ],
  });
  await page
    .getByRole("button", { name: "Resume workout", exact: true })
    .click();
  const bench = page.getByRole("region", {
    name: "Last time for Barbell bench press",
  });
  const bodyweight = page.getByRole("region", {
    name: "Last time for Dead bug",
  });
  await expect(bench).toContainText("Partial workout");
  await expect(bench.getByRole("listitem")).toHaveText([
    "Set 150 kg × 10 reps",
    "Set 347.5 kg × 8 reps",
  ]);
  await expect(bench.locator("time")).toHaveAttribute(
    "datetime",
    saved.finishedAt,
  );
  await expect(bodyweight).toContainText("BW × 12 reps");
  await expect(page.getByText("No previous logged sets.")).toHaveCount(1);
  await page
    .getByLabel("Barbell bench press set 1 weight", { exact: true })
    .fill("52.5");
  await page.reload();
  await page
    .getByRole("button", { name: "Resume workout", exact: true })
    .click();
  await expect(bench).toContainText("50 kg × 10 reps");
  await expect(
    page.getByLabel("Barbell bench press set 1 weight", { exact: true }),
  ).toHaveValue("52.5");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: "test-results/last-time-mobile.png" });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.screenshot({ path: "test-results/last-time-desktop.png" });

  // Live corrections update the comparison without overwriting today's inputs.
  const corrected = await cloud.store.updateWorkout({
    ...saved,
    exercises: saved.exercises.map((exercise) => ({
      ...exercise,
      sets: exercise.sets.map((set, index) =>
        exercise.id === "bench" && index === 0
          ? { ...set, weight: 55, reps: 9 }
          : set,
      ),
    })),
  });
  await expect(bench).toContainText("55 kg × 9 reps");
  await expect(
    page.getByLabel("Barbell bench press set 1 weight", { exact: true }),
  ).toHaveValue("52.5");
  await cloud.store.deleteWorkout(corrected);
  await expect(page.getByText("No previous logged sets.")).toHaveCount(3);
});
