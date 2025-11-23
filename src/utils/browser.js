/**
 * Browser compatibility utilities
 */

/**
 * Check if Wake Lock API is supported
 * @returns {boolean} True if Wake Lock API is available
 */
export function isWakeLockSupported() {
  return 'wakeLock' in navigator;
}

/**
 * Check if the app is running in a secure context (HTTPS or localhost)
 * @returns {boolean} True if running in secure context
 */
export function isSecureContext() {
  return (
    window.isSecureContext ||
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost'
  );
}

/**
 * Get browser information
 * @returns {object} Browser info object
 */
export function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  const isChrome =
    /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor);
  const isFirefox = /Firefox/.test(userAgent);
  const isSafari =
    /Safari/.test(userAgent) && /Apple Computer/.test(navigator.vendor);
  const isEdge = /Edg/.test(userAgent);

  return {
    isChrome,
    isFirefox,
    isSafari,
    isEdge,
    userAgent,
    supportsWakeLock: isWakeLockSupported(),
    isSecureContext: isSecureContext(),
  };
}

/**
 * Check if the current environment supports all required features
 * @returns {object} Feature support status
 */
export function checkFeatureSupport() {
  const browserInfo = getBrowserInfo();

  return {
    wakeLock: {
      supported: browserInfo.supportsWakeLock,
      reason: !browserInfo.supportsWakeLock
        ? 'Wake Lock API not supported in this browser'
        : null,
    },
    secureContext: {
      supported: browserInfo.isSecureContext,
      reason: !browserInfo.isSecureContext
        ? 'App must run in secure context (HTTPS or localhost)'
        : null,
    },
    localStorage: {
      supported: typeof Storage !== 'undefined',
      reason:
        typeof Storage === 'undefined' ? 'Local Storage not supported' : null,
    },
  };
}

/**
 * Show a user-friendly error message for unsupported features
 * @param {string} feature - The unsupported feature name
 * @param {string} reason - The reason why it's not supported
 */
export function showUnsupportedFeatureMessage(feature, reason) {
  console.warn(`${feature} is not supported: ${reason}`);

  // You can extend this to show a modal or notification to the user
  if (feature === 'wakeLock' && !isWakeLockSupported()) {
    return 'Wake Lock is not supported in this browser. The screen may turn off during use.';
  }

  if (feature === 'secureContext' && !isSecureContext()) {
    return 'This app requires a secure connection (HTTPS) or localhost to function properly.';
  }

  return `${feature} is not supported in your browser.`;
}
