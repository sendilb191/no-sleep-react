import React from 'react';
import './App.css';
import { useWakeLock } from './hooks/useWakeLock';

function App() {
  const { isActive, isSupported, error, userWantsWakeLock, toggleWakeLock } =
    useWakeLock();

  return (
    <div className='app'>
      <div className='container'>
        <h1>🔒 Wake Lock App</h1>
        <p className='subtitle'>Keep your screen awake</p>

        <div className='status-card'>
          <div className='status-indicator'>
            <div
              className={`status-dot ${isActive ? 'active' : 'inactive'}`}
            ></div>
            <span className='status-text'>
              {isActive
                ? 'Screen Wake Lock Active'
                : userWantsWakeLock
                  ? 'Wake Lock Requested (will reactivate when tab is focused)'
                  : 'Screen Wake Lock Inactive'}
            </span>
          </div>

          {userWantsWakeLock && !isActive && (
            <div className='auto-reactivate-info'>
              <p>
                💡 Wake lock will automatically reactivate when you return to
                this tab
              </p>
            </div>
          )}

          {isSupported ? (
            <button
              className={`wake-lock-btn ${userWantsWakeLock ? 'active' : 'inactive'}`}
              onClick={toggleWakeLock}
            >
              {userWantsWakeLock
                ? '🔓 Turn Off Wake Lock'
                : '🔒 Keep Screen Awake'}
            </button>
          ) : (
            <div className='unsupported'>
              <p>❌ Wake Lock API not supported</p>
              <p className='help-text'>
                Please use a modern browser like Chrome, Edge, or Safari on
                mobile.
              </p>
            </div>
          )}

          {error && (
            <div className='error-message'>
              <p>⚠️ {error}</p>
            </div>
          )}
        </div>

        <div className='info-card'>
          <h3>How it works:</h3>
          <ul>
            <li>
              Wake lock is automatically activated when you load this page
            </li>
            <li>
              Wake lock automatically reactivates when you focus this tab/window
            </li>
            <li>
              The wake lock will be automatically released if you switch tabs or
              minimize the browser
            </li>
            <li>You can manually turn off the wake lock anytime</li>
            <li>This only works on HTTPS websites or localhost</li>
          </ul>
        </div>

        <div className='compatibility-info'>
          <h4>Browser Compatibility:</h4>
          <p>
            <strong>Supported:</strong> Chrome 84+, Edge 84+, Safari 13.1+
            (mobile)
          </p>
          <p>
            <strong>Current Status:</strong>{' '}
            {isSupported ? '✅ Supported' : '❌ Not Supported'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
