import { useState, useEffect, useRef } from 'react';
import { useAudio } from './useAudio';

export const useWakeLock = () => {
  const { playWakeLockBeep, resumeAudioContext } = useAudio();
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);
  const [error, setError] = useState('');

  const wakeLockRef = useRef(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Check Wake Lock API support
  useEffect(() => {
    if ('wakeLock' in navigator) {
      setWakeLockSupported(true);
    }
  }, []);

  // Auto-activate wake lock on app load
  useEffect(() => {
    const activateWakeLockOnLoad = async () => {
      let success = false;

      if ('wakeLock' in navigator) {
        success = await requestWakeLock();
      }

      if (!success) {
        startFallbackMethods();
        success = true;
      }

      if (success) {
        setIsWakeLockActive(true);
      }
    };

    // Activate wake lock after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      activateWakeLockOnLoad();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

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
        setError('');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to request wake lock:', err);
      setError(`Wake Lock failed: ${err.message}`);
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
        setError('');
      } catch (err) {
        console.error('Failed to release wake lock:', err);
        setError(`Failed to release: ${err.message}`);
      }
    }
  };

  const startFallbackMethods = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Video fallback failed');
      });
    }

    setFallbackActive(true);
  };

  const stopFallbackMethods = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setFallbackActive(false);
  };

  // Main toggle function
  const toggleWakeLock = async () => {
    try {
      // Resume audio context before playing beeps
      await resumeAudioContext();

      if (isWakeLockActive) {
        await releaseWakeLock();
        stopFallbackMethods();
        setIsWakeLockActive(false);

        // Play beep for wake lock disabled
        console.log('🔊 Playing wake lock disabled beep');
        await playWakeLockBeep(false);
      } else {
        let success = false;

        if (wakeLockSupported) {
          success = await requestWakeLock();
        }

        if (!success || !wakeLockSupported) {
          // Use fallback methods
          startFallbackMethods();
          success = true;
        }

        if (success) {
          setIsWakeLockActive(true);

          // Play beep for wake lock enabled
          console.log('🔊 Playing wake lock enabled beep');
          await playWakeLockBeep(true);
        }
      }
    } catch (error) {
      console.warn('Error in toggleWakeLock with beep:', error);
      // Continue with original functionality even if beep fails
      if (isWakeLockActive) {
        await releaseWakeLock();
        stopFallbackMethods();
        setIsWakeLockActive(false);
      } else {
        let success = false;

        if (wakeLockSupported) {
          success = await requestWakeLock();
        }

        if (!success || !wakeLockSupported) {
          startFallbackMethods();
          success = true;
        }

        if (success) {
          setIsWakeLockActive(true);
        }
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      releaseWakeLock();
      stopFallbackMethods();
    };
  }, []);

  return {
    isWakeLockActive,
    wakeLockSupported,
    fallbackActive,
    error,
    toggleWakeLock,
    videoRef,
  };
};
