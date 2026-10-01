import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/cloud-browser",
  workers: 1,
  retries: 0,
  use: {
    baseURL: "http://localhost:5176",
    channel: "msedge",
    trace: "retain-on-failure",
  },
  webServer: {
    command:
      "node node_modules/vite/bin/vite.js preview --mode test-cloud --outDir dist-test-cloud --host 127.0.0.1 --port 5176 --strictPort",
    url: "http://localhost:5176",
    reuseExistingServer: false,
  },
});
