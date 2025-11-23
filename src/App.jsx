import { Route, Routes } from 'react-router-dom';
import './App.less';
import Navigation from './components/shared/Navigation';
import { SmartRouter } from './components/SmartRouter';
import { WakeLockProvider } from './contexts/WakeLockContext';
import AboutPage from './pages/AboutPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <WakeLockProvider>
      <SmartRouter>
        <div className='app'>
          <Navigation />
          <main className='main-content'>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/settings' element={<SettingsPage />} />
              <Route path='/about' element={<AboutPage />} />
            </Routes>
          </main>
        </div>
      </SmartRouter>
    </WakeLockProvider>
  );
}

export default App;
