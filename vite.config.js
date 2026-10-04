import { defineConfig } from "vite";
import linaria from "@wyw-in-js/vite";

export default defineConfig(({ mode }) => {
  const testMode = mode === "test-cloud" || mode === "test-setup";
  const fixture =
    mode === "test-cloud"
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
    plugins: [
      linaria({
        include: ["**/src/**/*.styles.js"],
      }),
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
              mode === "test-cloud" ? "true" : "false",
            ),
          },
        }
      : {}),
  };
});
