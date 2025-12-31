import './Battery.less';

function Battery({ level, charging, isSupported, getBatteryColor }) {
  return (
    <article className='card battery-card'>
      <h2 className='card-title'>🔋 Battery Status</h2>
      <div className='card-content'>
        {isSupported ? (
          <>
            <figure className='battery-visual'>
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
              <figcaption className='battery-level'>{level}%</figcaption>
            </figure>
            <p className='charging-status'>
              {charging ? '⚡ Charging' : '🔌 Not Charging'}
            </p>
          </>
        ) : (
          <>
            <p>❌ Battery API not supported</p>
            <p className='help-text'>
              Battery status is not available in this browser.
            </p>
          </>
        )}
      </div>
    </article>
  );
}

export default Battery;
