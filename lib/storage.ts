/**
 * Loads a string from localStorage.
 *
 * @param key The key to fetch.
 * @param localStorage The localStorage object
 */
export function loadString(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Saves a string to localStorage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 * @param localStorage The localStorage object
 */
export function saveString(key: string, value: string): boolean {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Loads something from localStorage and runs it through JSON.parse.
 *
 * @param key The key to fetch.
 * @param localStorage The localStorage object
 */
export function load(key: string): unknown | null {
  try {
    const almostThere = localStorage.getItem(key);
    return JSON.parse(almostThere || "{}");
  } catch {
    return null;
  }
}

/**
 * Saves an object to localStorage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 * @param localStorage The localStorage object
 */
export function save(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from localStorage.
 *
 * @param key The key to kill.
 * @param localStorage The localStorage object
 */
export function remove(key: string): void {
  localStorage.removeItem(key);
}

/**
 * Burn it all to the ground.
 *
 * @param localStorage The localStorage object
 */
export function clear(): void {
  localStorage.clear();
}
