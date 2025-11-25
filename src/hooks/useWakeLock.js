import { useCallback, useEffect, useRef, useState } from 'react';
import { checkFeatureSupport, getBrowserInfo } from '../utils/browser.js';

// Hook that contains all wake lock logic
export const useWakeLock = () => {
  const [isWakeLockEnabled, setIsWakeLockEnabled] = useState(false);
  const [wakeLockSupported, setWakeLockSupported] = useState(false);
  const [wakeLockStatus, setWakeLockStatus] = useState('Initializing...');
  const [userWantsWakeLock, setUserWantsWakeLock] = useState(false); // Track user intention
  const [isToggling, setIsToggling] = useState(false); // Prevent multiple toggles
  const wakeLockRef = useRef(null);
  const videoRef = useRef(null);
  const userWantsWakeLockRef = useRef(false);

  // Check if Wake Lock API is supported
  useEffect(() => {
    const featureSupport = checkFeatureSupport();
    const browserInfo = getBrowserInfo();

    if (
      featureSupport.wakeLock.supported &&
      featureSupport.secureContext.supported
    ) {
      setWakeLockSupported(true);
      setWakeLockStatus('Ready - Native API Available');
    } else {
      setWakeLockSupported(false);
      let statusMessage = 'Ready - Video Fallback Available';

      if (!featureSupport.secureContext.supported) {
        statusMessage = 'Requires HTTPS or localhost';
      } else if (!featureSupport.wakeLock.supported) {
        statusMessage = `Fallback mode - ${browserInfo.isChrome ? 'Chrome' : browserInfo.isFirefox ? 'Firefox' : browserInfo.isSafari ? 'Safari' : 'Browser'} detected`;
      }

      setWakeLockStatus(statusMessage);
    }
  }, []);

  // Create invisible video element for fallback
  useEffect(() => {
    if (!wakeLockSupported) {
      const video = document.createElement('video');
      video.setAttribute('muted', '');
      video.setAttribute('playsinline', '');
      video.setAttribute('loop', '');
      video.setAttribute('data-wakelock', 'true');
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

  const requestWakeLock = useCallback(async () => {
    try {
      if (wakeLockSupported) {
        // Use Wake Lock API
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setWakeLockStatus('Wake Lock Active');

        // Listen for wake lock release
        wakeLockRef.current.addEventListener('release', () => {
          setWakeLockStatus('Wake Lock Released (will auto-resume)');
          setIsWakeLockEnabled(false);
          // Don't change userWantsWakeLock - keep user intention
        });
      } else {
        // Fallback method using invisible video
        if (videoRef.current) {
          await videoRef.current.play();
          setWakeLockStatus('Video Fallback Active');
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
  }, [wakeLockSupported]);
  const releaseWakeLock = useCallback(async () => {
    try {
      if (wakeLockSupported && wakeLockRef.current) {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
      } else if (videoRef.current) {
        videoRef.current.pause();
      }
      setWakeLockStatus(
        wakeLockSupported
          ? 'Ready - Native API Available'
          : 'Ready - Video Fallback Available'
      );
      setIsWakeLockEnabled(false);
    } catch (error) {
      console.error('Failed to release wake lock:', error);
      setWakeLockStatus(`Error: ${error.message}`);
    }
  }, [wakeLockSupported]);
  const toggleWakeLock = useCallback(async () => {
    if (isToggling) {
      console.log('Toggle already in progress, ignoring...');
      return;
    }

    setIsToggling(true);

    try {
      const newWantsWakeLock = !userWantsWakeLock;
      console.log(
        'Toggling wake lock from',
        userWantsWakeLock,
        'to',
        newWantsWakeLock,
        '| Current enabled state:',
        isWakeLockEnabled
      );

      // Update user intention first
      setUserWantsWakeLock(newWantsWakeLock);
      userWantsWakeLockRef.current = newWantsWakeLock;

      if (newWantsWakeLock) {
        console.log('Requesting wake lock...');
        // Inline wake lock request
        if (wakeLockSupported) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
          setWakeLockStatus('Wake Lock Active');
          wakeLockRef.current.addEventListener('release', () => {
            setWakeLockStatus('Wake Lock Released (will auto-resume)');
            setIsWakeLockEnabled(false);
          });
        } else {
          if (videoRef.current) {
            await videoRef.current.play();
            setWakeLockStatus('Video Fallback Active');
          }
        }
        setIsWakeLockEnabled(true);
      } else {
        console.log('Releasing wake lock...');
        // Inline wake lock release
        if (wakeLockSupported && wakeLockRef.current) {
          await wakeLockRef.current.release();
          wakeLockRef.current = null;
        } else if (videoRef.current) {
          videoRef.current.pause();
        }
        setWakeLockStatus(
          wakeLockSupported
            ? 'Ready - Native API Available'
            : 'Ready - Video Fallback Available'
        );
        setIsWakeLockEnabled(false);
      }
    } catch (error) {
      console.error('Failed to toggle wake lock:', error);
      setWakeLockStatus(`Error: ${error.message}`);
    } finally {
      setIsToggling(false);
    }
  }, [isToggling, userWantsWakeLock, wakeLockSupported]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        userWantsWakeLock &&
        !isWakeLockEnabled
      ) {
        // Re-request wake lock when page becomes visible again if user wants it
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
    isWakeLockEnabled, // Return actual wake lock state
    userWantsWakeLock, // Expose user intention separately
    wakeLockSupported,
    wakeLockStatus,
    isToggling,
    requestWakeLock,
    releaseWakeLock,
    toggleWakeLock,
  };
};
