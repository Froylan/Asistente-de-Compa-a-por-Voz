export interface SpeechVoiceLike {
  name: string;
  lang: string;
  localService?: boolean;
  default?: boolean;
}

export type GeminiMaleVoiceName = 'Charon' | 'Fenrir' | 'Orus' | 'Puck';

export interface MaleVoiceOption {
  id: GeminiMaleVoiceName;
  label: string;
  description: string;
}

export const MALE_GEMINI_VOICE_OPTIONS: MaleVoiceOption[] = [
  {
    id: 'Charon',
    label: 'Voz Madura Serena (55–60 años) — Recomendada',
    description: 'Tono grave, cálido, respetuoso y paternal.',
  },
  {
    id: 'Fenrir',
    label: 'Voz Masculina Cálida y Firme (50–55 años)',
    description: 'Timbre varonil cercano, claro y reconfortante.',
  },
  {
    id: 'Orus',
    label: 'Voz Masculina Pausada (55–60 años)',
    description: 'Dicción muy clara y ritmo tranquilo para lectura.',
  },
];

/**
 * Known male Spanish / Mexican voice name markers across Android, Windows, iOS, Chrome, and Edge.
 */
const MALE_VOICE_HINTS = [
  'jorge',
  'juan',
  'diego',
  'raul',
  'raúl',
  'pablo',
  'alonso',
  'carlos',
  'miguel',
  'enrique',
  'alvaro',
  'álvaro',
  'mateo',
  'andres',
  'andrés',
  'gerardo',
  'rodrigo',
  'fernando',
  'tomas',
  'tomás',
  'ernesto',
  'eddy',
  'reed',
  'grandpa',
  'rocko',
  'male',
  'hombre',
  'masculino',
  'es-mx-x-sfm',
  'es-mx-x-sfd',
  'es-us-x-sfd',
  'es-es-x-eef',
  'es-es-x-eed',
];

/**
 * Known female Spanish voice name markers to deprioritize so the voice stays mature male.
 */
const FEMALE_VOICE_HINTS = [
  'paulina',
  'sabina',
  'monica',
  'mónica',
  'lucia',
  'lucía',
  'helena',
  'sofia',
  'sofía',
  'dalia',
  'paloma',
  'elena',
  'laura',
  'carmen',
  'elvira',
  'conchita',
  'marisol',
  'esperanza',
  'shelley',
  'grandma',
  'flo',
  'google español',
  'google spanish',
  'female',
  'mujer',
  'femenino',
];

export const DEFAULT_MATURE_MALE_PITCH = 0.78;

export const MATURE_MALE_GEMINI_VOICE = {
  model: 'gemini-3.8-flash-lite-tts',
  fallbackModel: 'gemini-3.8-flash-tts',
  prebuiltVoiceName: 'Charon' as GeminiMaleVoiceName,
  styleInstruction:
    'Voz cálida, serena, grave y paternal de un hombre mexicano de entre 55 y 60 años. Habla despacio, con dicción muy clara, respeto y dulzura para acompañar a una señora de 90 años.',
} as const;

export function isMatureMaleHint(voiceName: string): boolean {
  const lower = voiceName.toLowerCase();
  return MALE_VOICE_HINTS.some((hint) => lower.includes(hint));
}

export function isKnownFemaleHint(voiceName: string): boolean {
  const lower = voiceName.toLowerCase();
  return FEMALE_VOICE_HINTS.some((hint) => lower.includes(hint));
}

/**
 * Selects the best available Spanish voice favoring a mature male Mexican/Spanish voice.
 */
export function selectMatureMaleSpanishVoice<T extends SpeechVoiceLike>(voices: T[]): T | null {
  if (!Array.isArray(voices) || voices.length === 0) return null;

  const spanishVoices = voices.filter((v) => v.lang && v.lang.toLowerCase().startsWith('es'));
  if (spanishVoices.length === 0) return null;

  const scoreVoice = (voice: T): number => {
    const lang = voice.lang.toLowerCase();
    const name = voice.name.toLowerCase();
    let score = 0;

    if (isMatureMaleHint(name)) score += 100;
    if (isKnownFemaleHint(name)) score -= 80;

    if (lang === 'es-mx') score += 30;
    else if (lang === 'es-us' || lang === 'es-419') score += 20;
    else if (lang === 'es-es') score += 10;

    if (voice.localService) score += 5;
    return score;
  };

  return [...spanishVoices].sort((a, b) => scoreVoice(b) - scoreVoice(a))[0];
}

export function clampMalePitch(pitch: number): number {
  if (!Number.isFinite(pitch)) return DEFAULT_MATURE_MALE_PITCH;
  return Math.min(1.05, Math.max(0.65, Number(pitch.toFixed(2))));
}
