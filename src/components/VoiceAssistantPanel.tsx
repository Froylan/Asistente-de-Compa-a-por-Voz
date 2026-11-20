import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  MessageCircleHeart,
  Utensils,
  Users,
  BookOpen,
  Church,
  Music,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { VoiceTranscriptionRecorder } from './VoiceTranscriptionRecorder';
import {
  CONVERSATION_TOPICS,
  ConversationTopicId,
  DEFAULT_CONVERSATION_STARTERS,
} from '../lib/conversationUtils';

interface VoiceAssistantPanelProps {
  messages: ChatMessage[];
  isListening: boolean;
  isSpeaking: boolean;
  isThinking?: boolean;
  suggestedReplies?: string[];
  onToggleListening: () => void;
  onSendMessage: (text: string) => void;
  onSparkConversation: (topic: ConversationTopicId) => void;
  onStopSpeaking: () => void;
  onRepeatLastMessage: () => void;
  onSpeakMessage: (text: string) => void;
  grandmotherName: string;
  assistantName: string;
}

const TOPIC_ICON_MAP: Record<ConversationTopicId, React.ReactNode> = {
  libre: <MessageCircleHeart className="w-4 h-4 text-amber-700 shrink-0" />,
  cocina: <Utensils className="w-4 h-4 text-orange-700 shrink-0" />,
  familia: <Users className="w-4 h-4 text-blue-700 shrink-0" />,
  recuerdos: <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" />,
  fe: <Church className="w-4 h-4 text-indigo-700 shrink-0" />,
  musica: <Music className="w-4 h-4 text-rose-700 shrink-0" />,
};

export const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
  messages,
  isListening,
  isSpeaking,
  isThinking = false,
  suggestedReplies,
  onToggleListening,
  onSendMessage,
  onSparkConversation,
  onStopSpeaking,
  onRepeatLastMessage,
  onSpeakMessage,
  grandmotherName,
  assistantName,
}) => {
  const [inputText, setInputText] = useState('');
  const feedContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = feedContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, isThinking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  // Find last assistant message for quick repetition
  const lastAssistantMsg = [...messages].reverse().find((m) => m.sender === 'assistant');
  const activeReplies =
    suggestedReplies && suggestedReplies.length > 0
      ? suggestedReplies
      : DEFAULT_CONVERSATION_STARTERS;

  return (
    <div className="w-full h-full bg-white rounded-3xl p-3.5 border-2 border-slate-200/80 shadow-md flex flex-col overflow-hidden isolate">
      {/* Top zone: Big high-contrast Assistant header and audio status */}
      <div className="flex items-center justify-between pb-2 border-b-2 border-slate-100 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center font-black text-xl shadow-md">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">
                {assistantName}
              </h2>
              <span className="text-xs font-black uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded-full border border-blue-200">
                Voz Activa
              </span>
            </div>
            <p className="text-sm font-bold text-slate-600">
              Platicando con cariño con Doña {grandmotherName}
            </p>
          </div>
        </div>

        {/* Audio control actions */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <button
              onClick={onStopSpeaking}
              className="h-10 px-3.5 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-black text-sm flex items-center gap-2 transition-colors border border-amber-300 shadow-xs"
              title="Detener voz"
              aria-label="Pausar voz"
            >
              <VolumeX className="w-5 h-5 text-amber-700" />
              <span>Pausar voz</span>
            </button>
          )}

          {lastAssistantMsg && !isSpeaking && (
            <button
              onClick={onRepeatLastMessage}
              className="h-10 px-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-950 font-black text-sm flex items-center gap-2 transition-colors border border-blue-200 shadow-xs"
              title="Volver a escuchar lo que dijo Berna"
              aria-label="Volver a escuchar lo que dijo Berna"
            >
              <Volume2 className="w-5 h-5 text-blue-600" />
              <span>Repetir en voz alta</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Conversation Feed: Ultra Large High-Contrast Typography for Low-Vision */}
      <div ref={feedContainerRef} className="flex-1 min-h-0 overflow-y-auto py-2 space-y-2.5 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-2 mb-0.5 px-1">
              <span className="text-xs sm:text-sm font-extrabold text-slate-600">
                {msg.sender === 'user' ? `Doña ${grandmotherName}` : assistantName}
              </span>
              <span className="text-xs font-bold text-slate-400">· {msg.timestamp}</span>
              {msg.sender === 'assistant' && (
                <button
                  onClick={() => onSpeakMessage(msg.text)}
                  className="p-1 text-slate-400 hover:text-blue-600"
                  title="Escuchar este mensaje"
                  aria-label="Escuchar este mensaje en voz alta"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Bubble with extra readable font */}
            <div
              className={`max-w-[92%] rounded-3xl px-4 py-3 shadow-sm text-base sm:text-lg font-extrabold leading-snug tracking-tight ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-br-md'
                  : 'bg-slate-100 text-slate-950 rounded-bl-md border-2 border-slate-200'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isThinking && (
          <div className="flex flex-col items-start">
            <span className="text-sm font-extrabold text-slate-500 mb-1 px-1">
              {assistantName} está pensando...
            </span>
            <div className="rounded-3xl rounded-bl-md px-4 py-3 bg-slate-100 border-2 border-slate-200 text-slate-700 font-extrabold text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:150ms]" />
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}
      </div>

      {/* Conversation Starter Strip ("Sácame plática" + Topic Triggers) */}
      <div className="py-1.5 px-2.5 bg-amber-50/75 rounded-2xl border border-amber-200 flex items-center gap-1.5 flex-wrap shrink-0 mb-1.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 shrink-0">
          Platicar:
        </span>
        {CONVERSATION_TOPICS.map((topic) => {
          const isPrimary = topic.id === 'libre';
          return (
            <button
              key={topic.id}
              type="button"
              disabled={isThinking}
              onClick={() => onSparkConversation(topic.id)}
              title={topic.shortHint}
              className={`h-8 px-2.5 rounded-xl font-black text-xs flex items-center gap-1 transition-all active:scale-95 disabled:opacity-60 ${
                isPrimary
                  ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  : 'bg-white hover:bg-amber-100 text-slate-900 border border-amber-200 shadow-2xs'
              }`}
            >
              {isPrimary ? (
                <MessageCircleHeart className="w-3.5 h-3.5 text-white shrink-0" />
              ) : (
                TOPIC_ICON_MAP[topic.id]
              )}
              <span>{topic.label}</span>
            </button>
          );
        })}
      </div>

      {/* Reactive Visual Voice Orb & Waveform */}
      <div className="py-1.5 px-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              isListening
                ? 'bg-red-500 animate-ping'
                : isSpeaking
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-blue-500'
            }`}
          />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-700">
            {isListening
              ? 'Berna está escuchando atentamente...'
              : isSpeaking
              ? 'Berna está hablando...'
              : 'Diga "Hey Berna" o toque el micrófono'}
          </span>
        </div>

        {/* Audio Wave Bars */}
        <div className="flex items-center gap-1.5">
          {[40, 75, 95, 60, 85, 45, 90, 70, 100, 50, 80, 65].map((height, idx) => (
            <span
              key={idx}
              className={`w-1.5 rounded-full transition-all duration-300 ${
                isListening
                  ? 'bg-red-500 animate-pulse'
                  : isSpeaking
                  ? 'bg-emerald-600 animate-pulse'
                  : 'bg-slate-300'
              }`}
              style={{
                height: isListening || isSpeaking ? `${height * 0.28}px` : '7px',
              }}
            />
          ))}
        </div>
      </div>

      {/* Action Controls: Massive Microphone & Gemini 3.5 Transcription */}
      <div className="pt-2 border-t-2 border-slate-100 flex flex-col gap-1.5 shrink-0">
        <div className="flex flex-col sm:flex-row items-start gap-2.5">
          {/* Big Primary Mic Button */}
          <button
            onClick={onToggleListening}
            className={`flex-1 w-full h-13 rounded-3xl font-black text-lg sm:text-xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg px-5 ${
              isListening
                ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse ring-4 ring-red-300 shadow-red-600/30'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/30'
            }`}
            aria-label={isListening ? 'Detener escucha' : 'Tocar para hablar'}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 shrink-0" />
                <span className="truncate">Escuchando... Toque al terminar</span>
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 shrink-0" />
                <span className="truncate">Hablar con "{assistantName}"</span>
              </>
            )}
          </button>

          {/* High-Accuracy Gemini 3.5 Transcribe button */}
          <VoiceTranscriptionRecorder
            onTranscribed={(transcript) => onSendMessage(transcript)}
            buttonLabel="Dictar con Gemini 3.5"
          />
        </div>

        {/* Dynamic Contextual Suggested Replies Bar */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {suggestedReplies && suggestedReplies.length > 0
              ? 'Ideas para responder:'
              : 'Para empezar:'}
          </span>
          {activeReplies.slice(0, 3).map((prompt, idx) => (
            <button
              key={`${prompt}-${idx}`}
              type="button"
              disabled={isThinking}
              onClick={() => onSendMessage(prompt)}
              className="text-xs sm:text-[13px] font-extrabold text-slate-900 bg-blue-50/90 hover:bg-blue-100 hover:text-blue-950 px-3 py-1 rounded-xl whitespace-nowrap shrink-0 transition-colors border-2 border-blue-200 shadow-xs disabled:opacity-60"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Text Input Fallback with Clear Button */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="O escriba algo para platicar con Berna..."
            className="flex-1 h-11 px-4 rounded-2xl bg-slate-100 border-2 border-slate-200 text-base font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            className="h-11 w-11 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-md"
            aria-label="Enviar mensaje a Berna"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
