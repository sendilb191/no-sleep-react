import { useState, useEffect, useRef } from 'react';
import { DEFAULT_SETTINGS } from '../constants/defaultSettings';

export const useWakeLock = () => {
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const wakeLockRef = useRef(null);

  // Handle visibility change (user switches tabs/minimizes)
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible' && isWakeLockActive) {
        await requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () =>
      document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isWakeLockActive]);

  // Modern Wake Lock API implementation
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        wakeLockRef.current.addEventListener('release', () => {
          // Wake Lock was released
        });
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Release wake lock
  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } catch (err) {
        // Handle wake lock release error silently
      }
    }
  };

  // Main toggle function
  const toggleWakeLock = async () => {
    if (isWakeLockActive) {
      await releaseWakeLock();
      setIsWakeLockActive(false);
    } else {
      const success = await requestWakeLock();
      if (success) {
        setIsWakeLockActive(true);
      }
    }
  };

  // Enable wake lock by default on mount (if configured)
  useEffect(() => {
    const enableDefaultWakeLock = async () => {
      if (DEFAULT_SETTINGS.WAKE_LOCK_ENABLED_BY_DEFAULT) {
        const success = await requestWakeLock();
        if (success) {
          setIsWakeLockActive(true);
        }
      }
    };

    enableDefaultWakeLock();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, []);

  return {
    isWakeLockActive,
    toggleWakeLock,
  };
};
