import React, { useRef, useState } from 'react';
import { Mic } from 'lucide-react';
import './VoiceButton.css';

const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
};

const VoiceButton = ({ onTranscript, disabled = false, className = '' }) => {
  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);
  const SpeechRecognition = getSpeechRecognition();
  const isSupported = Boolean(SpeechRecognition);
  const isDisabled = disabled || !isSupported;

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const startListening = () => {
    if (isDisabled) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join(' ')
        .trim();

      if (transcript) {
        onTranscript?.(transcript);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const handleClick = () => {
    if (isDisabled) return;

    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button
      type="button"
      className={`voice-button ${listening ? 'listening' : ''} ${className}`}
      onClick={handleClick}
      disabled={isDisabled}
      title={!isSupported ? 'Voice input is not supported in this browser' : listening ? 'Listening...' : 'Speak your question'}
    >
      <Mic size={18} />
    </button>
  );
};

export default VoiceButton;
