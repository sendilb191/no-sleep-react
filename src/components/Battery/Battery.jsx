import './Battery.less';

function Battery({ level, charging, isSupported, getBatteryColor }) {
  return (
    <article className='card battery-card'>
      <h2>🔋 Battery Status</h2>
      {isSupported ? (
        <div className='battery-status'>
          <div className='battery-visual'>
            <div className='battery-icon'>
              <div className='battery-body'>
                <div
                  className='battery-fill'
                  style={{
                    width: `${level}%`,
                    backgroundColor: getBatteryColor(),
                  }}
                />
              </div>
              <div className='battery-tip' />
            </div>
            <span className='battery-level'>{level}%</span>
          </div>
          <p className='charging-status'>
            {charging ? '⚡ Charging' : '🔌 Not Charging'}
          </p>
        </div>
      ) : (
        <div className='unsupported'>
          <p>❌ Battery API not supported</p>
          <p className='help-text'>
            Battery status is not available in this browser.
          </p>
        </div>
      )}
    </article>
  );
}

export default Battery;
