import { useState, useEffect, useCallback } from 'react';

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState('');
  const [userWantsWakeLock, setUserWantsWakeLock] = useState(true);

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
      setUserWantsWakeLock(true);

      // Listen for wake lock release
      lock.addEventListener('release', () => {
        console.log('Wake Lock was released');
        setIsActive(false);
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
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
        setUserWantsWakeLock(false); // User manually turned it off
        console.log('Wake Lock released');
      } catch (err) {
        setError(`Failed to release wake lock: ${err.message}`);
        console.error('Wake lock release failed:', err);
      }
    } else {
      // If there's no active wake lock but user wants to turn off the intent
      setUserWantsWakeLock(false);
      setIsActive(false);
    }
  }, [wakeLock]);

  // Toggle wake lock
  const toggleWakeLock = useCallback(() => {
    if (userWantsWakeLock) {
      releaseWakeLock();
    } else {
      requestWakeLock();
    }
  }, [userWantsWakeLock, releaseWakeLock, requestWakeLock]);

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
      if (document.visibilityState === 'visible' && userWantsWakeLock) {
        // When tab becomes visible and user wants wake lock, reactivate it
        console.log('Tab focused, requesting wake lock');
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLock && !wakeLock.released) {
        wakeLock.release();
      }
    };
  }, [userWantsWakeLock, requestWakeLock, wakeLock]);

  return {
    isActive,
    isSupported,
    error,
    userWantsWakeLock,
    toggleWakeLock,
  };
};
