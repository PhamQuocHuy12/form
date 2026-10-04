import React from "react";
import { Clock3, Pause, Play, RotateCcw } from "lucide-react";

export function RestTimer({
  timer,
  running,
  startTimer,
  pauseTimer,
  resetTimer,
}) {
  return (
    <div className="rest-timer">
      <Clock3 size={18} />
      <strong>
        {String(Math.floor(timer / 60)).padStart(2, "0")}:
        {String(timer % 60).padStart(2, "0")}
      </strong>
      <span>
        {running
          ? "Rest. Breathe. Reset."
          : timer
            ? "Timer paused"
            : "Rest timer"}
      </span>
      <button
        type="button"
        className="icon-button"
        aria-label={running ? "Pause timer" : "Start timer"}
        onClick={() => (running ? pauseTimer() : startTimer(timer || 60))}
      >
        {running ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <button
        type="button"
        className="icon-button"
        aria-label="Reset timer"
        onClick={resetTimer}
      >
        <RotateCcw size={17} />
      </button>
    </div>
  );
}
