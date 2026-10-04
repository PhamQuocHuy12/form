import { setupError } from "./SetupPage.styles.js";
import { pageTitle } from "../../components/common/styles/Typography.styles.js";
import { Button } from "../../components/common/Button/Button.jsx";
import React from "react";

export function SetupPage({ error }) {
  return (
    <div className={`${setupError} setup-error`}>
      <h1 className={pageTitle}>Finish Firebase setup</h1>
      <p role="alert">{error}</p>
      <Button variant="secondary" onClick={() => window.location.reload()}>
        Retry
      </Button>
    </div>
  );
}
