import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, BatteryCharging, Shield, Mic, Image } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface TabletHeaderProps {
  onOpenFamilyPortal: () => void;
  onOpenVoiceTraining: () => void;
  onOpenScreensaver: () => void;
  isListeningWakeWord: boolean;
  assistantName: string;
}

export const TabletHeader: React.FC<TabletHeaderProps> = ({
  onOpenFamilyPortal,
  onOpenVoiceTraining,
  onOpenScreensaver,
  assistantName,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      const dateFormatted = now.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      setCurrentDate(dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white/95 border-b border-black/5 px-5 py-3.5 flex items-center justify-between gap-3 shadow-xs shrink-0 select-none">
      {/* Left zone: Brand and active listener status */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            B
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
                {assistantName}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Escuchando voz
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Compañía y asistencia para Doña Lupita</p>
          </div>
        </div>
      </div>

      {/* Center zone: Very large, crystal-clear Clock & Date */}
      <div className="flex flex-col items-center justify-center text-center shrink-0">
        <span className="text-2xl xl:text-3xl font-extrabold text-slate-900 tracking-tight tabular-nums whitespace-nowrap">
          {currentTime || '10:30 AM'}
        </span>
        <span className="text-xs xl:text-sm font-semibold text-slate-600 capitalize whitespace-nowrap">
          {currentDate || 'Miércoles, 12 de noviembre'}
        </span>
      </div>

      {/* Right zone: Senior & family utility buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <PWAInstallButton variant="header" />

        {/* Screensaver button */}
        <button
          onClick={onOpenScreensaver}
          className="h-12 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center gap-2 transition-all active:scale-95 border border-slate-200 whitespace-nowrap"
          aria-label="Ver fotos de los nietos"
          title="Ver fotos de los nietos"
        >
          <Image className="w-5 h-5 text-indigo-600 shrink-0" />
          <span className="hidden md:inline">Fotos de Nietos</span>
        </button>

        {/* Voice training button */}
        <button
          onClick={onOpenVoiceTraining}
          className="h-12 px-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-sm flex items-center gap-2 transition-all active:scale-95 border border-blue-200 whitespace-nowrap"
          aria-label="Calibrar y entrenar comando de voz"
          title="Calibrar y entrenar comando de voz"
        >
          <Mic className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="hidden md:inline">Calibrar Voz</span>
        </button>

        {/* Family Portal toggle */}
        <button
          onClick={onOpenFamilyPortal}
          className="h-12 px-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center gap-2 transition-all active:scale-95 shadow-sm whitespace-nowrap"
          aria-label="Modo familiar y ajustes"
          title="Modo familiar y ajustes"
        >
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Modo Familia</span>
        </button>

        {/* Tablet hardware status indicators */}
        <div className="hidden xl:flex items-center gap-2 pl-2.5 border-l border-slate-200 text-slate-600 shrink-0">
          <div title={isOnline ? 'Wifi conectado' : 'Modo sin conexión (offline)'}>
            {isOnline ? (
              <Wifi className="w-5 h-5 text-slate-700" />
            ) : (
              <WifiOff className="w-5 h-5 text-amber-600" />
            )}
          </div>
          <div className="flex items-center gap-1 font-semibold text-xs text-slate-700">
            <BatteryCharging className="w-5 h-5 text-emerald-600" />
            <span>100%</span>
          </div>
        </div>
      </div>
    </header>
  );
};
