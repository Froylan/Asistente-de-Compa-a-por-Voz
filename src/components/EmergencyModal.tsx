import React, { useState, useEffect } from 'react';
import { AlertOctagon, Phone, MessageSquare, X, CheckCircle, ShieldAlert } from 'lucide-react';
import { EmergencyContact } from '../types';

interface EmergencyModalProps {
  contacts: EmergencyContact[];
  onClose: () => void;
  onSpeak: (text: string) => void;
  grandmotherName: string;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  contacts,
  onClose,
  onSpeak,
  grandmotherName,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [isAlertActive, setIsAlertActive] = useState(false);

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  useEffect(() => {
    onSpeak(`Atención. Modo de ayuda activado. Llamando a su hija ${primaryContact?.name || 'familiar'} en 5 segundos. Toque cancelar si fue por error.`);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsAlertActive(true);
          onSpeak(`Avisando de emergencia a ${primaryContact?.name || 'su familia'}. Guarde la calma, ya le estamos llamando.`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleWhatsAppAlert = () => {
    const rawPhone = (primaryContact?.phone || '').replace(/[^0-9]/g, '');
    const message = encodeURIComponent(
      `🚨 ALERTA DE EMERGENCIA: Doña ${grandmotherName} ha presionado el botón de auxilio en su tableta Berna. Por favor llámale de inmediato o acude a su domicilio.`
    );
    window.open(`https://wa.me/${rawPhone}?text=${message}`, '_blank');
  };

  const handlePhoneCall = () => {
    const rawPhone = (primaryContact?.phone || '').replace(/[^0-9]/g, '');
    window.location.href = `tel:${rawPhone}`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-red-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl border-4 border-red-600 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-red-100">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold animate-pulse">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-red-600">
                Protocolo de Auxilio Inmediato
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                {countdown > 0 ? `Llamando en ${countdown} segundos...` : '¡Alerta enviada a la familia!'}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-12 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-sm flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <X className="w-5 h-5 text-red-600" />
            <span>Cancelar</span>
          </button>
        </div>

        {/* Big Alert Notice */}
        <div className="my-6 bg-red-50 rounded-3xl p-6 border-2 border-red-200 text-center space-y-3">
          <p className="text-2xl md:text-3xl font-black text-red-900 leading-snug">
            {countdown > 0
              ? `¿Se siente mal o necesita ayuda, doña ${grandmotherName}?`
              : `Estamos contactando a ${primaryContact?.name || 'su hija'}.`}
          </p>
          <p className="text-lg font-bold text-slate-700">
            Contacto principal: <span className="text-red-700">{primaryContact?.name}</span> ({primaryContact?.phone})
          </p>
        </div>

        {/* Priority Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
          <button
            onClick={handlePhoneCall}
            className="h-20 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-red-600/30 active:scale-95 transition-all"
          >
            <Phone className="w-7 h-7" />
            <span>Llamar por Teléfono</span>
          </button>

          <button
            onClick={handleWhatsAppAlert}
            className="h-20 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xl flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all"
          >
            <MessageSquare className="w-7 h-7" />
            <span>Avisar por WhatsApp</span>
          </button>
        </div>

        {/* Cancel button */}
        <div className="pt-6 border-t border-slate-100 flex justify-center">
          <button
            onClick={onClose}
            className="h-16 px-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-lg flex items-center gap-2 active:scale-95 transition-all"
          >
            <CheckCircle className="w-6 h-6 text-emerald-400" />
            <span>Estoy bien (Fue sin querer)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
