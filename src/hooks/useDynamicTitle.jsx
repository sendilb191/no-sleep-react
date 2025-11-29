import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useDynamicTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const hostname = window.location.hostname;
    const isDevelopment = import.meta.env.DEV;
    const protocol = window.location.protocol;

    // Simple environment detection
    let environmentPrefix = '';

    if (protocol === 'file:') {
      environmentPrefix = '[Local] ';
    } else if (isDevelopment) {
      environmentPrefix = '[Dev] ';
    } else if (hostname && hostname.includes('.')) {
      // Has domain
      const isSecure = protocol === 'https:';
      environmentPrefix = isSecure ? `[🔒 ${hostname}] ` : `[⚠️ ${hostname}] `;
    }

    // Page titles
    const routeTitles = {
      '/': 'Dashboard',
      '/setting': 'Settings',
      '/about': 'About',
    };

    const currentPageTitle = routeTitles[location.pathname] || 'Dashboard';

    // Set title
    document.title = `${environmentPrefix}${currentPageTitle} | No Sleep`;
  }, [location.pathname]);
};

export default useDynamicTitle;
