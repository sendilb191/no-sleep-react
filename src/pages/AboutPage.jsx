import './AboutPage.less';

function AboutPage() {
  return (
    <div className='page about-page'>
      <div className='page-header'>
        <h1>About No Sleep</h1>
        <p className='page-description'>
          Learn how this wake lock application works and its technical details.
        </p>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h2>How it works</h2>
        </div>
        <div className='section-body'>
          <ul className='feature-list'>
            <li>Uses native Wake Lock API when supported</li>
            <li>Falls back to invisible video playback for older browsers</li>
            <li>Automatically re-activates when tab becomes visible</li>
            <li>Prevents screen from turning off or device from sleeping</li>
          </ul>
        </div>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h2>Browser Compatibility</h2>
        </div>
        <div className='section-body'>
          <div className='compatibility-grid'>
            <div className='browser-support'>
              <h3>Native Wake Lock API</h3>
              <ul className='feature-list'>
                <li>Chrome 84+</li>
                <li>Edge 84+</li>
                <li>Safari 16.4+</li>
                <li>Firefox (experimental)</li>
              </ul>
            </div>
            <div className='browser-support'>
              <h3>Video Fallback</h3>
              <ul className='feature-list'>
                <li>All modern browsers</li>
                <li>Mobile browsers</li>
                <li>Legacy browsers</li>
                <li>PWA support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h2>Technical Details</h2>
        </div>
        <div className='section-body'>
          <div className='tech-details'>
            <div className='detail-item'>
              <h4>Wake Lock API</h4>
              <p>
                Uses the Screen Wake Lock API to prevent the screen from dimming
                or locking. Automatically handles page visibility changes and
                re-requests locks when needed.
              </p>
            </div>
            <div className='detail-item'>
              <h4>Video Fallback</h4>
              <p>
                For browsers without Wake Lock API support, plays an invisible,
                muted video loop to prevent screen sleep. The video is
                positioned off-screen and has minimal impact on performance.
              </p>
            </div>
            <div className='detail-item'>
              <h4>Visibility Handling</h4>
              <p>
                Monitors page visibility changes and automatically re-enables
                wake lock when the tab becomes active again, ensuring continuous
                protection.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='github-section'>
        <div className='section-header'>
          <h2>Application Info</h2>
        </div>
        <div className='section-body'>
          <div className='app-info'>
            <div className='info-row'>
              <span className='info-label'>Version:</span>
              <span className='info-value'>1.0.0</span>
            </div>
            <div className='info-row'>
              <span className='info-label'>Framework:</span>
              <span className='info-value'>React 18.2</span>
            </div>
            <div className='info-row'>
              <span className='info-label'>Build Tool:</span>
              <span className='info-value'>Vite 6.4</span>
            </div>
            <div className='info-row'>
              <span className='info-label'>Styling:</span>
              <span className='info-value'>LESS CSS</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
