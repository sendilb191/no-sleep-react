import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className='navigation'>
      <div className='nav-brand'>
        <span>🔋 No Sleep</span>
      </div>
      <div className='nav-links'>
        <Link to='/' className='nav-link'>
          🏠 Home
        </Link>
        <Link to='/setting' className='nav-link'>
          ⚙️ Settings
        </Link>
        <Link to='/about' className='nav-link'>
          📱 About
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;
