import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceOptions {
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

export const useVoice = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Check if speech synthesis and recognition are supported
    const speechSupported = 'speechSynthesis' in window;
    const recognitionSupported = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    
    setIsSupported(speechSupported && recognitionSupported);
    
    if (speechSupported) {
      synthesisRef.current = window.speechSynthesis;
    }
    
    if (recognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
        };
        
        recognitionRef.current.onresult = (event) => {
          const result = event.results[0][0].transcript;
          setTranscript(result);
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
        
        recognitionRef.current.onerror = (event) => {
          setIsListening(false);
          toast({
            title: "Voice Input Error",
            description: "Could not recognize speech. Please try again.",
            variant: "destructive"
          });
        };
      }
    }
  }, []);

  const speak = useCallback((text: string, options: VoiceOptions = {}) => {
    if (!synthesisRef.current || !text.trim()) return;
    
    // Stop any current speech
    synthesisRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 0.9;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    // Try to use a female voice for better rural user experience
    const voices = synthesisRef.current.getVoices();
    const preferredVoice = voices.find(voice => 
      voice.name.toLowerCase().includes('female') || 
      voice.name.toLowerCase().includes('woman') ||
      voice.name.toLowerCase().includes('karen') ||
      voice.name.toLowerCase().includes('samantha')
    ) || voices.find(voice => voice.lang === 'en-US') || voices[0];
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast({
        title: "Voice Output Error",
        description: "Could not speak text. Please try again.",
        variant: "destructive"
      });
    };
    
    synthesisRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    
    try {
      setTranscript('');
      recognitionRef.current.start();
    } catch (error) {
      toast({
        title: "Voice Input Error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive"
      });
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const clearTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    // States
    isListening,
    isSpeaking,
    transcript,
    isSupported,
    
    // Functions
    speak,
    stopSpeaking,
    startListening,
    stopListening,
    clearTranscript
  };
};

// Global speech synthesis voices loading helper
export const loadVoices = (): Promise<SpeechSynthesisVoice[]> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve([]);
      return;
    }

    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }

    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};