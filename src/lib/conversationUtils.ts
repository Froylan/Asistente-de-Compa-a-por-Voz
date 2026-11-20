export type ConversationTopicId =
  | 'libre'
  | 'cocina'
  | 'familia'
  | 'recuerdos'
  | 'fe'
  | 'musica';

export interface ConversationTopicMeta {
  id: ConversationTopicId;
  label: string;
  shortHint: string;
}

export interface StructuredConversationReply {
  reply: string;
  suggestedReplies: string[];
  topic?: ConversationTopicId;
}

export const CONVERSATION_TOPICS: ConversationTopicMeta[] = [
  { id: 'libre', label: 'Sácame plática', shortHint: 'Tema sorpresa cariñoso' },
  { id: 'cocina', label: 'Cocina', shortHint: 'Recetas y platillos de antes' },
  { id: 'familia', label: 'Mis nietos', shortHint: 'Mateo, Sofía y Valentina' },
  { id: 'recuerdos', label: 'Juventud', shortHint: 'Anécdotas de antes' },
  { id: 'fe', label: 'Fe y santos', shortHint: 'Dios, Virgen y santos' },
  { id: 'musica', label: 'Música', shortHint: 'Boleros y canciones de antes' },
];

export const DEFAULT_CONVERSATION_STARTERS: string[] = [
  'Platiquemos de mis recuerdos',
  '¿Qué comida hacíamos los domingos?',
  'Platícame de San Judas Tadeo',
  'Muéstrame una foto de Mateo',
];

interface SparkSeed {
  reply: string;
  suggestedReplies: string[];
}

const SPARK_BANK: Record<ConversationTopicId, SparkSeed[]> = {
  libre: [
    {
      reply:
        'Doña Lupita, qué gusto tener este ratito para charlar con usted. Estaba pensando en las tardes tranquilas de antes, cuando se platicaba sin prisas en la sala. ¿Qué era lo que más disfrutaba hacer en las tardes cuando era joven?',
      suggestedReplies: [
        'Salir a platicar con amigas',
        'Escuchar la radio en casa',
        'Tejer o bordar tranquila',
      ],
    },
    {
      reply:
        'Qué bonito verla acompañada por aquí, doña Lupita. Dicen que recordar momentos alegres nos llena el corazón de vida. ¿Cuál ha sido uno de los viajes o paseos más bonitos que recuerda con su familia?',
      suggestedReplies: [
        'Ir al campo todos juntos',
        'Visitar la Basílica',
        'Las fiestas de mi pueblo',
      ],
    },
    {
      reply:
        'Aquí estoy muy atento para platicar de lo que usted guste, doña Lupita. A veces una buena taza de café o tecito sabe mejor cuando se comparte una historia. ¿Qué bebida calientita le gusta tomar más en las tardes?',
      suggestedReplies: [
        'Un cafecito de olla',
        'Té de manzanilla tibio',
        'Chocolate caliente con pan',
      ],
    },
  ],
  cocina: [
    {
      reply:
        'Ay, doña Lupita, dicen que el secreto de la buena cocina está en el cariño de las manos que la preparan. Seguro usted cocinaba delicioso para toda la casa. ¿Cuál era ese platillo especial que nadie preparaba mejor que usted?',
      suggestedReplies: [
        'Mi mole con arroz rojo',
        'Un buen caldo de pollo',
        'Tamales y atole en familia',
      ],
    },
    {
      reply:
        'Me encanta imaginar el olor tan rico de una cocina tradicional mexicana por la mañana. ¿Usted aprendió a cocinar viendo a su mamá o a su abuelita, doña Lupita?',
      suggestedReplies: [
        'Con mi mamá desde chica',
        'Fui aprendiendo poco a poco',
        'Me gustaba más hacer postres',
      ],
    },
    {
      reply:
        'Hablando de antojos ricos, doña Lupita, ¿qué pan dulce o postre de su juventud le trae los recuerdos más bonitos cuando lo prueba ahora?',
      suggestedReplies: [
        'Las conchas recién hechas',
        'Arroz con leche y canela',
        'Unos buñuelos con miel',
      ],
    },
  ],
  familia: [
    {
      reply:
        'Su familia la quiere muchísimo, doña Lupita. Mateo, Sofía y la pequeña Valentina siempre hablan con orgullo de su abuelita. ¿Qué travesura o momento gracioso de alguno de sus nietos la ha hecho reír mucho?',
      suggestedReplies: [
        'Cuando Mateo era chiquito',
        'Las ocurrencias de Sofía',
        'Ver bailar a Valentina',
      ],
    },
    {
      reply:
        'Qué bendición tan grande es ver crecer a los hijos y luego a los nietos, doña Lupita. ¿Qué consejo de vida le gusta darle siempre a María Elena o a los muchachos cuando vienen a visitarla?',
      suggestedReplies: [
        'Que siempre estén unidos',
        'Que den gracias a Dios',
        'Que coman bien y descansen',
      ],
    },
    {
      reply:
        'Estaba pensando en las reuniones familiares de domingo, doña Lupita. Cuando viene toda la familia a verla, ¿qué es lo que más le alegra el corazón de tenerlos cerca?',
      suggestedReplies: [
        'Escuchar sus risas juntos',
        'Que me abracen fuerte',
        'Platicar en la mesa larga',
      ],
    },
  ],
  recuerdos: [
    {
      reply:
        'Doña Lupita, usted ha visto cambiar tanto el mundo y guarda historias valiosísimas. Cuando usted era niña, ¿a qué jugaba en la calle o en el patio con sus hermanos y amigos?',
      suggestedReplies: [
        'Jugábamos a la lotería',
        'A la cuerda y escondidas',
        'Con muñecas de trapo',
      ],
    },
    {
      reply:
        'Me da mucha curiosidad imaginar cómo eran las fiestas y bailes de su juventud, doña Lupita. ¿Cómo se arreglaban usted y sus amigas cuando iban a una celebración especial?',
      suggestedReplies: [
        'Con vestidos hechos en casa',
        'Peinadas con trenzas bonitas',
        'Nos cuidaban mucho los papás',
      ],
    },
    {
      reply:
        'Dicen que antes los vecinos se conocían como familia, doña Lupita. ¿Se acuerda de algún vecino o amiga muy querida de aquellos años que siempre venía a saludar?',
      suggestedReplies: [
        'Sí, teníamos muy buena amistad',
        'Nos prestábamos cosas seguido',
        'Platicábamos en la banqueta',
      ],
    },
  ],
  fe: [
    {
      reply:
        'Qué paz tan grande da platicar de nuestra fe, doña Lupita. Cada santo tiene una historia hermosa de entrega y esperanza. ¿A qué santo o advocación de la Virgen le tiene usted más devoción desde joven?',
      suggestedReplies: [
        'A la Virgen de Guadalupe',
        'A San Judas Tadeo',
        'Al Sagrado Corazón',
      ],
    },
    {
      reply:
        'Recuerdo que ir a misa los domingos siempre ha sido un momento muy especial para las familias mexicanas. ¿Cómo recuerda las misas de su niñez, doña Lupita, o alguna oración que le enseñó su mamá?',
      suggestedReplies: [
        'El Padre Nuestro al despertar',
        'Íbamos todos bien vestidos',
        'Me gustaban los cantos del coro',
      ],
    },
    {
      reply:
        'Agradecer a Dios al terminar el día nos da un descanso muy tranquilo, doña Lupita. Hoy por qué bendición chiquita o grande siente más gratitud en su corazón?',
      suggestedReplies: [
        'Por la salud de mi familia',
        'Por despertar un día más',
        'Por tener compañía hoy',
      ],
    },
  ],
  musica: [
    {
      reply:
        'La música de antes tiene unas letras tan bonitas y llenas de sentimiento, doña Lupita. Voces como las de Pedro Infante o los tríos románticos alegran cualquier tarde. ¿Cuál canción o bolero nunca pasa de moda para usted?',
      suggestedReplies: [
        'Cielito Lindo me encanta',
        'Las de Pedro Infante',
        'Boleros de Los Panchos',
      ],
    },
    {
      reply:
        'Dicen que las canciones nos llevan directo a los mejores momentos de la vida, doña Lupita. ¿En su casa les gustaba cantar o poner música en el radio mientras hacían los quehaceres?',
      suggestedReplies: [
        'Sí, todo el día sonaba el radio',
        'Mi papá silbaba canciones',
        'Cantábamos en las reuniones',
      ],
    },
  ],
};

function sanitizeSuggestions(rawList: unknown, fallback: string[]): string[] {
  if (!Array.isArray(rawList)) return fallback;
  const cleaned = rawList
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter((item) => item.length >= 2 && item.length <= 65)
    .slice(0, 3);

  return cleaned.length >= 2 ? cleaned : fallback;
}

export function inferTopicFromText(text: string): ConversationTopicId {
  const lower = text.toLowerCase();
  if (/(cocin|comid|mole|tamal|receta|pan|café|desayun|almorzar|cenar|postre)/.test(lower)) {
    return 'cocina';
  }
  if (/(nieto|nieta|bisniet|mateo|sof[ií]a|valentina|mar[ií]a elena|carlos|hijo|hija|familia)/.test(lower)) {
    return 'familia';
  }
  if (/(dios|virgen|guadalupe|san |santo|misa|rosario|iglesia|oraci[oó]n|fe|rezar)/.test(lower)) {
    return 'fe';
  }
  if (/(m[uú]sica|canci[oó]n|bolero|pedro infante|cantar|radio|baile)/.test(lower)) {
    return 'musica';
  }
  if (/(recuerdo|antes|joven|niñ|pueblo|infancia|escuela|amig)/.test(lower)) {
    return 'recuerdos';
  }
  return 'libre';
}

export function parseStructuredConversationResponse(
  rawText: string,
  fallbackContext = ''
): StructuredConversationReply {
  const inferredTopic = inferTopicFromText(fallbackContext || rawText);
  const defaultSuggestions =
    SPARK_BANK[inferredTopic][0]?.suggestedReplies || [
      'Cuénteme más de eso',
      'Le platico un recuerdo',
      'Cambiar de tema',
    ];

  if (!rawText || typeof rawText !== 'string') {
    const fallback = getEnhancedLocalFallback(fallbackContext);
    return fallback;
  }

  let candidate = rawText.trim();
  const codeFenceMatch = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeFenceMatch?.[1]) {
    candidate = codeFenceMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(candidate);
    const reply =
      typeof parsed?.reply === 'string' && parsed.reply.trim()
        ? parsed.reply.trim()
        : typeof parsed?.message === 'string' && parsed.message.trim()
        ? parsed.message.trim()
        : '';

    if (reply) {
      return {
        reply,
        suggestedReplies: sanitizeSuggestions(parsed?.suggestedReplies, defaultSuggestions),
        topic: inferredTopic,
      };
    }
  } catch {
    // Plain text response from model; return clean text paired with contextual suggestions
  }

  const plainReply = candidate.replace(/^["']|["']$/g, '').trim();
  if (!plainReply) {
    return getEnhancedLocalFallback(fallbackContext);
  }

  return {
    reply: plainReply,
    suggestedReplies: defaultSuggestions,
    topic: inferredTopic,
  };
}

export function getEnhancedLocalFallback(
  query: string,
  grandmotherName = 'Lupita'
): StructuredConversationReply {
  const lower = (query || '').toLowerCase().trim();

  if (/(dios|jes[uú]s|padre nuestro|fe|oraci[oó]n|bendici[oó]n)/.test(lower)) {
    return {
      reply: `Dios siempre camina con usted, doña ${grandmotherName}, cuidándola con infinita ternura. Tener fe en el corazón nos da mucha paz. ¿Hay alguna oración especial que a usted le guste rezar cuando busca tranquilidad?`,
      suggestedReplies: [
        'El Padre Nuestro y Ave María',
        'Pido por toda mi familia',
        'Platícame de algún santo',
      ],
      topic: 'fe',
    };
  }

  if (/(virgen|guadalupe|morenita|mar[ií]a)/.test(lower) && !lower.includes('maría elena')) {
    return {
      reply: `La Virgencita de Guadalupe es como una madre cariñosa que siempre nos arropa bajo su manto, doña ${grandmotherName}. ¿Alguna vez fue usted a visitarla a la Basílica con su familia?`,
      suggestedReplies: [
        'Sí, íbamos en familia',
        'Le tengo mucha devoción',
        'Quiero rezar un ratito',
      ],
      topic: 'fe',
    };
  }

  if (/(san |santo|judas|antonio|jos[eé])/.test(lower)) {
    return {
      reply: `Qué ejemplo tan bonito nos dejan los santos, como San Judas Tadeo o San José, que siempre ayudaban con humildad y amor. ¿Cuál de los santos ha sido el más especial en su casa, doña ${grandmotherName}?`,
      suggestedReplies: [
        'San Judas Tadeo siempre me ayuda',
        'San Antonio y San José',
        'Cuéntame su historia',
      ],
      topic: 'fe',
    };
  }

  if (/(mateo|sof[ií]a|valentina|nieto|nieta|bisniet|mar[ií]a elena|carlos|hija|hijo|familia)/.test(lower)) {
    return {
      reply: `Qué alegría hablar de los suyos, doña ${grandmotherName}. Sus hijos y sus nietos Mateo, Sofía y Valentina tienen una abuelita maravillosa que siempre los tiene en su corazón. ¿Qué es lo que más disfruta hacer cuando vienen a visitarla?`,
      suggestedReplies: [
        'Platicar y tomar café juntos',
        'Ver las fotos de los niños',
        'Consentirlos con algo rico',
      ],
      topic: 'familia',
    };
  }

  if (/(cocin|comid|mole|tamal|desayun|almorz|cenar|hambre|pan|caf[eé]|t[eé])/.test(lower)) {
    return {
      reply: `Qué rico tema, doña ${grandmotherName}. La comida hecha en casa siempre sabe a puro cariño y recuerdos bonitos. ¿Qué platillo de los domingos era el que más le pedía su familia que preparara?`,
      suggestedReplies: [
        'Un mole con arroz rojo',
        'Caldo con verduras frescas',
        'Me gustaba hacer pan y atole',
      ],
      topic: 'cocina',
    };
  }

  if (/(m[uú]sica|canci[oó]n|bolero|pedro infante|radio|cantar|baile)/.test(lower)) {
    return {
      reply: `Ah, la música de antes tiene un encanto muy especial, doña ${grandmotherName}, con esas guitarras y voces tan cálidas. ¿Cuál canción le gusta tararear o escuchar para alegrar la tarde?`,
      suggestedReplies: [
        'Cielito Lindo o Las Mañanitas',
        'Boleros románticos de trío',
        'Canciones de Pedro Infante',
      ],
      topic: 'musica',
    };
  }

  if (/(recuerdo|antes|joven|niñ|pueblo|infancia|historia|cu[eé]ntame|platiquemos)/.test(lower)) {
    return {
      reply: `Con mucho gusto nos ponemos a recordar tiempos bonitos, doña ${grandmotherName}. La juventud de antes tenía mucha sencillez y alegría en familia. ¿Qué recuerda con más cariño de la casa donde creció?`,
      suggestedReplies: [
        'El patio y las plantas',
        'Jugar con mis hermanos',
        'Las pláticas en la cocina',
      ],
      topic: 'recuerdos',
    };
  }

  if (/(sola|triste|aburr|extrañ|nostalgia|cansad)/.test(lower)) {
    return {
      reply: `Aquí estoy cerquita haciéndole compañía con todo respeto y cariño, doña ${grandmotherName}, nunca está sola. Si quiere podemos recordar algo bonito o ver fotos de sus nietos. ¿Qué le gustaría hacer ahorita para animar el corazón?`,
      suggestedReplies: [
        'Platiquemos de cosas bonitas',
        'Muéstrame fotos de mis nietos',
        'Cuéntame de algún santo',
      ],
      topic: 'familia',
    };
  }

  if (/(hola|buenos d[ií]as|buenas tardes|buenas noches|c[oó]mo amanec|c[oó]mo est[aá]s)/.test(lower)) {
    return {
      reply: `¡Qué alegría escucharla, doña ${grandmotherName}! Yo estoy muy bien y muy contento de acompañarla hoy. ¿Cómo se siente usted de ánimo y qué planes tranquilos tiene para este ratito?`,
      suggestedReplies: [
        'Amanecí muy bien gracias a Dios',
        'Quiero platicar un rato contigo',
        'Cuéntame algo bonito',
      ],
      topic: 'libre',
    };
  }

  if (/(medicina|pastilla|doctor|dolor|salud)/.test(lower)) {
    return {
      reply: `Cuidar nuestra salud con calma y a sus horas es muy importante, doña ${grandmotherName}. Recuerde que si siente alguna molestia, siempre avisamos enseguida a María Elena. ¿Cómo se ha sentido hoy del cuerpo y del descanso?`,
      suggestedReplies: [
        'Me siento muy bien hoy',
        'Un poco cansada pero tranquila',
        'Abrir mis medicinas de hoy',
      ],
      topic: 'libre',
    };
  }

  if (lower.length > 0 && lower.length <= 28) {
    return {
      reply: `Qué bien me da escuchar eso, doña ${grandmotherName}. Me gusta mucho platicar sin prisas con usted. ¿Y de qué otro recuerdo bonito, platillo o canción le gustaría que conversáramos ahorita?`,
      suggestedReplies: [
        'De la cocina de antes',
        'De mi juventud y pueblo',
        'De mis nietos Mateo y Sofía',
      ],
      topic: 'recuerdos',
    };
  }

  return {
    reply: `Qué interesante lo que me platica, doña ${grandmotherName}, la escucho con mucha atención y cariño. Eso me hace pensar en cuántas experiencias valiosas guarda usted. ¿Y qué parte de esa historia le trae más alegría recordar?`,
    suggestedReplies: [
      'Los momentos en familia',
      'La música y fiestas de antes',
      'Cambiar a otro tema',
    ],
    topic: 'libre',
  };
}

export function getSparkStarter(
  topic: ConversationTopicId,
  timeSlot: 'morning' | 'afternoon' | 'evening',
  grandmotherName = 'Lupita',
  recentAssistantTexts: string[] = []
): StructuredConversationReply {
  const effectiveTopic: ConversationTopicId = topic in SPARK_BANK ? topic : 'libre';
  const pool = SPARK_BANK[effectiveTopic].map((seed) => ({
    reply: seed.reply.replace(/Lupita/g, grandmotherName),
    suggestedReplies: seed.suggestedReplies,
  }));

  // Try to pick one not recently shown
  const normalizedRecent = recentAssistantTexts.map((t) => t.toLowerCase());
  const unused = pool.filter(
    (seed) => !normalizedRecent.some((prev) => prev.includes(seed.reply.slice(0, 35).toLowerCase()))
  );
  const candidates = unused.length > 0 ? unused : pool;

  const slotIndex = timeSlot === 'morning' ? 0 : timeSlot === 'afternoon' ? 1 : 2;
  const chosen = candidates[slotIndex % candidates.length] || candidates[0];

  return {
    reply: chosen.reply,
    suggestedReplies: chosen.suggestedReplies,
    topic: effectiveTopic,
  };
}
