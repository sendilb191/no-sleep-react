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
          console.log('Wake lock was released by system');
          setIsActive(false);
          setWakeLock(null);
          // Don't update app-settings when system releases wake lock
          // This keeps the user's intent to have wake lock active
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
  }, [wakeLock, onActiveChange]);

  const toggleWakeLock = useCallback(() => {
    if (isActive) {
      console.log('User manually disabling wake lock');
      releaseWakeLock();
    } else {
      console.log('User manually enabling wake lock');
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

  // Sync with external state changes immediately
  useEffect(() => {
    if (!initialized.current) return;

    // Sync state based on initialActive setting
    if (initialActive && !isActive) {
      // Try to re-acquire wake lock if setting is active but wake lock was lost
      console.log('Re-acquiring wake lock due to settings');
      requestWakeLock();
    } else if (!initialActive && isActive) {
      // Release if user disabled it in settings
      console.log('Releasing wake lock due to user settings');
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
        // Re-request wake lock if settings indicate it should be active or it was active before hiding
        if (
          (wasActiveBeforeHidden.current && !isActive) ||
          (initialActive && !isActive)
        ) {
          console.log('Re-acquiring wake lock after tab became visible');
          requestWakeLock();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, initialActive, requestWakeLock]);

  // Periodic check to maintain wake lock if settings indicate it should be active
  useEffect(() => {
    if (!initialActive) return;

    const intervalId = setInterval(() => {
      if (
        initialActive &&
        !isActive &&
        document.visibilityState === 'visible'
      ) {
        console.log('Periodic wake lock check - re-acquiring');
        requestWakeLock();
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(intervalId);
  }, [initialActive, isActive, requestWakeLock]);

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
