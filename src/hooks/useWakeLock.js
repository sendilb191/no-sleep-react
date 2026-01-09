import { useState, useEffect, useCallback, useRef } from 'react';
import { useHistory } from './useHistory';
import { TIMER_PRESETS } from '../constants';

export { TIMER_PRESETS };

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [selectedTimer, setSelectedTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Use history hook for session tracking
  const {
    history,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
    getCurrentSessionTime,
    formatDuration,
    startAutoSave,
    stopAutoSave,
  } = useHistory();

  // Track if we're just switching tabs (to prevent glitch)
  const isReactivating = useRef(false);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

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

      // Start session tracking
      startSession();
      startAutoSave();

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
  }, [startSession, startAutoSave]);

  // Handle wake lock deactivation
  const releaseWakeLock = useCallback(async () => {
    // End session and stop auto-save
    endSession();
    stopAutoSave();

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
  }, [endSession, stopAutoSave, wakeLock]);

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
        // Resume session time tracking
        resumeSession();
        // Mark that we're reactivating to prevent glitch
        isReactivating.current = true;
        console.log('Tab focused, requesting wake lock');
        requestWakeLock().finally(() => {
          // Reset the flag after reactivation attempt
          setTimeout(() => {
            isReactivating.current = false;
          }, 100);
        });
      } else {
        // Pause session time tracking when tab is hidden
        pauseSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    getCurrentSessionTime,
  };
};
