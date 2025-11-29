# No Sleep React App 🔋

A modern Progressive Web App (PWA) that prevents your device from going to sleep while providing comprehensive battery monitoring, smart notifications, and wake lock functionality. Built with React, Vite, and modern web APIs.

## 🚀 Features

- **🔒 Wake Lock API** - Keeps your device screen active and prevents sleep mode
- **🔋 Real-time Battery Monitoring** - Live battery level, charging status, and time estimates
- **📢 Smart Notifications** - Customizable periodic battery alerts via Service Worker
- **📱 Progressive Web App** - Offline capability, installable, native app experience
- **🎨 Modern UI/UX** - Clean cadet-blue design with responsive layout
- **⚙️ Customizable Settings** - Adjustable notification frequency and preferences
- **🌐 Cross-Platform** - Works seamlessly on desktop, mobile, and tablet devices

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: LESS with CSS Variables
- **Routing**: React Router DOM with NavLink
- **PWA**: Service Worker for background notifications
- **APIs**: Wake Lock API, Battery Status API, Notification API
- **Build Tool**: Vite with HMR (Hot Module Replacement)

---

## 🎨 Design System

### Color Palette (Cadet Blue Theme)

- **Primary**: `#5f9ea0` (Cadet Blue)
- **Light Variations**: `#8bb5b7`, `#b7ccce`
- **Dark Variations**: `#4a7d7f`, `#3a6162`

### Typography

- **Small**: 0.9rem
- **Medium**: 1rem
- **Large**: 1.3rem

---

## 📱 Application Architecture

### **Core Components**

#### **1. Main App (`src/App.jsx`)**

- **Root component** that sets up the application structure
- **Navigation routing** between pages
- **Global app initialization**

```jsx
// Main app structure
<SettingsProvider>
  <Router>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/settings' element={<SettingPage />} />
    </Routes>
  </Router>
</SettingsProvider>
```

#### **2. Home Page (`src/pages/HomePage.jsx`)**

**Primary dashboard displaying real-time device status**

**Features:**

- 🔋 **Live Battery Status** - Level, charging state, time remaining
- 🔒 **Wake Lock Toggle** - One-click sleep prevention
- 📊 **Visual Indicators** - Battery icon with dynamic styling
- ⚡ **Real-time Updates** - Automatic refresh of battery data

**Key Functions:**

```jsx
// Battery status display
{batteryInfo.level}% {batteryInfo.charging ? 'Charging' : 'Discharging'}

// Wake lock control
<button onClick={toggleWakeLock}>
  {isWakeLockActive ? 'Release' : 'Activate'} Wake Lock
</button>
```

#### **3. Settings Page (`src/pages/SettingPage.jsx`)**

**Complete notification and app configuration**

**Features:**

- 🔔 **Notification Toggle** - Enable/disable battery alerts
- ⏰ **Frequency Control** - 1min to 30min intervals
- 🧪 **Test Notifications** - Immediate notification testing
- 🔒 **Wake Lock Settings** - Screen awake preferences
- 📊 **System Status** - Permission and service worker status

**Settings Options:**

```jsx
// Notification frequency options
<option value={1}>Every 1 minute</option>
<option value={2}>Every 2 minutes</option>
<option value={5}>Every 5 minutes</option>
<option value={10}>Every 10 minutes</option>
<option value={15}>Every 15 minutes</option>
<option value={30}>Every 30 minutes</option>
```

**System Status Display:**

- ✅ **Notification Permission** - Granted/Denied/Not Requested
- ✅ **Service Worker Support** - Available/Not Supported
- 🧪 **Test Function** - Immediate notification preview

#### **4. Navigation (`src/pages/Navigation.jsx`)**

**App navigation and routing management**

---

## 🏗️ State Management & Contexts

### **Settings Context (`src/contexts/SettingsContext.jsx`)**

**Central state management for all app preferences**

**Managed State:**

```javascript
appSettings = {
  battery: {
    notificationsEnabled: boolean,
    notificationFrequency: number, // minutes
  },
  wakeLock: {
    active: boolean,
  },
};
```

**Key Features:**

- 💾 **localStorage Integration** - Persistent settings storage
- 🔄 **Automatic Migration** - Handles old setting formats
- 🔔 **Permission Management** - Notification permission requests
- 🎣 **Custom Hooks Integration** - Battery and wake lock state

**Settings Flow:**

```
User Changes Setting → Context Updates → localStorage Save → Service Worker Notify
```

---

## 🎣 Custom Hooks

### **Battery State Hook (`src/hooks/useBatteryState.jsx`)**

**Battery monitoring and notification management**

**Features:**

- 🔋 **Battery API Integration** - Level, charging, time estimates
- 📡 **Service Worker Communication** - Settings and status updates
- ⏰ **Time Formatting** - Human-readable time displays
- 🧪 **Test Notifications** - Manual notification triggering

**Battery Data Structure:**

```javascript
batteryInfo = {
  level: number, // 0-100 percentage
  charging: boolean, // Charging state
  chargingTime: number, // Seconds to full
  dischargingTime: number, // Seconds to empty
  supported: boolean, // Battery API availability
};
```

**Service Worker Integration:**

```javascript
// Send settings to service worker
swManager.updateNotificationSettings({
  enabled: batteryNotificationsEnabled,
  frequency: notificationFrequency,
});

// Send battery updates
swManager.sendBatteryStatus({
  level: batteryInfo.level,
  charging: batteryInfo.charging,
});
```

### **Wake Lock Hook (`src/hooks/useWakeLockState.jsx`)**

**Screen wake lock management**

**Features:**

- 🔒 **Wake Lock API** - Prevents device sleep
- 👁️ **Visibility Handling** - Restore lock when tab becomes visible
- 🔄 **Automatic Recovery** - Re-acquire lock if system releases it
- ⚡ **Event Management** - User actions vs system actions

**Wake Lock Flow:**

```
User Enables → Request Wake Lock → Track State → Handle System Events → Auto-Recovery
```

---

## ⚙️ Service Worker Architecture (`public/sw.js`)

### **🎯 Core Purpose**

**Background notification engine that operates independently of browser tab state**

### **🏗️ Architecture Components**

#### **1. Caching System (Lines 1-48)**

**Progressive Web App functionality**

```javascript
const CACHE_NAME = 'no-sleep-v1';
const urlsToCache = ['/', '/index.html', '/no-sleep.svg', '/src/main.jsx'];

// Automatic caching and cache management
// Enables offline functionality
```

**Features:**

- 💾 **Asset Caching** - Essential files cached for offline use
- 🔄 **Cache Versioning** - Automatic old cache cleanup
- 📱 **PWA Support** - Full Progressive Web App capability

#### **2. Communication Hub (Lines 87-106)**

**Message handling between main app and service worker**

```javascript
self.addEventListener('message', event => {
  switch (type) {
    case 'UPDATE_NOTIFICATION_SETTINGS': // Settings changed
    case 'CURRENT_BATTERY_STATUS': // Battery updated
    case 'TEST_NOTIFICATION': // User test request
  }
});
```

**Message Types:**

- 📤 **Settings Updates** - Notification preferences from main app
- 🔋 **Battery Status** - Real-time battery data
- 🧪 **Test Requests** - Manual notification triggers

#### **3. Notification Engine (Lines 118-200)**

**Core notification management system**

**State Management:**

```javascript
let notificationTimer = null; // Active background timer
let currentBatteryData = null; // Latest battery information
let notificationSettings = {
  // User preferences
  enabled: false,
  frequency: 5,
};
let lastNotification = {
  // Notification history
  timestamp: null,
  batteryLevel: null,
  chargingStatus: null,
};
```

**Key Functions:**

**🔧 `updateNotificationSettings(settings)`**

- ❌ **Stops existing timer** immediately
- 🧹 **Cancels active notifications** to prevent duplicates
- ✅ **Starts new timer** with updated frequency
- 🔄 **Immediate response** to setting changes

**⏰ `startNotificationTimer()`**

- 🚀 **Background execution** - Works when tab is inactive
- ⏰ **Precise timing** - Respects user frequency settings
- 🔋 **Battery integration** - Uses current battery data
- 🔄 **Perpetual operation** - Continues until disabled

**🔔 `showBatteryNotification(batteryData)`**

- 📝 **Rich content** - Current + previous notification details
- 🏷️ **Unique tagging** - Prevents notification collisions
- 📱 **Action buttons** - View App / Dismiss options
- 📊 **History tracking** - Records notification metadata

#### **4. Smart Notification Content (Lines 202-258)**

**Enhanced notification information**

**Example Notification:**

```
🔋 No Sleep - Battery Status

Battery: 87% (charging) - 9:45:32 PM
Device is staying awake.

Previous: 85% (charging) at 9:44:32 PM (1m ago)
```

**Content Features:**

- 🔋 **Current Status** - Battery level, charging state, timestamp
- 📜 **Notification History** - Previous notification details
- ⏰ **Time Tracking** - Minutes elapsed since last notification
- 🎯 **Session Awareness** - "First notification of this session"

#### **5. User Interaction Handling (Lines 65-85)**

**Smart app focus management**

```javascript
self.addEventListener('notificationclick', event => {
  // Close the notification
  event.notification.close();

  // Smart app focusing
  if (app_is_open) {
    focus_existing_tab();
  } else {
    open_new_window();
  }
});
```

**Interaction Features:**

- 🎯 **Smart Focus** - Finds existing app tab or opens new window
- 🧹 **Auto-cleanup** - Closes notification on interaction
- 🔄 **Seamless UX** - Immediate app access

### **🔄 Complete Service Worker Workflow**

#### **Initialization:**

```
1. Service Worker Registers →
2. Main App Sends Current Settings →
3. SW Starts Background Timer (if enabled) →
4. Perpetual Notification Loop Begins
```

#### **Settings Change:**

```
1. User Modifies Settings →
2. Main App Sends Update to SW →
3. SW Cancels Existing Notifications →
4. SW Stops Old Timer →
5. SW Starts New Timer (new frequency) →
6. New Notification Cycle Begins
```

#### **Background Operation:**

```
1. Timer Fires at Set Interval →
2. SW Creates Notification with Current Battery Data →
3. SW Updates Notification History →
4. Process Repeats Indefinitely →
5. Works Even When Browser Tab Inactive
```

---

## 🛠️ Utilities & Managers

### **Service Worker Manager (`src/utils/serviceWorkerManager.js`)**

**Communication bridge between main app and service worker**

**Key Methods:**

```javascript
// Core functionality
swManager.register(); // Register service worker
swManager.updateNotificationSettings(); // Send settings to SW
swManager.sendBatteryStatus(); // Send battery data to SW
swManager.testNotification(); // Trigger test notification
swManager.isReady(); // Check SW availability
```

**Features:**

- 🔗 **Bidirectional Communication** - Main app ↔ Service Worker
- 🛡️ **Error Handling** - Graceful degradation if SW unavailable
- 🔄 **Automatic Retry** - Ensures message delivery when SW is ready
- 📡 **Event Coordination** - Manages complex app-SW interactions

---

## 🎨 Styling & UI

### **CSS Architecture**

- **`src/root.css`** - Global styles and CSS variables
- **`src/index.less`** - Main LESS stylesheet with component styles
- **`src/styles/page.less`** - Page-specific styling
- **`src/components/BatteryIcon/BatteryIcon.less`** - Component-specific styles

**Design Features:**

- 🌙 **Dark Theme** - Modern dark color scheme
- 📱 **Responsive Design** - Mobile-first approach
- 🎯 **Component Styling** - Modular CSS architecture
- ✨ **Interactive Elements** - Hover states and transitions

---

## 🚀 Getting Started

### **Installation**

```bash
npm install
```

### **Development**

```bash
npm run dev
```

### **Build**

```bash
npm run build
```

### **Preview**

```bash
npm run preview
```

---

## 📋 API Requirements

### **Browser APIs Used:**

- **🔋 Battery Status API** - `navigator.getBattery()`
- **🔒 Screen Wake Lock API** - `navigator.wakeLock.request()`
- **🔔 Notifications API** - `Notification` constructor
- **⚙️ Service Worker API** - Background processing
- **💾 localStorage** - Settings persistence

### **Browser Compatibility:**

- **Chrome/Edge** - Full support ✅
- **Firefox** - Partial support (no Wake Lock) ⚠️
- **Safari** - Limited support (no Battery API) ⚠️
- **Mobile** - Android Chrome recommended ✅

---

## 🔧 Configuration

### **Notification Frequency Options:**

- Every 1 minute (testing)
- Every 2 minutes
- Every 5 minutes (default)
- Every 10 minutes
- Every 15 minutes
- Every 30 minutes

### **Settings Storage:**

```javascript
// localStorage structure
{
  "battery": {
    "notificationsEnabled": true,
    "notificationFrequency": 5
  },
  "wakeLock": {
    "active": false
  }
}
```

---

## 🤝 Contributing

This app demonstrates modern PWA architecture with:

- Service Worker-based background processing
- Browser API integration (Battery, Wake Lock, Notifications)
- React 18 with custom hooks
- LESS/CSS modular styling
- Vite build system

Perfect for learning PWA development, browser API integration, and Service Worker communication patterns!

---

## 📄 License

Built with React + Vite template. Open source and educational use.
