import { pageHeading } from "./PageHeading.styles.js";
import { eyebrow, pageTitle } from "../../common/styles/Typography.styles.js";
import { Button } from "../../common/Button/Button.jsx";
import React from "react";
import { Settings2 } from "lucide-react";

export function PageHeading({ view, loaded, onSettings }) {
  return (
    <div className={`${pageHeading} page-heading`}>
      <div>
        <div className={`${eyebrow} eyebrow`}>
          <span /> MAKE ROOM FOR PROGRESS
        </div>
        <h1 className={pageTitle}>
          {view === "planner"
            ? "Your week. Your work."
            : view === "history"
              ? "The work you’ve put in."
              : "See how far you’ve come."}
        </h1>
        <p>
          {view === "planner"
            ? "A clear plan. Consistent effort. Stronger you."
            : view === "history"
              ? "Your sets, your notes, your story so far."
              : "Small wins become lasting strength."}
        </p>
      </div>
      <Button
        variant="secondary"
        aria-label="Customize plan"
        disabled={!loaded}
        onClick={onSettings}
      >
        <Settings2 size={17} /> Customize plan
      </Button>
    </div>
  );
}
