import { Link } from 'react-router-dom';
import './MainPage.less';

function MainPage({ wakeLock }) {
  const { isWakeLockEnabled, wakeLockSupported, wakeLockStatus } = wakeLock;

  return (
    <div className='page main-page'>
      <div className='page-header'>
        <h1>Screen Wake Lock Control</h1>
        <p className='page-description'>
          Control your device's screen wake lock to prevent sleep mode.
        </p>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h2>System Status</h2>
        </div>
        <div className='section-body'>
          <div className='status-grid'>
            <div className='status-item'>
              <span className='status-label'>API Support</span>
              <span className='status-value'>
                {wakeLockSupported ? '✓ Native Wake Lock' : '⚠ Video Fallback'}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Current Status</span>
              <span className='status-value'>
                {isWakeLockEnabled ? '🔒 Active' : '⭕ Inactive'}
              </span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Ready State</span>
              <span className='status-value'>{wakeLockStatus}</span>
            </div>
            <div className='status-item'>
              <span className='status-label'>Control Location</span>
              <span className='status-value'>
                <Link to='/settings' className='settings-link'>
                  → Settings Page
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
