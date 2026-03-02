import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_TURN_TIME = 60;
const PAUSED_PHASES = new Set(["card", "buydecision", "payrent", "endturn"]);

export function useTurnTimer({ screen, phase, onTimeout }) {
  const [turnTimer, setTurnTimer] = useState(INITIAL_TURN_TIME);
  const onTimeoutRef = useRef(onTimeout);

  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const resetTimer = useCallback(() => {
    setTurnTimer(INITIAL_TURN_TIME);
  }, []);

  useEffect(() => {
    if (screen !== "game" || PAUSED_PHASES.has(phase)) {
      return;
    }

    const timerId = setInterval(() => {
      setTurnTimer((prev) => {
        if (prev <= 1) {
          onTimeoutRef.current?.();
          return INITIAL_TURN_TIME;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [screen, phase]);

  return { turnTimer, resetTimer };
}
