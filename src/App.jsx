import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.less';
import Navigation from './components/Navigation';
import { WakeLockProvider } from './contexts/WakeLockContext';
import AboutPage from './pages/AboutPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <WakeLockProvider>
      <Router>
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
      </Router>
    </WakeLockProvider>
  );
}

export default App;
