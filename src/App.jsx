import { Route, Routes } from 'react-router-dom';
import './App.less';
import Navigation from './components/shared/Navigation';
import { SmartRouter } from './components/SmartRouter';
import { useWakeLock } from './hooks/useWakeLock';
import { useBattery } from './hooks/useBattery';
import AboutPage from './pages/AboutPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  // Initialize wake lock at the app level
  const wakeLockState = useWakeLock();
  // Initialize battery for global notifications
  const { notification, dismissNotification } = useBattery();

  return (
    <SmartRouter>
      <div className='app'>
        <Navigation />
        <main className='main-content'>
          <Routes>
            <Route path='/' element={<MainPage wakeLock={wakeLockState} />} />
            <Route
              path='/settings'
              element={<SettingsPage wakeLock={wakeLockState} />}
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
