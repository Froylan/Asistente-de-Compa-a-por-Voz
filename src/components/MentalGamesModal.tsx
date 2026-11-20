import React, { useState } from 'react';
import { X, Brain, Music, Sparkles, Volume2, ArrowRight, RotateCcw } from 'lucide-react';
import { REFRANES_POPULARES, CANCIONES_DEL_RECUERDO, RefranItem, SongMemoryItem } from '../lib/mentalGamesData';

interface MentalGamesModalProps {
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const MentalGamesModal: React.FC<MentalGamesModalProps> = ({ onClose, onSpeak }) => {
  const [gameMode, setGameMode] = useState<'refranes' | 'canciones'>('refranes');
  const [refranIndex, setRefranIndex] = useState(0);
  const [songIndex, setSongIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const currentRefran = REFRANES_POPULARES[refranIndex];
  const currentSong = CANCIONES_DEL_RECUERDO[songIndex];

  const handleSelectRefranAnswer = (option: string) => {
    setSelectedAnswer(option);
    if (option === currentRefran.completion) {
      setFeedback('¡Muy bien doña Lupita! Se lo sabe a la perfección. ' + currentRefran.explanation);
      onSpeak('¡Excelente doña Lupita! Se lo sabe de memoria. ' + currentRefran.explanation);
    } else {
      setFeedback('¡Casi! La frase tradicional es: ' + currentRefran.completion + '. ' + currentRefran.explanation);
      onSpeak('Buen intento. El dicho dice: ' + currentRefran.completion + '.');
    }
  };

  const handleNextRefran = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    if (refranIndex < REFRANES_POPULARES.length - 1) {
      setRefranIndex((prev) => prev + 1);
    } else {
      setRefranIndex(0);
    }
  };

  const handleSelectSongAnswer = (option: string) => {
    setSelectedAnswer(option);
    const correct = currentSong.answerOptions[0]; // First is correct in our dataset
    if (option === correct) {
      setFeedback(`¡Exacto! "${currentSong.title}" de ${currentSong.artist}. ¡Qué hermosa melodía!`);
      onSpeak(`¡Qué buena memoria tiene, doña Lupita! Es ${currentSong.title} de ${currentSong.artist}.`);
    } else {
      setFeedback(`La letra sigue así: "${correct}". Una canción inolvidable.`);
      onSpeak(`La letra sigue: ${correct}. Hermosa canción de ${currentSong.artist}.`);
    }
  };

  const handleNextSong = () => {
    setSelectedAnswer(null);
    setFeedback(null);
    if (songIndex < CANCIONES_DEL_RECUERDO.length - 1) {
      setSongIndex((prev) => prev + 1);
    } else {
      setSongIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-teal-200 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-teal-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                Gimnasia mental y recuerdos
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Juegos Amables de la Memoria
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
            aria-label="Cerrar juegos"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 my-4 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => {
              setGameMode('refranes');
              setSelectedAnswer(null);
              setFeedback(null);
            }}
            className={`flex-1 h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              gameMode === 'refranes'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Completar el Refrán</span>
          </button>
          <button
            onClick={() => {
              setGameMode('canciones');
              setSelectedAnswer(null);
              setFeedback(null);
            }}
            className={`flex-1 h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              gameMode === 'canciones'
                ? 'bg-white text-teal-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Music className="w-4 h-4 text-rose-500" />
            <span>Canciones del Recuerdo</span>
          </button>
        </div>

        {/* Game Arena */}
        <div className="flex-1 my-2 overflow-y-auto">
          {gameMode === 'refranes' ? (
            <div className="bg-teal-50/50 rounded-3xl p-6 md:p-8 border-2 border-teal-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                  Refrán {refranIndex + 1} de {REFRANES_POPULARES.length}
                </span>

                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mt-4 mb-2">
                  "{currentRefran.firstPart}"
                </h3>
                <p className="text-lg font-bold text-slate-600 mb-6">
                  ¿Cómo continúa este refrán de nuestros abuelos?
                </p>

                <div className="grid grid-cols-1 gap-3">
                  {currentRefran.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectRefranAnswer(option)}
                      className={`h-16 px-6 rounded-2xl font-extrabold text-xl text-left flex items-center justify-between border-2 transition-all active:scale-[0.99] ${
                        selectedAnswer === option
                          ? option === currentRefran.completion
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      <span>{option}</span>
                      <span className="text-sm font-bold opacity-75">Tocar aquí</span>
                    </button>
                  ))}
                </div>

                {feedback && (
                  <div className="mt-5 p-4 rounded-2xl bg-white border border-teal-200 text-teal-950 font-bold text-lg">
                    {feedback}
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={handleNextRefran}
                  className="h-14 px-8 rounded-2xl bg-teal-800 hover:bg-teal-900 text-white font-extrabold text-base flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <span>Siguiente refrán</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50/50 rounded-3xl p-6 md:p-8 border-2 border-rose-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-rose-800 bg-rose-100 px-3 py-1 rounded-full">
                  Canción {songIndex + 1} de {CANCIONES_DEL_RECUERDO.length} · {currentSong.yearOrEra}
                </span>

                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-4 mb-1">
                  {currentSong.title}
                </h3>
                <p className="text-sm font-bold text-rose-700 mb-4">
                  Inmortalizada por {currentSong.artist}
                </p>

                <div className="p-4 rounded-2xl bg-white/80 border border-rose-200 mb-6">
                  <p className="text-xl md:text-2xl font-bold text-slate-800 italic">
                    "{currentSong.verse}..."
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {currentSong.answerOptions.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSongAnswer(option)}
                      className={`h-16 px-6 rounded-2xl font-extrabold text-xl text-left flex items-center justify-between border-2 transition-all active:scale-[0.99] ${
                        selectedAnswer === option
                          ? idx === 0
                            ? 'bg-emerald-600 text-white border-emerald-700 shadow-md'
                            : 'bg-amber-100 text-amber-950 border-amber-300'
                          : 'bg-white text-slate-800 border-slate-200 hover:border-rose-400'
                      }`}
                    >
                      <span>{option}</span>
                      <span className="text-sm font-bold opacity-75">Tocar aquí</span>
                    </button>
                  ))}
                </div>

                {feedback && (
                  <div className="mt-5 p-4 rounded-2xl bg-white border border-rose-200 text-rose-950 font-bold text-lg">
                    {feedback}
                  </div>
                )}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  onClick={handleNextSong}
                  className="h-14 px-8 rounded-2xl bg-rose-800 hover:bg-rose-900 text-white font-extrabold text-base flex items-center gap-2 shadow-sm active:scale-95 transition-all"
                >
                  <span>Siguiente canción</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base active:scale-95 transition-all"
          >
            Listo, regresar al inicio
          </button>
        </div>
      </div>
    </div>
  );
};
