import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  cacheAppearance,
  readAppearanceCache,
} from "../services/appearance.js";

export function useAppearance(store, uid) {
  const [appearance, setAppearance] = useState(() => readAppearanceCache(uid));
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    setReady(false);
    setError("");
    return store.subscribeAppearance(
      (value) => {
        setAppearance(value);
        cacheAppearance(uid, value);
        setReady(true);
        setError("");
      },
      (err) => {
        setReady(false);
        setError(err.message);
      },
    );
  }, [store, uid, retry]);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = () => {
      document.documentElement.dataset.theme =
        appearance.theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : appearance.theme;
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      delete document.documentElement.dataset.theme;
    };
  }, [appearance.theme]);

  const save = useCallback(
    async (value) => {
      const saved = await store.saveAppearance(value);
      setAppearance(saved);
      cacheAppearance(uid, saved);
    },
    [store, uid],
  );

  return {
    appearance,
    ready,
    error,
    save,
    retry: () => setRetry((value) => value + 1),
  };
}
