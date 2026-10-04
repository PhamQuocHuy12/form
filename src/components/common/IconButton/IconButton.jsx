import React from "react";
import { iconButton } from "./IconButton.styles.js";

export function IconButton({ type = "button", className = "", ...props }) {
  return (
    <button
      {...props}
      type={type}
      className={[iconButton, "icon-button", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
