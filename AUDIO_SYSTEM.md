# 🔊 Audio Feedback System

## Overview

The No Sleep React app now includes a custom beep sound system that provides audio feedback before notifications and when toggling wake lock functionality.

## Features

### 🔔 Notification Beeps

- **Battery Low**: Urgent double beep with lower tone (600Hz)
- **Battery High**: Gentle triple beep with higher tones (1000Hz → 1200Hz → 1000Hz)
- **Test Notification**: Pleasant single beep (800Hz)
- **Default**: Standard notification beep (800Hz)

### 🌙 Wake Lock Beeps

- **Wake Lock Enabled**: Rising tone (600Hz → 800Hz)
- **Wake Lock Disabled**: Falling tone (800Hz → 600Hz)

## Implementation

### Custom Audio Hook (`useAudio.js`)

- Uses Web Audio API for precise sound generation
- Creates sine wave oscillators with volume envelopes
- Graceful fallback when audio context isn't supported
- Automatic audio context resumption for browser compatibility

### Integration

- **Notifications**: Beeps play automatically before notifications appear
- **Wake Lock**: Beeps play when toggling wake lock on/off
- **Async/Await**: All audio functions are promise-based for proper sequencing

## Browser Compatibility

- Modern browsers with Web Audio API support
- Graceful degradation when audio features aren't available
- Automatic audio context resumption handling

## Usage

The beep system works automatically - no user configuration needed:

1. Enable notifications → Beeps will play before each notification
2. Toggle wake lock → Beeps will indicate status changes
3. Test notifications → Special test beep confirms functionality

## Technical Details

- **Frequency Range**: 600Hz - 1200Hz for pleasant, attention-getting tones
- **Duration**: 100-200ms per beep for quick, non-intrusive feedback
- **Volume**: 0.08-0.15 (8-15%) for comfortable listening levels
- **Envelope**: Quick attack with smooth exponential decay
