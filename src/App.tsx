import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TabletHeader } from './components/TabletHeader';
import { QuickActionCards } from './components/QuickActionCards';
import { VoiceAssistantPanel } from './components/VoiceAssistantPanel';
import { RosarioModal } from './components/RosarioModal';
import { MisaModal } from './components/MisaModal';
import { MedicinesModal } from './components/MedicinesModal';
import { MentalGamesModal } from './components/MentalGamesModal';
import { EmergencyModal } from './components/EmergencyModal';
import { Screensaver } from './components/Screensaver';
import { VoiceTrainingModal } from './components/VoiceTrainingModal';
import { FamilyPortal } from './components/FamilyPortal';
import { SpecificPhotoModal } from './components/SpecificPhotoModal';
import { ProactiveCheckInBanner } from './components/ProactiveCheckInBanner';
import { routeIntent } from './lib/intentRouter';
import { selectMatureMaleSpanishVoice, DEFAULT_MATURE_MALE_PITCH } from './lib/voiceUtils';
import {
  ConversationTopicId,
  DEFAULT_CONVERSATION_STARTERS,
  getEnhancedLocalFallback,
  getSparkStarter,
} from './lib/conversationUtils';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { FamilySettings, ChatMessage } from './types';

export default function App() {
  const isOnline = useOnlineStatus();
  const [settings, setSettings] = useState<FamilySettings>({
    assistantName: 'Hey Berna',
    grandmotherName: 'Lupita',
    formality: 'usted',
    wakeWordSensitivity: 4,
    speechSpeed: 0.85,
    speechPitch: DEFAULT_MATURE_MALE_PITCH,
    maleVoiceName: 'Charon',
    proactiveSchedule: {
      morningEnabled: true,
      morningTime: '09:30',
      afternoonEnabled: true,
      afternoonTime: '15:00',
      eveningEnabled: true,
      eveningTime: '20:00',
    },
    emergencyContacts: [
      {
        id: 'c1',
        name: 'María Elena (Hija mayor)',
        relationship: 'Hija',
        phone: '+52 55 1234 5678',
        isPrimary: true,
      },
      {
        id: 'c2',
        name: 'Carlos (Hijo)',
        relationship: 'Hijo',
        phone: '+52 55 8765 4321',
        isPrimary: false,
      },
    ],
    medications: [
      {
        id: 'm1',
        name: 'Losartán (Presión arterial)',
        dosage: '50 mg - 1 pastilla',
        time: '09:00',
        instructions: 'Con un vaso de agua después del desayuno',
        takenToday: true,
        lastConfirmedTime: '09:12 AM',
      },
      {
        id: 'm2',
        name: 'Calcio con Vitamina D',
        dosage: '600 mg - 1 tableta masticable',
        time: '14:00',
        instructions: 'Después de la comida',
        takenToday: false,
      },
      {
        id: 'm3',
        name: 'Gotas para ojos',
        dosage: '1 gota en cada ojo',
        time: '20:30',
        instructions: 'Antes de acostarse',
        takenToday: false,
      },
    ],
    photos: [
      {
        id: 'p1',
        title: 'Mateo y Sofía en el jardín',
        caption: 'Tus nietos Mateo y Sofi mandándote muchos besos y abrazos.',
        url: '/images/mateo_sofia_jardin.jpg',
        dateAdded: 'Hoy',
      },
      {
        id: 'p2',
        title: 'Cumpleaños de María Elena',
        caption: 'Toda la familia reunida comiendo pastel de chocolate.',
        url: '/images/cumple_maria_elena.jpg',
        dateAdded: 'Ayer',
      },
      {
        id: 'p3',
        title: 'Valentina vestida de fiesta',
        caption: 'Tu bisnieta Valentina vestida con traje tradicional.',
        url: '/images/valentina_festival.jpg',
        dateAdded: 'Hace 3 días',
      },
      {
        id: 'p4',
        title: 'Domingo familiar en el parque',
        caption: 'Recordando los paseos familiares y las risas de los niños.',
        url: '/images/domingo_parque.jpg',
        dateAdded: 'Hace 5 días',
      },
    ],
    familyMessages: [
      {
        id: 'msg1',
        from: 'María Elena',
        text: '¡Hola mamá hermosa! Ya salí del trabajo, paso a verte al ratito con unas conchas de chocolate que tanto te gustan.',
        timestamp: '10:15 AM',
        played: false,
      },
    ],
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: '¡Muy buenos días, doña Lupita! Qué alegría acompañarla hoy. Estaba acordándome de las tardes tranquilas en familia, ¿qué platillo o recuerdo bonito le gustaría que platicáramos hoy?',
      timestamp: '10:00 AM',
      suggestedReplies: DEFAULT_CONVERSATION_STARTERS.slice(0, 3),
    },
  ]);

  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>(
    DEFAULT_CONVERSATION_STARTERS.slice(0, 3)
  );
  const [selectedGrandchildPhoto, setSelectedGrandchildPhoto] = useState<string>('Mateo');
  const [activeModal, setActiveModal] = useState<
    'rosario' | 'misa' | 'medicines' | 'games' | 'emergency' | 'screensaver' | 'voiceTraining' | 'familyPortal' | 'specificPhoto' | null
  >(null);

  const [proactiveCheckIn, setProactiveCheckIn] = useState<{
    active: boolean;
    timeSlot: 'morning' | 'afternoon' | 'evening';
    message: string;
    suggestedReplies?: string[];
  } | null>(null);

  const speechRecognitionRef = useRef<any>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const triggeredSlotsTodayRef = useRef<Set<string>>(new Set());
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string | null>(null);
  const ttsAbortRef = useRef<AbortController | null>(null);
  const ttsRequestIdRef = useRef<number>(0);

  // Preload browser speech synthesis voices (some browsers populate asynchronously)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener?.('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener?.('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  const triggerProactiveCheckIn = useCallback(async (timeSlot: 'morning' | 'afternoon' | 'evening') => {
    try {
      const r = await fetch('/api/gemini/proactive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ timeSlot }),
      });
      const res = await r.json();
      if (res && res.message) {
        setProactiveCheckIn({
          active: true,
          timeSlot,
          message: res.message,
          suggestedReplies: Array.isArray(res.suggestedReplies) ? res.suggestedReplies : undefined,
        });
      }
    } catch (e) {
      console.log('Proactive check-in offline:', e);
    }
  }, []);

  // Fetch initial family state and trigger initial proactive check-in
  useEffect(() => {
    fetch('/api/family/state')
      .then((r) => r.json())
      .then((data) => {
        if (data && data.grandmotherName) {
          setSettings(data);
        }
      })
      .catch((err) => console.log('Using local client state:', err));

    const hour = new Date().getHours();
    const timeSlot: 'morning' | 'afternoon' | 'evening' =
      hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    triggerProactiveCheckIn(timeSlot);
  }, [triggerProactiveCheckIn]);

  // Scheduled proactive conversation check every 30 seconds
  useEffect(() => {
    const checkSchedule = () => {
      const schedule = settings.proactiveSchedule;
      if (!schedule) return;

      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const dayKey = now.toISOString().slice(0, 10);

      const slots: Array<{ enabled: boolean; time: string; slot: 'morning' | 'afternoon' | 'evening' }> = [
        { enabled: schedule.morningEnabled, time: schedule.morningTime, slot: 'morning' },
        { enabled: schedule.afternoonEnabled, time: schedule.afternoonTime, slot: 'afternoon' },
        { enabled: schedule.eveningEnabled, time: schedule.eveningTime, slot: 'evening' },
      ];

      for (const s of slots) {
        const triggerKey = `${dayKey}-${s.slot}`;
        if (s.enabled && s.time === hhmm && !triggeredSlotsTodayRef.current.has(triggerKey)) {
          triggeredSlotsTodayRef.current.add(triggerKey);
          triggerProactiveCheckIn(s.slot);
          break;
        }
      }
    };

    const interval = setInterval(checkSchedule, 30000);
    return () => clearInterval(interval);
  }, [settings.proactiveSchedule, triggerProactiveCheckIn]);

  const stopSpeaking = useCallback(() => {
    ttsRequestIdRef.current += 1;
    if (ttsAbortRef.current) {
      ttsAbortRef.current.abort();
      ttsAbortRef.current = null;
    }
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (currentAudioUrlRef.current) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
      currentAudioUrlRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speakWithBrowserFallback = useCallback(
    (textToSpeak: string) => {
      if (!('speechSynthesis' in window)) {
        setIsSpeaking(false);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = settings.speechSpeed || 0.85;
      utterance.pitch = settings.speechPitch ?? DEFAULT_MATURE_MALE_PITCH;
      utterance.lang = 'es-MX';

      const voices = window.speechSynthesis.getVoices();
      const maleSpanishVoice = selectMatureMaleSpanishVoice(voices);
      if (maleSpanishVoice) {
        utterance.voice = maleSpanishVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [settings.speechSpeed, settings.speechPitch]
  );

  // Mature 50-60yo male text-to-speech engine (Gemini TTS + offline male browser voice fallback)
  const speakText = useCallback(
    async (textToSpeak: string) => {
      if (!textToSpeak.trim()) return;

      stopSpeaking();
      const requestId = ttsRequestIdRef.current;

      if (typeof navigator !== 'undefined' && navigator.onLine) {
        const controller = new AbortController();
        ttsAbortRef.current = controller;

        try {
          const response = await fetch('/api/gemini/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: textToSpeak,
              speechSpeed: settings.speechSpeed || 0.85,
              voiceName: settings.maleVoiceName || 'Charon',
            }),
            signal: controller.signal,
          });

          if (requestId !== ttsRequestIdRef.current) return;

          if (response.ok) {
            const data = await response.json();
            if (data?.audioBase64 && requestId === ttsRequestIdRef.current) {
              const binaryStr = window.atob(data.audioBase64);
              const bytes = new Uint8Array(binaryStr.length);
              for (let i = 0; i < binaryStr.length; i += 1) {
                bytes[i] = binaryStr.charCodeAt(i);
              }
              const audioBlob = new Blob([bytes], { type: data.mimeType || 'audio/wav' });
              const objectUrl = URL.createObjectURL(audioBlob);
              currentAudioUrlRef.current = objectUrl;

              const audio = new Audio(objectUrl);
              currentAudioRef.current = audio;

              audio.onplay = () => {
                if (requestId === ttsRequestIdRef.current) {
                  setIsSpeaking(true);
                }
              };
              audio.onended = () => {
                if (currentAudioRef.current === audio) {
                  currentAudioRef.current = null;
                }
                if (currentAudioUrlRef.current === objectUrl) {
                  URL.revokeObjectURL(objectUrl);
                  currentAudioUrlRef.current = null;
                }
                setIsSpeaking(false);
              };
              audio.onerror = () => {
                if (currentAudioRef.current === audio) {
                  currentAudioRef.current = null;
                }
                if (currentAudioUrlRef.current === objectUrl) {
                  URL.revokeObjectURL(objectUrl);
                  currentAudioUrlRef.current = null;
                }
                setIsSpeaking(false);
                if (requestId === ttsRequestIdRef.current) {
                  speakWithBrowserFallback(textToSpeak);
                }
              };

              await audio.play();
              return;
            }
          }
        } catch (err) {
          if ((err as Error)?.name === 'AbortError' || requestId !== ttsRequestIdRef.current) {
            return;
          }
        }
      }

      if (requestId === ttsRequestIdRef.current) {
        speakWithBrowserFallback(textToSpeak);
      }
    },
    [settings.speechSpeed, settings.maleVoiceName, stopSpeaking, speakWithBrowserFallback]
  );

  const handleRepeatLastMessage = () => {
    const lastAssistant = [...messages].reverse().find((m) => m.sender === 'assistant');
    if (lastAssistant) {
      speakText(lastAssistant.text);
    }
  };

  // Idle timer for screensaver (60 seconds on home screen only)
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (activeModal !== null) return;

    idleTimerRef.current = setTimeout(() => {
      setActiveModal('screensaver');
    }, 60000);
  }, [activeModal]);

  useEffect(() => {
    const handleActivity = () => resetIdleTimer();
    window.addEventListener('pointerdown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    resetIdleTimer();

    return () => {
      window.removeEventListener('pointerdown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [resetIdleTimer]);

  // Speech Recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'es-MX';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          handleUserSpeechOrText(transcript);
        }
      };

      speechRecognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    stopSpeaking();

    if (isListening) {
      if (speechRecognitionRef.current) {
        speechRecognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.start();
        } catch {
          setIsListening(true);
        }
      } else {
        // Fallback for browsers without Web Speech API: focus text input and inform gently
        const inputEl = document.querySelector<HTMLInputElement>(
          'input[placeholder*="escriba algo"]'
        );
        if (inputEl) inputEl.focus();
        addAssistantMessage(
          'No detecté el micrófono de voz en este navegador. Puede escribirme abajo o tocar una de las peticiones rápidas con mucho gusto.',
          'SISTEMA'
        );
      }
    }
  };

  // Process User message through deterministic router + Gemini API
  const handleUserSpeechOrText = async (userInput: string) => {
    stopSpeaking();
    resetIdleTimer();

    const timestamp = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      sender: 'user',
      text: userInput,
      timestamp,
    };

    setMessages((prev) => [...prev, userMsg]);

    // 1. Evaluate deterministic intent router first
    const intent = routeIntent(userInput);

    if (intent.type === 'EMERGENCIA') {
      setActiveModal('emergency');
      return;
    }

    if (intent.type === 'MEDICINAS') {
      setActiveModal('medicines');
      const text = 'Abriendo su lista de medicinas de hoy, doña Lupita.';
      addAssistantMessage(text, 'MEDICINAS');
      speakText(text);
      return;
    }

    if (intent.type === 'ROSARIO') {
      setActiveModal('rosario');
      const text = 'Con mucho gusto. Vamos a rezar el Santo Rosario juntas.';
      addAssistantMessage(text, 'ROSARIO');
      speakText(text);
      return;
    }

    if (intent.type === 'MISA') {
      setActiveModal('misa');
      const text = 'Poniendo la Santa Misa desde la Basílica de Guadalupe.';
      addAssistantMessage(text, 'MISA');
      speakText(text);
      return;
    }

    if (intent.type === 'FOTO_ESPECIFICA') {
      const targetName = intent.targetPerson || 'Mateo';
      setSelectedGrandchildPhoto(targetName);
      setActiveModal('specificPhoto');
      const text = `Con mucho gusto, doña ${settings.grandmotherName}. Aquí le muestro la fotografía de ${targetName}.`;
      addAssistantMessage(text, 'FOTO_ESPECIFICA');
      return;
    }

    if (intent.type === 'FOTOS') {
      setActiveModal('screensaver');
      return;
    }

    if (intent.type === 'HORA') {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
      const text = `Son las ${timeStr} de este hermoso ${dateStr}.`;
      addAssistantMessage(text, 'HORA');
      speakText(text);
      return;
    }

    if (intent.type === 'MUSICA') {
      setActiveModal('games');
      const text = 'Le pongo sus canciones y boleros del recuerdo con mucho cariño.';
      addAssistantMessage(text, 'MUSICA');
      speakText(text);
      return;
    }

    // 2. Open Conversational with Gemini structured response
    setIsThinking(true);
    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userInput,
          conversationHistory: [...messages, userMsg].slice(-8),
        }),
      });

      const data = await response.json();
      const replyText = data.text || 'Aquí estoy con usted, doña Lupita. La escucho con todo gusto.';
      const nextSuggestions =
        Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0
          ? data.suggestedReplies
          : undefined;
      addAssistantMessage(replyText, 'CONVERSACION', nextSuggestions);
      if (nextSuggestions) {
        setActiveSuggestions(nextSuggestions);
      }
      speakText(replyText);
    } catch {
      const fallback = getEnhancedLocalFallback(userInput, settings.grandmotherName);
      addAssistantMessage(fallback.reply, 'FALLBACK', fallback.suggestedReplies);
      setActiveSuggestions(fallback.suggestedReplies);
      speakText(fallback.reply);
    } finally {
      setIsThinking(false);
    }
  };

  // Topic-driven conversation spark ("Sácame plática")
  const handleSparkConversation = async (topic: ConversationTopicId) => {
    stopSpeaking();
    resetIdleTimer();
    setIsThinking(true);

    const hour = new Date().getHours();
    const timeSlot: 'morning' | 'afternoon' | 'evening' =
      hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

    const recentAssistantMessages = messages
      .filter((m) => m.sender === 'assistant')
      .slice(-4)
      .map((m) => m.text);

    try {
      const response = await fetch('/api/gemini/spark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          timeSlot,
          recentAssistantMessages,
        }),
      });
      const data = await response.json();
      const sparkText =
        data.text ||
        getSparkStarter(topic, timeSlot, settings.grandmotherName, recentAssistantMessages).reply;
      const nextSuggestions =
        Array.isArray(data.suggestedReplies) && data.suggestedReplies.length > 0
          ? data.suggestedReplies
          : getSparkStarter(topic, timeSlot, settings.grandmotherName, recentAssistantMessages)
              .suggestedReplies;

      addAssistantMessage(sparkText, 'PLÁTICA_ESTIMULADA', nextSuggestions);
      setActiveSuggestions(nextSuggestions);
      speakText(sparkText);
    } catch {
      const localSpark = getSparkStarter(
        topic,
        timeSlot,
        settings.grandmotherName,
        recentAssistantMessages
      );
      addAssistantMessage(localSpark.reply, 'PLÁTICA_ESTIMULADA', localSpark.suggestedReplies);
      setActiveSuggestions(localSpark.suggestedReplies);
      speakText(localSpark.reply);
    } finally {
      setIsThinking(false);
    }
  };

  const addAssistantMessage = (
    text: string,
    intent?: string,
    suggestedReplies?: string[]
  ) => {
    const timestamp = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [
      ...prev,
      {
        id: 'ast_' + Date.now(),
        sender: 'assistant',
        text,
        timestamp,
        intent,
        suggestedReplies,
      },
    ]);
  };

  // Medicine confirm handler
  const handleConfirmMedication = async (medId: string) => {
    try {
      await fetch('/api/medications/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: medId }),
      });
    } catch (e) {
      console.log('Local med update', e);
    }

    setSettings((prev) => {
      const updated = prev.medications.map((m) => {
        if (m.id === medId) {
          return {
            ...m,
            takenToday: true,
            lastConfirmedTime: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
          };
        }
        return m;
      });
      return { ...prev, medications: updated };
    });

    const med = settings.medications.find((m) => m.id === medId);
    const msg = `Medicina ${med?.name || ''} registrada. ¡Qué bien, doña Lupita! Siga cuidándose mucho.`;
    addAssistantMessage(msg, 'MEDICINA_CONFIRMADA');
    speakText(msg);
  };

  const handleConfirmNextMedication = () => {
    const nextPending = settings.medications.find((m) => !m.takenToday);
    if (nextPending) {
      handleConfirmMedication(nextPending.id);
    }
  };

  // Family message sender
  const handleSendFamilyMessage = async (from: string, text: string) => {
    try {
      await fetch('/api/family/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, text }),
      });
    } catch (e) {
      console.log('Local msg push', e);
    }

    const newMsg = {
      id: 'fmsg_' + Date.now(),
      from,
      text,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      played: false,
    };

    setSettings((prev) => ({
      ...prev,
      familyMessages: [newMsg, ...prev.familyMessages],
    }));

    // Alert grandmother on the tablet
    const voiceNotice = `Doña Lupita, le acaba de llegar un mensaje con mucho cariño de su familia. ${from} le dice: ${text}`;
    addAssistantMessage(voiceNotice, 'MENSAJE_FAMILIAR');
    speakText(voiceNotice);
  };

  // Update family settings
  const handleUpdateSettings = async (updates: Partial<FamilySettings>) => {
    try {
      await fetch('/api/family/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.log('Local settings update', e);
    }

    setSettings((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="w-full h-full bg-[#F2F4F7] flex flex-col overflow-hidden select-none">
      {/* Top Tablet Header with big clock & mode switches */}
      <TabletHeader
        assistantName={settings.assistantName}
        isListeningWakeWord={isListening}
        onOpenFamilyPortal={() => setActiveModal('familyPortal')}
        onOpenVoiceTraining={() => setActiveModal('voiceTraining')}
        onOpenScreensaver={() => setActiveModal('screensaver')}
      />

      {/* Main Voice-First Dual-Panel View */}
      <main className="flex-1 p-4 md:p-5 overflow-hidden min-h-0 flex flex-col gap-3 max-w-7xl w-full mx-auto">
        {proactiveCheckIn?.active && (
          <ProactiveCheckInBanner
            timeSlot={proactiveCheckIn.timeSlot}
            promptMessage={proactiveCheckIn.message}
            suggestedReplies={proactiveCheckIn.suggestedReplies}
            onSpeak={speakText}
            onDismiss={() => setProactiveCheckIn(null)}
            onRespond={(promptMsg, promptSuggestions) => {
              const nextSuggestions =
                promptSuggestions && promptSuggestions.length > 0
                  ? promptSuggestions
                  : activeSuggestions;
              addAssistantMessage(promptMsg, 'PLÁTICA_PROACTIVA', nextSuggestions);
              setActiveSuggestions(nextSuggestions);
              speakText(promptMsg);
              setProactiveCheckIn(null);
            }}
          />
        )}

        <div className="flex-1 w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch min-h-0">
          {/* Primary Left Column: Voice-First Conversational Panel (8 cols on lg) */}
          <section className="lg:col-span-8 h-full min-h-0 overflow-hidden flex flex-col">
            <VoiceAssistantPanel
              messages={messages}
              isListening={isListening}
              isSpeaking={isSpeaking}
              isThinking={isThinking}
              suggestedReplies={activeSuggestions}
              onToggleListening={toggleListening}
              onSendMessage={handleUserSpeechOrText}
              onSparkConversation={handleSparkConversation}
              onStopSpeaking={stopSpeaking}
              onRepeatLastMessage={handleRepeatLastMessage}
              onSpeakMessage={speakText}
              grandmotherName={settings.grandmotherName}
              assistantName={settings.assistantName}
            />
          </section>

          {/* Secondary Right Column: Quick Action Cards (4 cols on lg) */}
          <section className="lg:col-span-4 h-full min-h-0 overflow-hidden flex flex-col">
            <QuickActionCards
              onOpenRosario={() => setActiveModal('rosario')}
              onOpenMisa={() => setActiveModal('misa')}
              onOpenMedicines={() => setActiveModal('medicines')}
              onOpenGames={() => setActiveModal('games')}
              onTriggerEmergency={() => setActiveModal('emergency')}
              medications={settings.medications}
              onConfirmNextMedication={handleConfirmNextMedication}
              primaryContactName={settings.emergencyContacts.find((c) => c.isPrimary)?.name || 'María Elena'}
            />
          </section>
        </div>
      </main>

      {/* Modals & Screensaver */}
      {activeModal === 'screensaver' && (
        <Screensaver
          photos={settings.photos}
          onWakeUp={() => setActiveModal(null)}
          assistantName={settings.assistantName}
          grandmotherName={settings.grandmotherName}
        />
      )}

      {activeModal === 'specificPhoto' && (
        <SpecificPhotoModal
          personName={selectedGrandchildPhoto}
          photos={settings.photos}
          onClose={() => setActiveModal(null)}
          onSpeak={speakText}
        />
      )}

      {activeModal === 'rosario' && (
        <RosarioModal onClose={() => setActiveModal(null)} onSpeak={speakText} />
      )}

      {activeModal === 'misa' && (
        <MisaModal onClose={() => setActiveModal(null)} onSpeak={speakText} />
      )}

      {activeModal === 'medicines' && (
        <MedicinesModal
          medications={settings.medications}
          onConfirmMedication={handleConfirmMedication}
          onClose={() => setActiveModal(null)}
          onSpeak={speakText}
        />
      )}

      {activeModal === 'games' && (
        <MentalGamesModal onClose={() => setActiveModal(null)} onSpeak={speakText} />
      )}

      {activeModal === 'emergency' && (
        <EmergencyModal
          contacts={settings.emergencyContacts}
          onClose={() => setActiveModal(null)}
          onSpeak={speakText}
          grandmotherName={settings.grandmotherName}
        />
      )}

      {activeModal === 'voiceTraining' && (
        <VoiceTrainingModal
          currentAssistantName={settings.assistantName}
          onUpdateAssistantName={(name) => handleUpdateSettings({ assistantName: name })}
          sensitivity={settings.wakeWordSensitivity}
          onUpdateSensitivity={(sens) => handleUpdateSettings({ wakeWordSensitivity: sens })}
          onClose={() => setActiveModal(null)}
          onSpeak={speakText}
        />
      )}

      {activeModal === 'familyPortal' && (
        <FamilyPortal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onClose={() => setActiveModal(null)}
          onSendFamilyMessage={handleSendFamilyMessage}
          onTriggerProactiveCheckIn={triggerProactiveCheckIn}
          onTestVoice={() =>
            speakText(
              `Muy buenos días, doña ${settings.grandmotherName}. Soy su acompañante Berna, con voz tranquila y clara para platicar con usted todo el día.`
            )
          }
        />
      )}

      {!isOnline && (
        <div
          role="status"
          className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-xs font-extrabold text-white shadow-lg"
        >
          <span className="h-2.5 w-2.5 rounded-full bg-white animate-pulse" />
          <span>Modo sin conexión — Funciones básicas y voz local activas</span>
        </div>
      )}
    </div>
  );
}
