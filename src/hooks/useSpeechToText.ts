import { useState, useRef, useCallback } from "react";

interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface UseSpeechToTextOptions {
  language?: string;
  onResult?: (transcript: string) => void;
  appendMode?: boolean;
}

export function useSpeechToText({ language = "pt", onResult, appendMode = true }: UseSpeechToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const accumulatedRef = useRef("");

  const langMap: Record<string, string> = {
    pt: "pt-BR",
    es: "es-ES",
  };

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const start = useCallback(
    (currentValue: string) => {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Seu navegador não suporta reconhecimento de voz.");
        return;
      }

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      const recognition = new SpeechRecognition();
      recognition.lang = langMap[language] || "pt-BR";
      recognition.continuous = true;
      recognition.interimResults = true;

      accumulatedRef.current = appendMode ? currentValue : "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }

        if (finalTranscript) {
          const separator = accumulatedRef.current.trim() ? " " : "";
          accumulatedRef.current += separator + finalTranscript;
          onResult?.(accumulatedRef.current);
        } else if (interim) {
          const separator = accumulatedRef.current.trim() ? " " : "";
          onResult?.(accumulatedRef.current + separator + interim);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    },
    [language, onResult, appendMode]
  );

  const toggle = useCallback(
    (currentValue: string) => {
      if (isListening) {
        stop();
      } else {
        start(currentValue);
      }
    },
    [isListening, start, stop]
  );

  return { isListening, toggle, stop };
}
