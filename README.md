# 🚫😴 No Sleep React

A modern React application that prevents your device from going to sleep using the Screen Wake Lock API with intelligent fallback methods for older browsers.

## ✨ Features

- **Modern Wake Lock API**: Uses the latest Screen Wake Lock API when available
- **Smart Fallbacks**: Automatic fallback methods for browsers that don't support Wake Lock API
- **Visual Status Indicator**: Clear visual feedback showing current sleep prevention status
- **Auto-Recovery**: Automatically reactivates when returning to the tab
- **Responsive Design**: Works great on desktop and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Browser Compatibility**: Works across modern and legacy browsers

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

## 🛠️ Technical Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Less** - CSS preprocessing
- **React Icons** - Beautiful SVG icons
- **Screen Wake Lock API** - Native browser sleep prevention

## 📱 Browser Support

| Feature          | Chrome | Firefox | Safari   | Edge   |
| ---------------- | ------ | ------- | -------- | ------ |
| Wake Lock API    | ✅ 84+ | ❌      | ✅ 16.4+ | ✅ 84+ |
| Fallback Methods | ✅ All | ✅ All  | ✅ All   | ✅ All |

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

## 🔍 API Reference

### Core Functions

```javascript
// Request wake lock
const wakeLock = await navigator.wakeLock.request('screen');

// Release wake lock
await wakeLock.release();

// Check support
const isSupported = 'wakeLock' in navigator;
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Screen Wake Lock API specification by W3C
- React team for the amazing framework
- Vite for the lightning-fast build tool
