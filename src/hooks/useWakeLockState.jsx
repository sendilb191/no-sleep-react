import { useState, useEffect, useCallback, useRef } from 'react';

const useWakeLockState = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const initialized = useRef(false);
  const userWantsWakeLock = useRef(false);

  const requestWakeLock = useCallback(async () => {
    // Prevent multiple wake lock requests
    if (wakeLock || isActive) {
      return;
    }

    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setIsActive(true);
        localStorage.setItem('wakeLockActive', 'true');

        // Handle wake lock release events
        lock.addEventListener('release', () => {
          setIsActive(false);
          setWakeLock(null);
        });

        userWantsWakeLock.current = true;
      } else {
        console.log('Wake Lock API is not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to activate Wake Lock:', error);
    }
  }, [wakeLock, isActive]);

  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      await wakeLock.release();
      setWakeLock(null);
      setIsActive(false);
      localStorage.setItem('wakeLockActive', 'false');
      userWantsWakeLock.current = false;
    }
  }, [wakeLock]);

  const toggleWakeLock = useCallback(() => {
    if (isActive) {
      releaseWakeLock();
    } else {
      requestWakeLock();
    }
  }, [isActive, releaseWakeLock, requestWakeLock]);

  // Initialize wake lock from localStorage
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const savedWakeLockState = localStorage.getItem('wakeLockActive');
    if (savedWakeLockState === 'true') {
      userWantsWakeLock.current = true;
      requestWakeLock();
    } else {
      userWantsWakeLock.current = false;
      setIsActive(false);
    }
  }, [requestWakeLock]);

  // Handle page visibility changes to re-request wake lock if needed
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        userWantsWakeLock.current &&
        !wakeLock
      ) {
        // Re-request wake lock when page becomes visible again and user wants it
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeLock, requestWakeLock]);

  // Only cleanup wake lock on component unmount (not on every wakeLock change)
  useEffect(() => {
    return () => {
      // Only release if we're truly unmounting the component
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, []); // Empty dependency array - only runs on mount/unmount

  return {
    isActive,
    requestWakeLock,
    releaseWakeLock,
    toggleWakeLock,
  };
};

export default useWakeLockState;
