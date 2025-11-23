import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [isWakeLockEnabled, setIsWakeLockEnabled] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [wakeLockStatus, setWakeLockStatus] = useState('Not active');
  const wakeLockRef = useRef(null);
  const videoRef = useRef(null);

  // Check if Wake Lock API is supported
  useEffect(() => {
    if ('wakeLock' in navigator) {
      setWakeLockSupported(true);
    }
  }, []);

  // Create invisible video element for fallback
  useEffect(() => {
    if (!wakeLockSupported) {
      const video = document.createElement('video');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('loop', '');
      video.style.position = 'fixed';
      video.style.top = '-1000px';
      video.style.left = '-1000px';
      video.style.width = '1px';
      video.style.height = '1px';
      video.style.opacity = '0';

      // Create a tiny video data URL
      video.src =
        'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWF2YzEAAAAIZnJlZQAAAsdtZGF0AAAC6wYF//+r3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1OSByMjk5MSAxNzcxYjU1IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIGNyZj0yMy4wIHFjb21wPTAuNjAgcWNvbXBfb2Zmc2V0PTQuMDAgcWNvbXBfYWRhcHQ9MS4wMCBxY29tcF9tdWx0aXBsZWNrPTEuMDAgcWNvbXBfbXVsdGlwbGVjcF8zcGFzcz0xLjAwIGNvbXBsZXhpdHlfYmx1cj0yMCBxYmx1cj0wLjUgcXN0YXJ0PTAgcXN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//72rvzLK0cLlS4dWXuzUfLoSXL9iDB9aAAAAwAAAwAAJuABAAH5UAAAAgAA8w==';

      document.body.appendChild(video);
      videoRef.current = video;
    }

    return () => {
      if (videoRef.current && !wakeLockSupported) {
        document.body.removeChild(videoRef.current);
      }
    };
  }, [wakeLockSupported]);

  const requestWakeLock = async () => {
    try {
      if (wakeLockSupported) {
        // Use Wake Lock API
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setWakeLockStatus('Wake Lock active');

        // Listen for wake lock release
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockStatus('Wake Lock released');
          setIsWakeLockEnabled(false);
        });
      } else {
        // Fallback method using invisible video
        if (videoRef.current) {
          await videoRef.current.play();
          setWakeLockStatus('Video fallback active');
        } else {
          throw new Error('Fallback method not available');
        }
      }
      setIsWakeLockEnabled(true);
    } catch (error) {
      console.error('Failed to request wake lock:', error);
      setWakeLockStatus(`Error: ${error.message}`);
      setIsWakeLockEnabled(false);
    }
  };

  const releaseWakeLock = async () => {
    try {
      if (wakeLockSupported && wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } else if (videoRef.current) {
        videoRef.current.pause();
      }
      setWakeLockStatus('Wake Lock released');
      setIsWakeLockEnabled(false);
    } catch (error) {
      console.error('Failed to release wake lock:', error);
      setWakeLockStatus(`Error: ${error.message}`);
    }
  };

  const toggleWakeLock = () => {
    if (isWakeLockEnabled) {
      releaseWakeLock();
    } else {
      requestWakeLock();
    }
  };

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        isWakeLockEnabled &&
        wakeLockSupported
      ) {
        // Re-request wake lock when page becomes visible again
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isWakeLockEnabled, wakeLockSupported]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, []);

  return (
    <>
      <div>
        <h1>No Sleep React App</h1>
        <p>Keep your screen awake with Wake Lock API!</p>
      </div>

      <div className='wake-lock-controls'>
        <h2>Screen Wake Lock Control</h2>

        <div className='status-info'>
          <p>
            <strong>Wake Lock Support:</strong>{' '}
            {wakeLockSupported
              ? 'Native API Available'
              : 'Using Video Fallback'}
          </p>
          <p>
            <strong>Status:</strong> {wakeLockStatus}
          </p>
        </div>

        <div className='toggle-buttons'>
          <button
            onClick={toggleWakeLock}
            className={`toggle-btn ${
              isWakeLockEnabled ? 'active' : 'inactive'
            }`}
          >
            {isWakeLockEnabled ? '🔓 Release Wake Lock' : '🔒 Enable Wake Lock'}
          </button>

          <button
            onClick={requestWakeLock}
            disabled={isWakeLockEnabled}
            className='action-btn enable-btn'
          >
            Enable Screen Lock Prevention
          </button>

          <button
            onClick={releaseWakeLock}
            disabled={!isWakeLockEnabled}
            className='action-btn disable-btn'
          >
            Allow Screen Lock
          </button>
        </div>

        <div className='info-section'>
          <h3>How it works:</h3>
          <ul>
            <li>Uses native Wake Lock API when supported</li>
            <li>Falls back to invisible video playback for older browsers</li>
            <li>Automatically re-activates when tab becomes visible</li>
            <li>Prevents screen from turning off or device from sleeping</li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
