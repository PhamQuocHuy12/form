import { test, expect } from "@playwright/test";

test("mobile planning, logging, persistence, progression and desktop layout", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Your week. Your work." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Start workout", exact: true }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/planner-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Customize plan", exact: true })
    .click();
  await page.getByRole("button", { name: "3 Full body" }).click();
  await page.getByRole("button", { name: "Save my plan" }).click();
  await expect(
    page.getByRole("heading", { name: "Full body A" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Customize plan", exact: true })
    .click();
  await page.getByRole("button", { name: "5 Push / pull +" }).click();
  await page.getByRole("button", { name: "Save my plan" }).click();
  await expect(page.getByRole("heading", { name: "Push day" })).toBeVisible();
  await page
    .getByRole("button", { name: "Customize plan", exact: true })
    .click();
  await page.getByRole("button", { name: "4 Upper / lower" }).click();
  await page.getByRole("button", { name: "Save my plan" }).click();
  await page
    .getByRole("button", { name: "Edit Barbell bench press target" })
    .click();
  await page.getByLabel("Weight (kg)").fill("50");
  await page.getByLabel("Reps", { exact: true }).fill("10");
  await page.getByRole("button", { name: "Save target" }).click();
  await expect(
    page.getByRole("button", { name: "Edit Barbell bench press target" }),
  ).toContainText("50 kg");
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await page
    .getByLabel("Session notes")
    .fill("Mobile test: controlled reps, good energy.");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.reload();
  await page.getByRole("button", { name: "Resume workout" }).click();
  await expect(page.getByLabel("Session notes")).toHaveValue(
    "Mobile test: controlled reps, good energy.",
  );
  await page.screenshot({
    path: "test-results/session-mobile.png",
    fullPage: true,
  });
  const complete = page.getByRole("button", {
    name: "Mark all sets complete",
    exact: true,
  });
  const exerciseCount = await complete.count();
  for (let i = 0; i < exerciseCount; i++) await complete.first().click();
  await page.getByRole("button", { name: "Finish workout" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".completion-count")).toHaveText("1/ 4");
  await page.getByRole("button", { name: "Workout history" }).click();
  await page.locator(".history-item summary").click();
  await expect(
    page.getByText("Mobile test: controlled reps, good energy."),
  ).toBeVisible();
  await page.reload();
  await page.getByRole("button", { name: "Workout history" }).click();
  await expect(page.locator(".history-item")).toHaveCount(1);
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(
    page.locator(".record").filter({ hasText: "Barbell bench press" }),
  ).toContainText("50");
  await page
    .getByRole("button", { name: "Weekly planner", exact: true })
    .click();
  await page.getByRole("button", { name: "Next week" }).click();
  await expect(
    page.getByRole("button", { name: "Edit Barbell bench press target" }),
  ).toContainText("52.5 kg");
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.screenshot({
    path: "test-results/planner-desktop.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await page.screenshot({
    path: "test-results/progress-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("API rejects invalid input and duplicate saves are idempotent", async ({
  request,
}) => {
  const state = await (await request.get("/api/state")).json();
  const saved = state.workouts[0];
  expect(saved).toBeTruthy();
  const duplicate = await request.post("/api/workouts", { data: saved });
  expect(duplicate.status()).toBe(200);
  const after = await (await request.get("/api/state")).json();
  expect(after.workouts).toHaveLength(1);
  expect(
    (
      await request.put("/api/settings", {
        data: { days: 99, strategy: "weight" },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/workouts", {
        data: { ...saved, status: "completed", exercises: [] },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.put("/api/settings", {
        headers: { Origin: "https://example.com" },
        data: state.settings,
      })
    ).status(),
  ).toBe(403);
});
