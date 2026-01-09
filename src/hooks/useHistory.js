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
const saveInProgressSession = (startTime, accumulatedTime) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEYS.IN_PROGRESS,
      JSON.stringify({ startTime, accumulatedTime, lastUpdate: Date.now() })
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
      const { startTime, accumulatedTime = 0 } = JSON.parse(stored);
      // Use accumulated time plus time since last update (if tab was active)
      const duration = Math.floor(accumulatedTime / 1000);
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
  // Track accumulated active time (in milliseconds)
  const accumulatedTimeRef = useRef(0);
  // Track when the current active period started
  const activeStartRef = useRef(null);

  // Start a new session
  const startSession = useCallback(() => {
    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
      accumulatedTimeRef.current = 0;
      // Only start counting if tab is visible
      if (document.visibilityState === 'visible') {
        activeStartRef.current = Date.now();
      }
      saveInProgressSession(
        sessionStartRef.current,
        accumulatedTimeRef.current
      );
    }
  }, []);

  // Pause time accumulation (when tab becomes hidden)
  const pauseSession = useCallback(() => {
    if (sessionStartRef.current && activeStartRef.current) {
      accumulatedTimeRef.current += Date.now() - activeStartRef.current;
      activeStartRef.current = null;
      saveInProgressSession(
        sessionStartRef.current,
        accumulatedTimeRef.current
      );
    }
  }, []);

  // Resume time accumulation (when tab becomes visible)
  const resumeSession = useCallback(() => {
    if (sessionStartRef.current && !activeStartRef.current) {
      activeStartRef.current = Date.now();
    }
  }, []);

  // End current session and save to history
  const endSession = useCallback(() => {
    if (sessionStartRef.current) {
      // Add any remaining active time
      if (activeStartRef.current) {
        accumulatedTimeRef.current += Date.now() - activeStartRef.current;
      }
      const duration = Math.floor(accumulatedTimeRef.current / 1000);
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
      accumulatedTimeRef.current = 0;
      activeStartRef.current = null;
      clearInProgressSession();
    }
  }, []);

  // Update in-progress session (for auto-save)
  const updateSession = useCallback(() => {
    if (sessionStartRef.current) {
      // Calculate current accumulated time including active period
      let currentAccumulated = accumulatedTimeRef.current;
      if (activeStartRef.current) {
        currentAccumulated += Date.now() - activeStartRef.current;
      }
      saveInProgressSession(sessionStartRef.current, currentAccumulated);
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

  // Get current session duration in seconds (only counts active/visible time)
  const getCurrentSessionTime = useCallback(() => {
    if (!sessionStartRef.current) return 0;
    let currentAccumulated = accumulatedTimeRef.current;
    if (activeStartRef.current) {
      currentAccumulated += Date.now() - activeStartRef.current;
    }
    return Math.floor(currentAccumulated / 1000);
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
        // Add any remaining active time
        let totalAccumulated = accumulatedTimeRef.current;
        if (activeStartRef.current) {
          totalAccumulated += Date.now() - activeStartRef.current;
        }
        const duration = Math.floor(totalAccumulated / 1000);
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
          let currentAccumulated = accumulatedTimeRef.current;
          if (activeStartRef.current) {
            currentAccumulated += Date.now() - activeStartRef.current;
          }
          saveInProgressSession(sessionStartRef.current, currentAccumulated);
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
    pauseSession,
    resumeSession,
    updateSession,
    isSessionActive,
    getSessionStart,
    getCurrentSessionTime,
    formatDuration,
    startAutoSave,
    stopAutoSave,
  };
};
