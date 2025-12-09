import { useRef, useCallback } from 'react';

export const useAudio = () => {
  const audioRef = useRef(null);

  // Initialize audio element with the announce-tones file
  const initAudio = useCallback(() => {
    if (!audioRef.current) {
      try {
        audioRef.current = new Audio('/announce-tones.wav');
        audioRef.current.preload = 'auto';

        // Set volume to reasonable level
        audioRef.current.volume = 0.7;

        // Allow cross-origin and background playback
        audioRef.current.crossOrigin = 'anonymous';

        // Prevent audio from being paused when tab loses focus
        audioRef.current.setAttribute('playsinline', true);
      } catch (error) {
        return null;
      }
    }
    return audioRef.current;
  }, []);

  // Play the announce-tones audio file
  const playAnnounceTone = useCallback(async () => {
    return new Promise(resolve => {
      try {
        const audio = initAudio();
        if (!audio) {
          resolve();
          return;
        }

        // Reset audio to beginning
        audio.currentTime = 0;

        // Handle audio end
        const handleEnded = () => {
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          resolve();
        };

        // Handle audio errors
        const handleError = error => {
          audio.removeEventListener('ended', handleEnded);
          audio.removeEventListener('error', handleError);
          resolve();
        };

        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('error', handleError);

        // Play the audio with better background support
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              // Audio playing successfully
            })
            .catch(error => {
              // Fallback for background tab restrictions - handle silently
              audio.removeEventListener('ended', handleEnded);
              audio.removeEventListener('error', handleError);
              resolve();
            });
        }
      } catch (error) {
        resolve();
      }
    });
  }, [initAudio]);

  // Play notification sound using announce-tones file
  const playNotificationBeep = useCallback(
    async (type = 'default') => {
      try {
        // Play the announce-tones file for all notification types
        await playAnnounceTone();
      } catch (error) {
        // Handle audio error silently
      }
    },
    [playAnnounceTone]
  );

  // Play wake lock sound using announce-tones file
  const playWakeLockBeep = useCallback(
    async enabled => {
      try {
        // Play the announce-tones file for wake lock status changes
        await playAnnounceTone();
      } catch (error) {
        // Handle audio error silently
      }
    },
    [playAnnounceTone]
  );

  // Simple audio context resume for compatibility
  const resumeAudioContext = useCallback(async () => {
    // Not needed for HTML5 Audio element, but kept for compatibility
  }, []);

  // Keep audio context active (simplified for HTML5 Audio)
  const keepAudioContextActive = useCallback(async () => {
    // Not needed for HTML5 Audio element, but kept for compatibility
  }, []);

  return {
    playNotificationBeep,
    playWakeLockBeep,
    resumeAudioContext,
    keepAudioContextActive,
  };
};
