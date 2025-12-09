import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useWakeLock } from './hooks/useWakeLock';
import { DEFAULT_SETTINGS } from './constants/defaultSettings';
import Navigation from './components/_shared/Navigation';
import Home from './pages/Home';
import InstructionsPage from './pages/Instructions';

function App() {
  // Lift wake lock state to App level to persist across page navigation
  const { isWakeLockActive, toggleWakeLock } = useWakeLock();

  // Lift all notification settings to App level
  const [notificationFrequency, setNotificationFrequency] = useState(
    DEFAULT_SETTINGS.NOTIFICATION_FREQUENCY
  );
  const [autoReleaseEnabled, setAutoReleaseEnabled] = useState(
    DEFAULT_SETTINGS.AUTO_RELEASE_ENABLED
  );
  const [soundEnabled, setSoundEnabled] = useState(
    DEFAULT_SETTINGS.SOUND_ENABLED
  );
  const [notificationDisplayEnabled, setNotificationDisplayEnabled] = useState(
    DEFAULT_SETTINGS.NOTIFICATION_DISPLAY_ENABLED
  );

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className='no-sleep-app'>
        <div className='app-container'>
          <div className='app-header-nav'>
            <header className='app-header'>
              <h1>🚫😴 No Sleep</h1>
            </header>
            <Navigation />
          </div>
          <div className='app-content'>
            <Routes>
              <Route
                path='/'
                element={
                  <Home
                    isWakeLockActive={isWakeLockActive}
                    toggleWakeLock={toggleWakeLock}
                    notificationFrequency={notificationFrequency}
                    setNotificationFrequency={setNotificationFrequency}
                    autoReleaseEnabled={autoReleaseEnabled}
                    setAutoReleaseEnabled={setAutoReleaseEnabled}
                    soundEnabled={soundEnabled}
                    setSoundEnabled={setSoundEnabled}
                    notificationDisplayEnabled={notificationDisplayEnabled}
                    setNotificationDisplayEnabled={
                      setNotificationDisplayEnabled
                    }
                  />
                }
              />
              <Route path='/instructions' element={<InstructionsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
