import React from "react";
import { Dumbbell } from "lucide-react";

export function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark">
        <Dumbbell size={22} strokeWidth={2.5} />
      </span>
      FORM<span className="brand-dot">®</span>
    </div>
  );
}
