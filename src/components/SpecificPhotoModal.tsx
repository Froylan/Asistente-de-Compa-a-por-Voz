import React, { useEffect } from 'react';
import { X, Heart, Volume2, UserCheck, ChevronRight } from 'lucide-react';
import { FamilyPhoto } from '../types';

interface SpecificPhotoModalProps {
  personName: string;
  photos: FamilyPhoto[];
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const SpecificPhotoModal: React.FC<SpecificPhotoModalProps> = ({
  personName,
  photos,
  onClose,
  onSpeak,
}) => {
  // Find matching photo for this person or default
  const matchedPhotos = photos.filter(
    (p) =>
      p.title.toLowerCase().includes(personName.toLowerCase()) ||
      p.caption.toLowerCase().includes(personName.toLowerCase())
  );

  const photo = matchedPhotos[0] || photos[0];

  useEffect(() => {
    const announcement = `Aquí tiene la foto de su nieto ${personName}, doña Lupita. ${photo?.caption || 'Le mandan muchos abrazos con todo el amor de la familia.'}`;
    onSpeak(announcement);
  }, [personName, photo, onSpeak]);

  const handleReadCaption = () => {
    onSpeak(`En esta fotografía está ${personName}. ${photo.caption}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border-2 border-indigo-200 overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-indigo-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-xl">
              <Heart className="w-6 h-6 fill-indigo-600 text-indigo-600" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-800">
                Petición de voz cumplida
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                Recuerdo de {personName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-14 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base flex items-center gap-2 active:scale-95 transition-all"
            aria-label="Cerrar foto y volver"
          >
            <X className="w-5 h-5" />
            <span>Cerrar foto</span>
          </button>
        </div>

        {/* Large Grandchild Photo */}
        <div className="my-4 flex-1 flex flex-col items-center justify-center overflow-hidden">
          <div className="relative w-full max-h-[50vh] aspect-16/10 rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-slate-900">
            <img
              src={photo.url}
              alt={photo.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Friendly Large Text Description for Low Vision */}
          <div className="w-full mt-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                {photo.title}
              </h3>
              <p className="text-lg sm:text-xl font-bold text-slate-700 leading-relaxed">
                "{photo.caption}"
              </p>
            </div>

            <button
              onClick={handleReadCaption}
              className="h-14 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 active:scale-95 transition-all shrink-0"
              aria-label="Escuchar dedicatoria en voz alta"
            >
              <Volume2 className="w-6 h-6" />
              <span>Escuchar en voz alta</span>
            </button>
          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <p className="text-sm font-bold text-slate-500">
            Diga <strong className="text-blue-700">"Hey Berna, muéstrame a Sofía"</strong> para ver a otro nieto.
          </p>

          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-extrabold text-base active:scale-95 transition-all"
          >
            Listo, volver a platicar
          </button>
        </div>
      </div>
    </div>
  );
};
