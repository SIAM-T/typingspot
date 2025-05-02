class KeyboardSoundManager {
  private keyPressSound: HTMLAudioElement | null = null;
  private keyErrorSound: HTMLAudioElement | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      this.keyPressSound = new Audio('/sounds/keypress.mp3');
      this.keyErrorSound = new Audio('/sounds/keyerror.mp3');
      
      // Preload sounds
      this.keyPressSound.load();
      this.keyErrorSound.load();
    }
  }

  playKeyPress() {
    if (this.enabled && this.keyPressSound) {
      // Clone and play to allow overlapping sounds
      const sound = this.keyPressSound.cloneNode() as HTMLAudioElement;
      sound.volume = 0.5;
      sound.play().catch(() => {
        // Ignore errors (e.g., if user hasn't interacted with page yet)
      });
    }
  }

  playError() {
    if (this.enabled && this.keyErrorSound) {
      const sound = this.keyErrorSound.cloneNode() as HTMLAudioElement;
      sound.volume = 0.3;
      sound.play().catch(() => {
        // Ignore errors
      });
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

// Create a singleton instance
export const keyboardSounds = typeof window !== 'undefined' ? new KeyboardSoundManager() : null; 