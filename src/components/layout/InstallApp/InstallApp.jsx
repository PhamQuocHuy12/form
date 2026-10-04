import React, { useCallback, useState } from "react";
import { Download } from "lucide-react";
import { IconButton } from "../../common/IconButton/IconButton.jsx";
import { Modal } from "../../common/Modal/Modal.jsx";
import { usePwa } from "../../../hooks/usePwa.js";
import { installApp } from "../../../services/pwa.js";

export function InstallApp() {
  const { canInstall, ios, installed, installing } = usePwa();
  const [instructions, setInstructions] = useState(false);
  const close = useCallback(() => setInstructions(false), []);
  if (installed || (!canInstall && !ios)) return null;
  return (
    <>
      <IconButton
        className="install-app-button"
        aria-label="Install FORM"
        title="Install FORM"
        disabled={installing}
        onClick={canInstall ? installApp : () => setInstructions(true)}
      >
        <Download size={18} />
      </IconButton>
      {instructions && (
        <Modal title="Install FORM" onClose={close}>
          <p>
            Open FORM in Safari, tap the Share button, then choose
            <strong> Add to Home Screen</strong> and tap <strong>Add</strong>.
            FORM will open from its own icon on your home screen.
          </p>
          <p>Sign-in and saving workouts need an internet connection.</p>
        </Modal>
      )}
    </>
  );
}
