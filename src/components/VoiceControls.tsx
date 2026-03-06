import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import { toast } from '@/hooks/use-toast';

interface VoiceControlsProps {
  text?: string;
  onVoiceInput?: (transcript: string) => void;
  showSpeechToText?: boolean;
  showTextToSpeech?: boolean;
  className?: string;
}

export const VoiceControls = ({ 
  text = '', 
  onVoiceInput, 
  showSpeechToText = true, 
  showTextToSpeech = true,
  className = ''
}: VoiceControlsProps) => {
  const { 
    isListening, 
    isSpeaking, 
    transcript, 
    isSupported, 
    speak, 
    stopSpeaking, 
    startListening, 
    stopListening,
    clearTranscript 
  } = useVoice();

  // Handle voice input result
  React.useEffect(() => {
    if (transcript && onVoiceInput) {
      onVoiceInput(transcript);
      clearTranscript();
    }
  }, [transcript, onVoiceInput, clearTranscript]);

  const handleSpeak = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else if (text.trim()) {
      speak(text);
    } else {
      toast({
        title: "No text to read",
        description: "Please select or provide text to read aloud.",
        variant: "destructive"
      });
    }
  };

  const handleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        Voice features not supported in this browser
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {showTextToSpeech && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSpeak}
          disabled={!text.trim()}
          className={`transition-all ${
            isSpeaking 
              ? 'bg-primary text-primary-foreground animate-pulse' 
              : 'hover:bg-accent'
          }`}
          title={isSpeaking ? "Stop reading" : "Read aloud"}
        >
          {isSpeaking ? (
            <VolumeX className="w-4 h-4" />
          ) : (
            <Volume2 className="w-4 h-4" />
          )}
          <span className="ml-1 hidden sm:inline">
            {isSpeaking ? 'Stop' : 'Listen'}
          </span>
        </Button>
      )}
      
      {showSpeechToText && onVoiceInput && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleListen}
          className={`transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'hover:bg-accent'
          }`}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          {isListening ? (
            <MicOff className="w-4 h-4" />
          ) : (
            <Mic className="w-4 h-4" />
          )}
          <span className="ml-1 hidden sm:inline">
            {isListening ? 'Stop' : 'Speak'}
          </span>
        </Button>
      )}
    </div>
  );
};