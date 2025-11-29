import { useState, useEffect, useCallback, useRef } from 'react';

const useWakeLockState = (initialActive = false, onActiveChange = null) => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(initialActive);
  const initialized = useRef(false);
  const wasActiveBeforeHidden = useRef(false);

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
        onActiveChange?.(true);

        // Handle wake lock release events
        lock.addEventListener('release', () => {
          setIsActive(false);
          setWakeLock(null);
          onActiveChange?.(false);
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
      onActiveChange?.(false);
    }
  }, [wakeLock]);

  const toggleWakeLock = useCallback(() => {
    if (isActive) {
      releaseWakeLock();
    } else {
      requestWakeLock();
    }
  }, [isActive, releaseWakeLock, requestWakeLock]);

  // Initialize wake lock from external state
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (initialActive) {
      requestWakeLock();
    }
  }, [requestWakeLock, initialActive]);

  // Sync with external state changes
  useEffect(() => {
    if (!initialized.current) return;

    if (initialActive && !isActive) {
      requestWakeLock();
    } else if (!initialActive && isActive) {
      releaseWakeLock();
    }
  }, [initialActive, isActive, requestWakeLock, releaseWakeLock]);

  // Handle tab visibility changes to restore wake lock
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Remember if wake lock was active when tab became hidden
        wasActiveBeforeHidden.current = isActive;
      } else if (document.visibilityState === 'visible') {
        // Re-request wake lock if it was active before hiding
        if (wasActiveBeforeHidden.current && !isActive) {
          requestWakeLock();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, requestWakeLock]);

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
