import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { initializeRouting } from './utils/routing.js';

import './App.less';
import './root.css';

// Initialize routing mode detection
initializeRouting();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
