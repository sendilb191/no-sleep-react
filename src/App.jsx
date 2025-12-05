import React, { useState, useEffect, useRef } from 'react';
import { FiMoon, FiSun, FiInfo, FiAlertCircle } from 'react-icons/fi';

function App() {
  const [isWakeLockActive, setIsWakeLockActive] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [error, setError] = useState('');
  const [fallbackActive, setFallbackActive] = useState(false);
  const wakeLockRef = useRef(null);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  // Check Wake Lock API support
  useEffect(() => {
    if ('wakeLock' in navigator) {
      setWakeLockSupported(true);
    }
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

  // Fallback methods for older browsers
  const startFallbackMethods = () => {
    // Method 1: Hidden video loop
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        console.log('Video fallback failed');
      });
    }

    // Method 2: Periodic page activity simulation
    intervalRef.current = setInterval(() => {
      // Simulate user activity by creating a tiny DOM change
      document.body.style.background =
        document.body.style.background === 'inherit' ? '' : 'inherit';
    }, 30000); // Every 30 seconds

    setFallbackActive(true);
  };

  const stopFallbackMethods = () => {
    // Stop video
    if (videoRef.current) {
      videoRef.current.pause();
    }

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setFallbackActive(false);
  };

  // Main toggle function
  const toggleWakeLock = async () => {
    if (isWakeLockActive) {
      // Turn off
      await releaseWakeLock();
      stopFallbackMethods();
      setIsWakeLockActive(false);
    } else {
      // Turn on
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

  return (
    <div className='app'>
      <div className='container'>
        <header className='header'>
          <h1>🚫😴 No Sleep</h1>
          <p className='subtitle'>Keep your device awake</p>
        </header>

        <div className='status-card'>
          <div
            className={`status-indicator ${isWakeLockActive ? 'active' : 'inactive'}`}
          >
            {isWakeLockActive ? <FiSun /> : <FiMoon />}
          </div>
          <h2>
            {isWakeLockActive ? 'Device Staying Awake' : 'Device Can Sleep'}
          </h2>
          <p className='status-text'>
            {isWakeLockActive
              ? "Your screen will stay on and your device won't go to sleep"
              : 'Click the button below to prevent your device from sleeping'}
          </p>
        </div>

        <button
          className={`wake-lock-button ${isWakeLockActive ? 'active' : ''}`}
          onClick={toggleWakeLock}
          type='button'
        >
          {isWakeLockActive ? 'Allow Sleep' : 'Prevent Sleep'}
        </button>

        {error && (
          <div className='error-message'>
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <div className='info-section'>
          <div className='info-item'>
            <FiInfo />
            <div>
              <strong>Wake Lock API:</strong>{' '}
              {wakeLockSupported ? '✅ Supported' : '❌ Not Supported'}
            </div>
          </div>

          {!wakeLockSupported && (
            <div className='info-item'>
              <FiInfo />
              <div>
                <strong>Fallback Mode:</strong>{' '}
                {fallbackActive ? '✅ Active' : '⏸️ Inactive'}
              </div>
            </div>
          )}

          <div className='info-item'>
            <FiInfo />
            <div>
              <strong>Browser:</strong> {navigator.userAgent.split(' ').pop()}
            </div>
          </div>
        </div>

        <div className='instructions'>
          <h3>How it works:</h3>
          <ul>
            <li>Uses the modern Screen Wake Lock API when available</li>
            <li>Falls back to alternative methods for older browsers</li>
            <li>Automatically reactivates when you return to the tab</li>
            <li>Works best when the tab is active and visible</li>
          </ul>
        </div>

        {/* Hidden video for fallback */}
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          style={{ display: 'none' }}
        >
          <source
            src='data:video/mp4;base64,AAAAHGZ0eXBpc29tAAACAGlzb21pc28ybXA0MQAAAAhmcmVlAAAACG1kYXQAAAAPbW9vdgAAAGxtdmhkAAAAANUxdb7VMXW+AAAAUAAAAUAAQUAAACAAAAEAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAACFpb2RzAAAAE2VzZHMAAAAAA4CAgE8AAQAAAAAAAAABAAAAAAAAAA=='
            type='video/mp4'
          />
        </video>
      </div>
    </div>
  );
}

export default App;
