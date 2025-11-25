import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import './App.less';
import Navigation from './components/shared/Navigation';
import { SmartRouter } from './components/SmartRouter';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import { useSettings } from './hooks/useSettings';
import AboutPage from './pages/AboutPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  // Initialize settings at the app level
  const settingsState = useSettings();
  // Initialize wake lock at the app level
  const wakeLockState = useWakeLock();
  // Initialize battery for global notifications
  const { notification, dismissNotification } = useBattery(settingsState);

  // Auto-enable wake lock when settings are loaded and autoEnable is true
  useEffect(() => {
    if (
      settingsState.isLoaded &&
      settingsState.autoEnable &&
      !wakeLockState.isWakeLockEnabled
    ) {
      wakeLockState.requestWakeLock();
    }
  }, [
    settingsState.isLoaded,
    settingsState.autoEnable,
    wakeLockState.isWakeLockEnabled,
  ]);

  return (
    <SmartRouter>
      <div className='app'>
        <Navigation />
        <main className='main-content'>
          <Routes>
            <Route
              path='/'
              element={
                <MainPage wakeLock={wakeLockState} settings={settingsState} />
              }
            />
            <Route
              path='/settings'
              element={
                <SettingsPage
                  wakeLock={wakeLockState}
                  settings={settingsState}
                />
              }
            />
            <Route path='/about' element={<AboutPage />} />
          </Routes>
        </main>

        {/* Global battery notifications */}
        {notification && (
          <div className={`battery-notification ${notification.type}`}>
            <div className='notification-content'>
              <span className='notification-message'>
                {notification.message}
              </span>
              <button
                className='notification-close'
                onClick={dismissNotification}
                aria-label='Dismiss notification'
              >
                ×
              </button>
            </div>
          </div>
        )}
      </div>
    </SmartRouter>
  );
}

export default App;
