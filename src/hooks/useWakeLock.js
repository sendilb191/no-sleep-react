import { useState, useEffect, useCallback, useRef } from 'react';

// Timer presets in minutes
export const TIMER_PRESETS = [
  { label: 'Off', value: null },
  { label: '30m', value: 30 },
  { label: '1h', value: 60 },
  { label: '2h', value: 120 },
];

const HISTORY_KEY = 'wakeLockHistory';
const MAX_HISTORY = 3;

// Helper to load history from localStorage
const loadHistory = () => {
  try {
    const stored = window.localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save history to localStorage
const saveHistory = history => {
  try {
    window.localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, MAX_HISTORY))
    );
  } catch {
    // Ignore storage errors
  }
};

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [history, setHistory] = useState(() => loadHistory());

  // Track if we're just switching tabs (to prevent glitch)
  const isReactivating = useRef(false);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);
  const sessionStartRef = useRef(null);

  // Save session to history
  const saveSession = useCallback(() => {
    if (sessionStartRef.current) {
      const duration = Math.floor(
        (Date.now() - sessionStartRef.current) / 1000
      );
      // Only save if session was longer than 5 seconds
      if (duration > 5) {
        const newSession = {
          id: Date.now(),
          startTime: sessionStartRef.current,
          duration,
        };
        setHistory(prev => {
          const updated = [newSession, ...prev].slice(0, MAX_HISTORY);
          saveHistory(updated);
          return updated;
        });
      }
      sessionStartRef.current = null;
    }
  }, []);

  // Handle wake lock activation
  const requestWakeLock = useCallback(async () => {
    // Only request wake lock if page is visible
    if (document.visibilityState !== 'visible') {
      console.log('Page not visible, skipping wake lock request');
      return;
    }

    try {
      setError('');
      console.log('Requesting wake lock...');
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      setIsActive(true);

      // Start session tracking if not already started
      if (!sessionStartRef.current) {
        sessionStartRef.current = Date.now();
      }

      // Listen for wake lock release
      lock.addEventListener('release', () => {
        console.log('Wake Lock was released');
        // Only update isActive if we're not reactivating due to tab switch
        if (!isReactivating.current) {
          setIsActive(false);
        }
        setWakeLock(null);
      });

      console.log('Wake Lock is now active');
    } catch (err) {
      setError(`Failed to activate wake lock: ${err.message}`);
      console.error('Wake lock request failed:', err);
      setIsActive(false);
    }
  }, []);

  // Handle wake lock deactivation
  const releaseWakeLock = useCallback(async () => {
    // Save session before releasing
    saveSession();

    // Clear any active timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setTimeRemaining(null);
    setSelectedTimer(null);

    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
        console.log('Wake Lock released');
      } catch (err) {
        setError(`Failed to release wake lock: ${err.message}`);
        console.error('Wake lock release failed:', err);
      }
    } else {
      setIsActive(false);
    }
  }, [saveSession, wakeLock]);

  // Start timer to auto-turn off wake lock
  const startTimer = useCallback(
    minutes => {
      // Clear existing timers
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      if (minutes === null) {
        setSelectedTimer(null);
        setTimeRemaining(null);
        return;
      }

      setSelectedTimer(minutes);
      const endTime = Date.now() + minutes * 60 * 1000;
      setTimeRemaining(minutes * 60);

      // Update countdown every second
      countdownRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimeRemaining(remaining);

        if (remaining <= 0) {
          clearInterval(countdownRef.current);
          countdownRef.current = null;
        }
      }, 1000);

      // Set timer to turn off wake lock
      timerRef.current = setTimeout(
        () => {
          console.log('Timer expired, releasing wake lock');
          releaseWakeLock();
        },
        minutes * 60 * 1000
      );
    },
    [releaseWakeLock]
  );

  // Check if Wake Lock API is supported and auto-activate on load
  useEffect(() => {
    if ('wakeLock' in navigator) {
      setIsSupported(true);
      // Auto-activate wake lock on page load
      requestWakeLock();
    } else {
      setIsSupported(false);
      setError('Wake Lock API is not supported in this browser');
    }
  }, [requestWakeLock]);

  // Handle tab focus - reactivate when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Mark that we're reactivating to prevent glitch
        isReactivating.current = true;
        console.log('Tab focused, requesting wake lock');
        requestWakeLock().finally(() => {
          // Reset the flag after reactivation attempt
          setTimeout(() => {
            isReactivating.current = false;
          }, 100);
        });
      }
    };

    // Save session when page is being closed
    const handleBeforeUnload = () => {
      if (sessionStartRef.current) {
        const duration = Math.floor(
          (Date.now() - sessionStartRef.current) / 1000
        );
        if (duration > 5) {
          const newSession = {
            id: Date.now(),
            startTime: sessionStartRef.current,
            duration,
          };
          const currentHistory = loadHistory();
          saveHistory([newSession, ...currentHistory]);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (wakeLock && !wakeLock.released) {
        wakeLock.release();
      }
      // Clear timers on unmount
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [requestWakeLock, wakeLock]);

  // Format time remaining for display
  const formatTimeRemaining = useCallback(() => {
    if (timeRemaining === null) return null;
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, [timeRemaining]);

  // Format duration for history display
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

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory([]);
    window.localStorage.removeItem(HISTORY_KEY);
  }, []);

  return {
    isActive,
    isSupported,
    error,
    selectedTimer,
    timeRemaining,
    formatTimeRemaining,
    startTimer,
    history,
    formatDuration,
    clearHistory,
  };
};
