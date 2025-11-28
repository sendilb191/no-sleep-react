import { checkFeatureSupport, getBrowserInfo } from './browser.js';

export const checkWakeLockSupport = () => {
  const featureSupport = checkFeatureSupport();
  const browserInfo = getBrowserInfo();

  if (
    featureSupport.wakeLock.supported &&
    featureSupport.secureContext.supported
  ) {
    return {
      supported: true,
      status: 'Ready - Native API Available',
    };
  } else {
    let statusMessage = 'Ready - Video Fallback Available';

    if (!featureSupport.secureContext.supported) {
      statusMessage = 'Requires HTTPS or localhost';
    } else if (!featureSupport.wakeLock.supported) {
      statusMessage = `Fallback mode - ${browserInfo.isChrome ? 'Chrome' : browserInfo.isFirefox ? 'Firefox' : browserInfo.isSafari ? 'Safari' : 'Browser'} detected`;
    }

    return {
      supported: false,
      status: statusMessage,
    };
  }
};

export const createVideoElement = () => {
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

  video.src =
    'data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMWF2YzEAAAAIZnJlZQAAAsdtZGF0AAAC6wYF//+r3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE1OSByMjk5MSAxNzcxYjU1IC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxOSAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTMgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MzoweDExMyBtZT1oZXggc3VibWU9NyBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0xIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MSA4eDhkY3Q9MSBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0tMiB0aHJlYWRzPTEgbG9va2FoZWFkX3RocmVhZHM9MSBzbGljZWRfdGhyZWFkcz0wIG5yPTAgZGVjaW1hdGU9MSBpbnRlcmxhY2VkPTAgYmx1cmF5X2NvbXBhdD0wIGNvbnN0cmFpbmVkX2ludHJhPTAgYmZyYW1lcz0zIGJfcHlyYW1pZD0yIGJfYWRhcHQ9MSBiX2JpYXM9MCBkaXJlY3Q9MSB3ZWlnaHRiPTEgb3Blbl9nb3A9MCB3ZWlnaHRwPTIga2V5aW50PTI1MCBrZXlpbnRfbWluPTI1IHNjZW5lY3V0PTQwIGludHJhX3JlZnJlc2g9MCByY19sb29rYWhlYWQ9NDAgcmM9Y3JmIGNyZj0yMy4wIHFjb21wPTAuNjAgcWNvbXBfb2Zmc2V0PTQuMDAgcWNvbXBfYWRhcHQ9MS4wMCBxY29tcF9tdWx0aXBsZWNrPTEuMDAgcWNvbXBfbXVsdGlwbGVjcF8zcGFzcz0xLjAwIGNvbXBsZXhpdHlfYmx1cj0yMCBxYmx1cj0wLjUgcXN0YXJ0PTAgcXN0ZXA9NCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//72rvzLK0cLlS4dWXuzUfLoSXL9iDB9aAAAAwAAAwAAJuABAAH5UAAAAgAA8w==';

  return video;
};

export const requestWakeLock = async (wakeLockSupported, videoRef) => {
  try {
    // Check if page is visible before requesting wake lock
    if (document.visibilityState !== 'visible') {
      return {
        success: false,
        wakeLock: null,
        status:
          'Page not visible - wake lock will be requested when tab becomes active',
        error: 'PAGE_NOT_VISIBLE',
      };
    }

    if (wakeLockSupported) {
      const wakeLock = await navigator.wakeLock.request('screen');
      return {
        success: true,
        wakeLock,
        status: 'Wake Lock Active',
      };
    } else {
      if (videoRef.current) {
        await videoRef.current.play();
        return {
          success: true,
          wakeLock: null,
          status: 'Video Fallback Active',
        };
      } else {
        throw new Error('Fallback method not available');
      }
    }
  } catch (error) {
    // Handle specific case where page is not visible
    if (
      error.name === 'NotAllowedError' &&
      error.message.includes('not visible')
    ) {
      console.warn(
        'Wake lock request failed: Page not visible. Will retry when tab becomes active.'
      );
      return {
        success: false,
        wakeLock: null,
        status:
          'Page not visible - wake lock will be requested when tab becomes active',
        error: 'PAGE_NOT_VISIBLE',
      };
    }

    console.error('Failed to request wake lock:', error);
    return {
      success: false,
      wakeLock: null,
      status: `Error: ${error.message}`,
    };
  }
};

export const releaseWakeLock = async (
  wakeLockSupported,
  wakeLockRef,
  videoRef
) => {
  try {
    if (wakeLockSupported && wakeLockRef.current) {
      await wakeLockRef.current.release();
    } else if (videoRef.current) {
      videoRef.current.pause();
    }

    return {
      success: true,
      status: wakeLockSupported
        ? 'Ready - Native API Available'
        : 'Ready - Video Fallback Available',
    };
  } catch (error) {
    console.error('Failed to release wake lock:', error);
    return {
      success: false,
      status: `Error: ${error.message}`,
    };
  }
};
