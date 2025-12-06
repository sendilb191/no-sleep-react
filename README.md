# 🚫😴 No Sleep React

A modern React application that prevents your device from going to sleep using the Screen Wake Lock API with intelligent fallback methods for older browsers. Features comprehensive battery monitoring, web push notifications, and a component-based architecture with an optimized, compact UI design.

## ✨ Features

### 🔋 **Battery Health Management**

- **Real-time Battery Monitoring**: Live battery level display with visual battery icon
- **Charging Status Detection**: Shows charging state with animated indicators
- **Low Battery Alerts**: Smart warnings when battery drops below 30% while not charging
- **High Battery Alerts**: Notifications when battery exceeds 90% while charging to preserve battery health
- **Dual Alert System**: Comprehensive monitoring for both undercharge and overcharge protection
- **Visual Battery Icon**: Dynamic battery icon with color-coded levels for instant status recognition

### 🔔 **Advanced Notification System**

- **Web Push Notifications**: Automatic battery health alerts for both low and high battery conditions
- **Configurable Frequency**: Choose notification intervals from 1 minute to 1 hour for all battery alerts
- **Timestamp Tracking**: Display last notification time with type identification (Test, Battery Warning, Battery Fully Charged)
- **Smart Cooldown**: Prevents notification spam while respecting user-selected frequency settings
- **Test Functionality**: Built-in test button to verify notification settings and display timing
- **Permission Management**: Easy notification permission setup with clear status indicators

### 🌙 **Wake Lock System**

- **Modern Wake Lock API**: Uses the latest Screen Wake Lock API when available
- **Smart Fallbacks**: Automatic fallback methods for browsers that don't support Wake Lock API
- **Visual Status Indicators**: Clear feedback showing current sleep prevention status
- **Auto-Recovery**: Automatically reactivates when returning to the tab
- **Toggle Switch Control**: Modern on/off switch for easy wake lock management

### 🎨 **Accessibility-Focused Interface**

- **Optimized Dashboard Layout**: Balanced two-column grid with equal panel widths
- **Compact Design**: Space-efficient layout with reduced spacing for maximum content visibility
- **High Contrast Design**: Simplified color palette using only white, black (#000000), and dark gray (#4a4a4a) for enhanced accessibility
- **Semantic Structure**: Clean `control-description` and `control-setting` organization with proper content width sizing
- **Modern Styling**: Glass-morphism effects, subtle animations, and professional appearance
- **Responsive Design**: Adaptive layout that works seamlessly on desktop and mobile devices
- **Component Architecture**: Reusable `SectionContainer` with consistent styling and content-width API status badges
- **Enhanced Readability**: Improved contrast ratios and simplified color scheme for users with visual accessibility needs

## 🚀 How It Works

### Primary Method: Screen Wake Lock API

- Uses `navigator.wakeLock.request('screen')` for modern browsers
- Prevents screen dimming and device sleep
- Automatically handles tab visibility changes

### Fallback Methods

For browsers without Wake Lock API support:

- **Hidden Video Loop**: Plays a silent, looping video to keep the browser active
- **Periodic Activity**: Simulates user activity every 30 seconds
- **DOM Manipulation**: Makes minimal changes to keep the browser engaged

## 🏗️ Architecture

### **Component Structure**

```
src/
├── hooks/
│   ├── useWakeLock.js       # Wake lock state management with fallback detection
│   ├── useBattery.js        # Battery API with dual callback support (low/high battery)
│   └── useNotifications.js  # Web push notifications with timestamp tracking and type identification
├── components/
│   ├── SectionContainer/    # Reusable section wrapper component
│   ├── BatterySection/      # Battery status display with icons
│   ├── WakeLockSection/     # Sleep prevention status and controls
│   ├── SettingsCard/        # Notification controls and toggles
│   ├── ErrorMessage/        # Error handling display
│   ├── Instructions/        # Comprehensive usage documentation
│   └── HiddenVideo/         # Fallback video element for older browsers
└── App.jsx                  # Main application orchestrator
```

### **Custom Hooks**

- **`useWakeLock`**: Manages wake lock state, API calls, and intelligent fallback methods
- **`useBattery`**: Battery API integration with dual callback support for both low (<30%) and high (>90%) battery conditions
- **`useNotifications`**: Comprehensive notification system with timestamp tracking, type identification, and configurable frequency

## 🛠️ Technical Stack

- **React 18** - Modern React with hooks and component composition
- **Vite** - Fast build tool and dev server with single-file plugin
- **Less** - CSS preprocessing with modern styling
- **React Icons (Feather)** - Beautiful, consistent SVG icons
- **Screen Wake Lock API** - Native browser sleep prevention
- **Battery Status API** - Device battery monitoring (where available)

## 📱 Browser Support

| Feature            | Chrome  | Firefox | Safari   | Edge   | Notes                |
| ------------------ | ------- | ------- | -------- | ------ | -------------------- |
| Wake Lock API      | ✅ 84+  | ❌      | ✅ 16.4+ | ✅ 84+ | Primary method       |
| Battery Status API | ❌ 103+ | ✅ All  | ❌       | ❌     | Limited availability |
| Fallback Methods   | ✅ All  | ✅ All  | ✅ All   | ✅ All | Works everywhere     |

### **API Availability Notes**

- **Wake Lock API**: Modern browsers support this for reliable sleep prevention
- **Battery Status API**: Firefox still supports it, Chrome removed it for privacy
- **Fallback Detection**: App automatically detects and uses available APIs
- **Graceful Degradation**: Features work even when APIs are unavailable

## 🔧 Development

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sendilb191/no-sleep-react.git
cd no-sleep-react

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The build process creates a single HTML file using `vite-plugin-singlefile`, making it easy to host anywhere or use offline.

## 📋 Usage

### **Getting Started**

1. **Open the application** in your browser
2. **Enable notifications** (optional): Click "Enable" in the Battery Notifications section
3. **Set notification frequency** (optional): Choose how often you want low battery alerts
4. **Test notifications** (optional): Use the test button to verify notifications work
5. **Activate sleep prevention**: Use the toggle switch in the controls panel
6. **Monitor status**: Watch battery level and wake lock status in real-time
7. **Deactivate when done**: Toggle off to allow normal sleep behavior and preserve battery

### **Interface Overview**

- **🔋 Battery Status Section**: Real-time battery level, charging status, and visual indicators
- **😴 Sleep Prevention Section**: Wake lock status, API support, and fallback information
- **⚙️ Controls Panel**:
  - Sleep prevention toggle switch
  - Notification permission management
  - Configurable battery health alert frequency (1 min - 1 hour)
  - Test notification functionality with timestamp tracking
  - Last notification display with type and timestamp information
- **📚 Instructions**: Comprehensive documentation of all features and best practices

### **Battery Health Notification Features**

- **Dual Battery Alerts**:
  - **Low Battery Warnings**: Alerts when battery drops below 30% while not charging
  - **High Battery Alerts**: Notifications when battery exceeds 90% while charging (overcharge protection)
- **Frequency Control**: Choose notification intervals for all battery health alerts:
  - Every 1 minute (for critical monitoring)
  - Every 5 minutes (default, balanced approach)
  - Every 10, 15, 30 minutes (moderate monitoring)
  - Every 1 hour (minimal notifications)
- **Timestamp Tracking**: View when the last notification was sent with type identification:
  - **🧪 Test** - Manual test notifications
  - **🔋 Battery Warning** - Low battery alerts
  - **🔋 Battery Fully Charged** - High battery/overcharge alerts
- **Smart Cooldown**: Prevents spam while ensuring you don't miss important health alerts
- **Test Functionality**: Verify your notification setup with timestamp tracking

### **Best Practices**

- **Active Tab**: Keep the browser tab active and visible for optimal wake lock performance
- **Power Management**: Monitor battery levels regularly, especially when using sleep prevention on battery power
- **Notification Setup**: Enable notifications for important battery warnings and system alerts
- **Responsible Usage**: Toggle off wake lock when not needed to preserve battery life
- **Browser Compatibility**: Use modern browsers for best API support and performance

## 🔍 API Reference

### **Wake Lock API**

```javascript
// Request wake lock
const wakeLock = await navigator.wakeLock.request('screen');

// Release wake lock
await wakeLock.release();

// Check support
const isSupported = 'wakeLock' in navigator;
```

### **Battery Status API**

```javascript
// Get battery information
const battery = await navigator.getBattery();

// Battery properties
battery.level; // 0.0 to 1.0
battery.charging; // boolean
battery.chargingTime; // seconds until charged
battery.dischargingTime; // seconds until empty

// Event listeners
battery.addEventListener('levelchange', handler);
battery.addEventListener('chargingchange', handler);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Key Features Highlights

- **🔋 Comprehensive Battery Health**: Dual monitoring system for both low battery warnings and overcharge protection
- **🔔 Advanced Notification System**: Configurable web push alerts with timestamp tracking and type identification
- **🌙 Reliable Sleep Prevention**: Wake Lock API with robust fallbacks for universal browser support
- **♿ Accessibility-First Design**: High contrast color scheme (white/black/dark gray) optimized for visual accessibility
- **🎨 Optimized UI Experience**: Compact, space-efficient layout with semantic component structure and content-width sizing
- **⚡ Performance Optimized**: Modular architecture with reusable components and efficient state management
- **📱 Cross-Platform Compatibility**: Seamless experience on desktop and mobile devices with responsive design
- **🔧 Developer Friendly**: Clean codebase with custom hooks, centralized styling, and comprehensive documentation
- **🛡️ Proactive Battery Management**: Smart health alerts for both undercharge and overcharge conditions

## 🙏 Acknowledgments

- Screen Wake Lock API specification by W3C
- Battery Status API for device monitoring capabilities
- React team for the amazing framework and hooks system
- Vite for the lightning-fast build tool and single-file plugin
- React Icons for the beautiful Feather icon set
- Contributors and users providing feedback and improvements
