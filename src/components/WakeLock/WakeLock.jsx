import './WakeLock.less';
import StatusDot from '../StatusDot/StatusDot';

function WakeLock({
  isActive,
  isSupported,
  error,
  userWantsWakeLock,
  toggleWakeLock,
}) {
  return (
    <article className='card wakelock-card'>
      <div className='status-indicator'>
        <StatusDot isActive={isActive} />
        <span className='status-text'>
          {isActive
            ? 'Screen Wake Lock Active'
            : userWantsWakeLock
              ? 'Wake Lock Requested (will reactivate when tab is focused)'
              : 'Screen Wake Lock Inactive'}
        </span>
      </div>

      {userWantsWakeLock && !isActive && (
        <p className='info-message'>
          💡 Wake lock will automatically reactivate when you return to this tab
        </p>
      )}

      {isSupported ? (
        <button
          className={`btn btn-primary ${userWantsWakeLock ? 'active' : ''}`}
          onClick={toggleWakeLock}
        >
          {userWantsWakeLock ? '🔓 Turn Off Wake Lock' : '🔒 Keep Screen Awake'}
        </button>
      ) : (
        <div className='unsupported'>
          <p>❌ Wake Lock API not supported</p>
          <p className='help-text'>
            Please use a modern browser like Chrome, Edge, or Safari on mobile.
          </p>
        </div>
      )}

      {error && <p className='error-message'>⚠️ {error}</p>}
    </article>
  );
}

export default WakeLock;
