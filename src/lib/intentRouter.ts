export type IntentType =
  | 'EMERGENCIA'
  | 'MEDICINAS'
  | 'ROSARIO'
  | 'MISA'
  | 'MUSICA'
  | 'FOTO_ESPECIFICA'
  | 'FOTOS'
  | 'HORA'
  | 'CONVERSACION';

export interface IntentResult {
  type: IntentType;
  confidence: number;
  triggerPhrase?: string;
  actionSummary: string;
  targetPerson?: string;
}

const EMERGENCY_KEYWORDS = [
  'ayuda',
  'auxilio',
  'socorro',
  'me caí',
  'me cai',
  'me siento mal',
  'dolor fuerte',
  'no puedo respirar',
  'llama a mi hija',
  'llama a un doctor',
  'emergencia',
  '911',
  'ambulancia',
];

const MEDICATION_KEYWORDS = [
  'medicina',
  'pastilla',
  'remedio',
  'ya me la tomé',
  'ya me la tome',
  'ya la tomé',
  'qué pastilla me toca',
  'hora de mi medicina',
  'mis medicamentos',
];

const ROSARIO_KEYWORDS = [
  'rosario',
  'rezar',
  'oración',
  'oracion',
  'misterios',
  'ave maría',
  'padre nuestro',
  'santísima virgen',
  'la salve',
];

const MISA_KEYWORDS = [
  'misa',
  'misa en vivo',
  'misa de hoy',
  'basílica',
  'basilica',
  'evangelio del día',
  'santo del día',
];

const MUSIC_KEYWORDS = [
  'música',
  'musica',
  'canción',
  'cancion',
  'bolero',
  'boleros',
  'mariachi',
  'agustín lara',
  'agustin lara',
  'trío',
  'trio',
  'cantar',
  'pedro infante',
];

const TIME_KEYWORDS = [
  'qué hora es',
  'que hora es',
  'qué día es',
  'que dia es',
  'fecha de hoy',
  'qué fecha estamos',
];

// Specific known family members and grandchildren
const FAMILY_MEMBERS = [
  { name: 'Mateo', aliases: ['mateo', 'mateíto', 'mateito'] },
  { name: 'Sofía', aliases: ['sofía', 'sofia', 'sofi'] },
  { name: 'Valentina', aliases: ['valentina', 'valen', 'vale', 'bisnieta'] },
  { name: 'María Elena', aliases: ['maría elena', 'maria elena', 'elena', 'mi hija'] },
  { name: 'Carlos', aliases: ['carlos', 'charly', 'carlitos'] },
];

export function routeIntent(rawInput: string): IntentResult {
  const normalized = (rawInput || '').toLowerCase().trim();

  // 1. Highest priority: EMERGENCY
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        type: 'EMERGENCIA',
        confidence: 1.0,
        triggerPhrase: keyword,
        actionSummary: 'Activando protocolo de asistencia y comunicación urgente con la familia.',
      };
    }
  }

  // 2. Specific grandchild photo request: "muéstrame una foto de Mateo", "pon a Sofía", "foto de Valentina"
  if (
    normalized.includes('foto') ||
    normalized.includes('fotos') ||
    normalized.includes('ver a') ||
    normalized.includes('enséñame a') ||
    normalized.includes('muéstrame a') ||
    normalized.includes('pon a') ||
    normalized.includes('recuerdo de')
  ) {
    for (const member of FAMILY_MEMBERS) {
      if (member.aliases.some((alias) => normalized.includes(alias))) {
        return {
          type: 'FOTO_ESPECIFICA',
          confidence: 0.95,
          targetPerson: member.name,
          triggerPhrase: member.name,
          actionSummary: `Mostrando foto y recuerdos especiales de ${member.name}.`,
        };
      }
    }
  }

  // 3. General Photos / Screensaver
  if (
    normalized.includes('fotos') ||
    normalized.includes('mis nietos') ||
    normalized.includes('ver a los niños') ||
    normalized.includes('álbum') ||
    normalized.includes('album') ||
    normalized.includes('salvapantallas') ||
    normalized.includes('fotos de la familia') ||
    normalized.includes('pon las fotos')
  ) {
    return {
      type: 'FOTOS',
      confidence: 0.9,
      actionSummary: 'Mostrando las fotos recientes de los nietos y familia.',
    };
  }

  // 4. Medications
  for (const keyword of MEDICATION_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        type: 'MEDICINAS',
        confidence: 0.95,
        triggerPhrase: keyword,
        actionSummary: 'Consultando recordatorios de medicamentos de hoy.',
      };
    }
  }

  // 5. Holy Rosary & Prayer
  for (const keyword of ROSARIO_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        type: 'ROSARIO',
        confidence: 0.9,
        triggerPhrase: keyword,
        actionSummary: 'Iniciando el rezo guiado del Santo Rosario.',
      };
    }
  }

  // 6. Daily Mass
  for (const keyword of MISA_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        type: 'MISA',
        confidence: 0.9,
        triggerPhrase: keyword,
        actionSummary: 'Abriendo la Santa Misa del día desde la Basílica de Guadalupe.',
      };
    }
  }

  // 7. Music
  for (const keyword of MUSIC_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        type: 'MUSICA',
        confidence: 0.85,
        triggerPhrase: keyword,
        actionSummary: 'Reproduciendo música y boleros inolvidables.',
      };
    }
  }

  // 8. Time and Date
  for (const keyword of TIME_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return {
        type: 'HORA',
        confidence: 0.95,
        triggerPhrase: keyword,
        actionSummary: 'Informando la hora y fecha actual con voz pausada.',
      };
    }
  }

  // Default: Conversational AI with Gemini
  return {
    type: 'CONVERSACION',
    confidence: 0.7,
    actionSummary: 'Conversación abierta con Berna sobre vivencias, fe o acompañamiento.',
  };
}
