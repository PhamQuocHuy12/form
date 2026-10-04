import {
  weekToolbar,
  weekTitle,
  weekIcon,
  weekControls,
  todayButton,
} from "./WeekToolbar.styles.js";
import React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { monday, shiftDate } from "../../../../shared/utils/dates.mjs";
import { formatDate } from "../../../utils/format.js";

export function WeekToolbar({ week, days, setWeek }) {
  return (
    <section className={`${weekToolbar} week-toolbar`}>
      <div className={`${weekTitle} week-title`}>
        <div className={`${weekIcon} week-icon`}>
          <CalendarDays size={20} />
        </div>
        <div>
          <strong>
            {formatDate(week, { month: "long", day: "numeric" })} –{" "}
            {formatDate(shiftDate(week, 6), {
              day: "numeric",
              month: "short",
            })}
          </strong>
          <span>
            {week === monday() ? "This week" : "Training week"} · {days}-day
            split
          </span>
        </div>
      </div>
      <div className={`${weekControls} week-controls`}>
        <button
          aria-label="Previous week"
          onClick={() => setWeek(shiftDate(week, -7))}
        >
          <ChevronLeft size={18} />
        </button>
        <button
          className={`${todayButton} today-button`}
          onClick={() => setWeek(monday())}
        >
          Today
        </button>
        <button
          aria-label="Next week"
          onClick={() => setWeek(shiftDate(week, 7))}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
}
