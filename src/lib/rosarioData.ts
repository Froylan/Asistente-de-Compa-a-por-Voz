export type MysteryType = 'Gozosos' | 'Luminosos' | 'Dolorosos' | 'Gloriosos';

export interface Mystery {
  number: number;
  title: string;
  contemplation: string;
  fruit: string;
}

export interface DayMysteryInfo {
  dayName: string;
  mysteryType: MysteryType;
  mysteries: Mystery[];
}

const MYSTERIES_BY_TYPE: Record<MysteryType, Mystery[]> = {
  Gozosos: [
    {
      number: 1,
      title: 'La Encarnación del Hijo de Dios',
      contemplation: 'El Ángel Gabriel anuncia a María Santísima que será la Madre del Salvador.',
      fruit: 'Humildad',
    },
    {
      number: 2,
      title: 'La Visitación de Nuestra Señora a su prima Santa Isabel',
      contemplation: 'María viaja con prontitud para acompañar y servir a su prima Isabel.',
      fruit: 'Caridad fraterna y servicio al prójimo',
    },
    {
      number: 3,
      title: 'El Nacimiento del Hijo de Dios en el portal de Belén',
      contemplation: 'Jesús nace en la pobreza y ternura del pesebre en una noche de paz.',
      fruit: 'Pobreza de espíritu y desprendimiento',
    },
    {
      number: 4,
      title: 'La Presentación del Niño Jesús en el Templo',
      contemplation: 'María y José presentan a Jesús al Señor y Simeón lo bendice.',
      fruit: 'Obediencia y pureza de corazón',
    },
    {
      number: 5,
      title: 'El Niño Jesús perdido y hallado en el Templo',
      contemplation: 'Tras tres días de búsqueda angustiada, María y José encuentran a Jesús enseñando entre los doctores.',
      fruit: 'Búsqueda constante de Dios',
    },
  ],
  Luminosos: [
    {
      number: 1,
      title: 'El Bautismo de Jesús en el Jordán',
      contemplation: 'El Espíritu Santo desciende en forma de paloma y el Padre proclama: Este es mi Hijo amado.',
      fruit: 'Fidelidad a las promesas bautismales',
    },
    {
      number: 2,
      title: 'La autorrevelación de Jesús en las Bodas de Caná',
      contemplation: 'Por intercesión amorosa de la Virgen María, Jesús transforma el agua en vino nuevo.',
      fruit: 'Confianza plena en la Virgen María',
    },
    {
      number: 3,
      title: 'El Anuncio del Reino de Dios invitando a la conversión',
      contemplation: 'Jesús proclama la llegada del Reino y perdona los pecados con infinita misericordia.',
      fruit: 'Conversión y perdón sincero',
    },
    {
      number: 4,
      title: 'La Transfiguración de Jesús en el Monte Tabor',
      contemplation: 'El rostro de Jesús brilla como el sol y su gloria conforta a los apóstoles.',
      fruit: 'Esperanza y contemplación celestial',
    },
    {
      number: 5,
      title: 'La Institución de la Sagrada Eucaristía',
      contemplation: 'En la Última Cena, Jesús se ofrece a sí mismo como alimento de vida eterna.',
      fruit: 'Amor ardiente a la Eucaristía y la Santa Misa',
    },
  ],
  Dolorosos: [
    {
      number: 1,
      title: 'La Oración de Jesús en el Huerto de Getsemaní',
      contemplation: 'Jesús reza en profunda soledad entregando su voluntad al Padre Celestial.',
      fruit: 'Conformidad con la voluntad de Dios',
    },
    {
      number: 2,
      title: 'La Flagelación de Nuestro Señor atado a la columna',
      contemplation: 'Jesús soporta los golpes con paciencia infinita por amor a nosotros.',
      fruit: 'Paciencia en los dolores y achaques',
    },
    {
      number: 3,
      title: 'La Coronación de Espinas',
      contemplation: 'Corona de espinas ceñida en la cabeza de nuestro Rey de Reyes.',
      fruit: 'Perdón a quienes nos ofenden',
    },
    {
      number: 4,
      title: 'Jesús con la Cruz a Cuestas camino al Calvario',
      contemplation: 'Jesús abraza el madero y encuentra a su Santísima Madre en el camino.',
      fruit: 'Fortaleza para cargar nuestra propia cruz diaria',
    },
    {
      number: 5,
      title: 'La Crucifixión y Muerte de Nuestro Señor Jesucristo',
      contemplation: 'Jesús nos entrega a María como Madre antes de entregar su espíritu: ¡Ahí tienes a tu Madre!',
      fruit: 'Salvación, gratitud y perdón',
    },
  ],
  Gloriosos: [
    {
      number: 1,
      title: 'La Triunfante Resurrección del Señor',
      contemplation: 'Cristo vence a la muerte y resucita glorioso al tercer día.',
      fruit: 'Fe inquebrantable',
    },
    {
      number: 2,
      title: 'La Ascensión del Señor a los Cielos',
      contemplation: 'Jesús bendice a sus discípulos y sube al Cielo a preparar un lugar para nosotros.',
      fruit: 'Esperanza del reencuentro en la vida eterna',
    },
    {
      number: 3,
      title: 'La Venida del Espíritu Santo en Pentecostés',
      contemplation: 'Lenguas de fuego descienden sobre María y los apóstoles reunidos en oración.',
      fruit: 'Dones y consuelo del Espíritu Santo',
    },
    {
      number: 4,
      title: 'La Asunción de la Santísima Virgen en cuerpo y alma',
      contemplation: 'Nuestra Madre es llevada a la gloria celestial por los santos ángeles.',
      fruit: 'Devoción tierna a la Virgen y deseo del cielo',
    },
    {
      number: 5,
      title: 'La Coronación de María como Reina de todo lo creado',
      contemplation: 'La Santísima Trinidad corona a la Virgen María como Reina de la Paz y de nuestras familias.',
      fruit: 'Protección materna y perseverancia final',
    },
  ],
};

/**
 * Liturgical assignment according to Catholic tradition:
 * - Lunes y Sábado: Gozosos
 * - Martes y Viernes: Dolorosos
 * - Miércoles y Domingo: Gloriosos
 * - Jueves: Luminosos
 */
export function getMysteriesForDay(date: Date = new Date()): DayMysteryInfo {
  const day = date.getDay(); // 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  let mysteryType: MysteryType;
  switch (day) {
    case 1: // Lunes
    case 6: // Sábado
      mysteryType = 'Gozosos';
      break;
    case 2: // Martes
    case 5: // Viernes
      mysteryType = 'Dolorosos';
      break;
    case 4: // Jueves
      mysteryType = 'Luminosos';
      break;
    case 0: // Domingo
    case 3: // Miércoles
    default:
      mysteryType = 'Gloriosos';
      break;
  }

  return {
    dayName: dayNames[day],
    mysteryType,
    mysteries: MYSTERIES_BY_TYPE[mysteryType],
  };
}

export const COMMON_PRAYERS = {
  senialDeLaCruz: 'Por la señal de la Santa Cruz, de nuestros enemigos líbranos, Señor Dios nuestro. En el nombre del Padre, y del Hijo, y del Espíritu Santo. Amén.',
  padreNuestro: 'Padre nuestro, que estás en el cielo, santificado sea tu Nombre; venga a nosotros tu reino; hágase tu voluntad en la tierra como en el cielo. Danos hoy nuestro pan de cada día; perdona nuestras ofensas, como también nosotros perdonamos a los que nos ofenden; no nos dejes caer en la tentación, y líbranos del mal. Amén.',
  aveMaria: 'Dios te salve, María, llena eres de gracia; el Señor es contigo; bendita tú eres entre todas las mujeres, y bendito es el fruto de tu vientre, Jesús. Santa María, Madre de Dios, ruega por nosotros, pecadores, ahora y en la hora de nuestra muerte. Amén.',
  gloria: 'Gloria al Padre, y al Hijo, y al Espíritu Santo. Como era en el principio, ahora y siempre, por los siglos de los siglos. Amén.',
  salve: 'Dios te salve, Reina y Madre de misericordia, vida, dulzura y esperanza nuestra; Dios te salve. A ti llamamos los desterrados hijos de Eva; a ti suspiramos, gimiendo y llorando, en este valle de lágrimas. Ea, pues, Señora, abogada nuestra, vuelve a nosotros esos tus ojos misericordiosos; y después de este destierro muéstranos a Jesús, fruto bendito de tu vientre. ¡Oh clementísima, oh piadosa, oh dulce Virgen María! Ruega por nosotros, Santa Madre de Dios, para que seamos dignos de alcanzar las promesas de Nuestro Señor Jesucristo. Amén.',
};
