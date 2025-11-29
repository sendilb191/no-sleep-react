import { useState, useEffect, useCallback, useRef } from 'react';

const useWakeLockState = () => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const initialized = useRef(false);

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
          localStorage.setItem('wakeLockActive', 'false');
        });
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
      requestWakeLock();
    } else {
      setIsActive(false);
    }
  }, [requestWakeLock]);

  // Cleanup wake lock on unmount
  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  return {
    isActive,
    requestWakeLock,
    releaseWakeLock,
    toggleWakeLock,
  };
};

export default useWakeLockState;
