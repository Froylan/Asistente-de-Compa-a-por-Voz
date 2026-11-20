import React, { useState } from 'react';
import { X, Mic, CheckCircle2, Sliders, Volume2, Sparkles, RefreshCw } from 'lucide-react';

interface VoiceTrainingModalProps {
  currentAssistantName: string;
  onUpdateAssistantName: (name: string) => void;
  sensitivity: number;
  onUpdateSensitivity: (sens: number) => void;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const VoiceTrainingModal: React.FC<VoiceTrainingModalProps> = ({
  currentAssistantName,
  onUpdateAssistantName,
  sensitivity,
  onUpdateSensitivity,
  onClose,
  onSpeak,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [customName, setCustomName] = useState(currentAssistantName);
  const [attempts, setAttempts] = useState([false, false, false]);
  const [isSimulatingListen, setIsSimulatingListen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePracticeSaying = (attemptIndex: number) => {
    setIsSimulatingListen(true);
    setFeedback(`Escuchando... Por favor diga en voz alta: "${customName}"`);

    setTimeout(() => {
      setIsSimulatingListen(false);
      const newAttempts = [...attempts];
      newAttempts[attemptIndex] = true;
      setAttempts(newAttempts);
      setFeedback(`¡Excelente! Voz reconocida perfectamente en intento ${attemptIndex + 1}.`);
      onSpeak(`¡Muy bien doña Lupita! La escuché con toda claridad.`);
    }, 1800);
  };

  const handleSaveName = () => {
    if (customName.trim()) {
      onUpdateAssistantName(customName.trim());
      onSpeak(`El nombre de activación ahora es ${customName}.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-blue-200 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Mic className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Calibración y comando de voz
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Entrenamiento: "{customName}"
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
            aria-label="Cerrar entrenamiento"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="grid grid-cols-3 gap-2 my-4">
          <button
            onClick={() => setStep(1)}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              step === 1 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span>1. Nombre</span>
          </button>
          <button
            onClick={() => setStep(2)}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              step === 2 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span>2. Práctica ({attempts.filter(Boolean).length}/3)</span>
          </button>
          <button
            onClick={() => setStep(3)}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              step === 3 ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <span>3. Sensibilidad</span>
          </button>
        </div>

        {/* Content Body based on step */}
        <div className="flex-1 my-2 overflow-y-auto">
          {step === 1 && (
            <div className="bg-blue-50/50 rounded-3xl p-6 border-2 border-blue-200 space-y-4">
              <h3 className="text-xl font-black text-slate-900">
                Palabra clave para despertar a la asistente
              </h3>
              <p className="text-base font-semibold text-slate-700">
                Por defecto está configurada como <strong className="text-blue-700">"Hey Berna"</strong>. Puede cambiarla por otro nombre cariñoso de 2 o 3 sílabas que a la abuela le sea natural pronunciar.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ej: Hey Berna, Paloma, Lupita..."
                  className="w-full sm:flex-1 h-14 px-4 rounded-2xl bg-white border-2 border-blue-300 text-xl font-extrabold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveName}
                  className="w-full sm:w-auto h-14 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base active:scale-95 transition-all shrink-0"
                >
                  Guardar Nombre
                </button>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-xs font-bold text-slate-500">Sugerencias:</span>
                {['Hey Berna', 'Don Berna', 'Hey Bernardo', 'Compañero'].map((sug) => (
                  <button
                    key={sug}
                    onClick={() => {
                      setCustomName(sug);
                      onUpdateAssistantName(sug);
                    }}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-white border border-blue-200 text-blue-900 hover:bg-blue-100"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-blue-50/50 rounded-3xl p-6 border-2 border-blue-200 space-y-4">
              <h3 className="text-xl font-black text-slate-900">
                Práctica guiada: decir "{customName}" 3 veces
              </h3>
              <p className="text-base font-semibold text-slate-700">
                Toque cada botón y diga en voz alta el nombre para que la tableta calibre el tono y timbre de la abuela.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                {[0, 1, 2].map((idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePracticeSaying(idx)}
                    disabled={isSimulatingListen}
                    className={`h-24 rounded-2xl font-black text-base flex flex-col items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
                      attempts[idx]
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs'
                        : 'bg-white text-slate-800 border-blue-200 hover:border-blue-400'
                    }`}
                  >
                    {attempts[idx] ? (
                      <>
                        <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        <span>¡Prueba {idx + 1} Lista!</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-7 h-7 text-blue-600" />
                        <span>Decir prueba {idx + 1}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className="p-4 rounded-2xl bg-white border border-blue-200 text-blue-950 font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                  <span>{feedback}</span>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="bg-blue-50/50 rounded-3xl p-6 border-2 border-blue-200 space-y-4">
              <h3 className="text-xl font-black text-slate-900">
                Sensibilidad del Micrófono en Casa
              </h3>
              <p className="text-base font-semibold text-slate-700">
                Ajuste qué tan sensible debe ser la tableta a la voz de doña Lupita en el ambiente:
              </p>

              <div className="bg-white p-6 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold text-slate-900">Nivel de Sensibilidad:</span>
                  <span className="text-lg font-black text-blue-700 bg-blue-100 px-3 py-1 rounded-xl">
                    Nivel {sensitivity} de 5
                  </span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="5"
                  value={sensitivity}
                  onChange={(e) => onUpdateSensitivity(Number(e.target.value))}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                <div className="flex justify-between text-xs font-bold text-slate-500">
                  <span>1: Tolera TV ruidosa</span>
                  <span>3: Normal hogareño</span>
                  <span>5: Voz muy suave o lejana</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500">
            Ajustes guardados localmente en la tableta
          </span>
          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-base active:scale-95 transition-all"
          >
            Finalizar Calibración
          </button>
        </div>
      </div>
    </div>
  );
};
