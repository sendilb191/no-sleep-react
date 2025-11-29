import React from 'react';
import { NavLink } from 'react-router-dom';

const Navigation = () => {
  return (
    <nav className='navigation'>
      <div className='nav-brand'>
        <span>🔋 No Sleep</span>
      </div>
      <div className='nav-links'>
        <NavLink to='/' className='nav-link'>
          🏠 Home
        </NavLink>
        <NavLink to='/setting' className='nav-link'>
          ⚙️ Settings
        </NavLink>
        <NavLink to='/about' className='nav-link'>
          📱 About
        </NavLink>
      </div>
    </nav>
  );
};

export default Navigation;
