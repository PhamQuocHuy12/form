import React, { useEffect, useState } from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import { Modal } from "../../common/Modal/Modal.jsx";
import { Button } from "../../common/Button/Button.jsx";
import { fieldset } from "../../common/styles/FormControls.styles.js";
import {
  formHint,
  formError,
} from "../../common/styles/FormFeedback.styles.js";
import { themeOptions } from "./AppearanceModal.styles.js";

export function AppearanceModal({ controller, onClose }) {
  const { appearance, ready, error: syncError, save, retry } = controller;
  const [theme, setTheme] = useState(appearance.theme);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);
  useEffect(() => {
    if (!touched) setTheme(appearance.theme);
  }, [appearance.theme, touched]);

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await save({ theme });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal title="Appearance" onClose={onClose}>
      <p>
        Choose how FORM looks. Your theme syncs anywhere you sign in to this
        account.
      </p>
      <form onSubmit={submit}>
        <fieldset className={fieldset} disabled={busy}>
          <legend>Theme</legend>
          <div className={`${themeOptions} theme-options`}>
            {[
              ["dark", "Dark", Moon],
              ["light", "Light", Sun],
              ["system", "System", Monitor],
            ].map(([value, label, Icon]) => (
              <label key={value}>
                <input
                  type="radio"
                  name="theme"
                  value={value}
                  checked={theme === value}
                  onChange={() => {
                    setTouched(true);
                    setTheme(value);
                  }}
                />
                <Icon size={20} aria-hidden="true" />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <p className={formHint}>
          System follows each device’s light or dark setting.
        </p>
        {!ready && !syncError && (
          <p className={formHint} role="status">
            Loading your saved theme…
          </p>
        )}
        {(error || syncError) && (
          <p className={formError} role="alert">
            {error || syncError}
          </p>
        )}
        {syncError && <Button onClick={retry}>Retry theme sync</Button>}
        <Button
          variant="primary"
          type="submit"
          fullWidth
          disabled={busy || !ready}
        >
          {busy ? "Saving…" : "Save theme"}
          <Check size={17} />
        </Button>
      </form>
    </Modal>
  );
}
