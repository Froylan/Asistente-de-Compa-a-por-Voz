import React, { useState } from 'react';
import { X, Tv, Volume2, BookOpen, Heart } from 'lucide-react';

interface MisaModalProps {
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const MisaModal: React.FC<MisaModalProps> = ({ onClose, onSpeak }) => {
  const [activeTab, setActiveTab] = useState<'video' | 'lecturas' | 'comunion'>('video');

  const evangelioDelDia = {
    cita: 'Evangelio según San Lucas (17, 11-19)',
    resumen: 'Curación de los diez leprosos y el agradecimiento del que volvió a dar gracias a Dios.',
    texto: 'Yendo Jesús camino de Jerusalén, pasaba entre Samaria y Galilea. Al entrar en una aldea, salieron a su encuentro diez hombres leprosos, que se pararon a lo lejos y a voz en grito dijeron: «Jesús, Maestro, ten compasión de nosotros». Al verlos, les dijo: «Vayan a presentarse a los sacerdotes». Y mientras iban de camino, quedaron limpios. Uno de ellos, viendo que estaba curado, volvió alabando a Dios a grandes voces y se postró a los pies de Jesús, dándole gracias. Jesús tomó la palabra y dijo: «¿No han quedado limpios los diez? Los otros nueve, ¿dónde están? ¿No ha habido quien volviera a dar gloria a Dios más que este extranjero?». Y le dijo: «Levántate, vete; tu fe te ha salvado».',
  };

  const comunionEspiritual = 'Creo, Jesús mío, que estás real y verdaderamente presente en el Santísimo Sacramento del Altar. Te amo sobre todas las cosas y deseo vivamente recibirte dentro de mi alma, pero no pudiendo hacerlo ahora sacramentalmente, ven al menos espiritualmente a mi corazón. Y como si ya te hubiese recibido, te abrazo y me uno del todo a Ti. Señor, no permitas que jamás me aparte de Ti. Amén.';

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-indigo-200 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
              <Tv className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Basílica de Guadalupe · Ciudad de México
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Santa Misa y Evangelio
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
            aria-label="Cerrar misa"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 my-4 p-1.5 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('video')}
            className={`flex-1 h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'video'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Misa en Video</span>
          </button>
          <button
            onClick={() => setActiveTab('lecturas')}
            className={`flex-1 h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'lecturas'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Evangelio de Hoy</span>
          </button>
          <button
            onClick={() => setActiveTab('comunion')}
            className={`flex-1 h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'comunion'
                ? 'bg-white text-indigo-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Comunión Espiritual</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 my-2 overflow-y-auto">
          {activeTab === 'video' && (
            <div className="flex flex-col gap-4">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 shadow-md">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube-nocookie.com/embed/live_stream?channel=UC8WbXb0TqA_zT5h1kZpMtwA"
                  title="Santa Misa en vivo Basílica de Guadalupe"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="bg-indigo-50/70 rounded-2xl p-4 border border-indigo-200 text-sm font-semibold text-indigo-950 flex items-center justify-between">
                <span>Transmisión en directo del Altar Mayor de la Insigne Basílica de Guadalupe.</span>
                <span className="font-bold text-xs bg-indigo-200 px-3 py-1 rounded-full uppercase">Canal Oficial</span>
              </div>
            </div>
          )}

          {activeTab === 'lecturas' && (
            <div className="bg-indigo-50/50 rounded-3xl p-6 border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-indigo-900 uppercase tracking-wider">
                  {evangelioDelDia.cita}
                </span>
                <button
                  onClick={() => onSpeak(evangelioDelDia.texto)}
                  className="h-11 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Escuchar lectura</span>
                </button>
              </div>

              <p className="text-lg font-bold text-indigo-900/80 mb-4 italic">
                "{evangelioDelDia.resumen}"
              </p>

              <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                {evangelioDelDia.texto}
              </p>
            </div>
          )}

          {activeTab === 'comunion' && (
            <div className="bg-rose-50/60 rounded-3xl p-6 border-2 border-rose-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-black text-rose-900 uppercase tracking-wider">
                  Oración para recibir la bendición de Jesús en casa
                </span>
                <button
                  onClick={() => onSpeak(comunionEspiritual)}
                  className="h-11 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-xs active:scale-95 transition-all"
                >
                  <Volume2 className="w-5 h-5" />
                  <span>Escuchar oración</span>
                </button>
              </div>

              <h3 className="text-3xl font-black text-slate-900 mb-4">
                Comunión Espiritual
              </h3>

              <p className="text-xl md:text-2xl font-bold text-slate-800 leading-relaxed">
                {comunionEspiritual}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl bg-indigo-900 hover:bg-indigo-800 text-white font-extrabold text-base active:scale-95 transition-all"
          >
            Volver a la pantalla principal
          </button>
        </div>
      </div>
    </div>
  );
};
