import { useState, useEffect, useCallback, useRef } from 'react';

const useWakeLockState = (initialActive = false, onActiveChange = null) => {
  const [wakeLock, setWakeLock] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const shouldBeActive = useRef(initialActive);
  const userHasInteracted = useRef(false);

  // Update shouldBeActive when initialActive changes
  useEffect(() => {
    shouldBeActive.current = initialActive;
  }, [initialActive]);

  // Acquire wake lock - simplified version based on working code
  const acquireWakeLock = useCallback(async () => {
    // Check if page is visible before requesting wake lock
    if (document.visibilityState === 'hidden') {
      console.log('Cannot acquire wake lock: page is not visible');
      return;
    }

    // Check if wake lock is supported
    if (!('wakeLock' in navigator)) {
      console.log('Wake Lock API not supported');
      return;
    }

    // Don't acquire if already active
    if (wakeLock) {
      console.log('Wake lock already active');
      return;
    }

    try {
      const lock = await navigator.wakeLock.request('screen');
      setWakeLock(lock);
      setIsActive(true);
      onActiveChange?.(true);
      console.log('🔒 Wake lock acquired');

      lock.addEventListener('release', () => {
        setWakeLock(null);
        setIsActive(false);
        onActiveChange?.(false);
        console.log('🔓 Wake lock released');
      });
    } catch (err) {
      if (err.name === 'NotAllowedError') {
        console.log(
          'Wake lock not allowed: Page might not be visible or user denied permission'
        );
      } else {
        console.error(`Could not acquire wake lock: ${err}`);
      }
    }
  }, [wakeLock, onActiveChange]);

  // Release wake lock
  const releaseWakeLock = useCallback(async () => {
    if (wakeLock) {
      try {
        await wakeLock.release();
        setWakeLock(null);
        setIsActive(false);
        onActiveChange?.(false);
        console.log('🔓 Wake lock manually released');
      } catch (err) {
        console.error(`Could not release wake lock: ${err}`);
      }
    }
  }, [wakeLock, onActiveChange]);

  // Toggle wake lock
  const toggleWakeLock = useCallback(() => {
    if (isActive) {
      console.log('👤 Disabling wake lock');
      releaseWakeLock();
    } else {
      console.log('👤 Enabling wake lock');
      acquireWakeLock();
    }
  }, [isActive, releaseWakeLock, acquireWakeLock]);

  // Track user interaction for wake lock activation
  useEffect(() => {
    const handleUserInteraction = () => {
      userHasInteracted.current = true;
      console.log('👤 User interaction detected');
    };

    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    events.forEach(event => {
      document.addEventListener(event, handleUserInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleUserInteraction);
      });
    };
  }, []);

  // Setup visibility change handling
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Page hidden - wake lock may be released by system
      } else if (document.visibilityState === 'visible') {
        if (shouldBeActive.current && !wakeLock && userHasInteracted.current) {
          setTimeout(() => {
            acquireWakeLock();
          }, 100);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [wakeLock, acquireWakeLock]);

  // Initialize wake lock when settings change
  useEffect(() => {
    if (initialActive && !isActive && userHasInteracted.current) {
      acquireWakeLock();
    } else if (!initialActive && isActive) {
      releaseWakeLock();
    }
  }, [initialActive, isActive, acquireWakeLock, releaseWakeLock]);

  // Auto-acquire on first interaction
  useEffect(() => {
    if (userHasInteracted.current || !initialActive || isActive) return;

    const handleFirstInteraction = () => {
      if (initialActive && !wakeLock) {
        // First interaction - acquiring wake lock
        acquireWakeLock();
      }
    };

    const events = ['click', 'keydown', 'touchstart', 'mousedown'];
    events.forEach(event => {
      document.addEventListener(event, handleFirstInteraction, {
        once: true,
        passive: true,
      });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleFirstInteraction);
      });
    };
  }, [initialActive, isActive, wakeLock, acquireWakeLock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLock) {
        wakeLock.release();
      }
    };
  }, [wakeLock]);

  return {
    isActive,
    requestWakeLock: acquireWakeLock,
    releaseWakeLock,
    toggleWakeLock,
    wakeLockSupported: 'wakeLock' in navigator,
    usingFallback: false,
  };
};

export default useWakeLockState;
