/**
 * Utility functions index
 * Exports all utility functions for easy importing
 */

// Browser utilities
export {
  checkFeatureSupport,
  getBrowserInfo,
  isSecureContext,
  isWakeLockSupported,
  showUnsupportedFeatureMessage,
} from './browser.js';

// Routing utilities
export {
  formatRoutePath,
  getBasePath,
  getCurrentPath,
  initializeRouting,
  isStaticBuild,
  navigateTo,
} from './routing.js';
