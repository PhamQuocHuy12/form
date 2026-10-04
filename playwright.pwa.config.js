import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/pwa-browser",
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://localhost:5179/form/",
    channel: "msedge",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js preview --mode test-pwa --outDir dist-test-pwa --host 127.0.0.1 --port 5179 --strictPort",
    url: "http://localhost:5179/form/",
    reuseExistingServer: false,
  },
});
