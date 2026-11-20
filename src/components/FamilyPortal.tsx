import React, { useState } from 'react';
import {
  X,
  Shield,
  Image,
  Pill,
  MessageSquare,
  Sliders,
  Plus,
  Trash2,
  Send,
  CheckCircle2,
  Phone,
  UserCheck,
  Clock,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { FamilySettings, FamilyPhoto, Medication } from '../types';
import { MALE_GEMINI_VOICE_OPTIONS, DEFAULT_MATURE_MALE_PITCH, GeminiMaleVoiceName } from '../lib/voiceUtils';
import { MedicationAdherenceChart } from './MedicationAdherenceChart';
import { VoiceTranscriptionRecorder } from './VoiceTranscriptionRecorder';
import { PWAInstallButton } from './PWAInstallButton';

interface FamilyPortalProps {
  settings: FamilySettings;
  onUpdateSettings: (newSettings: Partial<FamilySettings>) => void;
  onClose: () => void;
  onSendFamilyMessage: (from: string, text: string) => void;
  onTriggerProactiveCheckIn?: (slot: 'morning' | 'afternoon' | 'evening') => void;
  onTestVoice?: () => void;
}

export const FamilyPortal: React.FC<FamilyPortalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  onSendFamilyMessage,
  onTriggerProactiveCheckIn,
  onTestVoice,
}) => {
  const [activeTab, setActiveTab] = useState<'fotos' | 'medicinas' | 'mensajes' | 'ajustes'>('fotos');

  // Form states for adding photo
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  // Form states for adding medication
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('');
  const [newMedTime, setNewMedTime] = useState('12:00');
  const [newMedInstructions, setNewMedInstructions] = useState('');

  // Form state for sending message
  const [msgSender, setMsgSender] = useState('María Elena');
  const [msgBody, setMsgBody] = useState('');
  const [msgSentSuccess, setMsgSentSuccess] = useState(false);

  // Photo presets for easy one-click testing
  const samplePhotos = [
    {
      title: 'Valentina y Mateo en la nieve',
      caption: 'Tus nietos jugando abrigaditos y mandándote muchos besos.',
      url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
    },
    {
      title: 'Desayuno de domingo con la abuela',
      caption: 'Recordando las ricas conchas y el café de olla que nos preparas.',
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    },
  ];

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhoto: FamilyPhoto = {
      id: 'p_' + Date.now(),
      title: newPhotoTitle.trim() || 'Recuerdo familiar',
      caption: newPhotoCaption.trim() || 'Foto enviada con mucho amor.',
      url: newPhotoUrl.trim(),
      dateAdded: 'Hoy',
    };

    onUpdateSettings({
      photos: [newPhoto, ...settings.photos],
    });

    setNewPhotoTitle('');
    setNewPhotoCaption('');
    setNewPhotoUrl('');
  };

  const handleDeletePhoto = (id: string) => {
    onUpdateSettings({
      photos: settings.photos.filter((p) => p.id !== id),
    });
  };

  const handleAddMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim()) return;

    const newMed: Medication = {
      id: 'm_' + Date.now(),
      name: newMedName.trim(),
      dosage: newMedDose.trim() || '1 dosis',
      time: newMedTime,
      instructions: newMedInstructions.trim() || 'Tomar con agua fresca',
      takenToday: false,
    };

    onUpdateSettings({
      medications: [...settings.medications, newMed],
    });

    setNewMedName('');
    setNewMedDose('');
    setNewMedInstructions('');
  };

  const handleDeleteMedication = (id: string) => {
    onUpdateSettings({
      medications: settings.medications.filter((m) => m.id !== id),
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgBody.trim()) return;

    onSendFamilyMessage(msgSender.trim(), msgBody.trim());
    setMsgBody('');
    setMsgSentSuccess(true);
    setTimeout(() => setMsgSentSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="bg-white w-full max-w-5xl h-[94vh] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Shield className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Portal Complementario Remoto
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Gestión Familiar para Doña {settings.grandmotherName}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-12 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-sm flex items-center gap-1.5 active:scale-95 transition-all"
          >
            <X className="w-5 h-5" />
            <span>Volver a la Tableta</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 my-4 p-1.5 bg-slate-100 rounded-2xl shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('fotos')}
            className={`flex-1 min-w-[130px] h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'fotos'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Image className="w-4 h-4 text-indigo-600" />
            <span>Fotos Nietos ({settings.photos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('medicinas')}
            className={`flex-1 min-w-[130px] h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'medicinas'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4 text-emerald-600" />
            <span>Medicamentos ({settings.medications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mensajes')}
            className={`flex-1 min-w-[130px] h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'mensajes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-blue-600" />
            <span>Enviar Mensaje</span>
          </button>

          <button
            onClick={() => setActiveTab('ajustes')}
            className={`flex-1 min-w-[130px] h-12 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ajustes'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sliders className="w-4 h-4 text-slate-700" />
            <span>Ajustes & Contactos</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-6">
          {/* TAB 1: PHOTOS */}
          {activeTab === 'fotos' && (
            <div className="space-y-6">
              {/* Add Photo Form */}
              <form onSubmit={handleAddPhoto} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-600" />
                  <span>Subir Nueva Fotografía de Nietos / Familia</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    placeholder="Título (ej: Mateo y Sofía en el parque)"
                    className="h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={newPhotoCaption}
                    onChange={(e) => setNewPhotoCaption(e.target.value)}
                    placeholder="Mensaje o dedicatoria cariñosa"
                    className="h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Enlace URL de la foto (https://...)"
                    className="h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500">Ejemplos rápidos:</span>
                    {samplePhotos.map((s, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewPhotoTitle(s.title);
                          setNewPhotoCaption(s.caption);
                          setNewPhotoUrl(s.url);
                        }}
                        className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm active:scale-95 transition-all"
                  >
                    Agregar al Salvapantallas
                  </button>
                </div>
              </form>

              {/* Photo Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {settings.photos.map((photo) => (
                  <div
                    key={photo.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group flex flex-col justify-between"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="absolute top-2 right-2 p-2 rounded-xl bg-black/60 hover:bg-red-600 text-white transition-colors"
                        title="Eliminar foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-4 space-y-1">
                      <h4 className="font-extrabold text-slate-900 text-base leading-tight">
                        {photo.title}
                      </h4>
                      <p className="text-xs font-medium text-slate-600 line-clamp-2">
                        {photo.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MEDICATIONS */}
          {activeTab === 'medicinas' && (
            <div className="space-y-6">
              {/* 7-Day Adherence Data Visualization with Recharts */}
              <MedicationAdherenceChart medications={settings.medications} />

              {/* Add Med Form */}
              <form onSubmit={handleAddMedication} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <span>Programar Nuevo Medicamento</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newMedName}
                    onChange={(e) => setNewMedName(e.target.value)}
                    placeholder="Nombre (ej: Omeprazol)"
                    className="h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={(e) => setNewMedDose(e.target.value)}
                    placeholder="Dosis (ej: 20 mg - 1 cápsula)"
                    className="h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="time"
                    value={newMedTime}
                    onChange={(e) => setNewMedTime(e.target.value)}
                    className="h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    value={newMedInstructions}
                    onChange={(e) => setNewMedInstructions(e.target.value)}
                    placeholder="Indicación (ej: En ayunas con agua)"
                    className="h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm active:scale-95 transition-all"
                  >
                    Guardar Medicamento
                  </button>
                </div>
              </form>

              {/* Meds List with Status */}
              <div className="space-y-3">
                {settings.medications.map((med) => (
                  <div
                    key={med.id}
                    className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                          {med.time} hrs
                        </span>
                        <h4 className="font-black text-slate-900 text-lg">{med.name}</h4>
                        <span className="text-xs font-bold text-slate-500">({med.dosage})</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-600">{med.instructions}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      {med.takenToday ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-extrabold text-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Tomada {med.lastConfirmedTime ? `a las ${med.lastConfirmedTime}` : 'hoy'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-xs">
                          Pendiente por confirmar
                        </span>
                      )}

                      <button
                        onClick={() => handleDeleteMedication(med.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Eliminar medicina"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAMILY MESSAGES */}
          {activeTab === 'mensajes' && (
            <div className="space-y-6">
              <form onSubmit={handleSendMessage} className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  <span>Enviar Mensaje de Voz / Texto a la Tableta</span>
                </h3>
                <p className="text-sm font-semibold text-slate-600">
                  La tableta notificará a doña {settings.grandmotherName} con un tono dulce y Berna le leerá su mensaje en voz alta.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 mb-1">¿Quién lo envía?</label>
                    <input
                      type="text"
                      value={msgSender}
                      onChange={(e) => setMsgSender(e.target.value)}
                      placeholder="María Elena, Mateo..."
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contenido del Mensaje</label>
                    <input
                      type="text"
                      value={msgBody}
                      onChange={(e) => setMsgBody(e.target.value)}
                      placeholder="Hola mamá, al ratito paso a verte con tu pan dulce favorito..."
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-3">
                    <VoiceTranscriptionRecorder
                      onTranscribed={(transcript) => setMsgBody(transcript)}
                      buttonLabel="Dictar audio con Gemini 3.5"
                    />
                    {msgSentSuccess ? (
                      <span className="text-sm font-extrabold text-emerald-600 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        ¡Mensaje transmitido a la tableta de doña {settings.grandmotherName}!
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500">
                        Los nietos pueden dictar su mensaje por voz.
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm active:scale-95 transition-all flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar a la Tableta</span>
                  </button>
                </div>
              </form>

              {/* Message history */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-700 uppercase">Mensajes Recientes</h4>
                {settings.familyMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4 shadow-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-base">{msg.from}</span>
                        <span className="text-xs font-semibold text-slate-400">· {msg.timestamp}</span>
                      </div>
                      <p className="text-base font-semibold text-slate-700">"{msg.text}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SETTINGS & EMERGENCY CONTACTS */}
          {activeTab === 'ajustes' && (
            <div className="space-y-6">
              {/* Persona Settings */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-indigo-600" />
                  <span>Configuración de Berna y Trato Personal</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre de la Abuela</label>
                    <input
                      type="text"
                      value={settings.grandmotherName}
                      onChange={(e) => onUpdateSettings({ grandmotherName: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Asistente (Wake Word)</label>
                    <input
                      type="text"
                      value={settings.assistantName}
                      onChange={(e) => onUpdateSettings({ assistantName: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tratamiento de Respeto</label>
                    <select
                      value={settings.formality}
                      onChange={(e) => onUpdateSettings({ formality: e.target.value as 'usted' | 'tu' })}
                      className="w-full h-12 px-4 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                    >
                      <option value="usted">Tratar de "Usted" (Recomendado)</option>
                      <option value="tu">Tratar de "Tú"</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Velocidad de habla ({Math.round(settings.speechSpeed * 100)}% de velocidad normal)
                    </label>
                    <input
                      type="range"
                      min="0.7"
                      max="1.1"
                      step="0.05"
                      value={settings.speechSpeed}
                      onChange={(e) => onUpdateSettings({ speechSpeed: Number(e.target.value) })}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                    <div className="flex justify-between text-xs font-semibold text-slate-500 mt-1">
                      <span>Lento y muy pausado (0.7x)</span>
                      <span>Recomendado 90 años (0.85x)</span>
                      <span>Normal (1.0x)</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-black text-slate-900">
                          Voz del Asistente: Hombre Maduro (50–60 años)
                        </p>
                        <p className="text-xs font-semibold text-slate-500">
                          Voz masculina cálida, grave y serena (Gemini TTS en línea y timbre grave sin conexión).
                        </p>
                      </div>
                      {onTestVoice && (
                        <button
                          type="button"
                          onClick={onTestVoice}
                          className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all shrink-0"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>Escuchar prueba de voz</span>
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Timbre de voz masculina en línea (50–60 años)
                      </label>
                      <select
                        value={settings.maleVoiceName || 'Charon'}
                        onChange={(e) =>
                          onUpdateSettings({
                            maleVoiceName: e.target.value as GeminiMaleVoiceName,
                          })
                        }
                        className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-900 text-sm"
                      >
                        {MALE_GEMINI_VOICE_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Gravedad / Tono masculino sin conexión (Pitch: {(settings.speechPitch ?? DEFAULT_MATURE_MALE_PITCH).toFixed(2)})
                      </label>
                      <input
                        type="range"
                        min="0.65"
                        max="1.0"
                        step="0.02"
                        value={settings.speechPitch ?? DEFAULT_MATURE_MALE_PITCH}
                        onChange={(e) => onUpdateSettings({ speechPitch: Number(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs font-semibold text-slate-500 mt-1">
                        <span>Más grave 60 años (0.70)</span>
                        <span>Hombre maduro 55 años (0.78)</span>
                        <span>Estándar (1.0)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tablet PWA Installation Card */}
              <PWAInstallButton variant="card" />

              {/* Proactive Conversation Schedule */}
              <div className="bg-amber-50/70 p-6 rounded-3xl border border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span>Horarios de Plática Proactiva de Berna</span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-600 mt-0.5">
                      Berna buscará iniciar plática cariñosa en estos horarios para acompañar a Doña {settings.grandmotherName}.
                    </p>
                  </div>
                  {onTriggerProactiveCheckIn && (
                    <button
                      type="button"
                      onClick={() => {
                        onTriggerProactiveCheckIn('afternoon');
                        onClose();
                      }}
                      className="h-11 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all shrink-0"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Probar plática proactiva ahora</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      { key: 'morning', label: 'Mañana (Desayuno)', enabledKey: 'morningEnabled', timeKey: 'morningTime', defaultTime: '09:30' },
                      { key: 'afternoon', label: 'Sobremesa (Recuerdos)', enabledKey: 'afternoonEnabled', timeKey: 'afternoonTime', defaultTime: '15:00' },
                      { key: 'evening', label: 'Noche (Descanso)', enabledKey: 'eveningEnabled', timeKey: 'eveningTime', defaultTime: '20:00' },
                    ] as const
                  ).map((slot) => {
                    const schedule = settings.proactiveSchedule || {
                      morningEnabled: true,
                      morningTime: '09:30',
                      afternoonEnabled: true,
                      afternoonTime: '15:00',
                      eveningEnabled: true,
                      eveningTime: '20:00',
                    };
                    const isEnabled = schedule[slot.enabledKey];
                    const timeVal = schedule[slot.timeKey] || slot.defaultTime;

                    return (
                      <div key={slot.key} className="p-4 rounded-2xl bg-white border border-amber-200 space-y-2.5">
                        <label className="flex items-center justify-between gap-2 cursor-pointer">
                          <span className="text-sm font-black text-slate-900">{slot.label}</span>
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) =>
                              onUpdateSettings({
                                proactiveSchedule: {
                                  ...schedule,
                                  [slot.enabledKey]: e.target.checked,
                                },
                              })
                            }
                            className="w-5 h-5 accent-amber-600 rounded"
                          />
                        </label>
                        <input
                          type="time"
                          value={timeVal}
                          disabled={!isEnabled}
                          onChange={(e) =>
                            onUpdateSettings({
                              proactiveSchedule: {
                                ...schedule,
                                [slot.timeKey]: e.target.value,
                              },
                            })
                          }
                          className="w-full h-11 px-3 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-900 disabled:opacity-50"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Emergency Contacts Priority */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-red-600" />
                  <span>Contactos de Emergencia y WhatsApp</span>
                </h3>

                <div className="space-y-3">
                  {settings.emergencyContacts.map((contact, idx) => (
                    <div
                      key={contact.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-slate-900 text-white font-black text-sm flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <h4 className="font-black text-slate-900 text-base">{contact.name}</h4>
                          <p className="text-xs font-semibold text-slate-500">{contact.phone} · {contact.relationship}</p>
                        </div>
                      </div>

                      {contact.isPrimary && (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-800 font-extrabold text-xs">
                          Contacto Principal de Auxilio
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-base active:scale-95 transition-all"
          >
            Guardar y Volver a Tableta
          </button>
        </div>
      </div>
    </div>
  );
};
