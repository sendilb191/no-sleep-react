import { useState, useEffect, useCallback, useRef } from 'react';

const useWakeLockState = (initialActive = false, onActiveChange = null) => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(initialActive);
  const initialized = useRef(false);
  const wasActiveBeforeHidden = useRef(false);
  const userHasInteracted = useRef(false);

  const requestWakeLock = useCallback(async () => {
    // Prevent multiple wake lock requests
    if (wakeLock || isActive) {
      return;
    }

    // Check if page is visible and we have user interaction
    if (document.visibilityState !== 'visible') {
      console.log('Wake Lock cannot be requested: page not visible');
      return;
    }

    try {
      if ('wakeLock' in navigator) {
        const lock = await navigator.wakeLock.request('screen');
        setWakeLock(lock);
        setIsActive(true);
        onActiveChange?.(true);
        console.log('Wake lock activated successfully');

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

      // If error is due to page visibility or user activation, provide helpful message
      if (error.name === 'NotAllowedError') {
        console.log(
          'Wake Lock requires page to be visible and user interaction. Try clicking on the page first.'
        );
      }
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

  // Track user interaction for wake lock activation
  useEffect(() => {
    const handleUserInteraction = () => {
      userHasInteracted.current = true;
    };

    // Listen for various user interaction events
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, []);

  // Initialize wake lock from external state
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    // Only request wake lock if initialActive is true, but delay until user interaction
    if (initialActive) {
      // If user has already interacted, request immediately
      if (userHasInteracted.current) {
        requestWakeLock();
      } else {
        // Wait for user interaction, then request wake lock
        const waitForInteraction = () => {
          if (userHasInteracted.current && initialActive) {
            requestWakeLock();
          } else {
            setTimeout(waitForInteraction, 100);
          }
        };
        waitForInteraction();
      }
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
        // Add a small delay to ensure the page is fully visible before requesting wake lock
        setTimeout(() => {
          if (
            (wasActiveBeforeHidden.current && !isActive) ||
            (initialActive && !isActive)
          ) {
            console.log('Re-acquiring wake lock after tab became visible');
            requestWakeLock();
          }
        }, 100);
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
      // Only try to re-acquire if page is visible and user has interacted
      if (
        initialActive &&
        !isActive &&
        document.visibilityState === 'visible' &&
        document.hasFocus()
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
