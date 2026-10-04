import {
  weekStrip,
  dayTile,
  dayTop,
  todayDot,
  dayDescription,
  dayFooter,
} from "./WeekStrip.styles.js";
import React from "react";
import { Check, Dumbbell, Leaf } from "lucide-react";
import { dateKey, shiftDate } from "../../../../shared/utils/dates.mjs";
import { weekdayNames, formatDate } from "../../../utils/format.js";

export function WeekStrip({ plan, workout, week, completedDays, setSelected }) {
  return (
    <div className={`${weekStrip} week-strip`}>
      {weekdayNames.map((label, index) => {
        const day = plan.find((d) => d.weekday === index);
        const key = shiftDate(week, index);
        const chosen = day?.id === workout.id;
        return (
          <button
            key={label}
            aria-label={`${label}: ${day?.title || "Recovery"}${day && completedDays.has(day.id) ? ", completed" : ""}`}
            aria-pressed={chosen}
            className={`${dayTile} day-tile ${chosen ? "selected" : ""} ${!day ? "rest" : ""}`}
            onClick={() => day && setSelected(plan.indexOf(day))}
            disabled={!day}
          >
            <div className={`${dayTop} day-top`}>
              <span>{label}</span>
              {key === dateKey() && (
                <span className={`${todayDot} today-dot`} />
              )}
            </div>
            <strong>{formatDate(key, { day: "2-digit" })}</strong>
            <span className={`${dayDescription} day-description`}>
              {day?.title || "Recovery"}
            </span>
            <div className={`${dayFooter} day-footer`}>
              {day && completedDays.has(day.id) ? (
                <>
                  <Check size={13} />
                  <span>Completed</span>
                </>
              ) : day ? (
                <>
                  <Dumbbell size={13} />
                  <span>{day.exercises.length} exercises</span>
                </>
              ) : (
                <>
                  <Leaf size={13} />
                  <span>Rest day</span>
                </>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
