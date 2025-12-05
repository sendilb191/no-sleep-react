# 🚫😴 No Sleep React

A modern React application that prevents your device from going to sleep using the Screen Wake Lock API with intelligent fallback methods for older browsers. Features a comprehensive battery monitoring system and component-based architecture.

## ✨ Features

### 🔋 **Battery Management**

- **Real-time Battery Monitoring**: Live battery level display with visual battery icon
- **Charging Status Detection**: Shows charging state with animated indicators
- **Low Battery Warnings**: Alerts when battery is low (≤20%)
- **Power Consumption Awareness**: Warns when wake lock may drain battery faster
- **Visual Battery Icon**: Horizontal fill animation with color-coded levels (green/orange/red)

### 🌙 **Wake Lock System**

- **Modern Wake Lock API**: Uses the latest Screen Wake Lock API when available
- **Smart Fallbacks**: Automatic fallback methods for browsers that don't support Wake Lock API
- **Visual Status Indicators**: Clear feedback showing current sleep prevention status
- **Auto-Recovery**: Automatically reactivates when returning to the tab
- **Toggle Switch Control**: Modern on/off switch for easy wake lock management

### 🎨 **User Interface**

- **Two-Column Layout**: Battery and wake lock sections (left) with settings panel (right)
- **Responsive Design**: Works great on desktop and mobile devices, stacks on mobile
- **Modern Styling**: Clean gradients, animations, and professional appearance
- **Component Architecture**: Modular, maintainable React components
- **Error Handling**: Comprehensive error handling with user-friendly messages

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
│   ├── useWakeLock.js      # Wake lock state management
│   └── useBattery.js       # Battery API integration
├── components/
│   ├── BatterySection.jsx  # Battery status display
│   ├── WakeLockSection.jsx # Sleep prevention status
│   ├── SettingsCard.jsx    # Controls and system info
│   ├── ErrorMessage.jsx    # Error handling display
│   ├── InfoSection.jsx     # Technical information
│   ├── Instructions.jsx    # Usage instructions
│   └── HiddenVideo.jsx     # Fallback video element
└── App.jsx                 # Main application component
```

### **Custom Hooks**

- **`useWakeLock`**: Manages wake lock state, API calls, and fallback methods
- **`useBattery`**: Handles Battery API integration and real-time monitoring

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

1. Open the application in your browser
2. Click "Prevent Sleep" to activate wake lock
3. Your device will stay awake as long as the tab is active
4. Click "Allow Sleep" to deactivate and allow normal sleep behavior

### Best Practices

- Keep the browser tab active and visible for best results
- The app works best when the browser window has focus
- On mobile, avoid switching apps while wake lock is active

## 📋 Usage

### **Getting Started**

1. Open the application in your browser
2. View battery status (if supported) and current wake lock state
3. Use the toggle switch in the settings panel to activate sleep prevention
4. Monitor battery level and charging status in real-time
5. Toggle off when no longer needed to preserve battery life

### **Interface Overview**

- **Left Panel**: Battery status card and wake lock status card
- **Right Panel**: Settings with toggle switch and system information
- **Bottom Sections**: Technical details and usage instructions

### **Best Practices**

- Keep the browser tab active and visible for best results
- Monitor battery level, especially when not charging
- The app warns when wake lock may impact battery life
- Use responsibly to prevent unexpected device shutdowns

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

- **🔋 Smart Battery Integration**: Real-time monitoring with visual indicators
- **🌙 Reliable Sleep Prevention**: Wake Lock API with robust fallbacks
- **🎨 Modern UI Design**: Clean, responsive two-column layout
- **⚡ Performance Optimized**: Component-based architecture for maintainability
- **📱 Cross-Platform**: Works on desktop and mobile devices
- **🔧 Developer Friendly**: Well-structured codebase with custom hooks

## 🙏 Acknowledgments

- Screen Wake Lock API specification by W3C
- Battery Status API for device monitoring capabilities
- React team for the amazing framework and hooks system
- Vite for the lightning-fast build tool and single-file plugin
- React Icons for the beautiful Feather icon set
- Contributors and users providing feedback and improvements
