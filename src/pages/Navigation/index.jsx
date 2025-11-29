import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.less';

const Navigation = () => {
  return (
    <nav className='flex'>
      <Link to='/'>Home</Link>
      <Link to='/setting'>Setting</Link>
    </nav>
  );
};

export default Navigation;
