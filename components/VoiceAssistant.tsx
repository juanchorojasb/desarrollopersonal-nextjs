'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import { Mic, MicOff, Send, Volume2, VolumeX, Loader2, Bot } from 'lucide-react';

// --- Web Speech API types (not in all TS libs) ---
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
  length: number;
}
interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}
interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}
interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

interface VoiceAssistantProps {
  compact?: boolean;
}

export default function VoiceAssistant({ compact = false }: VoiceAssistantProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } = useChat({
    api: '/api/chat',
  });

  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  // Detect browser speech support
  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Speak assistant responses aloud
  useEffect(() => {
    if (!voiceEnabled) return;
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant' && last.content) {
      window.speechSynthesis?.cancel();
      const utt = new SpeechSynthesisUtterance(last.content);
      utt.lang = 'es-ES';
      utt.rate = 1.0;
      utt.pitch = 1.0;
      window.speechSynthesis?.speak(utt);
    }
  }, [messages, voiceEnabled]);

  const startListening = () => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) return;

    const recognition = new SR();
    recognition.lang = 'es-ES';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    window.speechSynthesis?.cancel();
    handleSubmit(e);
  };

  const containerClass = compact
    ? 'flex flex-col h-full'
    : 'flex flex-col h-[600px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden';

  return (
    <div className={containerClass}>
      {/* Header (only in non-compact / full-page mode) */}
      {!compact && (
        <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Dora — Asistente IA</h2>
            <p className="text-xs text-indigo-100">DesarrolloPersonal.uno · Llama 3.3 70B</p>
          </div>
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled);
              if (voiceEnabled) window.speechSynthesis?.cancel();
            }}
            className="ml-auto p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            title={voiceEnabled ? 'Silenciar voz' : 'Activar voz'}
          >
            {voiceEnabled ? (
              <Volume2 className="w-5 h-5 text-white" />
            ) : (
              <VolumeX className="w-5 h-5 text-white" />
            )}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 gap-3">
            <Bot className="w-12 h-12 text-indigo-300" />
            <p className="text-sm">
              Hola! Soy Dora, tu asistente de desarrollo personal.
              <br />
              ¿En qué puedo ayudarte hoy?
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-4 h-4 text-indigo-600" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleFormSubmit} className="p-3 border-t bg-gray-50">
        <div className="flex items-center gap-2">
          {/* Voice input button */}
          {speechSupported && (
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
              }`}
              title={isListening ? 'Detener grabación' : 'Hablar'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}

          <input
            value={input}
            onChange={handleInputChange}
            placeholder={isListening ? 'Escuchando...' : 'Escribe un mensaje...'}
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        {isListening && (
          <p className="text-xs text-red-500 mt-1 text-center animate-pulse">
            Grabando... habla ahora
          </p>
        )}
      </form>
    </div>
  );
}
