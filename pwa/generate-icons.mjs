import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

// Reuse the existing vector F mark; keep the maskable mark inside its safe zone.
const directory = new URL("../public/icons/", import.meta.url);
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ channel: "msedge" });
try {
  for (const [name, size, scale] of [
    ["icon-192.png", 192, 1],
    ["icon-512.png", 512, 1],
    ["icon-maskable-512.png", 512, 0.8],
    ["apple-touch-icon.png", 180, 1],
  ]) {
    const page = await browser.newPage({
      viewport: { width: size, height: size },
    });
    await page.setContent(
      `<style>body{margin:0}svg{display:block;width:100%;height:100%}</style>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
        <rect width="40" height="40" fill="#e8fc73"/>
        <path transform="translate(20 20) scale(${scale}) translate(-21.5 -22)"
          d="M12 10h19v6H19v4h10v6H19v8h-7z" fill="#121412"/>
      </svg>`,
    );
    await page.screenshot({ path: fileURLToPath(new URL(name, directory)) });
    await page.close();
  }
} finally {
  await browser.close();
}
