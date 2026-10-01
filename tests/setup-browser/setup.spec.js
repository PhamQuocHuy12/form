import { test, expect } from "@playwright/test";

test("missing Firebase setup blocks the planner without a local storage fallback", async ({
  page,
}) => {
  const localRequests = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname.startsWith("/api/"))
      localRequests.push(request.url());
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Finish Firebase setup" }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText(
    "Firebase setup is required",
  );
  await expect(
    page.getByRole("button", { name: "Start workout", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Retry", exact: true }),
  ).toBeVisible();
  expect(localRequests).toEqual([]);
});
