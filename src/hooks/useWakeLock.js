import { useState, useEffect, useRef, useCallback } from 'react';
import {
  checkWakeLockSupport,
  createVideoElement,
  requestWakeLock as requestWakeLockUtil,
  releaseWakeLock as releaseWakeLockUtil,
} from '../utils/wakeLockService.js';
import {
  loadWakeLockPreference,
  saveWakeLockPreference,
} from '../utils/settingsService.js';

export const useWakeLock = () => {
  const [isWakeLockEnabled, setIsWakeLockEnabled] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [wakeLockStatus, setWakeLockStatus] = useState('Initializing...');
  const [userWantsWakeLock, setUserWantsWakeLock] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const wakeLockRef = useRef(null);
  const videoRef = useRef(null);

  // Initialize wake lock support and load preferences
  useEffect(() => {
    const support = checkWakeLockSupport();
    setWakeLockSupported(support.supported);
    setWakeLockStatus(support.status);

    const savedPreference = loadWakeLockPreference();
    setUserWantsWakeLock(savedPreference);

    setIsInitialized(true);
  }, []);

  // Create video element for fallback
  useEffect(() => {
    if (!wakeLockSupported) {
      const video = createVideoElement();
      document.body.appendChild(video);
      videoRef.current = video;
    }

    return () => {
      if (videoRef.current && !wakeLockSupported) {
        document.body.removeChild(videoRef.current);
      }
    };
  }, [wakeLockSupported]);

  const requestWakeLock = useCallback(async () => {
    const result = await requestWakeLockUtil(wakeLockSupported, videoRef);
    if (result.success) {
      if (result.wakeLock) {
        wakeLockRef.current = result.wakeLock;
        result.wakeLock.addEventListener('release', () => {
          setWakeLockStatus('Wake Lock Released (will auto-resume)');
          setIsWakeLockEnabled(false);
        });
      }
      setIsWakeLockEnabled(true);
    }
    setWakeLockStatus(result.status);
  }, [wakeLockSupported]);

  const releaseWakeLock = useCallback(async () => {
    const result = await releaseWakeLockUtil(
      wakeLockSupported,
      wakeLockRef,
      videoRef
    );
    if (result.success) {
      wakeLockRef.current = null;
      setIsWakeLockEnabled(false);
    }
    setWakeLockStatus(result.status);
  }, [wakeLockSupported]);

  const toggleWakeLock = useCallback(async () => {
    if (isToggling) return;

    setIsToggling(true);
    try {
      const newWantsWakeLock = !userWantsWakeLock;
      setUserWantsWakeLock(newWantsWakeLock);

      // Save preference to localStorage
      saveWakeLockPreference(newWantsWakeLock);

      if (newWantsWakeLock) {
        await requestWakeLock();
      } else {
        await releaseWakeLock();
      }
    } finally {
      setIsToggling(false);
    }
  }, [isToggling, userWantsWakeLock, requestWakeLock, releaseWakeLock]);

  // Restore wake lock if user previously wanted it (after initialization and if page is visible)
  useEffect(() => {
    if (
      isInitialized &&
      userWantsWakeLock &&
      !isWakeLockEnabled &&
      document.visibilityState === 'visible'
    ) {
      console.log('Restoring wake lock from saved preference');
      requestWakeLock();
    }
  }, [isInitialized, userWantsWakeLock, isWakeLockEnabled, requestWakeLock]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        userWantsWakeLock &&
        !isWakeLockEnabled
      ) {
        console.log('Tab became visible, attempting to restore wake lock');
        requestWakeLock();
      } else if (document.visibilityState === 'hidden' && isWakeLockEnabled) {
        console.log(
          'Tab became hidden, wake lock will be automatically released by browser'
        );
      }
    };

    // Also handle focus events as an additional trigger
    const handleFocus = () => {
      if (userWantsWakeLock && !isWakeLockEnabled) {
        console.log('Window focused, attempting to restore wake lock');
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [userWantsWakeLock, isWakeLockEnabled, requestWakeLock]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  return {
    isWakeLockEnabled,
    userWantsWakeLock,
    wakeLockSupported,
    wakeLockStatus,
    isToggling,
    toggleWakeLock,
  };
};
