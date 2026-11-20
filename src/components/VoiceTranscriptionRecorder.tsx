import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2, Sparkles, AlertCircle, Send, X } from 'lucide-react';

interface VoiceTranscriptionRecorderProps {
  onTranscribed: (text: string) => void;
  buttonLabel?: string;
}

export const VoiceTranscriptionRecorder: React.FC<VoiceTranscriptionRecorderProps> = ({
  onTranscribed,
  buttonLabel = 'Grabar y Transcribir con Gemini 3.5',
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFallbackInput, setShowFallbackInput] = useState(false);
  const [fallbackText, setFallbackText] = useState(
    'Berna, platícame sobre San Judas Tadeo'
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const openFallbackSimulator = (friendlyReason: string) => {
    setErrorMessage(friendlyReason);
    setShowFallbackInput(true);
  };

  const startRecording = async () => {
    setErrorMessage(null);
    setShowFallbackInput(false);
    audioChunksRef.current = [];

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      openFallbackSimulator(
        'Este navegador o dispositivo no tiene captura de audio disponible. Puede probar el dictado escribiendo aquí:'
      );
      return;
    }

    try {
      if (typeof navigator.mediaDevices.enumerateDevices === 'function') {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasAudioInput = devices.some((d) => d.kind === 'audioinput');
        if (!hasAudioInput) {
          openFallbackSimulator(
            'No se detectó un micrófono conectado en este dispositivo. Puede probar el dictado escribiendo aquí:'
          );
          return;
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        stream.getTracks().forEach((track) => track.stop());
        await processAudioTranscription(audioBlob);
      };

      mediaRecorder.start(250);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      const errName = err?.name || '';
      if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        openFallbackSimulator(
          'No se encontró un micrófono conectado en este equipo. Puede enviar una frase de prueba aquí:'
        );
      } else if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError') {
        openFallbackSimulator(
          'El permiso del micrófono está bloqueado. Puede habilitarlo en su navegador o enviar una frase aquí:'
        );
      } else {
        openFallbackSimulator(
          'No fue posible iniciar el micrófono. Puede enviar una frase de prueba aquí:'
        );
      }
    }
  };

  const stopRecording = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudioTranscription = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const resultStr = typeof reader.result === 'string' ? reader.result : '';
          const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : '';

          if (!base64Data) {
            setIsProcessing(false);
            setErrorMessage('No se detectó audio válido en la grabación.');
            return;
          }

          const response = await fetch('/api/gemini/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioData: base64Data,
              mimeType: 'audio/webm',
            }),
          });

          const data = await response.json();
          setIsProcessing(false);

          if (data && data.transcript) {
            onTranscribed(data.transcript);
          } else {
            setErrorMessage('No se detectó voz clara en la grabación.');
          }
        } catch {
          setIsProcessing(false);
          setErrorMessage('Error al transcribir el audio.');
        }
      };
      reader.onerror = () => {
        setIsProcessing(false);
        setErrorMessage('No se pudo leer el audio grabado.');
      };
      reader.readAsDataURL(blob);
    } catch {
      setIsProcessing(false);
      setErrorMessage('Error al procesar el audio.');
    }
  };

  const handleFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fallbackText.trim()) return;
    onTranscribed(fallbackText.trim());
    setShowFallbackInput(false);
    setErrorMessage(null);
  };

  return (
    <div className="flex flex-col items-stretch gap-2">
      {isRecording ? (
        <button
          type="button"
          onClick={stopRecording}
          className="h-14 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-base flex items-center justify-center gap-3 shadow-lg shadow-red-600/30 animate-pulse active:scale-95 transition-all"
        >
          <Square className="w-5 h-5 fill-white" />
          <span>Detener Grabación ({recordingSeconds}s)</span>
        </button>
      ) : isProcessing ? (
        <div className="h-14 px-6 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-extrabold text-base flex items-center justify-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <span>Transcribiendo con Gemini 3.5 Transcribe...</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={startRecording}
          className="h-14 px-6 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-950 font-extrabold text-sm flex items-center justify-center gap-2.5 border border-indigo-200 shadow-xs active:scale-95 transition-all"
        >
          <Mic className="w-5 h-5 text-indigo-600" />
          <span>{buttonLabel}</span>
          <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-700" />
            Gemini 3.5
          </span>
        </button>
      )}

      {errorMessage && (
        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2 max-w-md">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-bold flex items-start gap-1.5 leading-snug">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setShowFallbackInput(false);
              }}
              className="p-1 text-amber-800 hover:text-amber-950 rounded-lg"
              aria-label="Cerrar aviso de micrófono"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {showFallbackInput && (
            <form onSubmit={handleFallbackSubmit} className="flex items-center gap-2">
              <input
                type="text"
                value={fallbackText}
                onChange={(e) => setFallbackText(e.target.value)}
                aria-label="Frase simulada para transcripción"
                className="flex-1 h-10 px-3 rounded-xl bg-white border border-amber-300 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                className="h-10 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center gap-1.5 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Usar texto</span>
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
