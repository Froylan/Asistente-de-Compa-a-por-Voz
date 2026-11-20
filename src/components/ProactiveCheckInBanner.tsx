import React from 'react';
import { Sun, Coffee, Moon, MessageCircle, Volume2, Sparkles, X } from 'lucide-react';

interface ProactiveCheckInBannerProps {
  timeSlot: 'morning' | 'afternoon' | 'evening';
  promptMessage: string;
  suggestedReplies?: string[];
  onRespond: (prompt: string, suggestedReplies?: string[]) => void;
  onDismiss: () => void;
  onSpeak: (text: string) => void;
}

export const ProactiveCheckInBanner: React.FC<ProactiveCheckInBannerProps> = ({
  timeSlot,
  promptMessage,
  suggestedReplies,
  onRespond,
  onDismiss,
  onSpeak,
}) => {
  const getIcon = () => {
    switch (timeSlot) {
      case 'morning':
        return <Sun className="w-7 h-7 text-amber-500" />;
      case 'afternoon':
        return <Coffee className="w-7 h-7 text-orange-500" />;
      case 'evening':
        return <Moon className="w-7 h-7 text-indigo-500" />;
    }
  };

  const getSlotTitle = () => {
    switch (timeSlot) {
      case 'morning':
        return 'Saludo y Plática Matutina';
      case 'afternoon':
        return 'Charla de Sobremesa y Recuerdos';
      case 'evening':
        return 'Bendición y Plática de la Noche';
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-3xl px-4 py-2.5 border-2 border-amber-300 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
      {/* Icon and Message */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-amber-200 flex items-center justify-center shrink-0">
          {getIcon()}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Berna quiere platicar · {getSlotTitle()}
            </span>
          </div>
          <p className="text-base font-black text-slate-900 leading-snug line-clamp-2">
            "{promptMessage}"
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2.5 shrink-0 w-full md:w-auto">
        <button
          onClick={() => onSpeak(promptMessage)}
          className="h-12 px-4 rounded-2xl bg-white hover:bg-amber-100 text-amber-950 font-extrabold text-sm flex items-center justify-center gap-2 border border-amber-300 active:scale-95 transition-all shadow-xs"
          title="Escuchar a Berna"
          aria-label="Escuchar pregunta proactiva en voz alta"
        >
          <Volume2 className="w-5 h-5 text-amber-700" />
          <span>Escuchar</span>
        </button>

        <button
          onClick={() => onRespond(promptMessage, suggestedReplies)}
          className="flex-1 md:flex-none h-12 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-600/20 active:scale-95 transition-all"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Platicar ahora</span>
        </button>

        <button
          onClick={onDismiss}
          className="h-12 w-12 rounded-2xl bg-white/80 hover:bg-white text-slate-600 flex items-center justify-center border border-amber-200 active:scale-95 transition-all"
          aria-label="Cerrar saludo proactivo"
          title="Cerrar saludo"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
