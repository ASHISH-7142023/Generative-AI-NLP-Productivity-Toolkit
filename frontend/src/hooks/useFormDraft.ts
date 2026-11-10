import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook to persist form drafts in sessionStorage.
 * Automatically saves state changes and restores drafts on page refresh.
 *
 * @param key Unique key for sessionStorage
 * @param initialValue Default value when no draft exists
 */
export function useFormDraft<T>(key: string, initialValue: T): [T, (val: T | ((prev: T) => T)) => void, () => void] {
  const storageKey = `nlp_toolkit_draft_${key}`;
  const isFirstRender = useRef(true);

  // Lazy initialize state from sessionStorage
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn(`Failed to read draft from sessionStorage for key: ${storageKey}`, e);
    }
    return initialValue;
  });

  // Debounced auto-save to sessionStorage
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const handler = setTimeout(() => {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(value));
      } catch (e) {
        console.warn(`Failed to save draft to sessionStorage for key: ${storageKey}`, e);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [value, storageKey]);

  // Method to explicitly clear draft on successful submission
  const clearDraft = useCallback(() => {
    try {
      sessionStorage.removeItem(storageKey);
      setValue(initialValue);
    } catch (e) {
      console.warn(`Failed to clear draft for key: ${storageKey}`, e);
    }
  }, [storageKey, initialValue]);

  return [value, setValue, clearDraft];
}
