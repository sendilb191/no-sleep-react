import React from 'react';

const AboutPage = () => {
  return (
    <main className='page'>
      <section className='info-card'>
        <h2>📱 About No Sleep App</h2>

        <div className='about-content'>
          <div className='section'>
            <h3>🚀 What is No Sleep?</h3>
            <p>
              No Sleep is a progressive web application designed to prevent your
              device from going to sleep while providing comprehensive battery
              monitoring and notifications. Perfect for presentations,
              monitoring sessions, or any time you need to keep your screen
              active.
            </p>
          </div>

          <div className='section'>
            <h3>✨ Key Features</h3>
            <ul>
              <li>
                <strong>Wake Lock Control:</strong> Prevents your device from
                sleeping or turning off the screen
              </li>
              <li>
                <strong>Battery Monitoring:</strong> Real-time battery level,
                charging status, and time estimates
              </li>
              <li>
                <strong>Smart Notifications:</strong> Periodic battery status
                alerts with customizable frequency
              </li>
              <li>
                <strong>Progressive Web App:</strong> Install on your device for
                native app-like experience
              </li>
              <li>
                <strong>Service Worker:</strong> Background notifications even
                when the app isn't active
              </li>
              <li>
                <strong>Cross-Platform:</strong> Works on desktop, mobile, and
                tablet devices
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🔋 Battery Features</h3>
            <ul>
              <li>
                <strong>Real-time Level:</strong> Live battery percentage with
                visual indicator
              </li>
              <li>
                <strong>Charging Detection:</strong> Automatically detects when
                device is plugged in
              </li>
              <li>
                <strong>Time Estimation:</strong> Smart calculation of remaining
                battery time
              </li>
              <li>
                <strong>Notification Alerts:</strong> Customizable periodic
                battery status updates
              </li>
              <li>
                <strong>Historical Tracking:</strong> Shows previous
                notification timestamps
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🔧 Technical Details</h3>
            <ul>
              <li>
                <strong>Built with:</strong> React, Vite, and modern web APIs
              </li>
              <li>
                <strong>Wake Lock API:</strong> Uses Screen Wake Lock API for
                preventing sleep
              </li>
              <li>
                <strong>Battery API:</strong> Leverages Navigator Battery API
                for power monitoring
              </li>
              <li>
                <strong>Service Worker:</strong> Background processing for
                notifications
              </li>
              <li>
                <strong>Local Storage:</strong> Persistent settings and
                preferences
              </li>
              <li>
                <strong>Responsive Design:</strong> Optimized for all screen
                sizes
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🎯 Use Cases</h3>
            <ul>
              <li>
                <strong>Presentations:</strong> Keep screen active during
                meetings or demos
              </li>
              <li>
                <strong>Monitoring:</strong> Watch dashboards or live data
                without interruption
              </li>
              <li>
                <strong>Media Consumption:</strong> Prevent sleep during video
                calls or streaming
              </li>
              <li>
                <strong>Development:</strong> Keep development environments
                active
              </li>
              <li>
                <strong>Kiosk Mode:</strong> Public displays or information
                screens
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>⚙️ Settings & Customization</h3>
            <ul>
              <li>
                <strong>Wake Lock Toggle:</strong> Easy on/off control for
                screen wake lock
              </li>
              <li>
                <strong>Notification Settings:</strong> Enable/disable battery
                alerts
              </li>
              <li>
                <strong>Frequency Control:</strong> Choose notification
                intervals (1-30 minutes)
              </li>
              <li>
                <strong>Permission Management:</strong> Handles browser
                permissions gracefully
              </li>
              <li>
                <strong>Persistent Storage:</strong> Remembers your preferences
                across sessions
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🔒 Privacy & Security</h3>
            <ul>
              <li>
                <strong>No Data Collection:</strong> All data stays on your
                device
              </li>
              <li>
                <strong>Local Storage Only:</strong> No external servers or
                databases
              </li>
              <li>
                <strong>Open Source Ready:</strong> Transparent codebase
              </li>
              <li>
                <strong>Permission Based:</strong> Only requests necessary
                browser permissions
              </li>
              <li>
                <strong>Offline Capable:</strong> Works without internet
                connection
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>📱 Installation</h3>
            <p>
              This app can be installed as a Progressive Web App (PWA) on your
              device:
            </p>
            <ul>
              <li>
                <strong>Desktop:</strong> Click the install button in your
                browser's address bar
              </li>
              <li>
                <strong>Mobile:</strong> Use "Add to Home Screen" from your
                browser menu
              </li>
              <li>
                <strong>Benefits:</strong> Native app experience, faster
                loading, offline access
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🌐 Browser Support</h3>
            <ul>
              <li>
                <strong>Chrome/Edge:</strong> Full feature support including
                Wake Lock API
              </li>
              <li>
                <strong>Firefox:</strong> Battery monitoring and notifications
                (limited wake lock)
              </li>
              <li>
                <strong>Safari:</strong> Basic functionality with graceful
                degradation
              </li>
              <li>
                <strong>Mobile Browsers:</strong> Optimized for mobile Chrome
                and Safari
              </li>
            </ul>
          </div>

          <div className='section version-info'>
            <h3>📊 App Information</h3>
            <div className='info-grid'>
              <div className='info-item'>
                <span className='label'>Version:</span>
                <span className='value'>1.0.0</span>
              </div>
              <div className='info-item'>
                <span className='label'>Build:</span>
                <span className='value'>Production</span>
              </div>
              <div className='info-item'>
                <span className='label'>Platform:</span>
                <span className='value'>Progressive Web App</span>
              </div>
              <div className='info-item'>
                <span className='label'>Last Updated:</span>
                <span className='value'>November 2025</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
