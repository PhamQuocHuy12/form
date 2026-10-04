import { getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

// Firebase web configuration is public and included in the browser build.
// Keep service-account credentials and other server secrets out of VITE_ values.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const required = ["apiKey", "authDomain", "projectId", "appId"];
export const firebaseConfigurationError = required.some(
  (key) => !firebaseConfig[key]?.trim(),
)
  ? "Firebase setup is required. Add the API key, auth domain, project ID, and app ID to your environment, then restart the app."
  : "";

// Reuse the app during development reloads instead of creating duplicates.
export const firebaseApp = !firebaseConfigurationError
  ? getApps().find((app) => app.name === "[DEFAULT]") ||
    initializeApp(firebaseConfig)
  : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const db = firebaseApp ? getFirestore(firebaseApp) : null;

if (firebaseApp && import.meta.env.VITE_FIREBASE_USE_EMULATORS === "true") {
  const local = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  if (
    !local ||
    !(
      import.meta.env.DEV ||
      ["test-cloud", "test-pwa"].includes(import.meta.env.MODE)
    )
  ) {
    throw new Error(
      "Firebase emulators are only supported in local development and tests.",
    );
  }
  if (!auth.emulatorConfig)
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
  // HMR can rerun this module, but an initialized Firestore instance is reusable.
  const connected = Symbol.for("form.firestore.emulator");
  if (!firebaseApp[connected]) {
    connectFirestoreEmulator(db, "127.0.0.1", 8080);
    firebaseApp[connected] = true;
  }
}
