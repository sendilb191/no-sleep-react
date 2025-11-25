import { Route, Routes } from 'react-router-dom';
import './App.less';
import Navigation from './components/shared/Navigation';
import { SmartRouter } from './components/SmartRouter';
import { useWakeLock } from './hooks/useWakeLock';
import AboutPage from './pages/AboutPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  // Initialize wake lock at the app level
  const wakeLockState = useWakeLock();

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
      </div>
    </SmartRouter>
  );
}

export default App;
