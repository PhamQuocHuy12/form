import { useState, useRef, useEffect } from "react";

export function useRestTimer() {
  const [timer, setTimer] = useState(0);
  const [running, setRunning] = useState(false);
  const deadline = useRef(0);
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((deadline.current - Date.now()) / 1000),
      );
      setTimer(remaining);
      if (!remaining) setRunning(false);
    }, 250);
    return () => clearInterval(interval);
  }, [running]);
  function startTimer(seconds) {
    deadline.current = Date.now() + seconds * 1000;
    setTimer(seconds);
    setRunning(true);
  }

  return {
    timer,
    running,
    startTimer,
    pauseTimer: () => setRunning(false),
    resetTimer: () => {
      setRunning(false);
      setTimer(0);
    },
  };
}
