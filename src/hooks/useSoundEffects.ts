import { useCallback, useRef, useEffect } from 'react';

type SoundType = 'hover' | 'click' | 'whoosh' | 'blip' | 'success';

class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;
  private enabled: boolean = true;

  initialize() {
    if (this.audioContext) return;
    
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = 0.15; // Master volume
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    attack: number = 0.01,
    decay: number = 0.1
  ) {
    if (!this.enabled || !this.audioContext || !this.gainNode) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(this.gainNode);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  playHover() {
    this.playTone(800, 0.08, 'sine', 0.005, 0.05);
  }

  playClick() {
    this.playTone(400, 0.1, 'square', 0.001, 0.05);
    setTimeout(() => this.playTone(600, 0.08, 'sine', 0.001, 0.03), 20);
  }

  playWhoosh() {
    if (!this.enabled || !this.audioContext || !this.gainNode) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.2);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.gainNode);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  playBlip() {
    this.playTone(1200, 0.05, 'sine', 0.001, 0.03);
  }

  playSuccess() {
    this.playTone(523, 0.15, 'sine', 0.01, 0.1);
    setTimeout(() => this.playTone(659, 0.15, 'sine', 0.01, 0.1), 100);
    setTimeout(() => this.playTone(784, 0.2, 'sine', 0.01, 0.15), 200);
  }
}

const audioEngine = new AudioEngine();

export const useSoundEffects = () => {
  const isInitialized = useRef(false);

  const initializeAudio = useCallback(() => {
    if (!isInitialized.current) {
      audioEngine.initialize();
      isInitialized.current = true;
    }
  }, []);

  // Initialize on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initializeAudio();
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('touchstart', handleInteraction);
    };
  }, [initializeAudio]);

  const playSound = useCallback((type: SoundType) => {
    initializeAudio();
    
    switch (type) {
      case 'hover':
        audioEngine.playHover();
        break;
      case 'click':
        audioEngine.playClick();
        break;
      case 'whoosh':
        audioEngine.playWhoosh();
        break;
      case 'blip':
        audioEngine.playBlip();
        break;
      case 'success':
        audioEngine.playSuccess();
        break;
    }
  }, [initializeAudio]);

  const playHover = useCallback(() => {
    initializeAudio();
    audioEngine.playHover();
  }, [initializeAudio]);

  const playClick = useCallback(() => {
    initializeAudio();
    audioEngine.playClick();
  }, [initializeAudio]);

  const setEnabled = useCallback((enabled: boolean) => {
    audioEngine.setEnabled(enabled);
  }, []);

  const isEnabled = useCallback(() => {
    return audioEngine.isEnabled();
  }, []);

  return { playSound, playHover, playClick, setEnabled, isEnabled, initializeAudio };
};

export default useSoundEffects;
