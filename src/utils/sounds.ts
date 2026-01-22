/**
 * Sound Utilities
 *
 * Bildirim sesleri yönetimi.
 * Ses dosyalarını preload eder ve çalar.
 *
 * @module utils/sounds
 * @category Utilities
 *
 * Features:
 * - Preload ses dosyaları
 * - Ses çalma fonksiyonları
 * - Ses seviyesi kontrolü
 * - Sessiz mod kontrolü
 * - Multiple instance support
 * - Error handling
 *
 * @example
 * ```typescript
 * import { playSound, setSoundVolume, setSoundEnabled } from '@/utils/sounds';
 *
 * // Ses çal
 * playSound('message');
 *
 * // Ses seviyesi ayarla
 * setSoundVolume(0.5);
 *
 * // Sesleri kapat
 * setSoundEnabled(false);
 * ```
 */

/**
 * Available sound types
 */
export type SoundType = 'message' | 'notification' | 'call' | 'sent' | 'error' | 'success';

/**
 * Sound file paths
 */
export const SOUNDS: Record<SoundType, string> = {
  message: '/sounds/message.mp3',
  notification: '/sounds/notification.mp3',
  call: '/sounds/call.mp3',
  sent: '/sounds/sent.mp3',
  error: '/sounds/error.mp3',
  success: '/sounds/success.mp3',
};

/**
 * Sound manager class
 */
class SoundManager {
  private audioCache: Map<SoundType, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.5;
  private preloaded: boolean = false;

  constructor() {
    // Load settings from localStorage
    this.loadSettings();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const savedEnabled = localStorage.getItem('soundEnabled');
      const savedVolume = localStorage.getItem('soundVolume');

      if (savedEnabled !== null) {
        this.enabled = savedEnabled === 'true';
      }

      if (savedVolume !== null) {
        this.volume = parseFloat(savedVolume);
      }
    } catch (error) {
      console.error('Failed to load sound settings:', error);
    }
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('soundEnabled', String(this.enabled));
      localStorage.setItem('soundVolume', String(this.volume));
    } catch (error) {
      console.error('Failed to save sound settings:', error);
    }
  }

  /**
   * Preload all sounds
   */
  preloadSounds(): void {
    if (this.preloaded) return;

    Object.entries(SOUNDS).forEach(([type, url]) => {
      const audio = new Audio();
      audio.src = url;
      audio.preload = 'auto';
      audio.volume = this.volume;
      
      // Handle load errors silently
      audio.onerror = () => {
        console.warn(`Failed to load sound: ${type}`);
      };

      this.audioCache.set(type as SoundType, audio);
    });

    this.preloaded = true;
  }

  /**
   * Play a sound
   */
  play(type: SoundType): void {
    if (!this.enabled) return;

    // Ensure sounds are preloaded
    if (!this.preloaded) {
      this.preloadSounds();
    }

    const audio = this.audioCache.get(type);

    if (audio) {
      // Clone the audio to allow multiple simultaneous plays
      const clone = audio.cloneNode() as HTMLAudioElement;
      clone.volume = this.volume;
      
      // Play the sound
      clone.play().catch(error => {
        // Silently handle autoplay restrictions
        if (error.name !== 'NotAllowedError') {
          console.error(`Failed to play sound: ${type}`, error);
        }
      });
    } else {
      console.warn(`Sound not found: ${type}`);
    }
  }

  /**
   * Set volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    
    // Update all cached audio elements
    this.audioCache.forEach(audio => {
      audio.volume = this.volume;
    });

    this.saveSettings();
  }

  /**
   * Get current volume
   */
  getVolume(): number {
    return this.volume;
  }

  /**
   * Enable/disable sounds
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  /**
   * Check if sounds are enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Toggle sounds on/off
   */
  toggle(): boolean {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }

  /**
   * Mute sounds (set volume to 0)
   */
  mute(): void {
    this.setVolume(0);
  }

  /**
   * Unmute sounds (restore to previous volume or default)
   */
  unmute(): void {
    if (this.volume === 0) {
      this.setVolume(0.5);
    }
  }
}

/**
 * Singleton instance
 */
const soundManager = new SoundManager();

/**
 * Preload all sounds on module load
 */
if (typeof window !== 'undefined') {
  // Preload after a short delay to not block initial page load
  setTimeout(() => {
    soundManager.preloadSounds();
  }, 1000);
}

/**
 * Play a sound
 */
export function playSound(type: SoundType): void {
  soundManager.play(type);
}

/**
 * Set sound volume (0.0 to 1.0)
 */
export function setSoundVolume(volume: number): void {
  soundManager.setVolume(volume);
}

/**
 * Get current sound volume
 */
export function getSoundVolume(): number {
  return soundManager.getVolume();
}

/**
 * Enable/disable sounds
 */
export function setSoundEnabled(enabled: boolean): void {
  soundManager.setEnabled(enabled);
}

/**
 * Check if sounds are enabled
 */
export function isSoundEnabled(): boolean {
  return soundManager.isEnabled();
}

/**
 * Toggle sounds on/off
 */
export function toggleSound(): boolean {
  return soundManager.toggle();
}

/**
 * Mute all sounds
 */
export function muteSounds(): void {
  soundManager.mute();
}

/**
 * Unmute sounds
 */
export function unmuteSounds(): void {
  soundManager.unmute();
}

/**
 * Preload all sounds
 */
export function preloadSounds(): void {
  soundManager.preloadSounds();
}

/**
 * Export the sound manager instance
 */
export { soundManager };

/**
 * Default export
 */
export default {
  playSound,
  setSoundVolume,
  getSoundVolume,
  setSoundEnabled,
  isSoundEnabled,
  toggleSound,
  muteSounds,
  unmuteSounds,
  preloadSounds,
  SOUNDS,
};
