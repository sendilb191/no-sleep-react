import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import swManager from './utils/serviceWorkerManager.js';

import './root.css';
import './index.less';

// Register service worker
swManager.register().then(registered => {
  if (registered) {
    console.log('Service Worker registered successfully');
  }
});

createRoot(document.getElementById('root')).render(<App />);
