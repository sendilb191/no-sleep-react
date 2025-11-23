import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.less';
import Navigation from './components/Navigation';
import AboutPage from './pages/AboutPage';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
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
  );
}

export default App;
