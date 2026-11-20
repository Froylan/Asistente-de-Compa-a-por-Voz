import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, BookOpen, Check } from 'lucide-react';
import { getMysteriesForDay, COMMON_PRAYERS, Mystery } from '../lib/rosarioData';

interface RosarioModalProps {
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const RosarioModal: React.FC<RosarioModalProps> = ({ onClose, onSpeak }) => {
  const dayInfo = getMysteriesForDay();
  const [currentMysteryIndex, setCurrentMysteryIndex] = useState(0);
  const [currentBead, setCurrentBead] = useState(1); // 1 to 10 Ave Marias

  const mystery: Mystery = dayInfo.mysteries[currentMysteryIndex];

  const handleReadMystery = () => {
    const textToSpeak = `Misterio número ${mystery.number} de los misterios ${dayInfo.mysteryType}. ${mystery.title}. Contemplemos: ${mystery.contemplation}. Fruto del misterio: ${mystery.fruit}.`;
    onSpeak(textToSpeak);
  };

  const handleNextBead = () => {
    if (currentBead < 10) {
      setCurrentBead((prev) => prev + 1);
      onSpeak(`Ave María número ${currentBead + 1}. Dios te salve María, llena eres de gracia, el Señor es contigo.`);
    } else {
      if (currentMysteryIndex < dayInfo.mysteries.length - 1) {
        setCurrentMysteryIndex((prev) => prev + 1);
        setCurrentBead(1);
        onSpeak(`Gloria al Padre, al Hijo y al Espíritu Santo. Pasamos al siguiente misterio.`);
      } else {
        onSpeak(`Hemos concluido los cinco misterios de hoy. Que la bendición de Dios Padre, Hijo y Espíritu Santo descienda sobre usted y su familia. Amén.`);
      }
    }
  };

  const handlePrevMystery = () => {
    if (currentMysteryIndex > 0) {
      setCurrentMysteryIndex((prev) => prev - 1);
      setCurrentBead(1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-amber-200 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-amber-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <BookOpen className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Santo Rosario · {dayInfo.dayName}
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Misterios {dayInfo.mysteryType}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
            aria-label="Cerrar rezo"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Current Mystery Presentation */}
        <div className="my-6 bg-amber-50/60 rounded-3xl p-6 md:p-8 border-2 border-amber-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-extrabold text-amber-900 bg-amber-200/80 px-3 py-1 rounded-full uppercase tracking-wider">
              Misterio {mystery.number} de 5
            </span>
            <button
              onClick={handleReadMystery}
              className="h-11 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <Volume2 className="w-5 h-5" />
              <span>Escuchar meditación</span>
            </button>
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-snug">
            {mystery.title}
          </h3>

          <p className="text-xl md:text-2xl font-bold text-slate-700 leading-relaxed mb-4">
            {mystery.contemplation}
          </p>

          <div className="pt-3 border-t border-amber-200 text-sm font-extrabold text-amber-800">
            Fruto espiritual: <span className="font-semibold text-slate-800">{mystery.fruit}</span>
          </div>
        </div>

        {/* Decade Beads Counter (10 Ave Marías) */}
        <div className="mb-6 bg-slate-50 rounded-2xl p-4 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700">
              Contador de Ave Marías: <strong className="text-blue-700 text-lg">{currentBead} de 10</strong>
            </span>
            <span className="text-xs font-semibold text-slate-500">Toque una cuenta para avanzar</span>
          </div>

          <div className="grid grid-cols-10 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <button
                key={num}
                onClick={() => setCurrentBead(num)}
                className={`h-14 rounded-2xl font-black text-lg flex items-center justify-center transition-all ${
                  num <= currentBead
                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300'
                    : 'bg-white text-slate-400 border border-slate-200'
                }`}
              >
                {num <= currentBead ? <Check className="w-6 h-6" /> : num}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation actions */}
        <div className="flex items-center justify-between gap-4 pt-2">
          <button
            onClick={handlePrevMystery}
            disabled={currentMysteryIndex === 0}
            className="h-16 px-6 rounded-2xl bg-slate-100 disabled:opacity-40 hover:bg-slate-200 text-slate-800 font-extrabold text-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Misterio anterior</span>
          </button>

          <button
            onClick={handleNextBead}
            className="flex-1 h-16 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 active:scale-95 transition-all"
          >
            <span>
              {currentBead < 10
                ? `Rezar Ave María (${currentBead + 1}/10)`
                : currentMysteryIndex < 4
                ? 'Siguiente Misterio'
                : 'Concluir Rosario con la Salve'}
            </span>
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
