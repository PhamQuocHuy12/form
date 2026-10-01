import { test, expect } from "@playwright/test";

test("signup explains missing Firebase Authentication configuration", async ({
  page,
}) => {
  await page.route("**/identitytoolkit.googleapis.com/**", (route) =>
    route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({
        error: {
          code: 400,
          message: "CONFIGURATION_NOT_FOUND",
          errors: [
            {
              message: "CONFIGURATION_NOT_FOUND",
              domain: "global",
              reason: "invalid",
            },
          ],
        },
      }),
    }),
  );
  await page.goto("/");
  await page
    .getByRole("button", { name: "Create an account", exact: true })
    .click();
  await page
    .getByLabel("Email", { exact: true })
    .fill("configuration-test@example.test");
  await page.getByLabel("Password", { exact: true }).fill("TestPassword123!");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await expect(page.getByRole("alert")).toContainText(
    "Firebase Authentication is not configured",
  );
  await expect(page.getByRole("alert")).toContainText("enable Email/Password");
  await expect(
    page.getByRole("button", { name: "Create account", exact: true }),
  ).toBeEnabled();
});
