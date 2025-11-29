// Service Worker Registration and Communication
class ServiceWorkerManager {
  constructor() {
    this.registration = null;
    this.isSupported = 'serviceWorker' in navigator;
  }

  async register() {
    if (!this.isSupported) {
      console.log('Service Worker not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', this.registration);

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener(
        'message',
        this.handleMessage.bind(this)
      );

      // Handle service worker updates
      this.registration.addEventListener('updatefound', () => {
        console.log('Service Worker update found');
      });

      return true;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return false;
    }
  }

  // Send message to service worker
  sendMessage(type, data) {
    if (this.registration && this.registration.active) {
      this.registration.active.postMessage({ type, data });
    }
  }

  // Handle messages from service worker
  handleMessage(event) {
    const { type, data } = event.data;

    switch (type) {
      case 'CHECK_BATTERY':
        // Trigger battery check in main app
        window.dispatchEvent(new CustomEvent('sw-battery-check'));
        break;
      case 'REQUEST_BATTERY_STATUS':
        // Service worker is requesting current battery status
        window.dispatchEvent(new CustomEvent('sw-request-battery-status'));
        break;
      default:
        console.log('Unknown message from service worker:', type, data);
    }
  }

  // Update battery status in service worker
  updateBatteryStatus(batteryData) {
    this.sendMessage('BATTERY_STATUS', batteryData);
  }

  // Update wake lock status in service worker
  updateWakeLockStatus(wakeLockData) {
    this.sendMessage('WAKE_LOCK_STATUS', wakeLockData);
  }

  // Schedule notification through service worker
  scheduleNotification(data) {
    this.sendMessage('SCHEDULE_NOTIFICATION', data);
  }

  // Send current battery status to service worker
  sendBatteryStatus(batteryData) {
    this.sendMessage('CURRENT_BATTERY_STATUS', batteryData);
  }

  // Update notification settings in service worker
  updateNotificationSettings(settings) {
    this.sendMessage('UPDATE_NOTIFICATION_SETTINGS', settings);
  }

  // Test notification via service worker
  testNotification(batteryData) {
    this.sendMessage('TEST_NOTIFICATION', batteryData);
  }

  // Cancel notifications
  cancelNotifications() {
    this.sendMessage('CANCEL_NOTIFICATIONS');
  }

  // Request persistent notification permission
  async requestNotificationPermission() {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
      return permission === 'granted';
    }
    return false;
  }
}

// Create global instance
const swManager = new ServiceWorkerManager();

export default swManager;
