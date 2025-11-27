import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';
import './App.less';
import Navigation from './components/shared/Navigation';
import { SmartRouter } from './components/SmartRouter';
import { useSettings } from './hooks/useSettings';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import AboutPage from './pages/AboutPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const settings = useSettings();
  const wakeLock = useWakeLock();
  const battery = useBattery(settings);

  // Auto-enable wake lock when settings are loaded and autoEnable is true
  useEffect(() => {
    if (
      settings.isLoaded &&
      settings.autoEnable &&
      !wakeLock.userWantsWakeLock &&
      !wakeLock.isWakeLockEnabled
    ) {
      console.log('Auto-enabling wake lock from settings...');
      wakeLock.toggleWakeLock();
    }
  }, [
    settings.isLoaded,
    settings.autoEnable,
    wakeLock.userWantsWakeLock,
    wakeLock.isWakeLockEnabled,
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
                <MainPage
                  wakeLock={wakeLock}
                  settings={settings}
                  battery={battery}
                />
              }
            />
            <Route
              path='/settings'
              element={
                <SettingsPage
                  wakeLock={wakeLock}
                  settings={settings}
                  battery={battery}
                />
              }
            />
            <Route path='/about' element={<AboutPage />} />
          </Routes>
        </main>

        {/* Global battery notifications */}
        {battery.notification && (
          <div className={`battery-notification ${battery.notification.type}`}>
            <div className='notification-content'>
              <span className='notification-message'>
                {battery.notification.message}
              </span>
              <button
                className='notification-close'
                onClick={battery.dismissNotification}
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
