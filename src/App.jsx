import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import SettingPage from './pages/SettingPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import Navigation from './pages/Navigation.jsx';
import { SettingsProvider } from './contexts/SettingsContext.jsx';
import './styles/page.less';

function App() {
  return (
    <SettingsProvider>
      <div className='app-container'>
        <HashRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Navigation />
          <section>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/setting' element={<SettingPage />} />
              <Route path='/about' element={<AboutPage />} />
            </Routes>
          </section>
        </HashRouter>
      </div>
    </SettingsProvider>
  );
}

export default App;
