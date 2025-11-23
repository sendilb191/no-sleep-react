/**
 * Routing utilities for handling navigation in both development and production builds
 */

/**
 * Get the current route path (handles both hash and history routing)
 * @returns {string} Current route path
 */
export function getCurrentPath() {
  if (window.location.hash) {
    // Hash routing (production build)
    return window.location.hash.slice(1) || '/';
  }
  // History routing (development)
  return window.location.pathname;
}

/**
 * Navigate to a specific route (handles both hash and history routing)
 * @param {string} path - The path to navigate to
 */
export function navigateTo(path) {
  if (window.location.protocol === 'file:' || window.location.hash) {
    // Use hash routing for file:// protocol or when already using hashes
    window.location.hash = path;
  } else {
    // Use history API for development server
    window.history.pushState({}, '', path);
    // Dispatch a custom event to notify React Router
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

/**
 * Check if the current environment is a static build
 * @returns {boolean} True if running as static build
 */
export function isStaticBuild() {
  return (
    window.location.protocol === 'file:' ||
    window.location.hash.length > 0 ||
    document.querySelector('meta[name="build-type"]')?.content === 'static'
  );
}

/**
 * Get the base path for the application
 * @returns {string} Base path
 */
export function getBasePath() {
  if (isStaticBuild()) {
    return '#';
  }
  return '/';
}

/**
 * Format a route path for the current routing mode
 * @param {string} path - The route path
 * @returns {string} Formatted path
 */
export function formatRoutePath(path) {
  const basePath = getBasePath();
  if (basePath === '#') {
    return `#${path}`;
  }
  return path;
}

/**
 * Initialize routing mode detection
 * This should be called early in the application lifecycle
 */
export function initializeRouting() {
  // Add a meta tag to help identify static builds
  if (isStaticBuild()) {
    const meta = document.createElement('meta');
    meta.name = 'build-type';
    meta.content = 'static';
    document.head.appendChild(meta);
  }

  // Log routing mode for debugging
  console.log(
    'Routing mode:',
    isStaticBuild() ? 'Hash (Static)' : 'History (Development)'
  );
}
