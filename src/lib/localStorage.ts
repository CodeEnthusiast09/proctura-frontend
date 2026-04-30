export const storeInLocalStorage = (key: string, value: unknown): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // silently fail
  }
};

export const retrieveFromLocalStorage = <T = unknown>(
  key: string,
): T | null => {
  if (typeof window === "undefined") return null;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // silently fail
  }
};

export const clearLocalStorage = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
  } catch {
    // silently fail
  }
};
