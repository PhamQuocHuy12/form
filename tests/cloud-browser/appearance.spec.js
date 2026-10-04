import { test, expect, signIn } from "./fixtures.js";

async function saveTheme(page, label) {
  await page.getByRole("button", { name: "Appearance", exact: true }).click();
  await page.getByRole("radio", { name: label, exact: true }).check();
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
}

test("themes sync between devices, persist on reload and follow each device in System mode", async ({
  page,
  browser,
  cloud,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const secondContext = await browser.newContext({
    baseURL: "http://localhost:5176",
    colorScheme: "dark",
  });
  const second = await secondContext.newPage();
  try {
    await signIn(second, cloud);
    await saveTheme(page, "Light");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(second.locator("html")).toHaveAttribute("data-theme", "light");
    await page.reload();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(
      page.getByRole("button", { name: "Start workout", exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: "test-results/theme-light-desktop.png",
      fullPage: true,
    });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "Appearance", exact: true }).click();
    await expect(
      page.getByRole("radio", { name: "Light", exact: true }),
    ).toBeChecked();
    await page.screenshot({
      path: "test-results/theme-light-mobile-dialog.png",
      fullPage: false,
    });
    await page.getByRole("radio", { name: "Dark", exact: true }).check();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Appearance", exact: true }),
    ).toBeFocused();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);

    await cloud.seedWorkout();
    await page
      .getByRole("button", { name: "My progress", exact: true })
      .click();
    await expect(
      page.getByRole("heading", { name: "Exercise progress", exact: true }),
    ).toBeVisible();
    await expect(page.locator(".trend-point").first()).toBeVisible();
    await page.screenshot({
      path: "test-results/theme-light-mobile-progress.png",
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Weekly planner", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Start workout", exact: true })
      .click();
    await expect(page.getByLabel("Session notes")).toBeVisible();
    await page.screenshot({
      path: "test-results/theme-light-mobile-workout.png",
    });
    await page
      .getByRole("button", { name: "Close dialog", exact: true })
      .click();

    // Saving a plan must not replace appearance preferences.
    await cloud.store.saveSettings({ days: 3, strategy: "reps" });
    await expect(
      page.getByRole("heading", { name: "Full body A" }),
    ).toBeVisible();
    await expect(second.locator("html")).toHaveAttribute("data-theme", "light");
    await saveTheme(page, "System");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(second.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.emulateMedia({ colorScheme: "dark" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await second.emulateMedia({ colorScheme: "light" });
    await expect(second.locator("html")).toHaveAttribute("data-theme", "light");
    await saveTheme(second, "Dark");
    await expect(second.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await saveTheme(page, "Light");
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Sign in", exact: true }),
    ).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("data-theme");
    await page
      .getByRole("button", { name: "Create an account", exact: true })
      .click();
    await page
      .getByLabel("Email", { exact: true })
      .fill(`theme-${Date.now()}@example.test`);
    await page.getByLabel("Password", { exact: true }).fill(cloud.password);
    await page
      .getByRole("button", { name: "Create account", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "Start workout", exact: true }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await page.getByLabel("Email", { exact: true }).fill(cloud.email);
    await page.getByLabel("Password", { exact: true }).fill(cloud.password);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(
      page.getByRole("button", { name: "Resume workout", exact: true }),
    ).toBeVisible();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(errors).toEqual([]);
  } finally {
    await secondContext.close();
  }
});

test("an unconfirmed theme save keeps the selection open and does not apply it", async ({
  page,
}) => {
  test.setTimeout(40000);
  await page.getByRole("button", { name: "Appearance", exact: true }).click();
  await page.getByRole("radio", { name: "Light", exact: true }).check();
  await expect(
    page.getByRole("button", { name: "Save theme", exact: true }),
  ).toBeEnabled();
  await page.route("http://127.0.0.1:8080/**", (route) => route.abort());
  await page.getByRole("button", { name: "Save theme", exact: true }).click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "could not be confirmed",
    { timeout: 22000 },
  );
  await expect(
    page.getByRole("radio", { name: "Light", exact: true }),
  ).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});
