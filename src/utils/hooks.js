import { useState, useEffect } from 'react';
import { storage } from './storage';

/**
 * Custom hook for state that persists to localStorage.
 * @param {string} key - The localStorage key.
 * @param {any} defaultValue - The initial value if not found in storage.
 * @param {string} type - 'string', 'boolean', or 'json'.
 * @returns {[any, Function]} - State and setter.
 */
export function useLocalStorageState(key, defaultValue, type = 'string') {
  const [state, setState] = useState(() => {
    if (type === 'boolean') return storage.getBoolean(key, defaultValue);
    if (type === 'json') return storage.getJSON(key, defaultValue);
    return storage.get(key, defaultValue);
  });

  useEffect(() => {
    if (type === 'json') storage.setJSON(key, state);
    else storage.set(key, state);
  }, [key, state, type]);

  return [state, setState];
}
