import { useBattery } from '../../../hooks/useBattery';
import './BatteryStatus.less';

function BatteryStatus() {
  const {
    batteryInfo,
    notification,
    dismissNotification,
    getBatteryIcon,
    getBatteryStatus,
    formatTime,
  } = useBattery();

  return (
    <div className='battery-status'>
      {/* Battery Info Display */}
      <div className='battery-info'>
        <span className='battery-icon'>{getBatteryIcon()}</span>
        <span className='battery-text'>{getBatteryStatus()}</span>
      </div>

      {/* Detailed Battery Info (when supported) */}
      {batteryInfo.supported && batteryInfo.level !== null && (
        <div className='battery-details'>
          {batteryInfo.charging && batteryInfo.chargingTime !== Infinity && (
            <div className='battery-time'>
              ⚡ Full in: {formatTime(batteryInfo.chargingTime)}
            </div>
          )}
          {!batteryInfo.charging &&
            batteryInfo.dischargingTime !== Infinity && (
              <div className='battery-time'>
                🔋 Time left: {formatTime(batteryInfo.dischargingTime)}
              </div>
            )}
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className={`battery-notification ${notification.type}`}>
          <div className='notification-content'>
            <span className='notification-message'>{notification.message}</span>
            <button
              className='notification-close'
              onClick={dismissNotification}
              aria-label='Dismiss notification'
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BatteryStatus;
