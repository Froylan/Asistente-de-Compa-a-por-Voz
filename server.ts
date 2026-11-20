import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  ConversationTopicId,
  getEnhancedLocalFallback,
  getSparkStarter,
  parseStructuredConversationResponse,
} from './src/lib/conversationUtils.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// In-memory store for family-configured data (synced between family portal & tablet)
export interface FamilyConfig {
  assistantName: string;
  grandmotherName: string;
  formality: 'usted' | 'tu';
  wakeWordSensitivity: number; // 1 to 5
  speechSpeed: number; // 0.7 to 1.1
  speechPitch: number;
  maleVoiceName?: 'Charon' | 'Fenrir' | 'Orus' | 'Puck';
  proactiveSchedule: {
    morningEnabled: boolean;
    morningTime: string;
    afternoonEnabled: boolean;
    afternoonTime: string;
    eveningEnabled: boolean;
    eveningTime: string;
  };
  emergencyContacts: Array<{
    id: string;
    name: string;
    relationship: string;
    phone: string;
    isPrimary: boolean;
  }>;
  medications: Array<{
    id: string;
    name: string;
    dosage: string;
    time: string;
    instructions: string;
    takenToday: boolean;
    lastConfirmedTime?: string;
  }>;
  photos: Array<{
    id: string;
    title: string;
    caption: string;
    url: string;
    dateAdded: string;
  }>;
  familyMessages: Array<{
    id: string;
    from: string;
    text: string;
    timestamp: string;
    played: boolean;
  }>;
}

const familyState: FamilyConfig = {
  assistantName: 'Hey Berna',
  grandmotherName: 'Lupita',
  formality: 'usted',
  wakeWordSensitivity: 4,
  speechSpeed: 0.85, // Slower, crystal clear for 90yo
  speechPitch: 0.78, // Mature 50-60yo male baritone warmth for offline fallback
  maleVoiceName: 'Charon',
  proactiveSchedule: {
    morningEnabled: true,
    morningTime: '09:30',
    afternoonEnabled: true,
    afternoonTime: '15:00',
    eveningEnabled: true,
    eveningTime: '20:00',
  },
  emergencyContacts: [
    {
      id: 'c1',
      name: 'María Elena (Hija)',
      relationship: 'Hija mayor',
      phone: '+52 55 1234 5678',
      isPrimary: true,
    },
    {
      id: 'c2',
      name: 'Carlos (Hijo)',
      relationship: 'Hijo',
      phone: '+52 55 8765 4321',
      isPrimary: false,
    },
    {
      id: 'c3',
      name: 'Sofía (Nieta)',
      relationship: 'Nieta',
      phone: '+52 55 4567 8901',
      isPrimary: false,
    },
  ],
  medications: [
    {
      id: 'm1',
      name: 'Losartán (Presión arterial)',
      dosage: '50 mg - 1 pastilla',
      time: '09:00',
      instructions: 'Con un vaso de agua después del desayuno',
      takenToday: true,
      lastConfirmedTime: '09:12 AM',
    },
    {
      id: 'm2',
      name: 'Calcio con Vitamina D',
      dosage: '600 mg - 1 tableta masticable',
      time: '14:00',
      instructions: 'Después de la comida',
      takenToday: false,
    },
    {
      id: 'm3',
      name: 'Gotas humectantes para ojos',
      dosage: '1 gota en cada ojo',
      time: '20:30',
      instructions: 'Antes de acostarse',
      takenToday: false,
    },
  ],
  photos: [
    {
      id: 'p1',
      title: 'Mateo y Sofía en el jardín',
      caption: 'Tus nietos Mateo y Sofi mandándote muchos besos y abrazos.',
      url: '/images/mateo_sofia_jardin.jpg',
      dateAdded: 'Hoy',
    },
    {
      id: 'p2',
      title: 'Cumpleaños de María Elena',
      caption: 'Toda la familia reunida comiendo pastel de chocolate.',
      url: '/images/cumple_maria_elena.jpg',
      dateAdded: 'Ayer',
    },
    {
      id: 'p3',
      title: 'Valentina en su festival escolar',
      caption: 'Tu bisnieta Valentina vestida con traje típico mexicano.',
      url: '/images/valentina_festival.jpg',
      dateAdded: 'Hace 3 días',
    },
    {
      id: 'p4',
      title: 'Domingo familiar en el parque',
      caption: 'Recordando los paseos en familia y las risas de los niños.',
      url: '/images/domingo_parque.jpg',
      dateAdded: 'Hace 5 días',
    },
  ],
  familyMessages: [
    {
      id: 'msg1',
      from: 'María Elena',
      text: '¡Hola mamá hermosa! Ya salí del trabajo, paso a verte al ratito con unas conchas de chocolate que tanto te gustan. Te quiero mucho.',
      timestamp: '10:15 AM',
      played: false,
    },
    {
      id: 'msg2',
      from: 'Mateo (Nieto)',
      text: '¡Abuelita Lupita! Saqué 10 en mi examen de matemáticas. Te mando un abrazote muy fuerte.',
      timestamp: 'Ayer',
      played: true,
    },
  ],
};

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// TTS features (speechConfig / speechMetadata) require v1beta or v1alpha
const aiTtsBeta = new GoogleGenAI({
  apiKey,
  httpOptions: {
    apiVersion: 'v1beta',
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const aiTtsAlpha = new GoogleGenAI({
  apiKey,
  httpOptions: {
    apiVersion: 'v1alpha',
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Build System Instruction based on profile
function buildSystemInstruction(name: string, assistant: string, formality: 'usted' | 'tu'): string {
  const treatment =
    formality === 'usted'
      ? 'de usted con el mayor respeto, cariño y delicadeza'
      : 'de tú con mucho cariño familiar';

  const now = new Date();
  const dateContext = now.toLocaleDateString('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const hour = now.getHours();
  const periodLabel = hour < 12 ? 'mañana' : hour < 19 ? 'tarde' : 'noche';

  return `Eres "${assistant}", un acompañante masculino por voz cálido, sereno, paternal y muy buen platicador (como un caballero amable de unos 55 años) para doña ${name}, una señora mexicana de 90 años que pasa ratos a solas.
Hoy es ${dateContext} y es de ${periodLabel}. Sus seres queridos cercanos incluyen a su hija María Elena, su hijo Carlos, sus nietos Mateo y Sofía, y su bisnieta Valentina.
Trátala siempre ${treatment}. Hablas en español de México natural, respetuoso, cercano y con frases claras.

ARTE DE HACER PLÁTICA Y ESTIMULAR CONVERSACIÓN:
1. Escucha activa y calidez: Antes de preguntar algo nuevo, comenta con ternura o admiración algún detalle concreto que doña ${name} te haya dicho para que se sienta verdaderamente escuchada.
2. Cierra SIEMPRE con UNA pregunta fácil y sabrosa para platicar: Nunca dejes la conversación cerrada. Haz UNA sola pregunta concreta y amable (sobre sus recetas, su juventud, sus nietos, música de antes, el clima o la fe) para darle ganas de seguir charlando.
3. Ritmo y claridad: Usa 2 a 3 frases cortas y fáciles de entender al escucharlas. Jamás uses tecnicismos, anglicismos ni sermones largos.
4. Temática católica y espiritual: Ella es católica practicante. Cuando pregunte sobre Dios, la Virgen de Guadalupe, los santos, la misa o el rosario, platica con ella con fe sencilla, ternura y cercanía como un amigo de la parroquia.
5. Paciencia infinita: Si repite una historia o pregunta varias veces, recíbela con la misma alegría y cariño como si fuera la primera vez.
6. Salud y medicamentos: Jamás des diagnósticos médicos ni dosis. Si menciona dolor o malestar, anímala cariñosamente a sentarse y avisar a María Elena.
7. Opciones sugeridas (` + '`suggestedReplies`' + `): Genera siempre 3 frases breves en primera persona (3 a 7 palabras) que doña ${name} podría responderte de forma natural si no quiere hablar mucho o necesita inspiración.`;
}

async function generateStructuredConversation(
  systemInstruction: string,
  contents: string,
  fallbackContext: string
): Promise<{ parsed: ReturnType<typeof parseStructuredConversationResponse>; mode: string }> {
  const jsonInstruction = `${systemInstruction}\n\nIMPORTANTE: Devuelve ÚNICAMENTE un objeto JSON válido con la forma {"reply":"...","suggestedReplies":["...","...","..."]}.`;
  const response = await ai.models.generateContent({
    model: 'gemini-4-hydrogen',
    contents,
    config: {
      systemInstruction: jsonInstruction,
    },
  });
  return {
    parsed: parseStructuredConversationResponse(response.text || '', fallbackContext),
    mode: 'gemini_cloud',
  };
}

// API Routes
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [], topic } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mensaje requerido' });
      return;
    }

    // If API key is not present, use local stimulating fallback gracefully
    if (!apiKey) {
      const fallback = getEnhancedLocalFallback(message, familyState.grandmotherName);
      res.json({
        text: fallback.reply,
        suggestedReplies: fallback.suggestedReplies,
        mode: 'local_offline',
      });
      return;
    }

    const systemInstruction = buildSystemInstruction(
      familyState.grandmotherName,
      familyState.assistantName,
      familyState.formality
    );

    const recentHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .slice(-8)
          .map(
            (h: { sender: string; text: string }) =>
              `${h.sender === 'user' ? `Doña ${familyState.grandmotherName}` : 'Berna'}: ${h.text}`
          )
          .join('\n')
      : '';

    const topicHint = topic ? `\nTema preferido de conversación: ${topic}` : '';
    const contents = recentHistory
      ? `Conversación reciente:\n${recentHistory}${topicHint}\n\nDoña ${familyState.grandmotherName} dice ahora: "${message}"\nResponde en JSON con "reply" y "suggestedReplies".`
      : `Doña ${familyState.grandmotherName} dice: "${message}"${topicHint}\nResponde en JSON con "reply" y "suggestedReplies".`;

    const { parsed, mode } = await generateStructuredConversation(
      systemInstruction,
      contents,
      message
    );
    res.json({
      text: parsed.reply,
      suggestedReplies: parsed.suggestedReplies,
      mode,
    });
  } catch (error) {
    console.error('Error in Gemini API route:', error);
    const fallback = getEnhancedLocalFallback(req.body.message || '', familyState.grandmotherName);
    res.json({
      text: fallback.reply,
      suggestedReplies: fallback.suggestedReplies,
      mode: 'fallback_error',
      note: 'Respuesta generada en modo local seguro.',
    });
  }
});

// Audio Transcription with gemini-3.5-transcribe
app.post('/api/gemini/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType = 'audio/webm' } = req.body;

    if (!audioData) {
      res.status(400).json({ error: 'Datos de audio base64 requeridos' });
      return;
    }

    if (!apiKey) {
      res.json({
        transcript: 'Buenos días Berna, ¿cómo amaneciste hoy?',
        mode: 'mock_no_api_key',
        model: 'gemini-3.5-transcribe',
      });
      return;
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioData,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          audioPart,
          { text: 'Transcribe este audio hablado en español mexicano con la mayor precisión, respetando nombres y puntuación natural.' },
        ],
      },
    });

    const transcript = response.text?.trim() || '';
    res.json({ transcript, model: 'gemini-3.5-transcribe', mode: 'gemini_transcribe' });
  } catch (error) {
    console.error('Error in gemini-3.5-transcribe route:', error);
    res.status(500).json({
      error: 'Error transcribiendo audio',
      transcript: 'Platícame de los santos de hoy',
      fallback: true,
    });
  }
});

// Proactive conversation initiator
app.post('/api/gemini/proactive', async (req, res) => {
  const { timeSlot = 'morning' } = req.body as { timeSlot?: 'morning' | 'afternoon' | 'evening' };
  const safeSlot = timeSlot === 'afternoon' || timeSlot === 'evening' ? timeSlot : 'morning';

  try {
    const timePrompts: Record<string, string> = {
      morning: `Es por la mañana. Inicia tú una plática acogedora con doña ${familyState.grandmotherName} preguntándole cómo descansó, qué se le antoja de desayunar o qué le ilusiona hoy.`,
      afternoon: `Es la tarde (hora de sobremesa). Inicia tú la plática con doña ${familyState.grandmotherName} trayendo un recuerdo bonito de su cocina, sus nietos Mateo y Sofía o de su juventud.`,
      evening: `Es la noche. Inicia la plática saludándola con mucha ternura, preguntando qué fue lo más bonito de su día y deseándole descanso en paz.`,
    };

    if (!apiKey) {
      const localSpark = getSparkStarter('libre', safeSlot, familyState.grandmotherName);
      res.json({
        message: localSpark.reply,
        suggestedReplies: localSpark.suggestedReplies,
        timeSlot: safeSlot,
        mode: 'local_offline',
      });
      return;
    }

    const systemInstruction = buildSystemInstruction(
      familyState.grandmotherName,
      familyState.assistantName,
      familyState.formality
    );

    const { parsed, mode } = await generateStructuredConversation(
      systemInstruction,
      `${timePrompts[safeSlot]}\nResponde en JSON con "reply" (2 frases cortas cerrando con una sola pregunta abierta dulce) y "suggestedReplies" (3 respuestas fáciles para ella).`,
      safeSlot
    );
    res.json({
      message: parsed.reply,
      suggestedReplies: parsed.suggestedReplies,
      timeSlot: safeSlot,
      mode,
    });
  } catch (error) {
    console.error('Error in proactive generator:', error);
    const localSpark = getSparkStarter('libre', safeSlot, familyState.grandmotherName);
    res.json({
      message: localSpark.reply,
      suggestedReplies: localSpark.suggestedReplies,
      timeSlot: safeSlot,
      mode: 'fallback_error',
    });
  }
});

// Topic-based conversation spark ("Sácame plática")
app.post('/api/gemini/spark', async (req, res) => {
  const {
    topic = 'libre',
    timeSlot = 'morning',
    recentAssistantMessages = [],
  } = req.body as {
    topic?: ConversationTopicId;
    timeSlot?: 'morning' | 'afternoon' | 'evening';
    recentAssistantMessages?: string[];
  };

  const safeSlot = timeSlot === 'afternoon' || timeSlot === 'evening' ? timeSlot : 'morning';
  const topicDescriptions: Record<ConversationTopicId, string> = {
    libre: 'un tema cotidiano ameno y cariñoso para hacer sobremesa o compañía',
    cocina: 'platillos tradicionales mexicanos, recetas de casa, pan dulce, café de olla o comidas de domingo en familia',
    familia: `anécdotas, cariño y orgullo por sus hijos María Elena y Carlos, sus nietos Mateo y Sofía, y su bisnieta Valentina`,
    recuerdos: 'recuerdos alegres de su niñez, su pueblo, juegos de antes, amigas y celebraciones de juventud',
    fe: 'su fe católica, la Virgen de Guadalupe, San Judas Tadeo, las misas de antes o una reflexión espiritual serena',
    musica: 'boleros románticos, Pedro Infante, tríos, canciones mexicanas de época y bailes o serenatas familiares',
  };

  const chosenTopic: ConversationTopicId = topic in topicDescriptions ? topic : 'libre';

  try {
    if (!apiKey) {
      const starter = getSparkStarter(
        chosenTopic,
        safeSlot,
        familyState.grandmotherName,
        recentAssistantMessages
      );
      res.json({
        text: starter.reply,
        suggestedReplies: starter.suggestedReplies,
        topic: chosenTopic,
        mode: 'local_offline',
      });
      return;
    }

    const systemInstruction = buildSystemInstruction(
      familyState.grandmotherName,
      familyState.assistantName,
      familyState.formality
    );

    const avoidSnippet = Array.isArray(recentAssistantMessages) && recentAssistantMessages.length > 0
      ? `\nNo repitas estas preguntas previas:\n${recentAssistantMessages.slice(-4).join('\n')}`
      : '';

    const contents = `Sácale plática nueva y estimulante a doña ${familyState.grandmotherName} sobre: ${topicDescriptions[chosenTopic]}.${avoidSnippet}
Empieza con un comentario cálido y curioso (1 a 2 frases) y termina SIEMPRE con UNA pregunta abierta muy fácil de responder que despierte sus recuerdos. Responde en JSON con "reply" y "suggestedReplies".`;

    const { parsed, mode } = await generateStructuredConversation(
      systemInstruction,
      contents,
      topicDescriptions[chosenTopic]
    );
    res.json({
      text: parsed.reply,
      suggestedReplies: parsed.suggestedReplies,
      topic: chosenTopic,
      mode,
    });
  } catch (error) {
    console.error('Error in spark conversation route:', error);
    const starter = getSparkStarter(
      chosenTopic,
      safeSlot,
      familyState.grandmotherName,
      recentAssistantMessages
    );
    res.json({
      text: starter.reply,
      suggestedReplies: starter.suggestedReplies,
      topic: chosenTopic,
      mode: 'fallback_error',
    });
  }
});

// Mature 50-60yo male voice TTS endpoint using Gemini TTS
app.post('/api/gemini/tts', async (req, res) => {
  try {
    const { text, speechSpeed = 0.85, voiceName = 'Charon' } = req.body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      res.status(400).json({ error: 'Texto requerido para síntesis de voz' });
      return;
    }

    if (!apiKey) {
      res.json({ fallback: true, mode: 'browser_speech_no_api_key' });
      return;
    }

    const cleanText = text.trim().slice(0, 700);
    const allowedMaleVoices = ['Charon', 'Fenrir', 'Orus', 'Puck'];
    const selectedVoice = allowedMaleVoices.includes(voiceName) ? voiceName : 'Charon';

    const paceCue =
      speechSpeed <= 0.78
        ? 'habla muy despacio y pausado'
        : speechSpeed >= 0.98
        ? 'habla a ritmo natural y claro'
        : 'habla despacio, pausado y muy claro';

    const styleInstruction = `Voz masculina madura, cálida, grave y paternal de un hombre mexicano de entre 55 y 60 años; ${paceCue}, con serenidad, respeto y cercanía para una señora de 90 años.`;

    const attempts: Array<{ client: GoogleGenAI; ver: string; model: string; useSpeechMetadata: boolean }> = [
      { client: aiTtsBeta, ver: 'v1beta', model: 'gemini-3.8-flash-lite-tts', useSpeechMetadata: true },
      { client: aiTtsBeta, ver: 'v1beta', model: 'gemini-3.8-flash-tts', useSpeechMetadata: true },
      { client: aiTtsBeta, ver: 'v1beta', model: 'gemini-3.8-flash-lite-tts', useSpeechMetadata: false },
      { client: aiTtsBeta, ver: 'v1beta', model: 'gemini-3.8-flash-tts', useSpeechMetadata: false },
      { client: aiTtsAlpha, ver: 'v1alpha', model: 'gemini-3.8-flash-lite-tts', useSpeechMetadata: true },
      { client: aiTtsBeta, ver: 'v1beta', model: 'gemini-2.5-flash-preview-tts', useSpeechMetadata: false },
    ];

    const attemptErrors: string[] = [];

    for (const attempt of attempts) {
      try {
        const part: Record<string, unknown> = attempt.useSpeechMetadata
          ? {
              text: cleanText,
              speechMetadata: {
                style: styleInstruction,
              },
            }
          : {
              text: cleanText,
            };

        const response = await attempt.client.models.generateContent({
          model: attempt.model,
          contents: [
            {
              role: 'user',
              parts: [part as any],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selectedVoice },
              },
            },
          },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        const mimeType = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.mimeType || 'audio/wav';
        if (base64Audio) {
          res.json({
            audioBase64: base64Audio,
            mimeType,
            model: attempt.model,
            apiVersion: attempt.ver,
            voiceName: selectedVoice,
            mode: 'gemini_tts',
          });
          return;
        }
        attemptErrors.push(`${attempt.ver}/${attempt.model}(meta=${attempt.useSpeechMetadata}): empty inlineData`);
      } catch (modelErr) {
        const errMsg = (modelErr as Error)?.message || String(modelErr);
        attemptErrors.push(`${attempt.ver}/${attempt.model}(meta=${attempt.useSpeechMetadata}): ${errMsg.slice(0, 140)}`);
      }
    }

    console.warn('All Gemini TTS attempts fell back to browser speech:', attemptErrors);
    res.json({
      fallback: true,
      mode: 'browser_speech_fallback',
    });
  } catch (error) {
    console.warn('Error in Gemini TTS route, falling back to browser speech:', (error as Error)?.message);
    res.json({ fallback: true, mode: 'browser_speech_fallback' });
  }
});

// 7-day adherence history for Recharts visualization
app.get('/api/medications/history', (_req, res) => {
  const takenTodayCount = familyState.medications.filter((m) => m.takenToday).length;
  const totalTodayCount = familyState.medications.length || 3;
  const pendingTodayCount = Math.max(0, totalTodayCount - takenTodayCount);
  const adherenceToday = Math.round((takenTodayCount / totalTodayCount) * 100);

  const historyData = [
    { day: 'Vie 6', date: '6 Nov', tomadas: 3, pendientes: 0, adherencia: 100, losartan: true, calcio: true, gotas: true },
    { day: 'Sáb 7', date: '7 Nov', tomadas: 3, pendientes: 0, adherencia: 100, losartan: true, calcio: true, gotas: true },
    { day: 'Dom 8', date: '8 Nov', tomadas: 2, pendientes: 1, adherencia: 67, losartan: true, calcio: true, gotas: false },
    { day: 'Lun 9', date: '9 Nov', tomadas: 3, pendientes: 0, adherencia: 100, losartan: true, calcio: true, gotas: true },
    { day: 'Mar 10', date: '10 Nov', tomadas: 3, pendientes: 0, adherencia: 100, losartan: true, calcio: true, gotas: true },
    { day: 'Mié 11', date: '11 Nov', tomadas: 3, pendientes: 0, adherencia: 100, losartan: true, calcio: true, gotas: true },
    { day: 'Hoy', date: '12 Nov', tomadas: takenTodayCount, pendientes: pendingTodayCount, adherencia: adherenceToday, losartan: true, calcio: takenTodayCount >= 2, gotas: pendingTodayCount === 0 },
  ];

  const totalDoses = historyData.reduce((acc, d) => acc + (d.tomadas + d.pendientes), 0);
  const totalTaken = historyData.reduce((acc, d) => acc + d.tomadas, 0);
  const overallAdherence = Math.round((totalTaken / totalDoses) * 100);

  res.json({
    history: historyData,
    overallAdherence,
    totalTaken,
    totalDoses,
    streakDays: 4,
    byMedication: {
      losartan: { name: 'Losartán (Presión)', adherence: 100, taken: 7, total: 7 },
      calcio: { name: 'Calcio con Vitamina D', adherence: 100, taken: 7, total: 7 },
      gotas: { name: 'Gotas humectantes ojos', adherence: 71, taken: 5, total: 7 },
    },
  });
});

// Family config endpoints
app.get('/api/family/state', (_req, res) => {
  res.json(familyState);
});

app.post('/api/family/state', (req, res) => {
  const updates = req.body;
  if (updates.assistantName) familyState.assistantName = updates.assistantName;
  if (updates.grandmotherName) familyState.grandmotherName = updates.grandmotherName;
  if (updates.formality) familyState.formality = updates.formality;
  if (typeof updates.wakeWordSensitivity === 'number') familyState.wakeWordSensitivity = updates.wakeWordSensitivity;
  if (typeof updates.speechSpeed === 'number') familyState.speechSpeed = updates.speechSpeed;
  if (typeof updates.speechPitch === 'number') familyState.speechPitch = updates.speechPitch;
  if (updates.maleVoiceName) familyState.maleVoiceName = updates.maleVoiceName;
  if (updates.proactiveSchedule) familyState.proactiveSchedule = updates.proactiveSchedule;
  if (updates.emergencyContacts) familyState.emergencyContacts = updates.emergencyContacts;
  if (updates.medications) familyState.medications = updates.medications;
  if (updates.photos) familyState.photos = updates.photos;
  res.json({ success: true, state: familyState });
});

// Toggle medication taken
app.post('/api/medications/confirm', (req, res) => {
  const { id } = req.body;
  const med = familyState.medications.find((m) => m.id === id);
  if (med) {
    med.takenToday = true;
    const now = new Date();
    med.lastConfirmedTime = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
    res.json({ success: true, med });
  } else {
    res.status(404).json({ error: 'Medicina no encontrada' });
  }
});

// Send new message from family
app.post('/api/family/messages', (req, res) => {
  const { from, text } = req.body;
  if (!text) {
    res.status(400).json({ error: 'Texto requerido' });
    return;
  }
  const newMessage = {
    id: 'msg_' + Date.now(),
    from: from || 'Familiar',
    text,
    timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
    played: false,
  };
  familyState.familyMessages.unshift(newMessage);
  res.json({ success: true, message: newMessage });
});

// Mark message as played
app.post('/api/family/messages/mark-played', (req, res) => {
  const { id } = req.body;
  const msg = familyState.familyMessages.find((m) => m.id === id);
  if (msg) {
    msg.played = true;
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Mensaje no encontrado' });
  }
});

// Add photo to screensaver
app.post('/api/family/photos', (req, res) => {
  const { title, caption, url } = req.body;
  if (!url) {
    res.status(400).json({ error: 'URL requerida' });
    return;
  }
  const newPhoto = {
    id: 'photo_' + Date.now(),
    title: title || 'Recuerdo familiar',
    caption: caption || 'Foto enviada por la familia.',
    url,
    dateAdded: 'Hoy',
  };
  familyState.photos.unshift(newPhoto);
  res.json({ success: true, photo: newPhoto });
});

// Vite middleware integration for full-stack SPA
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hey Berna Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
