const listeners = new Set();
let installPrompt = null;
let started = false;
let state = {
  canInstall: false,
  ios: false,
  installed: false,
  installing: false,
  offline: false,
  updateReady: false,
  error: "",
};

function update(values) {
  state = { ...state, ...values };
  listeners.forEach((listener) => listener());
}

export const getPwaState = () => state;
export function subscribePwa(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function startPwa() {
  if (started) return;
  started = true;
  const standalone = window.matchMedia("(display-mode: standalone)");
  const isInstalled = () => standalone.matches || navigator.standalone === true;
  update({
    installed: isInstalled(),
    ios:
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1),
    offline: !navigator.onLine,
  });
  standalone.addEventListener("change", () =>
    update({ installed: isInstalled() }),
  );
  window.addEventListener("online", () => update({ offline: false }));
  window.addEventListener("offline", () => update({ offline: true }));
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    update({ canInstall: true, error: "" });
  });
  window.addEventListener("appinstalled", () => {
    installPrompt = null;
    update({ installed: true, canInstall: false, error: "" });
  });

  if (
    !import.meta.env.PROD ||
    !("serviceWorker" in navigator) ||
    !window.isSecureContext
  )
    return;
  const register = async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        `${import.meta.env.BASE_URL}sw.js`,
        { scope: import.meta.env.BASE_URL, updateViaCache: "none" },
      );
      const checkWaiting = () => {
        if (registration.waiting && navigator.serviceWorker.controller)
          update({ updateReady: true });
      };
      checkWaiting();
      registration.addEventListener("updatefound", () => {
        registration.installing?.addEventListener("statechange", checkWaiting);
      });
      // Also check long-lived installed windows when they return to the foreground.
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible" && navigator.onLine)
          registration.update().catch(() => {});
      });
    } catch {
      // Browser installation and normal online usage can still work without a cache.
    }
  };
  if (document.readyState === "complete") register();
  else window.addEventListener("load", register, { once: true });
}

export async function installApp() {
  if (!installPrompt || state.installing) return;
  const prompt = installPrompt;
  installPrompt = null;
  update({ installing: true, error: "" });
  try {
    await prompt.prompt();
    await prompt.userChoice;
    update({ canInstall: false });
  } catch {
    update({
      canInstall: false,
      error: "Use your browser’s menu to install FORM, or reload to try again.",
    });
  } finally {
    update({ installing: false });
  }
}
