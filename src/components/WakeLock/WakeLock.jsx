import './WakeLock.less';
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
      <div className='status-indicator'>
        <StatusDot isActive={isActive} />
        <span className='status-text'>
          {isActive ? 'Screen Wake Lock Active' : 'Screen Wake Lock Inactive'}
        </span>
      </div>

      {isSupported ? (
        <div className='timer-section'>
          <label className='timer-label'>Auto turn off:</label>
          <div className='timer-buttons'>
            {TIMER_PRESETS.map(preset => (
              <button
                key={preset.label}
                className={`timer-btn ${selectedTimer === preset.value ? 'active' : ''}`}
                onClick={() => startTimer(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
          {timeDisplay && (
            <div className='timer-countdown'>
              ⏱️ Turns off in: <strong>{timeDisplay}</strong>
            </div>
          )}
          {!timeDisplay && (
            <div className='timer-countdown'>
              ⏱️ Turns off in: <strong>∞</strong>
            </div>
          )}
        </div>
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
