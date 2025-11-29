import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/index.jsx';
import SettingPage from './pages/SettingPage.jsx';
import Navigation from './pages/Navigation/index.jsx';
import { SettingsProvider } from './contexts/SettingsContext.jsx';
import './styles/page.less';

function App() {
  return (
    <SettingsProvider>
      <div className='app-container'>
        <HashRouter>
          <Navigation />
          <section>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/setting' element={<SettingPage />} />
            </Routes>
          </section>
        </HashRouter>
      </div>
    </SettingsProvider>
  );
}

export default App;
