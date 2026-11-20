import React from 'react';
import { BookOpen, Tv, Pill, Music, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { getMysteriesForDay } from '../lib/rosarioData';
import { Medication } from '../types';

interface QuickActionCardsProps {
  onOpenRosario: () => void;
  onOpenMisa: () => void;
  onOpenMedicines: () => void;
  onOpenGames: () => void;
  onTriggerEmergency: () => void;
  medications: Medication[];
  onConfirmNextMedication: () => void;
  primaryContactName?: string;
}

export const QuickActionCards: React.FC<QuickActionCardsProps> = ({
  onOpenRosario,
  onOpenMisa,
  onOpenMedicines,
  onOpenGames,
  onTriggerEmergency,
  medications,
  onConfirmNextMedication,
  primaryContactName = 'María Elena',
}) => {
  const dayInfo = getMysteriesForDay();
  const pendingMeds = medications.filter((m) => !m.takenToday);
  const nextPendingMed = pendingMeds[0];

  return (
    <div className="flex flex-col gap-2.5 w-full h-full justify-between overflow-y-auto pr-0.5 pb-1">
      <div className="flex flex-col gap-2.5">
        {/* 1. Holy Rosary Card */}
        <button
          onClick={onOpenRosario}
          className="w-full text-left bg-white hover:bg-amber-50/50 rounded-3xl p-3.5 border-2 border-amber-200/90 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-between group shrink-0"
          aria-label={`Rezar el Santo Rosario, ${dayInfo.mysteryType}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                Oración · {dayInfo.dayName}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">
                Rezar el Rosario
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5 truncate">
                Misterios {dayInfo.mysteryType}
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-100 text-amber-950 group-hover:bg-amber-200 transition-colors shrink-0">
            Abrir
          </span>
        </button>

        {/* 2. Live Mass Card */}
        <button
          onClick={onOpenMisa}
          className="w-full text-left bg-white hover:bg-indigo-50/50 rounded-3xl p-3.5 border-2 border-indigo-200/90 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-between group shrink-0"
          aria-label="Ver la Santa Misa en Vivo de la Basílica de Guadalupe"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center shrink-0 shadow-xs">
              <Tv className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-700">
                Basílica de Guadalupe
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">
                Santa Misa en Vivo
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5 truncate">
                Evangelio y transmisión diaria
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-indigo-100 text-indigo-950 group-hover:bg-indigo-200 transition-colors shrink-0">
            Ver
          </span>
        </button>

        {/* 3. Medicines Card with instant 1-click confirmation */}
        <div className="w-full bg-white rounded-3xl p-3.5 border-2 border-emerald-200/90 shadow-xs flex flex-col justify-between gap-2 shrink-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                <Pill className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                  Salud diaria
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">
                  Mis Medicinas
                </h3>
                <p className="text-xs font-bold text-slate-600 mt-0.5 truncate">
                  {pendingMeds.length === 0
                    ? 'Todas las tomas de hoy listas'
                    : `${pendingMeds.length} pendiente(s) por tomar`}
                </p>
              </div>
            </div>
            <button
              onClick={onOpenMedicines}
              className="text-xs font-black text-emerald-900 underline hover:text-emerald-950 p-1 shrink-0"
            >
              Ver lista
            </button>
          </div>

          {nextPendingMed ? (
            <div className="pt-2 border-t border-emerald-100 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-black text-slate-500 uppercase">Siguiente ({nextPendingMed.time}):</p>
                <p className="text-sm font-black text-slate-900 truncate">
                  {nextPendingMed.name}
                </p>
              </div>
              <button
                onClick={onConfirmNextMedication}
                className="h-10 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all shrink-0"
                aria-label={`Confirmar que ya tomó ${nextPendingMed.name}`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Ya me la tomé</span>
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-emerald-100 flex items-center gap-1.5 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Al corriente por hoy. ¡Muchas bendiciones!</span>
            </div>
          )}
        </div>

        {/* 4. Music & Golden Era Mental Games Combined */}
        <button
          onClick={onOpenGames}
          className="w-full text-left bg-white hover:bg-rose-50/50 rounded-3xl p-3.5 border-2 border-rose-200/90 shadow-xs hover:shadow-md transition-all active:scale-[0.99] flex items-center justify-between group shrink-0"
          aria-label="Música del recuerdo y refranes populares"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0 shadow-xs">
              <Music className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-800">
                Entretenimiento
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight truncate">
                Música y Refranes
              </h3>
              <p className="text-xs font-bold text-slate-600 mt-0.5 truncate">
                Boleros clásicos y dichos de México
              </p>
            </div>
          </div>
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-rose-100 text-rose-950 group-hover:bg-rose-200 transition-colors shrink-0">
            Jugar
          </span>
        </button>
      </div>

      {/* 5. High-Contrast Big Emergency Button anchored at bottom */}
      <button
        onClick={onTriggerEmergency}
        className="w-full bg-red-600 hover:bg-red-700 text-white rounded-3xl p-3.5 border-4 border-red-700/80 shadow-md shadow-red-600/25 transition-all active:scale-[0.98] flex items-center justify-between text-left shrink-0"
        aria-label="Botón de emergencia y auxilio"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-white text-red-600 flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-black uppercase tracking-widest text-red-100">
              Auxilio inmediato
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
              ¡PEDIR AYUDA!
            </h3>
            <p className="text-xs font-bold text-red-100 mt-0.5 truncate">
              Llamar a {primaryContactName}
            </p>
          </div>
        </div>
        <span className="text-xs font-black uppercase tracking-wider px-3 py-2 rounded-xl bg-white/20 text-white border border-white/30 shrink-0">
          Tocar
        </span>
      </button>
    </div>
  );
};
