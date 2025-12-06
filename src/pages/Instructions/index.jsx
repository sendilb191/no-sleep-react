import React from 'react';
import './Instructions.less';

const InstructionsPage = () => {
  return (
    <div className='instructions-page'>
      <div className='instructions'>
        <h2>How it works:</h2>

        <div className='instruction-section'>
          <h3>🔋 Battery Status Section</h3>
          <ul>
            <li>
              <strong>Real-time Monitoring:</strong> Continuously tracks your
              device's battery level and charging status using the Battery API
            </li>
            <li>
              <strong>Visual Indicators:</strong> Dynamic battery icon shows
              current charge level with color-coded states (green for good,
              yellow for low, red for critical)
            </li>
            <li>
              <strong>Charging Detection:</strong> Automatically detects when
              your device is plugged in and displays charging animation
            </li>
            <li>
              <strong>Smart Warnings:</strong> Shows power drain alerts when
              wake lock is active and battery is low (≤ 30%) while not charging
            </li>
            <li>
              <strong>API Support:</strong> Displays whether your browser
              supports the Battery API for accurate monitoring
            </li>
          </ul>
        </div>

        <div className='instruction-section'>
          <h3>😴 Sleep Prevention Section</h3>
          <ul>
            <li>
              <strong>Wake Lock API:</strong> Uses the modern Screen Wake Lock
              API when available for the most reliable screen-on functionality
            </li>
            <li>
              <strong>Smart Fallback:</strong> Automatically switches to
              video-based fallback method for older browsers that don't support
              Wake Lock API
            </li>
            <li>
              <strong>Status Tracking:</strong> Real-time display of wake lock
              status (Active/Inactive) with clear visual indicators
            </li>
            <li>
              <strong>Auto-Recovery:</strong> Automatically reactivates when you
              return to the tab or after temporary interruptions
            </li>
            <li>
              <strong>Browser Compatibility:</strong> Shows API support status
              and active fallback method for full transparency
            </li>
          </ul>
        </div>

        <div className='instruction-section'>
          <h3>⚙️ Controls Section</h3>
          <ul>
            <li>
              <strong>One-Click Toggle:</strong> Simple switch to enable/disable
              sleep prevention with immediate visual feedback
            </li>
            <li>
              <strong>Notification Permissions:</strong> Easy setup for battery
              warning notifications with clear permission status
            </li>
            <li>
              <strong>Test Functionality:</strong> Built-in test button to
              verify notifications are working properly on your device
            </li>
            <li>
              <strong>Smart Controls:</strong> Controls adapt based on browser
              support and current device state
            </li>
          </ul>
        </div>

        <div className='instruction-section'>
          <h3>🔔 Notification System</h3>
          <ul>
            <li>
              <strong>Low Battery Alerts:</strong> Automatic notifications when
              battery drops below 30% while not charging
            </li>
            <li>
              <strong>Smart Cooldown:</strong> 10-minute intervals between
              battery warnings to prevent notification spam
            </li>
            <li>
              <strong>Test Notifications:</strong> Verify your notification
              settings work with the dedicated test button
            </li>
            <li>
              <strong>Permission Management:</strong> Clear status indicators
              and easy permission requests for notification access
            </li>
            <li>
              <strong>Cross-Platform:</strong> Works on desktop and mobile
              devices that support web notifications
            </li>
          </ul>
        </div>

        <div className='instruction-section'>
          <h3>🛡️ Best Practices</h3>
          <ul>
            <li>
              <strong>Active Tab:</strong> Keep the browser tab active and
              visible for optimal wake lock performance
            </li>
            <li>
              <strong>Power Management:</strong> Monitor battery levels
              regularly, especially when using sleep prevention on battery power
            </li>
            <li>
              <strong>Notification Setup:</strong> Enable notifications for
              important battery warnings and system alerts
            </li>
            <li>
              <strong>Browser Updates:</strong> Use modern browsers for best API
              support and performance
            </li>
            <li>
              <strong>Testing:</strong> Use the test notification feature to
              ensure alerts will work when needed
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InstructionsPage;
