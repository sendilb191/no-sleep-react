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
              No Sleep is a modern progressive web application designed to
              prevent your device from going to sleep while providing
              comprehensive battery monitoring and smart notifications. Built
              with React 18 and Vite, it offers a native app-like experience
              with offline capability. Perfect for presentations, monitoring
              sessions, long-running tasks, or any time you need to keep your
              screen active and monitor your device's power status.
            </p>
          </div>

          <div className='section'>
            <h3>✨ Core Features</h3>
            <ul>
              <li>
                <strong>🔒 Advanced Wake Lock Control:</strong> Uses the Screen
                Wake Lock API to prevent your device from sleeping or turning
                off the screen
              </li>
              <li>
                <strong>🔋 Real-time Battery Monitoring:</strong> Live battery
                level, charging status, time remaining, and visual battery
                indicator
              </li>
              <li>
                <strong>📢 Smart Notifications:</strong> Customizable periodic
                battery status alerts with 1-60 minute intervals via Service
                Worker
              </li>
              <li>
                <strong>📱 Progressive Web App:</strong> Installable on desktop
                and mobile with offline functionality and native app experience
              </li>
              <li>
                <strong>⚙️ Comprehensive Settings:</strong> Auto-enable wake
                lock, notification preferences, and battery threshold alerts
              </li>
              <li>
                <strong>🎨 Modern Design:</strong> Clean cadet-blue theme with
                responsive layout and smooth animations
              </li>
              <li>
                <strong>🌐 Cross-Platform Compatibility:</strong> Works
                seamlessly on desktop, mobile, and tablet devices
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🔧 Technical Architecture</h3>
            <ul>
              <li>
                <strong>Frontend Framework:</strong> React 18 with modern hooks
                and context API
              </li>
              <li>
                <strong>Build System:</strong> Vite for lightning-fast
                development and optimized builds
              </li>
              <li>
                <strong>Styling:</strong> LESS preprocessor with CSS variables
                for consistent theming
              </li>
              <li>
                <strong>Routing:</strong> React Router DOM with NavLink for SPA
                navigation
              </li>
              <li>
                <strong>State Management:</strong> Context API with custom hooks
                for global state
              </li>
              <li>
                <strong>PWA Features:</strong> Service Worker for background
                tasks and caching
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🌐 Web APIs Used</h3>
            <ul>
              <li>
                <strong>Screen Wake Lock API:</strong> Prevents device sleep and
                screen dimming
              </li>
              <li>
                <strong>Battery Status API:</strong> Monitors battery level and
                charging state
              </li>
              <li>
                <strong>Notification API:</strong> Sends system-level
                notifications
              </li>
              <li>
                <strong>Service Worker API:</strong> Enables background
                processing and caching
              </li>
              <li>
                <strong>Local Storage API:</strong> Persists user settings and
                preferences
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🔋 Advanced Battery Monitoring</h3>
            <ul>
              <li>
                <strong>Live Battery Percentage:</strong> Real-time battery
                level with animated visual indicator and color-coded status
              </li>
              <li>
                <strong>Charging State Detection:</strong> Automatically detects
                when device is plugged in or unplugged with visual feedback
              </li>
              <li>
                <strong>Smart Time Estimation:</strong> Calculates remaining
                battery time and charging time based on current usage patterns
              </li>
              <li>
                <strong>Customizable Alerts:</strong> Set notification intervals
                from 1-60 minutes for periodic battery status updates
              </li>
              <li>
                <strong>Historical Tracking:</strong> View previous notification
                timestamps and battery status history
              </li>
              <li>
                <strong>Low Battery Warnings:</strong> Configurable threshold
                alerts when battery reaches critical levels
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🌍 Browser Compatibility</h3>
            <div className='compatibility-grid'>
              <div className='browser-support'>
                <h4>✅ Full Support</h4>
                <ul>
                  <li>
                    <strong>Chrome/Chromium:</strong> 84+ (Wake Lock API)
                  </li>
                  <li>
                    <strong>Microsoft Edge:</strong> 84+ (Wake Lock API)
                  </li>
                  <li>
                    <strong>All Modern Browsers:</strong> PWA & Service Worker
                  </li>
                </ul>
              </div>
              <div className='browser-support'>
                <h4>⚠️ Partial Support</h4>
                <ul>
                  <li>
                    <strong>Firefox:</strong> PWA features, no Wake Lock API
                  </li>
                  <li>
                    <strong>Safari:</strong> PWA features, no Wake Lock API
                  </li>
                  <li>
                    <strong>Battery API:</strong> Deprecated but functional
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className='section'>
            <h3>🔒 Privacy & Security</h3>
            <ul>
              <li>
                <strong>No Data Collection:</strong> The app doesn't collect,
                store, or transmit any personal information
              </li>
              <li>
                <strong>Local Storage Only:</strong> All settings and
                preferences are stored locally on your device
              </li>
              <li>
                <strong>No External Services:</strong> Fully self-contained
                application with no third-party dependencies
              </li>
              <li>
                <strong>Secure Context Required:</strong> Uses HTTPS for
                production deployment ensuring secure API access
              </li>
              <li>
                <strong>Permission-Based:</strong> Requests explicit permission
                for notifications and wake lock features
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🎯 Perfect Use Cases</h3>
            <ul>
              <li>
                <strong>📊 Presentations & Demos:</strong> Keep screen active
                during meetings, presentations, or live demonstrations
              </li>
              <li>
                <strong>🖥️ Monitoring & Dashboards:</strong> Watch real-time
                data, server monitoring, or analytics without screen
                interruption
              </li>
              <li>
                <strong>🎥 Media & Video Calls:</strong> Prevent sleep during
                long video conferences, webinars, or streaming sessions
              </li>
              <li>
                <strong>💻 Development Work:</strong> Keep development
                environments and IDEs active during long compilation or testing
                processes
              </li>
              <li>
                <strong>🏪 Kiosk & Display Mode:</strong> Perfect for public
                displays, information screens, or interactive installations
              </li>
              <li>
                <strong>🔋 Battery Monitoring:</strong> Keep track of device
                power status during critical operations or extended usage
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>⚙️ Comprehensive Settings</h3>
            <ul>
              <li>
                <strong>🔒 Wake Lock Control:</strong> Easy toggle for screen
                wake lock with auto-enable option on app startup
              </li>
              <li>
                <strong>🔔 Smart Notifications:</strong> Enable/disable battery
                alerts with customizable frequency from 1-60 minutes
              </li>
              <li>
                <strong>⚡ Battery Thresholds:</strong> Set custom low battery
                warning levels and charging notifications
              </li>
              <li>
                <strong>🎨 Visual Preferences:</strong> Modern cadet-blue theme
                with responsive design for all screen sizes
              </li>
              <li>
                <strong>💾 Persistent Storage:</strong> All settings remembered
                across browser sessions and app restarts
              </li>
              <li>
                <strong>🛡️ Permission Management:</strong> Graceful handling of
                browser permissions with clear user prompts
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>🚀 Performance & Optimization</h3>
            <ul>
              <li>
                <strong>⚡ Vite Build System:</strong> Lightning-fast
                development with optimized production builds and tree-shaking
              </li>
              <li>
                <strong>🔄 Efficient Updates:</strong> Smart re-rendering with
                React hooks and context optimization
              </li>
              <li>
                <strong>📦 Code Splitting:</strong> Lazy loading for optimal
                performance and reduced initial bundle size
              </li>
              <li>
                <strong>🗄️ Service Worker Caching:</strong> Intelligent caching
                strategy for faster load times and offline functionality
              </li>
              <li>
                <strong>📱 Mobile Optimized:</strong> Touch-friendly interface
                with responsive design and PWA features
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>📱 PWA Installation Guide</h3>
            <p>
              Install No Sleep as a Progressive Web App for the best experience:
            </p>

            <div className='installation-guide'>
              <div className='install-method'>
                <h4>🖥️ Desktop Installation</h4>
                <ul>
                  <li>
                    Look for the install icon (⊕) in your browser's address bar
                  </li>
                  <li>Click "Install No Sleep" when prompted</li>
                  <li>The app will be added to your desktop and start menu</li>
                </ul>
              </div>

              <div className='install-method'>
                <h4>📱 Mobile Installation</h4>
                <ul>
                  <li>
                    <strong>Android:</strong> Tap menu (⋮) → "Install app" or
                    "Add to Home screen"
                  </li>
                  <li>
                    <strong>iOS:</strong> Tap share button (□↗) → "Add to Home
                    Screen"
                  </li>
                  <li>The app icon will appear on your home screen</li>
                </ul>
              </div>
            </div>

            <div className='pwa-benefits'>
              <h4>✨ PWA Benefits</h4>
              <ul>
                <li>
                  <strong>🚀 Faster Loading:</strong> Instant app startup from
                  your home screen
                </li>
                <li>
                  <strong>📴 Offline Access:</strong> Core functionality works
                  without internet
                </li>
                <li>
                  <strong>🔔 Native Notifications:</strong> System-level battery
                  alerts
                </li>
                <li>
                  <strong>💾 Automatic Updates:</strong> Always get the latest
                  features
                </li>
                <li>
                  <strong>🎯 Full-Screen Experience:</strong> Native app-like
                  interface
                </li>
              </ul>
            </div>
          </div>

          <div className='section'>
            <h3>🤝 Open Source & Contributing</h3>
            <p>
              No Sleep is built with modern web technologies and designed to be
              transparent, secure, and community-driven:
            </p>
            <ul>
              <li>
                <strong>📂 GitHub Repository:</strong> Full source code
                available for review and contributions
              </li>
              <li>
                <strong>🐛 Issue Reporting:</strong> Found a bug or have a
                suggestion? Create an issue on GitHub
              </li>
              <li>
                <strong>🔧 Feature Requests:</strong> Help shape the future of
                the app with your ideas and feedback
              </li>
              <li>
                <strong>📄 MIT License:</strong> Free and open source software
                that respects your freedom
              </li>
            </ul>
          </div>

          <div className='section'>
            <h3>📞 Support & Resources</h3>
            <ul>
              <li>
                <strong>🌐 Web APIs Documentation:</strong> Learn more about
                Wake Lock API and Battery Status API on MDN
              </li>
              <li>
                <strong>💬 Community Support:</strong> Join discussions and get
                help from other users
              </li>
              <li>
                <strong>🔄 Updates:</strong> Regular updates with new features
                and improvements
              </li>
              <li>
                <strong>🛡️ Security:</strong> Report security issues responsibly
                through proper channels
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
