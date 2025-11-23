/**
 * Simple Hash Router Component
 * Uses HashRouter for consistent routing in all environments
 */

import { HashRouter } from 'react-router-dom';

export function SmartRouter({ children }) {
  // Always use HashRouter for compatibility with static files and HTTP servers
  return <HashRouter>{children}</HashRouter>;
}
