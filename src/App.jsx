import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/_shared/Navigation';
import Home from './pages/Home';
import InstructionsPage from './pages/Instructions';

function App() {
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

          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/instructions' element={<InstructionsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
