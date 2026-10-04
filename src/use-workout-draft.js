import { useCallback, useEffect, useRef, useState } from "react";
import { createDraftStorage } from "./workout-draft.js";

export function useWorkoutDraft(uid) {
  const [storage] = useState(() =>
    createDraftStorage(
      uid,
      () => window.localStorage,
      () => window.sessionStorage,
    ),
  );
  const [initial] = useState(() => storage.read());
  const [session, updateSession] = useState(initial.session);
  const [warning, setWarning] = useState(initial.warning);
  const current = useRef(session);
  const writeFailed = useRef(false);
  const setSession = useCallback(
    (value) => {
      // Incorporate another tab's latest edit even if its storage event is pending.
      const stored = storage.read();
      const base =
        writeFailed.current || stored.warning
          ? current.current
          : stored.session;
      if (base?.id !== current.current?.id) {
        current.current = base;
        updateSession(base);
        setWarning(stored.warning);
        return;
      }
      const next = typeof value === "function" ? value(base) : value;
      if (next === base) {
        if (JSON.stringify(base) !== JSON.stringify(current.current)) {
          current.current = base;
          updateSession(base);
        }
        return;
      }
      // Write during the edit, not in a deferred effect or unload handler.
      const storageWarning = storage.write(next);
      writeFailed.current = Boolean(storageWarning);
      setWarning(storageWarning);
      current.current = next;
      updateSession(next);
    },
    [storage],
  );
  useEffect(() => {
    function synchronize(event) {
      if (writeFailed.current) return;
      if (event.key !== storage.key && event.key !== null) return;
      try {
        if (event.storageArea !== window.localStorage) return;
      } catch {
        return;
      }
      const recovered = storage.read();
      current.current = recovered.session;
      updateSession(recovered.session);
      setWarning(recovered.warning);
    }
    window.addEventListener("storage", synchronize);
    return () => window.removeEventListener("storage", synchronize);
  }, [storage]);
  return { session, setSession, warning };
}
