/**
 * useTimer — Elapsed time tracking for active visits
 * Formats seconds into HH:MM:SS for the ClockButton display
 */
import { useState, useEffect, useCallback, useRef } from 'react';

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    setSeconds(0);
    setIsRunning(true);
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    return seconds;
  }, [seconds]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const formatted = useCallback(() => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, [seconds]);

  return {
    seconds,
    isRunning,
    formatted: formatted(),
    start,
    stop,
    reset,
  };
}

export default useTimer;
