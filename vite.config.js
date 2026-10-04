import { defineConfig } from "vite";
import linaria from "@wyw-in-js/vite";
import { installableApp } from "./pwa/vite-pwa.js";

export default defineConfig(({ mode }) => {
  const cloudTestMode = mode === "test-cloud" || mode === "test-pwa";
  const testMode = cloudTestMode || mode === "test-setup";
  const fixture = cloudTestMode
    ? {
        apiKey: "demo-api-key",
        authDomain: "demo-form.firebaseapp.com",
        projectId: "demo-form",
        appId: "demo-app-id",
        storageBucket: "",
        messagingSenderId: "",
      }
    : {
        apiKey: "",
        authDomain: "",
        projectId: "",
        appId: "",
        storageBucket: "",
        messagingSenderId: "",
      };
  const envNames = {
    apiKey: "API_KEY",
    authDomain: "AUTH_DOMAIN",
    projectId: "PROJECT_ID",
    appId: "APP_ID",
    storageBucket: "STORAGE_BUCKET",
    messagingSenderId: "MESSAGING_SENDER_ID",
  };
  return {
    ...(mode === "test-pwa" ? { base: "/form/" } : {}),
    plugins: [
      linaria({
        include: ["**/src/**/*.styles.js"],
      }),
      installableApp(),
    ],
    // Tests never load the user’s .env files or connect to their Firebase project.
    ...(testMode
      ? {
          envDir: false,
          define: {
            ...Object.fromEntries(
              Object.entries(fixture).map(([key, value]) => [
                `import.meta.env.VITE_FIREBASE_${envNames[key]}`,
                JSON.stringify(value),
              ]),
            ),
            "import.meta.env.VITE_FIREBASE_USE_EMULATORS": JSON.stringify(
              cloudTestMode ? "true" : "false",
            ),
          },
        }
      : {}),
  };
});
