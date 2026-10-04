import { test, expect } from "./fixtures.js";

const resume = (page) =>
  page.getByRole("button", { name: "Continue saved workout", exact: true });
const notes = (page) => page.getByLabel("Session notes");

test("drafts recover after closing a tab and restarting the browser context, then clear after acknowledged saving", async ({
  page,
  context,
  browser,
  cloud,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await notes(page).fill("Recover after browser restart");
  await page
    .getByLabel("Barbell bench press set 1 weight", { exact: true })
    .fill("52.5");
  await page
    .getByLabel("Barbell bench press set 2 reps", { exact: true })
    .fill("");
  await page
    .getByLabel("Complete Barbell bench press set 1", { exact: true })
    .check();
  const workoutId = await page.evaluate(() => {
    const key = Object.keys(localStorage).find((entry) =>
      entry.startsWith("form-session:"),
    );
    return JSON.parse(localStorage.getItem(key)).session.id;
  });
  await page.close();
  const reopened = await context.newPage();
  await reopened.goto("/");
  await expect(resume(reopened)).toBeVisible();
  await expect(
    reopened.getByRole("region", { name: "Unfinished workout" }),
  ).toContainText("1 set logged");
  await reopened.setViewportSize({ width: 320, height: 740 });
  expect(
    await reopened.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await reopened.screenshot({ path: "data/draft-recovery-mobile.png" });
  await resume(reopened).click();
  await expect(notes(reopened)).toHaveValue("Recover after browser restart");
  await expect(
    reopened.getByLabel("Barbell bench press set 2 reps", { exact: true }),
  ).toHaveValue("");

  // A fresh context has no per-tab state. Only persistent site data is restored.
  const storageState = await context.storageState();
  const restarted = await browser.newContext({
    storageState,
    baseURL: "http://localhost:5176",
  });
  try {
    const fresh = await restarted.newPage();
    await fresh.goto("/");
    await fresh.getByLabel("Email", { exact: true }).fill(cloud.email);
    await fresh.getByLabel("Password", { exact: true }).fill(cloud.password);
    await fresh.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(resume(fresh)).toBeVisible();
    await resume(fresh).click();
    await expect(notes(fresh)).toHaveValue("Recover after browser restart");
    await expect(
      fresh.getByLabel("Barbell bench press set 1 weight", { exact: true }),
    ).toHaveValue("52.5");
    await expect(
      fresh.getByLabel("Complete Barbell bench press set 1", { exact: true }),
    ).toBeChecked();
    await fresh
      .getByLabel("Barbell bench press set 2 reps", { exact: true })
      .fill("8");
    await fresh
      .getByRole("button", { name: "Save partial workout", exact: true })
      .click();
    await expect(fresh.getByRole("dialog")).toHaveCount(0);
    await expect(resume(fresh)).toHaveCount(0);
    expect((await cloud.load()).workouts[0].id).toBe(workoutId);
    await fresh.reload();
    await expect(
      fresh.getByRole("button", { name: "Start workout", exact: true }),
    ).toBeVisible();
  } finally {
    await restarted.close();
  }
  await expect(resume(reopened)).toHaveCount(0);
  await reopened.close();
});

test("draft edits synchronize across tabs and discarding requires confirmation without restoring a stale copy", async ({
  page,
  context,
}) => {
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await notes(page).fill("Shared unfinished session");
  const other = await context.newPage();
  await other.goto("/");
  await resume(other).click();
  await expect(notes(other)).toHaveValue("Shared unfinished session");
  await other
    .getByLabel("Barbell bench press set 1 weight", { exact: true })
    .fill("45");
  await expect(
    page.getByLabel("Barbell bench press set 1 weight", { exact: true }),
  ).toHaveValue("45");
  await notes(page).fill("Updated in first tab");
  await expect(notes(other)).toHaveValue("Updated in first tab");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page
    .getByRole("button", { name: "Discard draft", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep workout", exact: true }).click();
  await expect(resume(page)).toBeVisible();
  await page
    .getByRole("button", { name: "Discard draft", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Discard unfinished workout", exact: true })
    .click();
  await expect(resume(page)).toHaveCount(0);
  await expect(other.getByRole("dialog")).toHaveCount(0);
  await other.reload();
  await expect(
    other.getByRole("button", { name: "Start workout", exact: true }),
  ).toBeVisible();
  await expect(resume(other)).toHaveCount(0);
  await other.close();
});

test("storage failures warn clearly while retaining entered sets and notes in this tab", async ({
  page,
}) => {
  await page.evaluate(() => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (key, value) {
      if (this === localStorage && key.startsWith("form-session:"))
        throw new DOMException("Full", "QuotaExceededError");
      return original.call(this, key, value);
    };
  });
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await notes(page).fill("Protected by tab fallback");
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    "Keep this tab open",
  );
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.reload();
  await resume(page).click();
  await expect(notes(page)).toHaveValue("Protected by tab fallback");
  await expect(page.getByRole("dialog").getByRole("alert")).toHaveCount(0);
});

test("failed cloud saves retain recoverable drafts after closing and can be retried without duplicates", async ({
  page,
  context,
  cloud,
}) => {
  test.setTimeout(60000);
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await notes(page).fill("Recover even when saving fails");
  await page
    .getByLabel("Barbell bench press set 1 weight", { exact: true })
    .fill("45");
  await page
    .getByLabel("Complete Barbell bench press set 1", { exact: true })
    .check();
  await page.route("http://127.0.0.1:8080/**", (route) => route.abort());
  await page
    .getByRole("button", { name: "Save partial workout", exact: true })
    .click();
  await expect(page.getByRole("dialog").getByRole("alert")).toContainText(
    /could not|confirmed|unavailable/,
    { timeout: 22000 },
  );
  await page.close();
  const reopened = await context.newPage();
  try {
    await reopened.goto("/");
    await resume(reopened).click();
    await expect(notes(reopened)).toHaveValue("Recover even when saving fails");
    await expect(
      reopened.getByLabel("Barbell bench press set 1 weight", { exact: true }),
    ).toHaveValue("45");
    await reopened
      .getByRole("button", { name: "Save partial workout", exact: true })
      .click();
    await expect(reopened.getByRole("dialog")).toHaveCount(0);
    expect((await cloud.load()).workouts).toHaveLength(1);
    await expect(resume(reopened)).toHaveCount(0);
  } finally {
    await reopened.close();
  }
});

test("legacy drafts migrate in the browser and malformed saved data does not crash recovery", async ({
  page,
}) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page
    .getByRole("button", { name: "Start workout", exact: true })
    .click();
  await notes(page).fill("Legacy unfinished workout");
  await page.getByRole("button", { name: "Close dialog" }).click();
  await page.evaluate(() => {
    const key = Object.keys(localStorage).find((entry) =>
      entry.startsWith("form-session:"),
    );
    sessionStorage.setItem(
      key,
      JSON.stringify(JSON.parse(localStorage.getItem(key)).session),
    );
    localStorage.removeItem(key);
  });
  await page.reload();
  await resume(page).click();
  await expect(notes(page)).toHaveValue("Legacy unfinished workout");
  expect(
    await page.evaluate(() =>
      Object.keys(sessionStorage).some((key) =>
        key.startsWith("form-session:"),
      ),
    ),
  ).toBe(false);
  await page.evaluate(() => {
    const key = Object.keys(localStorage).find((entry) =>
      entry.startsWith("form-session:"),
    );
    localStorage.setItem(
      key,
      JSON.stringify({ version: 1, session: { id: "broken-draft" } }),
    );
  });
  await page.reload();
  await expect(page.getByRole("alert")).toContainText("could not be recovered");
  await expect(
    page.getByRole("button", { name: "Start workout", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
