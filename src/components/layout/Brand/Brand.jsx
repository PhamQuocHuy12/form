import { brand, brandMark, brandDot } from "./Brand.styles.js";
import React from "react";
import { Dumbbell } from "lucide-react";

export function Brand() {
  return (
    <div className={`${brand} brand`}>
      <span className={`${brandMark} brand-mark`}>
        <Dumbbell size={22} strokeWidth={2.5} />
      </span>
      FORM
      <span className={`${brandDot} brand-dot`}>®</span>
    </div>
  );
}
