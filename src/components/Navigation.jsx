import { FiHome, FiInfo, FiSettings } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.less';

function Navigation() {
  const location = useLocation();

  return (
    <nav className='navigation'>
      <div>
        <h1 className='nav-title'>No Sleep</h1>
      </div>

      <div className='nav-links'>
        <Link
          to='/'
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          <FiHome />
          <span>Main</span>
        </Link>

        <Link
          to='/settings'
          className={`nav-link ${location.pathname === '/settings' ? 'active' : ''}`}
        >
          <FiSettings />
          <span>Settings</span>
        </Link>

        <Link
          to='/about'
          className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
        >
          <FiInfo />
          <span>About</span>
        </Link>
      </div>
    </nav>
  );
}

export default Navigation;
