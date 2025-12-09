import { useState, useEffect, useRef } from 'react';

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
          console.log('Wake Lock was released');
        });
        console.log('Wake Lock is active');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to request wake lock:', err);
      return false;
    }
  };

  // Release wake lock
  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock released');
      } catch (err) {
        console.error('Failed to release wake lock:', err);
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
