import './WakeLock.less';
import { FaLock, FaLockOpen, FaClock, FaTimesCircle } from 'react-icons/fa';
import StatusDot from '../StatusDot/StatusDot';
import { TIMER_PRESETS } from '../../hooks/useWakeLock';

function WakeLock({
  isActive,
  isSupported,
  error,
  selectedTimer,
  formatTimeRemaining,
  startTimer,
}) {
  const timeDisplay = formatTimeRemaining?.();

  return (
    <article className='card wakelock-card'>
      <h2 className='card-title'>
        <StatusDot isActive={isActive} />
        {isActive ? (
          <>
            <FaLock /> Screen Wake Lock Active
          </>
        ) : (
          <>
            <FaLockOpen /> Screen Wake Lock Inactive
          </>
        )}
      </h2>

      <div className='card-content'>
        {isSupported ? (
          <>
            <p className='timer-label'>Auto turn off:</p>
            <nav className='timer-buttons'>
              {TIMER_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  className={`timer-btn ${selectedTimer === preset.value ? 'active' : ''}`}
                  onClick={() => startTimer(preset.value)}
                >
                  {preset.label}
                </button>
              ))}
            </nav>
            <p className='timer-countdown'>
              <FaClock /> Turns off in: <strong>{timeDisplay || '∞'}</strong>
            </p>
          </>
        ) : (
          <>
            <p>
              <FaTimesCircle /> Wake Lock API not supported
            </p>
            <p className='help-text'>
              Please use a modern browser like Chrome, Edge, or Safari on
              mobile.
            </p>
          </>
        )}

        {error && <p className='error-message'>⚠️ {error}</p>}
      </div>
    </article>
  );
}

export default WakeLock;
