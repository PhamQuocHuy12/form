import { test, expect } from "@playwright/test";
import { readFile, writeFile } from "node:fs/promises";

async function openApp(page) {
  await page.goto("./");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
}

async function readyWorker(page) {
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((resolve) =>
        navigator.serviceWorker.addEventListener("controllerchange", resolve, {
          once: true,
        }),
      );
  });
}

test("manifest, icons, and worker resolve under the GitHub Pages subpath", async ({
  page,
  request,
}) => {
  await openApp(page);
  const manifestURL = await page
    .locator('link[rel="manifest"]')
    .getAttribute("href");
  expect(manifestURL).toBe("/form/manifest.webmanifest");
  const response = await request.get(manifestURL);
  expect(response.ok()).toBe(true);
  const manifest = await response.json();
  expect(manifest).toMatchObject({
    id: "./",
    start_url: "./",
    scope: "./",
    display: "standalone",
    short_name: "FORM",
  });
  for (const icon of manifest.icons) {
    const image = await request.get(`/form/${icon.src}`);
    expect(image.ok()).toBe(true);
    const png = await image.body();
    expect(png.subarray(1, 4).toString()).toBe("PNG");
    const [width, height] = icon.sizes.split("x").map(Number);
    expect(png.readUInt32BE(16)).toBe(width);
    expect(png.readUInt32BE(20)).toBe(height);
  }
  const appleIcon = await page
    .locator('link[rel="apple-touch-icon"]')
    .getAttribute("href");
  expect((await request.get(appleIcon)).ok()).toBe(true);
  await readyWorker(page);
  expect(
    await page.evaluate(
      async () => (await navigator.serviceWorker.ready).scope,
    ),
  ).toBe("http://localhost:5179/form/");
});

test("Edge recognizes FORM as installable in a normal browser profile", async ({
  playwright,
}, testInfo) => {
  // Default Playwright contexts are private browsing, where installation is disabled.
  const context = await playwright.chromium.launchPersistentContext(
    testInfo.outputPath("install-profile"),
    {
      channel: "msedge",
      headless: true,
      baseURL: "http://localhost:5179/form/",
    },
  );
  try {
    const page = await context.newPage();
    await openApp(page);
    await readyWorker(page);
    const session = await context.newCDPSession(page);
    const { installabilityErrors } = await session.send(
      "Page.getInstallabilityErrors",
    );
    expect(installabilityErrors).toEqual([]);
    await session.detach();
  } finally {
    await context.close();
  }
});

test("the installed shell reopens offline with a clear cloud-storage message", async ({
  page,
  context,
}) => {
  await openApp(page);
  await readyWorker(page);
  await context.setOffline(true);
  await page.goto("./?source=installed");
  await expect(
    page.getByRole("heading", { name: "Welcome back" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText("You’re offline");
  await expect(page.getByRole("status")).toContainText(
    "cloud saves need a connection",
  );
  await context.setOffline(false);
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("only public app files are cached, leaving cloud and private requests alone", async ({
  page,
}) => {
  await openApp(page);
  await readyWorker(page);
  await page.evaluate(async () => {
    await fetch("./private-record?account=test");
  });
  const urls = await page.evaluate(async () => {
    const names = await caches.keys();
    const entries = await Promise.all(
      names.map(async (name) => {
        const cache = await caches.open(name);
        return (await cache.keys()).map((request) => request.url);
      }),
    );
    return entries.flat();
  });
  expect(urls.length).toBeGreaterThan(5);
  for (const url of urls) {
    expect(url).toMatch(
      /^http:\/\/localhost:5179\/form\/(index\.html|manifest\.webmanifest|favicon\.svg|icons\/[^/]+\.png|assets\/[^/]+\.(js|css))$/,
    );
  }
});

for (const outcome of ["accepted", "dismissed"]) {
  test(`install button uses the browser prompt and handles ${outcome}`, async ({
    page,
  }) => {
    await openApp(page);
    const button = page.getByRole("button", { name: "Install FORM" });
    await expect(button).toHaveCount(0);
    await page.evaluate((choice) => {
      window.promptCount = 0;
      const event = new Event("beforeinstallprompt", { cancelable: true });
      event.prompt = async () => {
        window.promptCount += 1;
      };
      event.userChoice = Promise.resolve({ outcome: choice });
      window.dispatchEvent(event);
      window.installEventPrevented = event.defaultPrevented;
    }, outcome);
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toHaveCount(0);
    expect(await page.evaluate(() => window.promptCount)).toBe(1);
    expect(await page.evaluate(() => window.installEventPrevented)).toBe(true);
  });
}

test("installation failures explain the browser-menu alternative", async ({
  page,
}) => {
  await openApp(page);
  await page.evaluate(() => {
    const event = new Event("beforeinstallprompt", { cancelable: true });
    event.prompt = async () => {
      throw new Error("Unavailable");
    };
    window.dispatchEvent(event);
  });
  await page.getByRole("button", { name: "Install FORM" }).click();
  await expect(page.getByRole("status")).toContainText("browser’s menu");
});

test("iPhone shows home-screen instructions and hides install when installed", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1",
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto("http://localhost:5179/form/");
    const button = page.getByRole("button", { name: "Install FORM" });
    await expect(button).toBeVisible();
    await button.click();
    await expect(page.getByRole("dialog")).toContainText("Add to Home Screen");
    await page.keyboard.press("Escape");
    await expect(button).toBeFocused();
    await page.screenshot({
      path: "test-results/pwa-mobile.png",
      fullPage: true,
    });
    await page.evaluate(() => window.dispatchEvent(new Event("appinstalled")));
    await expect(button).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  } finally {
    await context.close();
  }
});

test("updates wait for app windows to close and retain browser drafts", async ({
  page,
  context,
}) => {
  test.setTimeout(45000);
  await openApp(page);
  await readyWorker(page);
  await page.evaluate(() =>
    localStorage.setItem("pwa-draft-check", "workout in progress"),
  );
  const workerFile = new URL("../../dist-test-pwa/sw.js", import.meta.url);
  const original = await readFile(workerFile, "utf8");
  const updated = original.replace(
    /const VERSION = "[^"]+"/,
    'const VERSION = "update-test"',
  );
  try {
    await writeFile(workerFile, updated);
    await page.evaluate(async () => {
      await (await navigator.serviceWorker.ready).update();
    });
    await expect(page.getByRole("status")).toContainText(
      "A FORM update is ready",
    );
    expect(
      await page.evaluate(async () =>
        Boolean((await navigator.serviceWorker.ready).waiting),
      ),
    ).toBe(true);
    const secondPage = await context.newPage();
    await openApp(secondPage);
    await page.close();
    expect(
      await secondPage.evaluate(async () =>
        Boolean((await navigator.serviceWorker.ready).waiting),
      ),
    ).toBe(true);
    await secondPage.close();
    const reopened = await context.newPage();
    await openApp(reopened);
    await readyWorker(reopened);
    await expect
      .poll(() => reopened.evaluate(() => caches.keys()))
      .toContain("form-shell:/form/:update-test");
    await expect
      .poll(() => reopened.evaluate(() => caches.keys()))
      .toEqual(["form-shell:/form/:update-test"]);
    expect(
      await reopened.evaluate(() => localStorage.getItem("pwa-draft-check")),
    ).toBe("workout in progress");
  } finally {
    await writeFile(workerFile, original);
  }
});
