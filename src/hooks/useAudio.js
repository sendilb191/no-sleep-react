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

        console.log('🔊 Announce-tones audio initialized');
      } catch (error) {
        console.warn('Audio initialization failed:', error);
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
          console.warn('Audio not available');
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
          console.warn('Audio playback error:', error);
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
              console.log(
                '🔊 Announce-tones playing successfully in',
                document.hidden ? 'background' : 'foreground'
              );
            })
            .catch(error => {
              // Fallback for background tab restrictions
              if (error.name === 'NotAllowedError' && document.hidden) {
                console.warn(
                  'Audio blocked in background tab, this is expected browser behavior'
                );
              } else {
                console.warn('Audio play promise rejected:', error);
              }
              audio.removeEventListener('ended', handleEnded);
              audio.removeEventListener('error', handleError);
              resolve();
            });
        }
      } catch (error) {
        console.warn('Error playing announce-tones:', error);
        resolve();
      }
    });
  }, [initAudio]);

  // Play notification sound using announce-tones file
  const playNotificationBeep = useCallback(
    async (type = 'default') => {
      try {
        console.log(
          '🔊 Playing announce-tones for notification:',
          type,
          'Background:',
          document.hidden
        );

        // Play the announce-tones file for all notification types
        await playAnnounceTone();

        console.log('🔊 Announce-tones playback completed for:', type);
      } catch (error) {
        console.warn('Error playing announce-tones:', error);
      }
    },
    [playAnnounceTone]
  );

  // Play wake lock sound using announce-tones file
  const playWakeLockBeep = useCallback(
    async enabled => {
      try {
        console.log(
          '🔊 Playing announce-tones for wake lock:',
          enabled ? 'enabled' : 'disabled',
          'Background:',
          document.hidden
        );

        // Play the announce-tones file for wake lock status changes
        await playAnnounceTone();

        console.log(
          '🔊 Announce-tones playback completed for wake lock:',
          enabled ? 'enabled' : 'disabled'
        );
      } catch (error) {
        console.warn('Error playing announce-tones for wake lock:', error);
      }
    },
    [playAnnounceTone]
  );

  // Simple audio context resume for compatibility
  const resumeAudioContext = useCallback(async () => {
    // Not needed for HTML5 Audio element, but kept for compatibility
    console.log('🔊 Audio context resume called (using HTML5 Audio)');
  }, []);

  // Keep audio context active (simplified for HTML5 Audio)
  const keepAudioContextActive = useCallback(async () => {
    // Not needed for HTML5 Audio element, but kept for compatibility
    console.log('🔊 Audio context keep-alive called (using HTML5 Audio)');
  }, []);

  return {
    playNotificationBeep,
    playWakeLockBeep,
    resumeAudioContext,
    keepAudioContextActive,
  };
};
