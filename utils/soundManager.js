import { Audio } from 'expo-av';
import { Vibration, Platform } from 'react-native';

let soundObject = null;

export const soundManager = {
  // Initialize audio session once
  async initialize() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    } catch (error) {
      console.error('Failed to set audio mode:', error);
    }
  },

  // Play a simple beep using Audio API
  async playBeep(frequency = 800, duration = 150, volume = 0.7) {
  try {
    // Create a new sound object for each beep
    const newSound = new Audio.Sound();

    try {
      // Load the local notification.mp3 file
      await newSound.loadAsync(require('../assets/notification.mp3'));
      await newSound.setVolumeAsync(Math.min(volume, 1));
      await newSound.playAsync();
      
      // Stop and unload after 4 seconds
      setTimeout(async () => {
        try {
          await newSound.stopAsync();
          await newSound.unloadAsync();
        } catch (e) {
          console.log('Error stopping/unloading sound:', e);
        }
      }, 4000);
      
    } catch (loadError) {
      console.log('Could not load local sound file, trying web fallback:', loadError.message);
      
      // Try web audio as fallback
      try {
        await newSound.loadAsync({
          uri: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
        });
        await newSound.setVolumeAsync(Math.min(volume, 1));
        await newSound.playAsync();
        
        setTimeout(async () => {
          try {
            await newSound.stopAsync();
            await newSound.unloadAsync();
          } catch (e) {
            console.log('Error stopping/unloading web sound:', e);
          }
        }, 4000);
      } catch (webError) {
        console.log('Could not load web sound, using vibration fallback');
        // Vibration fallback
        if (Platform.OS !== 'web') {
          Vibration.vibrate([0, 150]);
        }
      }
    }
  } catch (error) {
    console.error('Beep error:', error);
    // Final fallback - vibration
    if (Platform.OS !== 'web') {
      try {
        Vibration.vibrate([0, 150]);
      } catch (e) {
        console.log('Vibration not available');
      }
    }
  }
},

  // Play multiple beeps (for timer completion)
  async playMultipleBeeps(beepCount = 3, volume = 0.7) {
    try {
      await this.initialize();
      
      for (let i = 0; i < beepCount; i++) {
        await new Promise(async (resolve) => {
          await this.playBeep(800, 150, volume);
          // Wait before next beep
          setTimeout(() => resolve(), 400);
        });
      }
    } catch (error) {
      console.error('Failed to play beeps:', error);
      // Final fallback - vibration pattern
      if (Platform.OS !== 'web') {
        try {
          Vibration.vibrate([0, 200, 100, 200, 100, 200]);
        } catch (e) {
          console.log('Vibration pattern not available');
        }
      }
    }
  },

  // Stop any playing sound
  async stopSound() {
    try {
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
        soundObject = null;
      }
    } catch (error) {
      console.error('Error stopping sound:', error);
    }
  },
};
  