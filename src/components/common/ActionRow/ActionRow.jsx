import React from "react";
import { historyActions } from "./ActionRow.styles.js";

export function ActionRow({ className = "", ...props }) {
  return (
    <div
      {...props}
      className={[historyActions, "history-actions", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
