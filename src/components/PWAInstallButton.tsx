import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Download, Tablet, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'card';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Suppress header install prompt when already running in installed standalone mode
  if (isInstalled && variant === 'header') {
    return null;
  }

  const handlePrimaryClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
      return;
    }
    setShowGuideModal(true);
  };

  const guideModal = showGuideModal ? (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pwa-guide-title"
    >
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Tablet className="w-6 h-6" />
            </div>
            <div>
              <h3 id="pwa-guide-title" className="text-xl sm:text-2xl font-black text-slate-900">
                Instalar en Tableta Xiaomi Pad 7
              </h3>
              <p className="text-sm font-semibold text-slate-500">
                Para usarla en pantalla completa sin barras de navegador
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowGuideModal(false)}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            aria-label="Cerrar guía de instalación"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isIOS ? (
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-slate-800">
            <p className="font-black text-base flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              <span>Pasos en iPad / Safari:</span>
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base font-semibold text-slate-700">
              <li>Toque el botón <strong>Compartir</strong> (cuadro con flecha arriba) en Safari.</li>
              <li>Baje y seleccione <strong>Agregar a inicio</strong> (Add to Home Screen).</li>
              <li>Confirme tocando <strong>Agregar</strong> en la esquina superior derecha.</li>
            </ol>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="bg-emerald-50/70 rounded-2xl p-5 border border-emerald-200 space-y-2.5 text-slate-800">
              <p className="font-black text-base text-emerald-900">
                Pasos en Xiaomi Pad 7 (Android con Google Chrome):
              </p>
              <ol className="list-decimal list-inside space-y-2 text-sm sm:text-base font-semibold text-slate-700">
                <li>Abra esta página directamente en <strong>Google Chrome</strong> en la tableta (no dentro de una vista previa).</li>
                <li>Toque el menú de los <strong>tres puntos (⋮)</strong> arriba a la derecha en Chrome.</li>
                <li>Elija <strong>“Instalar aplicación”</strong> o <strong>“Agregar a pantalla principal”</strong> y confirme.</li>
                <li>El ícono azul de <strong>Hey Berna</strong> aparecerá en el escritorio de la tableta listo para abrirse en pantalla completa.</li>
              </ol>
            </div>

            <div className="bg-blue-50/70 rounded-2xl p-4 border border-blue-200 text-sm font-semibold text-blue-900">
              <strong>Consejo para Doña Lupita:</strong> En Xiaomi Pad 7 (HyperOS), puede activar <em>Fijar aplicación</em> o poner el ícono solo en el escritorio principal en tamaño grande para que no salga por accidente.
            </div>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-1">
          {isInstallable && (
            <button
              type="button"
              onClick={install}
              className="h-12 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Instalar ahora</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowGuideModal(false)}
            className="h-12 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm transition-all active:scale-95"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {variant === 'header' ? (
        <button
          type="button"
          onClick={handlePrimaryClick}
          className="h-12 px-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center gap-2 transition-all active:scale-95 border border-emerald-200 shrink-0"
          aria-label="Instalar aplicación en la tableta"
          title="Instalar en la tableta"
        >
          <Download className="w-4 h-4 text-emerald-700" />
          <span className="hidden xl:inline">Instalar Tablet</span>
          <span className="hidden sm:inline xl:hidden">Instalar</span>
        </button>
      ) : (
        <div className="bg-emerald-50/80 p-6 rounded-3xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Tablet className="w-5 h-5 text-emerald-700" />
              <span>Instalar como App en la Tableta (Xiaomi Pad 7)</span>
            </h3>
            <p className="text-sm font-semibold text-slate-600">
              {isInstalled
                ? 'Esta tableta ya está ejecutando Hey Berna como aplicación instalada en pantalla completa.'
                : 'Instale Hey Berna en la pantalla principal para que Doña Lupita la abra con un toque y sin barras del navegador.'}
            </p>
          </div>
          {isInstalled ? (
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-sm shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-700" />
              <span>Instalada</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handlePrimaryClick}
              className="h-12 px-5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>{isInstallable ? 'Instalar Ahora' : 'Ver Cómo Instalar'}</span>
            </button>
          )}
        </div>
      )}

      {guideModal && typeof document !== 'undefined' && createPortal(guideModal, document.body)}
    </>
  );
};
