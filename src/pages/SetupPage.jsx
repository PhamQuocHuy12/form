import React from "react";

export function SetupPage({ error }) {
  return (
    <div className="setup-error">
      <h1>Finish Firebase setup</h1>
      <p role="alert">{error}</p>
      <button
        className="button secondary"
        onClick={() => window.location.reload()}
      >
        Retry
      </button>
    </div>
  );
}
