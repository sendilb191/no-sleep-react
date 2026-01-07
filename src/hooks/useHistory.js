import { useState, useEffect, useCallback, useRef } from 'react';
import {
  STORAGE_KEYS,
  MAX_HISTORY,
  AUTO_SAVE_INTERVAL,
  MIN_SESSION_DURATION,
} from '../constants';

// Helper to load history from localStorage
const loadHistory = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save history to localStorage
const saveHistoryToStorage = history => {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.HISTORY,
      JSON.stringify(history.slice(0, MAX_HISTORY))
    );
  } catch {
    // Ignore storage errors
  }
};

// Helper to save in-progress session
const saveInProgressSession = startTime => {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.IN_PROGRESS,
      JSON.stringify({ startTime, lastUpdate: Date.now() })
    );
  } catch {
    // Ignore storage errors
  }
};

// Helper to clear in-progress session
const clearInProgressSession = () => {
  try {
    window.localStorage.removeItem(STORAGE_KEYS.IN_PROGRESS);
  } catch {
    // Ignore storage errors
  }
};

// Helper to recover incomplete session on app load
const recoverInProgressSession = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEYS.IN_PROGRESS);
    if (stored) {
      const { startTime, lastUpdate } = JSON.parse(stored);
      // Use lastUpdate as end time since that's when we last knew it was active
      const duration = Math.floor((lastUpdate - startTime) / 1000);
      clearInProgressSession();
      if (duration > MIN_SESSION_DURATION) {
        return {
          id: startTime,
          startTime,
          duration,
        };
      }
    }
  } catch {
    clearInProgressSession();
  }
  return null;
};

export const useHistory = () => {
  const [history, setHistory] = useState(() => {
    const savedHistory = loadHistory();
    // Recover any incomplete session from a crash/sudden close
    const recoveredSession = recoverInProgressSession();
    if (recoveredSession) {
      const updated = [recoveredSession, ...savedHistory].slice(0, MAX_HISTORY);
      saveHistoryToStorage(updated);
      return updated;
    }
    return savedHistory;
  });

  const sessionStartRef = useRef(null);
  const autoSaveRef = useRef(null);

  // Start a new session
  const startSession = useCallback(() => {
    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
      saveInProgressSession(sessionStartRef.current);
    }
  }, []);

  // End current session and save to history
  const endSession = useCallback(() => {
    if (sessionStartRef.current) {
      const duration = Math.floor(
        (Date.now() - sessionStartRef.current) / 1000
      );
      // Only save if session was longer than minimum duration
      if (duration > MIN_SESSION_DURATION) {
        const newSession = {
          id: Date.now(),
          startTime: sessionStartRef.current,
          duration,
        };
        setHistory(prev => {
          const updated = [newSession, ...prev].slice(0, MAX_HISTORY);
          saveHistoryToStorage(updated);
          return updated;
        });
      }
      sessionStartRef.current = null;
      clearInProgressSession();
    }
  }, []);

  // Update in-progress session (for auto-save)
  const updateSession = useCallback(() => {
    if (sessionStartRef.current) {
      saveInProgressSession(sessionStartRef.current);
    }
  }, []);

  // Check if session is active
  const isSessionActive = useCallback(() => {
    return sessionStartRef.current !== null;
  }, []);

  // Get current session start time
  const getSessionStart = useCallback(() => {
    return sessionStartRef.current;
  }, []);

  // Format duration for display
  const formatDuration = useCallback(seconds => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  }, []);

  // Handle beforeunload - save session when page is closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (sessionStartRef.current) {
        const duration = Math.floor(
          (Date.now() - sessionStartRef.current) / 1000
        );
        if (duration > MIN_SESSION_DURATION) {
          const newSession = {
            id: Date.now(),
            startTime: sessionStartRef.current,
            duration,
          };
          const currentHistory = loadHistory();
          saveHistoryToStorage([newSession, ...currentHistory]);
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Start/stop auto-save based on session state
  const startAutoSave = useCallback(() => {
    if (!autoSaveRef.current) {
      autoSaveRef.current = setInterval(() => {
        if (sessionStartRef.current) {
          saveInProgressSession(sessionStartRef.current);
        }
      }, AUTO_SAVE_INTERVAL);
    }
  }, []);

  const stopAutoSave = useCallback(() => {
    if (autoSaveRef.current) {
      clearInterval(autoSaveRef.current);
      autoSaveRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveRef.current) {
        clearInterval(autoSaveRef.current);
      }
    };
  }, []);

  return {
    history,
    startSession,
    endSession,
    updateSession,
    isSessionActive,
    getSessionStart,
    formatDuration,
    startAutoSave,
    stopAutoSave,
  };
};
