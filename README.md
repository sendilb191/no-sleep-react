# � No Sleep React

A minimal React application that prevents your device screen from going to sleep using the Screen Wake Lock API. Features battery monitoring and a clean, desktop-optimized UI.

## ✨ Features

### 🔒 **Wake Lock**

- **Screen Wake Lock API**: Uses `navigator.wakeLock.request('screen')` to prevent screen sleep
- **Auto-Recovery**: Automatically reactivates when returning to the tab
- **Timer Presets**: Auto turn-off options (30 mins, 1 hour, 2 hours, or indefinite)
- **Visual Status**: Clear indicator showing active/inactive state

### 🔋 **Battery Monitoring**

- **Real-time Battery Level**: Live percentage display with visual battery icon
- **Charging Status**: Shows whether device is charging or on battery
- **Color-coded Indicator**: Battery fill color reflects charge level

### 🎨 **Clean UI**

- **Desktop Optimized**: Centered layout designed for desktop screens
- **Minimal Colors**: Only white and black for text, dark grey for borders
- **Two-Card Layout**: Wake Lock and Battery status side by side

## 🚀 How It Works

The app uses the Screen Wake Lock API (`navigator.wakeLock.request('screen')`) to prevent the screen from dimming or turning off. When you switch tabs or minimize the browser, the wake lock is released. When you return to the tab, it automatically reactivates.

### Timer Feature

- **No Timer**: Wake lock stays active indefinitely (∞)
- **30 mins / 1 hour / 2 hours**: Wake lock automatically turns off after the selected duration

## 🏗️ Architecture

```
src/
├── hooks/
│   ├── useWakeLock.js       # Wake lock + timer logic
│   └── useBattery.js        # Battery API integration
├── components/
│   ├── WakeLock/            # Wake lock status & timer UI
│   ├── Battery/             # Battery status display
│   └── StatusDot/           # Active/inactive indicator
├── App.jsx                  # Main app component
├── App.less                 # App layout styles
└── root.css                 # CSS variables & reset
```

## 🛠️ Tech Stack

- **React 18** - Hooks-based components
- **Vite** - Fast dev server & build
- **LESS** - CSS preprocessing with nesting
- **Screen Wake Lock API** - Browser sleep prevention
- **Battery Status API** - Device battery info

## 📱 Browser Support

| Feature            | Chrome | Firefox | Safari   | Edge   |
| ------------------ | ------ | ------- | -------- | ------ |
| Wake Lock API      | ✅ 84+ | ❌      | ✅ 16.4+ | ✅ 84+ |
| Battery Status API | ❌     | ✅      | ❌       | ❌     |

## 🔧 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Lint code
npm run check
```

## 📄 License

MIT License
