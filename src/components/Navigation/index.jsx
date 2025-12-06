import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.less';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className='app-navigation'>
      <Link
        to='/'
        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
      >
        Dashboard
      </Link>
      <Link
        to='/instructions'
        className={`nav-link ${location.pathname === '/instructions' ? 'active' : ''}`}
      >
        Instructions
      </Link>
    </nav>
  );
};

export default Navigation;
