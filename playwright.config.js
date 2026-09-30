import { defineConfig } from "@playwright/test";
import path from "node:path";
export default defineConfig({
  testDir: "./tests/browser",
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://localhost:5174",
    channel: "msedge",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "node server.mjs",
    url: "http://localhost:5174",
    reuseExistingServer: false,
    env: {
      PORT: "5174",
      DATA_DIR: path.resolve("data", `browser-test-${Date.now()}`),
    },
  },
});
