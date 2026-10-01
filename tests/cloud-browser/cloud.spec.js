import { test, expect } from "@playwright/test";

test("cloud sign-in, workout persistence, account isolation, and draft recovery", async ({
  page,
  context,
}) => {
  test.setTimeout(60000);
  const apiRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/api/"))
      apiRequests.push(request.url());
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await page.screenshot({
    path: "test-results/firebase-signin-mobile.png",
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  const email = `trainer-${Date.now()}@example.test`;
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Your week. Your work." }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Edit Barbell bench press target" })
    .click();
  await page.getByLabel("Weight (kg)").fill("40");
  await page.getByRole("button", { name: "Save target" }).click();
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await page.getByLabel("Session notes").fill("Private cloud workout");
  await page
    .getByLabel("Complete Barbell bench press set 1", { exact: true })
    .check();
  await page.getByRole("button", { name: "Save partial workout" }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.reload();
  await page.getByRole("button", { name: "Workout history" }).click();
  await page.locator(".history-item summary").click();
  await expect(
    page.getByText("Private cloud workout", { exact: true }),
  ).toBeVisible();
  // Live subscriptions update another browser tab using the same signed-in account.
  const other = await context.newPage();
  await other.goto("/");
  await other
    .getByRole("button", { name: "Edit Barbell bench press target" })
    .click();
  await other.getByLabel("Weight (kg)").fill("45");
  await other.getByRole("button", { name: "Save target" }).click();
  await page
    .getByRole("button", { name: "Weekly planner", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Edit Barbell bench press target" }),
  ).toContainText("45 kg");
  await other
    .getByRole("button", { name: "Customize plan", exact: true })
    .click();
  for (const weekday of ["Monday", "Thursday", "Wednesday", "Sunday"]) {
    await other.getByRole("button", { name: weekday, exact: true }).click();
  }
  await other.getByRole("button", { name: "Save my plan" }).click();
  await expect(other.getByRole("dialog")).toHaveCount(0);
  await expect(
    page
      .locator(".week-strip")
      .getByRole("button", { name: "Tue: Upper body A", exact: true }),
  ).toBeEnabled();
  await page.reload();
  await expect(
    page
      .locator(".week-strip")
      .getByRole("button", { name: "Sun: Lower body B", exact: true }),
  ).toBeEnabled();
  await other.close();
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await page.getByLabel("Session notes").fill("Account-specific draft");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await page
    .getByLabel("Email", { exact: true })
    .fill(`second-${Date.now()}@example.test`);
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start workout", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Workout history" }).click();
  await expect(page.locator(".history-item")).toHaveCount(0);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await page.getByLabel("Email", { exact: true }).fill(email);
  await page.getByLabel("Password", { exact: true }).fill("Incorrect123!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("incorrect");
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page
    .getByRole("button", { name: "Resume workout", exact: true })
    .click();
  await expect(page.getByLabel("Session notes")).toHaveValue(
    "Account-specific draft",
  );
  await page
    .getByLabel("Complete Barbell bench press set 1", { exact: true })
    .check();
  await page.route("http://127.0.0.1:8080/**", (route) => route.abort());
  await page.getByRole("button", { name: "Save partial workout" }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    /could not|not be|confirmed|unavailable/,
    { timeout: 22000 },
  );
  await expect(page.getByLabel("Session notes")).toHaveValue(
    "Account-specific draft",
  );
  await page.unroute("http://127.0.0.1:8080/**");
  expect(apiRequests).toEqual([]);
});

test("password recovery presents an account-neutral confirmation", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Forgot password?" }).click();
  await page.getByLabel("Email", { exact: true }).fill("recovery@example.test");
  await page.getByRole("button", { name: "Send reset link" }).click();
  await expect(page.getByRole("status")).toContainText("password reset link");
});

test("custom exercise plans and history corrections sync between signed-in tabs", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await page
    .getByLabel("Email", { exact: true })
    .fill(`custom-${Date.now()}@example.test`);
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Edit exercises", exact: true })
    .click();
  await page.getByLabel("Exercise 3", { exact: true }).selectOption("facepull");
  await page
    .getByRole("button", { name: "Remove Rope triceps pushdown", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Move Cable face pull up", exact: true })
    .click();
  await page.getByLabel("Add a movement").selectOption("deadbug");
  await page.getByRole("button", { name: "Add exercise", exact: true }).click();
  await page
    .getByRole("button", { name: "Save exercises", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  const other = await context.newPage();
  await other.goto("/");
  const expected = [
    "Barbell bench press",
    "Cable face pull",
    "Seated cable row",
    "Lat pulldown",
    "Dumbbell biceps curl",
    "Dead bug",
  ];
  await expect(other.locator(".exercise-row h3")).toHaveText(expected);
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await page
    .getByLabel("Complete Barbell bench press set 1", { exact: true })
    .check();
  await page.getByLabel("Session notes").fill("Cloud correction");
  await page
    .getByRole("button", { name: "Save partial workout", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  for (const tab of [page, other]) {
    await tab
      .getByRole("button", { name: "Workout history", exact: true })
      .click();
    await tab.locator(".history-item summary").click();
  }
  await page.getByRole("button", { name: "Edit workout", exact: true }).click();
  await page
    .getByLabel("Barbell bench press set 1 weight", { exact: true })
    .fill("60");
  await page.getByLabel("Session notes").fill("Corrected cloud workout");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(other.locator(".history-item")).toContainText(
    "Corrected cloud workout",
  );
  await expect(other.locator(".history-item")).toContainText("60 kg");
  await other
    .getByRole("button", { name: "Delete workout", exact: true })
    .click();
  await other
    .getByRole("button", { name: "Delete permanently", exact: true })
    .click();
  await expect(other.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".history-item")).toHaveCount(0);
  await page.reload();
  await expect(page.locator(".exercise-row h3")).toHaveText(expected);
  await page
    .getByRole("button", { name: "Workout history", exact: true })
    .click();
  await expect(page.locator(".history-item")).toHaveCount(0);
  await other.close();
});
