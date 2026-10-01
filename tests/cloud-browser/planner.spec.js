import { test, expect, signIn } from "./fixtures.js";
import { EXERCISES, PLANS, WEEKDAYS } from "../../shared/training.mjs";

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

test("custom weekdays for all splits persist and keep workout history", async ({
  page,
  cloud,
}) => {
  await cloud.seedWorkout();
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto("/");
  for (const days of [3, 4, 5]) {
    const weekdays = Array.from({ length: days }, (_, i) => 7 - days + i);
    await page
      .getByRole("button", { name: "Customize plan", exact: true })
      .click();
    await page
      .getByRole("button", {
        name:
          days === 3
            ? "3 Full body"
            : days === 4
              ? "4 Upper / lower"
              : "5 Push / pull +",
      })
      .click();
    await page.getByRole("button", { name: "Monday", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Save my plan" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Monday", exact: true }).click();
    for (const [index, name] of WEEKDAYS.entries()) {
      const button = page.getByRole("button", { name, exact: true });
      const selected = (await button.getAttribute("aria-pressed")) === "true";
      if (selected !== weekdays.includes(index)) await button.click();
    }
    await expect(
      page.getByRole("status").filter({ hasText: "days selected" }),
    ).toContainText(`${days} of ${days}`);
    await expect(
      page
        .getByRole("list", { name: "Weekly schedule preview" })
        .getByRole("listitem"),
    ).toHaveCount(days);
    if (days === 5)
      await page.screenshot({
        path: "test-results/custom-weekdays-mobile.png",
        fullPage: true,
      });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.getByRole("button", { name: "Save my plan" }).click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.reload();
    for (const [index, name] of WEEKDAYS.entries()) {
      const workoutIndex = weekdays.indexOf(index);
      const title =
        workoutIndex < 0 ? "Recovery" : PLANS[days][workoutIndex].title;
      const tile = page.locator(".week-strip").getByRole("button", {
        name: new RegExp(`^${name.slice(0, 3)}: ${title}`),
      });
      if (workoutIndex < 0) await expect(tile).toBeDisabled();
      else {
        await expect(tile).toBeEnabled();
        await tile.click();
        await expect(page.locator(".section-kicker")).toContainText(
          name.slice(0, 3).toUpperCase(),
        );
        await expect(
          page.getByRole("heading", { name: title, exact: false }),
        ).toBeVisible();
      }
    }
    const state = await cloud.load();
    expect(state.settings.weekdays).toEqual(weekdays);
    expect(state.workouts).toHaveLength(1);
  }
});

test("customizes exercises and corrects or deletes history with updated records", async ({
  page,
  cloud,
}) => {
  test.setTimeout(60000);
  await cloud.seedWorkout();
  await cloud.store.saveSettings({ days: 5, strategy: "weight" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Edit exercises", exact: true })
    .click();
  await page.getByLabel("Exercise 1", { exact: true }).selectOption("fly");
  await page
    .getByRole("button", { name: "Remove Incline dumbbell press", exact: true })
    .click();
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", {
        name: "Move Rope triceps pushdown up",
        exact: true,
      })
      .click();
  await page.getByLabel("Add a movement").selectOption("curl");
  await page.getByRole("button", { name: "Add exercise", exact: true }).click();
  await page.getByLabel("Add a movement").selectOption("dbrow");
  await page.getByRole("button", { name: "Add exercise", exact: true }).click();
  await page.screenshot({
    path: "test-results/exercise-editor-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Save exercises", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  const expected = [
    "Rope triceps pushdown",
    "Cable chest fly",
    "Dumbbell shoulder press",
    "Dumbbell lateral raise",
    "Dumbbell biceps curl",
    "Dumbbell row",
  ];
  await expect(page.locator(".exercise-row h3")).toHaveText(expected);
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await page
    .getByLabel("Rope triceps pushdown set 1 weight", { exact: true })
    .fill("30");
  await page.getByLabel("Session notes").fill("Customized workout");
  await page.getByRole("button", { name: "Close dialog" }).click();
  // Changing a future plan must not change the session already in progress.
  await page
    .getByRole("button", { name: "Edit exercises", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Remove Cable chest fly", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Save exercises", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Resume workout", exact: true })
    .click();
  await expect(page.locator(".log-exercise summary strong")).toHaveText(
    expected,
  );
  const complete = page.getByRole("button", {
    name: "Mark all sets complete",
    exact: true,
  });
  while (await complete.count()) await complete.first().click();
  await page
    .getByRole("button", { name: "Finish workout", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Workout history", exact: true })
    .click();
  const item = page.locator(".history-item").first();
  await item.locator("summary").click();
  await item.getByRole("button", { name: "Edit workout", exact: true }).click();
  await page.getByLabel("Session notes").fill("Canceled correction");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await expect(item).toContainText("Customized workout");
  const before = await cloud.load();
  const original = before.workouts[0];
  await item.getByRole("button", { name: "Edit workout", exact: true }).click();
  await page
    .getByLabel("Rope triceps pushdown set 1 weight", { exact: true })
    .fill("60");
  await page
    .getByLabel("Rope triceps pushdown set 1 reps", { exact: true })
    .fill("14");
  const firstExercise = page.locator(".log-exercise").first();
  await firstExercise
    .getByRole("button", { name: "Add set", exact: true })
    .click();
  await page
    .getByLabel("Complete Rope triceps pushdown set 3", { exact: true })
    .check();
  await page.getByLabel("Session notes").fill("Corrected workout");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const corrected = await cloud.load();
  expect(corrected.workouts[0].finishedAt).toEqual(original.finishedAt);
  expect(corrected.workouts[0].revision).toBe(1);
  expect(corrected.workouts[0].exercises[0].sets).toHaveLength(3);
  await page.reload();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(
    page.locator(".record").filter({ hasText: "Rope triceps pushdown" }),
  ).toContainText("60");
  await page
    .getByRole("button", { name: "Workout history", exact: true })
    .click();
  await page.locator(".history-item").first().locator("summary").click();
  await page
    .locator(".history-item")
    .first()
    .getByRole("button", { name: "Delete workout", exact: true })
    .click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.locator(".history-item")).toHaveCount(2);
  await page
    .locator(".history-item")
    .first()
    .getByRole("button", { name: "Delete workout", exact: true })
    .click();
  const deleteUrl = "http://127.0.0.1:8080/**";
  await page.route(deleteUrl, (route) => route.abort());
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    /could not|confirmed|unavailable/,
    { timeout: 22000 },
  );
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.unroute(deleteUrl);
  await page
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".history-item")).toHaveCount(1);
  await page.reload();
  await page.getByRole("button", { name: "My progress", exact: true }).click();
  await expect(
    page.locator(".record").filter({ hasText: "Rope triceps pushdown" }),
  ).toHaveCount(0);
  await expect(
    page.locator(".record").filter({ hasText: "Barbell bench press" }),
  ).toContainText("50");
  await page.setViewportSize({ width: 320, height: 740 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("dragging exercises with a mouse supports cancellation, keyboard moves and saved order", async ({
  page,
  cloud,
}) => {
  const initial = ["bench", "incline", "fly", "row"];
  await cloud.store.saveSettings({ days: 3, strategy: "weight" });
  await cloud.store.saveRoutine({ id: "full-a", exerciseIds: initial });
  await page.setViewportSize({ width: 1280, height: 1000 });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Edit exercises", exact: true })
    .click();
  const choices = page.locator(".routine-editor select");
  const order = () =>
    choices.evaluateAll((elements) => elements.map((element) => element.value));
  const grip = page.getByRole("button", {
    name: "Drag Barbell bench press to reorder",
    exact: true,
  });
  const start = await grip.boundingBox();
  const destination = await page
    .locator(".routine-editor li")
    .nth(2)
    .boundingBox();
  await page.mouse.move(start.x + start.width / 2, start.y + start.height / 2);
  await page.mouse.down();
  await page.mouse.move(
    start.x + start.width / 2,
    destination.y + destination.height / 2 + 15,
    { steps: 12 },
  );
  await expect(page.locator(".routine-drag-preview")).toBeVisible();
  await expect(page.locator(".drop-after")).toHaveCount(1);
  await page.mouse.up();
  await expect.poll(order).toEqual(["incline", "fly", "bench", "row"]);

  const moved = await grip.boundingBox();
  const first = await page.locator(".routine-editor li").first().boundingBox();
  await page.mouse.move(moved.x + moved.width / 2, moved.y + moved.height / 2);
  await page.mouse.down();
  await page.mouse.move(moved.x + moved.width / 2, first.y + 10, { steps: 10 });
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(page.locator(".routine-drag-preview")).toHaveCount(0);
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect.poll(order).toEqual(["incline", "fly", "bench", "row"]);

  await grip.focus();
  await page.keyboard.press("ArrowUp");
  await expect.poll(order).toEqual(["incline", "bench", "fly", "row"]);
  await expect(grip).toBeFocused();
  await expect(page.locator('[aria-live="polite"]')).toContainText(
    "position 2 of 4",
  );
  await page
    .getByRole("button", { name: "Save exercises", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".exercise-row h3")).toHaveText(
    ["incline", "bench", "fly", "row"].map((id) => EXERCISES[id].name),
  );
});

test("touch dragging scrolls a long exercise list and canceled touches keep its order", async ({
  browser,
  cloud,
}) => {
  const initial = [
    "bench",
    "incline",
    "fly",
    "row",
    "pulldown",
    "dbrow",
    "press",
    "lateral",
  ];
  await cloud.store.saveSettings({ days: 3, strategy: "weight" });
  await cloud.store.saveRoutine({ id: "full-a", exerciseIds: initial });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    baseURL: "http://localhost:5176",
    hasTouch: true,
  });
  try {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await signIn(page, cloud);
    await page
      .getByRole("button", { name: "Edit exercises", exact: true })
      .click();
    const touch = await context.newCDPSession(page);
    const handle = await page
      .getByRole("button", {
        name: "Drag Barbell bench press to reorder",
        exact: true,
      })
      .boundingBox();
    const panel = await page.getByRole("dialog").boundingBox();
    const x = handle.x + handle.width / 2;
    const bottom = panel.y + panel.height - 18;
    const point = (y) => [{ x, y, id: 1 }];
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: point(handle.y + handle.height / 2),
    });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: point(bottom),
    });
    await expect(page.locator(".routine-drag-preview")).toBeVisible();
    await expect
      .poll(() =>
        page.getByRole("dialog").evaluate((element) => element.scrollTop),
      )
      .toBeGreaterThan(100);
    await expect
      .poll(async () => {
        const last = await page
          .locator(".routine-editor li")
          .last()
          .boundingBox();
        return last.y + last.height / 2 < bottom;
      })
      .toBe(true);
    await expect(page.locator(".routine-drag-preview")).toContainText(
      "Position 8 of 8",
    );
    await page.screenshot({ path: "test-results/exercise-drag-mobile.png" });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    const expected = [...initial.slice(1), initial[0]];
    const order = () =>
      page
        .locator(".routine-editor select")
        .evaluateAll((elements) => elements.map((element) => element.value));
    await expect.poll(order).toEqual(expected);

    await page.getByRole("dialog").evaluate((element) => {
      element.scrollTop = 0;
    });
    const first = await page.locator(".routine-grip").first().boundingBox();
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: point(first.y + first.height / 2),
    });
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: point(first.y + first.height + 160),
    });
    await expect(page.locator(".routine-drag-preview")).toBeVisible();
    await touch.send("Input.dispatchTouchEvent", {
      type: "touchCancel",
      touchPoints: [],
    });
    await expect(page.locator(".routine-drag-preview")).toHaveCount(0);
    await expect.poll(order).toEqual(expected);
    await page.setViewportSize({ width: 320, height: 740 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page
      .getByRole("button", { name: "Save exercises", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.reload();
    await expect(page.locator(".exercise-row h3")).toHaveText(
      expected.map((id) => EXERCISES[id].name),
    );
    expect(errors).toEqual([]);
  } finally {
    await context.close();
  }
});
