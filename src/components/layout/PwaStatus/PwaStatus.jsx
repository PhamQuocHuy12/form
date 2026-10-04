import React from "react";
import { usePwa } from "../../../hooks/usePwa.js";
import { status } from "./PwaStatus.styles.js";

export function PwaStatus() {
  const { offline, updateReady, error } = usePwa();
  if (!offline && !updateReady && !error) return null;
  return (
    <aside className={`${status} pwa-status`} role="status" aria-live="polite">
      {offline && (
        <p>
          You’re offline. Sign-in and cloud saves need a connection. Workout
          drafts stay on this device when browser storage is available.
        </p>
      )}
      {updateReady && (
        <p>
          A FORM update is ready. When you’ve finished, close all FORM windows
          and tabs, then reopen the app to update.
        </p>
      )}
      {error && <p>{error}</p>}
    </aside>
  );
}
