import React, { useState, useEffect } from 'react';
import { Mic, Heart, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { FamilyPhoto } from '../types';

interface ScreensaverProps {
  photos: FamilyPhoto[];
  onWakeUp: () => void;
  assistantName: string;
  grandmotherName: string;
}

export const Screensaver: React.FC<ScreensaverProps> = ({
  photos,
  onWakeUp,
  assistantName,
  grandmotherName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');

  // Clock tick
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('es-MX', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      const d = now.toLocaleDateString('es-MX', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      });
      setDate(d.charAt(0).toUpperCase() + d.slice(1));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Slideshow cycle every 10 seconds
  useEffect(() => {
    if (!photos || photos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [photos]);

  const currentPhoto = photos[currentIndex] || photos[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div
      onClick={onWakeUp}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-opacity duration-700"
    >
      {/* Background Image with warm gradient scrim */}
      <div className="absolute inset-0">
        <img
          src={currentPhoto.url}
          alt={currentPhoto.title}
          className="w-full h-full object-cover transition-all duration-1000 scale-100"
        />
        {/* Apple-style smooth dark gradient scrim top and bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
      </div>

      {/* Top Bar: Grand Giant Clock & Date */}
      <div className="relative z-10 pt-10 px-8 flex flex-col items-center justify-center text-center text-white">
        <h1 className="text-6xl sm:text-8xl font-black tracking-tight drop-shadow-lg tabular-nums">
          {time}
        </h1>
        <p className="text-2xl sm:text-3xl font-extrabold text-white/90 drop-shadow-md mt-2 capitalize">
          {date}
        </p>
      </div>

      {/* Center Left/Right navigation arrows (if user wants to browse manually) */}
      <div className="relative z-10 px-6 flex items-center justify-between pointer-events-none">
        <button
          onClick={handlePrev}
          className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md pointer-events-auto transition-all active:scale-90"
          aria-label="Foto anterior"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <button
          onClick={handleNext}
          className="w-14 h-14 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-md pointer-events-auto transition-all active:scale-90"
          aria-label="Siguiente foto"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Bottom Bar: Photo title, caption and voice wake indicator */}
      <div className="relative z-10 pb-8 px-8 flex flex-col items-center text-center text-white">
        {/* Caption Card */}
        <div className="bg-black/50 backdrop-blur-md px-8 py-5 rounded-3xl max-w-2xl border border-white/20 mb-6 shadow-xl">
          <div className="flex items-center justify-center gap-2 mb-1 text-amber-300 font-bold text-sm">
            <Heart className="w-4 h-4 fill-amber-300" />
            <span>Recuerdo de la familia · Foto {currentIndex + 1} de {photos.length}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white leading-snug">
            {currentPhoto.title}
          </h2>
          <p className="text-lg sm:text-xl font-medium text-white/90 mt-1">
            "{currentPhoto.caption}"
          </p>
        </div>

        {/* Wake-up guide pill */}
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-lg px-6 py-3 rounded-full text-white font-extrabold text-base border border-white/30 animate-pulse">
          <Mic className="w-5 h-5 text-emerald-400" />
          <span>{assistantName} está atenta · Diga "{assistantName}" o toque la pantalla</span>
        </div>
      </div>
    </div>
  );
};
