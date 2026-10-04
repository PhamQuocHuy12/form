import React from "react";
import { button } from "./Button.styles.js";

export function Button({
  variant = "secondary",
  fullWidth = false,
  type = "button",
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      type={type}
      className={[
        button,
        "button",
        variant,
        fullWidth && "full-width",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
