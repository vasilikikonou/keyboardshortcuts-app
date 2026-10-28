import { useCallback, useEffect, useState } from "react";
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved) as T);
    } catch {
      // Continue with the in-memory value when storage is unavailable or invalid.
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the app usable when storage is disabled or full.
    }
  }, [key, ready, value]);

  const update = useCallback((next: T | ((previous: T) => T)) => {
    setValue(previous =>
      typeof next === "function" ? (next as (current: T) => T)(previous) : next
    );
  }, []);

  return [value, update, ready] as const;
}
