export interface RefranItem {
  id: string;
  firstPart: string;
  completion: string;
  options: string[];
  explanation: string;
}

export interface SongMemoryItem {
  id: string;
  title: string;
  artist: string;
  verse: string;
  answerOptions: string[];
  yearOrEra: string;
}

export const REFRANES_POPULARES: RefranItem[] = [
  {
    id: 'r1',
    firstPart: 'Al que madruga...',
    completion: 'Dios le ayuda',
    options: ['Dios le ayuda', 'Le da más sueño', 'Llega primero'],
    explanation: 'Un refrán que nos recuerda poner nuestras mañanas en manos de Dios.',
  },
  {
    id: 'r2',
    firstPart: 'Camarón que se duerme...',
    completion: 'Se lo lleva la corriente',
    options: ['Se lo lleva la corriente', 'Amanece cansado', 'Se queda sin cenar'],
    explanation: 'Nos aconseja estar atentos y con ánimo despierto.',
  },
  {
    id: 'r3',
    firstPart: 'De tal palo...',
    completion: 'Tal astilla',
    options: ['Tal astilla', 'Sale la leña', 'Nace la flor'],
    explanation: '¡Cómo se parecen nuestros hijos y nietos a nosotros!',
  },
  {
    id: 'r4',
    firstPart: 'Agua que no has de beber...',
    completion: 'Déjala correr',
    options: ['Déjala correr', 'Guárdala para después', 'Hiérvela bien'],
    explanation: 'Para vivir tranquilos sin angustiarnos por lo ajeno.',
  },
  {
    id: 'r5',
    firstPart: 'A caballo regalado...',
    completion: 'No se le ve colmillo',
    options: ['No se le ve colmillo', 'Se le da buen pasto', 'Se monta despacio'],
    explanation: 'Todo regalo y bendición se recibe con gratitud y una sonrisa.',
  },
  {
    id: 'r6',
    firstPart: 'El que a buen árbol se arrima...',
    completion: 'Buena sombra le cobija',
    options: ['Buena sombra le cobija', 'Come buena fruta', 'No se moja nunca'],
    explanation: 'La importancia de estar siempre rodeados de la buena familia y amigos.',
  },
];

export const CANCIONES_DEL_RECUERDO: SongMemoryItem[] = [
  {
    id: 'c1',
    title: 'Bésame Mucho',
    artist: 'Consuelo Velázquez',
    verse: 'Bésame, bésame mucho, como si fuera esta noche la...',
    answerOptions: ['Última vez', 'Primera vez', 'Única vez'],
    yearOrEra: 'Época de oro de la música romántica',
  },
  {
    id: 'c2',
    title: 'Cielito Lindo',
    artist: 'Quirino Mendoza y Cortés',
    verse: 'De la Sierra Morena, Cielito Lindo, vienen bajando...',
    answerOptions: ['Un par de ojitos negros', 'Dos palomas blancas', 'Los rayos del sol'],
    yearOrEra: 'Tradición mexicana inolvidable',
  },
  {
    id: 'c3',
    title: 'Solamente Una Vez',
    artist: 'Agustín Lara',
    verse: 'Solamente una vez amé en la vida, solamente una vez y...',
    answerOptions: ['Nada más', 'Para siempre', 'Volví a soñar'],
    yearOrEra: 'El Flaco de Oro',
  },
  {
    id: 'c4',
    title: 'Sabor a Mí',
    artist: 'Álvaro Carrillo',
    verse: 'Pasarán más de mil años, muchos más, yo no sé si tenga amor la eternidad, pero allá tal como aquí en la boca llevarás...',
    answerOptions: ['Sabor a mí', 'Mi recuerdo', 'Dulce miel'],
    yearOrEra: 'Los grandes tríos como Los Panchos',
  },
];
