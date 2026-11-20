import React from 'react';
import { X, Pill, CheckCircle2, Clock, Volume2 } from 'lucide-react';
import { Medication } from '../types';

interface MedicinesModalProps {
  medications: Medication[];
  onConfirmMedication: (id: string) => void;
  onClose: () => void;
  onSpeak: (text: string) => void;
}

export const MedicinesModal: React.FC<MedicinesModalProps> = ({
  medications,
  onConfirmMedication,
  onClose,
  onSpeak,
}) => {
  const pendingCount = medications.filter((m) => !m.takenToday).length;

  const handleReadMedications = () => {
    if (pendingCount === 0) {
      onSpeak('Doña Lupita, ya tomó todas sus medicinas de hoy. ¡Qué ordenada y responsable! Que Dios la bendiga con mucha salud.');
      return;
    }

    const pendingList = medications
      .filter((m) => !m.takenToday)
      .map((m) => `${m.name}, a las ${m.time}, ${m.dosage}.`)
      .join(' ');

    onSpeak(`Tiene ${pendingCount} medicina pendiente. ${pendingList} Tómela con calma y agua fresca.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[92vh] rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border border-emerald-200 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-emerald-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Control de salud diario
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
                Mis Medicamentos de Hoy
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadMedications}
              className="h-11 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center gap-2 border border-emerald-200"
            >
              <Volume2 className="w-5 h-5 text-emerald-600" />
              <span>Léemelas en voz alta</span>
            </button>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 active:scale-95 transition-all"
              aria-label="Cerrar medicinas"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Status banner */}
        <div className="my-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
          <span className="text-base font-bold text-emerald-950">
            {pendingCount === 0
              ? '🎉 ¡Felicidades! Todas las dosis de hoy han sido confirmadas.'
              : `⚠️ Tiene ${pendingCount} pastilla(s) pendiente(s) por tomar.`}
          </span>
          <span className="text-xs font-extrabold text-emerald-800 uppercase bg-emerald-200/80 px-3 py-1 rounded-full">
            Supervisado por la familia
          </span>
        </div>

        {/* Medication Cards List */}
        <div className="flex-1 space-y-4 my-2 overflow-y-auto">
          {medications.map((med) => (
            <div
              key={med.id}
              className={`p-6 rounded-3xl border-2 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                med.takenToday
                  ? 'bg-slate-50 border-emerald-200 opacity-90'
                  : 'bg-white border-emerald-300 shadow-sm'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900">
                    <Clock className="w-4 h-4" />
                    {med.time} hrs
                  </span>
                  <span className="text-sm font-bold text-slate-500">· {med.dosage}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">
                  {med.name}
                </h3>
                <p className="text-base font-semibold text-slate-600">
                  {med.instructions}
                </p>
                {med.takenToday && med.lastConfirmedTime && (
                  <p className="text-xs font-bold text-emerald-700 pt-1">
                    ✓ Confirmada hoy a las {med.lastConfirmedTime}
                  </p>
                )}
              </div>

              {med.takenToday ? (
                <div className="h-16 px-6 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-base flex items-center gap-2 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  <span>Tomada con éxito</span>
                </div>
              ) : (
                <button
                  onClick={() => onConfirmMedication(med.id)}
                  className="h-16 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all shrink-0"
                >
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Tocar: Ya me la tomé</span>
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base active:scale-95 transition-all"
          >
            Listo, regresar
          </button>
        </div>
      </div>
    </div>
  );
};
