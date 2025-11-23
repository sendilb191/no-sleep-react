import { useWakeLock } from '../contexts/WakeLockContext';
import './MainPage.less';

function MainPage() {
  const { isWakeLockEnabled, wakeLockSupported, wakeLockStatus } =
    useWakeLock();

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
              <span className='status-value'>→ Settings Page</span>
            </div>
          </div>
        </div>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h2>Information</h2>
        </div>
        <div className='section-body'>
          <div className='feature-list'>
            <li>Wake lock controls are available in Settings</li>
            <li>Status updates automatically when active</li>
            <li>Supports both native API and video fallback</li>
            <li>Works across all modern browsers</li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
