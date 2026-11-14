import { LearningUnit, SpanishWordPhrase } from '../types';
import { CINEMA_UNITS } from './cinemaAnd5000Data';

const BASE_SPANISH_UNITS: LearningUnit[] = [
  {
    id: 'unit-1',
    title: 'Saludos y Cortesía',
    subtitle: 'Essential Greetings & Courtesy',
    level: 'A1',
    iconName: 'Smile',
    color: 'from-amber-500 to-rose-500',
    description: 'Master first impressions, polite greetings, introducing yourself, and saying goodbye.',
    items: [
      {
        id: 'u1-1',
        spanish: '¡Hola! ¿Cómo estás?',
        english: 'Hello! How are you?',
        phonetic: 'OH-lah, KOH-moh ehs-TAHS',
        category: 'Greetings',
        level: 'A1',
        exampleSpanish: '¡Hola! ¿Cómo estás hoy, amigo?',
        exampleEnglish: 'Hello! How are you today, friend?',
        pronunciationTip: 'The "H" in Spanish is always completely silent! "Hola" sounds like "OH-lah".',
        difficulty: 1
      },
      {
        id: 'u1-2',
        spanish: 'Buenos días',
        english: 'Good morning',
        phonetic: 'BWEH-nohs DEE-ahs',
        category: 'Greetings',
        level: 'A1',
        exampleSpanish: 'Buenos días a todos en la clase.',
        exampleEnglish: 'Good morning to everyone in the class.',
        pronunciationTip: 'Pronounce the "ue" together smoothly like "bweh".',
        difficulty: 1
      },
      {
        id: 'u1-3',
        spanish: 'Buenas tardes',
        english: 'Good afternoon',
        phonetic: 'BWEH-nahs TAHR-dehs',
        category: 'Greetings',
        level: 'A1',
        exampleSpanish: 'Buenas tardes, señor García.',
        exampleEnglish: 'Good afternoon, Mr. Garcia.',
        pronunciationTip: 'Keep Spanish vowels crisp and short.',
        difficulty: 1
      },
      {
        id: 'u1-4',
        spanish: 'Buenas noches',
        english: 'Good evening / Good night',
        phonetic: 'BWEH-nahs NOH-chehs',
        category: 'Greetings',
        level: 'A1',
        exampleSpanish: 'Buenas noches, que descanses.',
        exampleEnglish: 'Good night, rest well.',
        pronunciationTip: 'The "ch" is pronounced like the "ch" in "chocolate".',
        difficulty: 1
      },
      {
        id: 'u1-5',
        spanish: '¿Cómo te llamas?',
        english: 'What is your name?',
        phonetic: 'KOH-moh teh YAH-mahs',
        category: 'Introductions',
        level: 'A1',
        exampleSpanish: 'Mucho gusto, ¿cómo te llamas tú?',
        exampleEnglish: 'Nice to meet you, what is your name?',
        pronunciationTip: 'Double "ll" is pronounced like the "y" in "yellow" or "yes".',
        difficulty: 1
      },
      {
        id: 'u1-6',
        spanish: 'Me llamo Carlos',
        english: 'My name is Carlos',
        phonetic: 'meh YAH-moh KAHR-lohs',
        category: 'Introductions',
        level: 'A1',
        exampleSpanish: 'Me llamo Carlos y soy de Madrid.',
        exampleEnglish: 'My name is Carlos and I am from Madrid.',
        pronunciationTip: 'Don\'t translate literally "I call myself" — it means "My name is".',
        difficulty: 1
      },
      {
        id: 'u1-7',
        spanish: 'Mucho gusto en conocerte',
        english: 'Nice to meet you',
        phonetic: 'MOO-choh GOOS-toh ehn koh-noh-SEHR-teh',
        category: 'Introductions',
        level: 'A1',
        exampleSpanish: 'Mucho gusto en conocerte, bienvenido.',
        exampleEnglish: 'Nice to meet you, welcome.',
        pronunciationTip: 'In Spain, the "c" before "e" sounds like "th" (ko-no-THEHR-te). In Latin America, like "s".',
        difficulty: 2
      },
      {
        id: 'u1-8',
        spanish: 'Por favor y muchas gracias',
        english: 'Please and thank you very much',
        phonetic: 'pohr fah-BVOHR ee MOO-chahs GRAH-syahs',
        category: 'Courtesy',
        level: 'A1',
        exampleSpanish: 'Un café, por favor, y muchas gracias.',
        exampleEnglish: 'A coffee, please, and thank you very much.',
        pronunciationTip: 'The letter "y" by itself is pronounced "ee" (means "and").',
        difficulty: 1
      },
      {
        id: 'u1-9',
        spanish: 'De nada, es un placer',
        english: 'You are welcome, it is a pleasure',
        phonetic: 'deh NAH-dhah, ehs oon plah-SEHR',
        category: 'Courtesy',
        level: 'A1',
        exampleSpanish: 'De nada, es un placer ayudarte.',
        exampleEnglish: 'You are welcome, it is a pleasure to help you.',
        pronunciationTip: 'The "d" between vowels softens to a gentle "th" sound in Spanish.',
        difficulty: 2
      },
      {
        id: 'u1-10',
        spanish: 'Hasta luego, nos vemos pronto',
        english: 'See you later, see you soon',
        phonetic: 'AHS-tah LWEH-goh, nohs VEH-mohs PROHN-toh',
        category: 'Farewells',
        level: 'A1',
        exampleSpanish: 'Tengo que irme. ¡Hasta luego, nos vemos pronto!',
        exampleEnglish: 'I have to go. See you later, see you soon!',
        pronunciationTip: 'Remember again: silent "H" on "Hasta"!',
        difficulty: 2
      }
    ]
  },
  {
    id: 'unit-2',
    title: 'Números, Horas y Tiempo',
    subtitle: 'Numbers, Time, Days & Dates',
    level: 'A1',
    iconName: 'Clock',
    color: 'from-blue-500 to-cyan-500',
    description: 'Learn to count smoothly, ask for the time, discuss dates, and schedule meetings.',
    items: [
      {
        id: 'u2-1',
        spanish: 'Uno, dos, tres, cuatro, cinco',
        english: 'One, two, three, four, five',
        phonetic: 'OO-noh, dohs, trehs, KWAH-troh, SEEN-koh',
        category: 'Numbers',
        level: 'A1',
        exampleSpanish: 'Necesito tres boletos, por favor.',
        exampleEnglish: 'I need three tickets, please.',
        pronunciationTip: 'Tap your tongue once on the roof of the mouth for single "r" in "tres" and "cuatro".',
        difficulty: 1
      },
      {
        id: 'u2-2',
        spanish: 'Seis, siete, ocho, nueve, diez',
        english: 'Six, seven, eight, nine, ten',
        phonetic: 'says, SYEH-teh, OH-choh, NWEH-veh, dyehs',
        category: 'Numbers',
        level: 'A1',
        exampleSpanish: 'El tren llega a las diez en punto.',
        exampleEnglish: 'The train arrives at ten sharp.',
        pronunciationTip: 'Spanish "v" in "nueve" sounds almost like a soft "b".',
        difficulty: 1
      },
      {
        id: 'u2-3',
        spanish: '¿Qué hora es ahora?',
        english: 'What time is it now?',
        phonetic: 'keh OH-rah ehs ah-OH-rah',
        category: 'Time',
        level: 'A1',
        exampleSpanish: 'Disculpe, ¿qué hora es ahora?',
        exampleEnglish: 'Excuse me, what time is it now?',
        pronunciationTip: 'Notice the written accent on "Qué" in questions. Accent means vocal emphasis.',
        difficulty: 1
      },
      {
        id: 'u2-4',
        spanish: 'Son las tres y media',
        english: 'It is three thirty (half past three)',
        phonetic: 'sohn lahs trehs ee MEH-dyah',
        category: 'Time',
        level: 'A1',
        exampleSpanish: 'La reunión empieza porque son las tres y media.',
        exampleEnglish: 'The meeting starts because it is three thirty.',
        pronunciationTip: 'Use "Es la una" for 1:00, but "Son las..." for 2:00 through 12:00.',
        difficulty: 2
      },
      {
        id: 'u2-5',
        spanish: 'Hoy es lunes y mañana es martes',
        english: 'Today is Monday and tomorrow is Tuesday',
        phonetic: 'oy ehs LOO-nehs ee mah-NYAH-nah ehs MAHR-tehs',
        category: 'Days',
        level: 'A1',
        exampleSpanish: 'Hoy es lunes y empezamos la semana.',
        exampleEnglish: 'Today is Monday and we start the week.',
        pronunciationTip: 'The "ñ" in "mañana" sounds like the "ny" in "canyon".',
        difficulty: 2
      },
      {
        id: 'u2-6',
        spanish: 'El fin de semana descansamos',
        english: 'On the weekend we rest',
        phonetic: 'ehl feen deh seh-MAH-nah dehs-kahn-SAH-mohs',
        category: 'Days',
        level: 'A1',
        exampleSpanish: 'El fin de semana voy a la playa.',
        exampleEnglish: 'On the weekend I go to the beach.',
        pronunciationTip: 'Stress the penultimate syllable: des-can-SA-mos.',
        difficulty: 2
      },
      {
        id: 'u2-7',
        spanish: '¿A qué hora abre la tienda?',
        english: 'What time does the store open?',
        phonetic: 'ah keh OH-rah AH-breh lah TYEHN-dah',
        category: 'Time',
        level: 'A1',
        exampleSpanish: '¿A qué hora abre el supermercado?',
        exampleEnglish: 'What time does the supermarket open?',
        pronunciationTip: 'Notice the inverted question mark "¿" used at the beginning of all Spanish questions.',
        difficulty: 2
      }
    ]
  },
  {
    id: 'unit-3',
    title: 'En el Restaurante y Tapas',
    subtitle: 'Dining, Drinks, Orders & Paying',
    level: 'A2',
    iconName: 'Utensils',
    color: 'from-emerald-500 to-teal-500',
    description: 'Order food, express preferences, request the check, and navigate menus like a local.',
    items: [
      {
        id: 'u3-1',
        spanish: 'Una mesa para dos personas, por favor',
        english: 'A table for two people, please',
        phonetic: 'OO-nah MEH-sah PAH-rah dohs pehr-SOH-nahs, pohr fah-BVOHR',
        category: 'Dining',
        level: 'A2',
        exampleSpanish: 'Buenas tardes, una mesa para dos personas cerca de la ventana.',
        exampleEnglish: 'Good afternoon, a table for two people near the window.',
        pronunciationTip: 'Lightly tap the "r" in "para" and "personas".',
        difficulty: 2
      },
      {
        id: 'u3-2',
        spanish: '¿Tiene una carta en inglés o español?',
        english: 'Do you have a menu in English or Spanish?',
        phonetic: 'TYEH-neh OO-nah KAHR-tah ehn eeng-GLEHS oh ehs-pah-NYOHL',
        category: 'Dining',
        level: 'A2',
        exampleSpanish: 'Disculpe camarero, ¿tiene una carta en español?',
        exampleEnglish: 'Excuse me waiter, do you have a menu in Spanish?',
        pronunciationTip: 'In Spain "la carta" is the food menu. "El menú" often refers to the set lunch menu.',
        difficulty: 2
      },
      {
        id: 'u3-3',
        spanish: '¿Qué me recomienda de plato principal?',
        english: 'What do you recommend for the main dish?',
        phonetic: 'keh meh reh-koh-MYEHN-dah deh PLAH-toh preen-see-PAHL',
        category: 'Ordering',
        level: 'A2',
        exampleSpanish: 'Todo se ve delicioso, ¿qué me recomienda?',
        exampleEnglish: 'Everything looks delicious, what do you recommend?',
        pronunciationTip: 'Double "r" in "recomienda" at the start of a word is always trilled / rolled!',
        difficulty: 3
      },
      {
        id: 'u3-4',
        spanish: 'Para mí, una paella de mariscos y agua',
        english: 'For me, a seafood paella and water',
        phonetic: 'PAH-rah mee, OO-nah pah-EH-yah deh mah-REES-kohs ee AH-gwah',
        category: 'Ordering',
        level: 'A2',
        exampleSpanish: 'Para mí, una paella de mariscos bien caliente.',
        exampleEnglish: 'For me, a hot seafood paella.',
        pronunciationTip: '"Paella" has three syllables: pah-EH-yah.',
        difficulty: 2
      },
      {
        id: 'u3-5',
        spanish: 'Soy vegetariano y alérgico al gluten',
        english: 'I am vegetarian and allergic to gluten',
        phonetic: 'soy veh-heh-tah-RYAH-noh ee ah-LEHR-hee-koh ahl GLOO-tehn',
        category: 'Dietary',
        level: 'A2',
        exampleSpanish: 'Disculpe, soy vegetariano, ¿este plato lleva carne?',
        exampleEnglish: 'Excuse me, I am vegetarian, does this dish contain meat?',
        pronunciationTip: 'The "g" before "i" or "e" (alérgico, vegetariano) sounds like a raspy English "H" or throat sound.',
        difficulty: 3
      },
      {
        id: 'u3-6',
        spanish: '¡La comida está realmente deliciosa!',
        english: 'The food is really delicious!',
        phonetic: 'lah koh-MEE-dhah ehs-TAH reh-ahl-MEHN-teh deh-lee-SYOH-sah',
        category: 'Feedback',
        level: 'A2',
        exampleSpanish: 'Felicitaciones al chef, la comida está deliciosa.',
        exampleEnglish: 'Congratulations to the chef, the food is delicious.',
        pronunciationTip: 'Notice the accent on "está" — changes meaning from "esta" (this) to "está" (it is).',
        difficulty: 2
      },
      {
        id: 'u3-7',
        spanish: 'La cuenta, por favor. ¿Se puede pagar con tarjeta?',
        english: 'The bill, please. Can I pay with card?',
        phonetic: 'lah KWEHN-tah pohr fah-BVOHR. seh PWEH-deh pah-GAHR kohn tahr-HEH-tah',
        category: 'Payment',
        level: 'A2',
        exampleSpanish: 'Camarero, la cuenta, por favor. ¿Aceptan tarjeta?',
        exampleEnglish: 'Waiter, the check, please. Do you accept cards?',
        pronunciationTip: 'The "j" in "tarjeta" is pronounced strongly from the back of the throat.',
        difficulty: 3
      }
    ]
  },
  {
    id: 'unit-4',
    title: 'Viajes, Ciudad y Direcciones',
    subtitle: 'Directions, Public Transit & Navigation',
    level: 'A2',
    iconName: 'Compass',
    color: 'from-violet-500 to-purple-600',
    description: 'Find landmarks, ask for directions, navigate airports and subways with confidence.',
    items: [
      {
        id: 'u4-1',
        spanish: 'Disculpe, ¿dónde está la estación de metro?',
        english: 'Excuse me, where is the metro station?',
        phonetic: 'dees-KOOL-peh, DOHN-deh ehs-TAH lah ehs-tah-SYOHN deh MEH-troh',
        category: 'Directions',
        level: 'A2',
        exampleSpanish: 'Disculpe, ¿dónde está la estación más cercana?',
        exampleEnglish: 'Excuse me, where is the nearest station?',
        pronunciationTip: 'Stress the last syllable of "estación" due to the accent mark on "ó".',
        difficulty: 2
      },
      {
        id: 'u4-2',
        spanish: 'Gire a la derecha y luego a la izquierda',
        english: 'Turn right and then to the left',
        phonetic: 'HEE-reh ah lah deh-REH-chah ee LWEH-goh ah lah ees-KYEHR-dhah',
        category: 'Directions',
        level: 'A2',
        exampleSpanish: 'Gire a la derecha en el semáforo y camine dos cuadras.',
        exampleEnglish: 'Turn right at the traffic light and walk two blocks.',
        pronunciationTip: '"Gire" starts with the Spanish guttural "G" sound like "HEE-reh".',
        difficulty: 3
      },
      {
        id: 'u4-3',
        spanish: 'Siga todo recto hasta la plaza central',
        english: 'Go straight ahead until the central square',
        phonetic: 'SEE-gah TOH-dhoh REHK-toh AHS-tah lah PLAH-sah sehn-TRAHL',
        category: 'Directions',
        level: 'A2',
        exampleSpanish: 'Siga todo recto por esta avenida unos diez minutos.',
        exampleEnglish: 'Go straight ahead along this avenue for about ten minutes.',
        pronunciationTip: '"Recto" has a strongly trilled single "R" at the start.',
        difficulty: 2
      },
      {
        id: 'u4-4',
        spanish: '¿Está cerca de aquí o tengo que tomar un autobús?',
        english: 'Is it near here or do I need to take a bus?',
        phonetic: 'ehs-TAH SEHR-kah deh ah-KEE oh TEHN-goh keh toh-MAHR oon ow-toh-BOOS',
        category: 'Transport',
        level: 'A2',
        exampleSpanish: '¿El museo está cerca o tengo que tomar un taxi?',
        exampleEnglish: 'Is the museum close or do I have to take a taxi?',
        pronunciationTip: '"Aquí" has strong stress on the final syllable: ah-KEE.',
        difficulty: 3
      },
      {
        id: 'u4-5',
        spanish: 'Quisiera un billete de ida y vuelta para Barcelona',
        english: 'I would like a round-trip ticket to Barcelona',
        phonetic: 'kee-SYEH-rah oon bee-LYEH-teh deh EE-dhah ee VWEHL-tah PAH-rah bahr-seh-LOH-nah',
        category: 'Travel',
        level: 'A2',
        exampleSpanish: 'Quisiera un billete de ida y vuelta en tren rápido.',
        exampleEnglish: 'I would like a round-trip ticket on the high-speed train.',
        pronunciationTip: '"Ida y vuelta" literally means "going and return" (round trip).',
        difficulty: 3
      },
      {
        id: 'u4-6',
        spanish: '¿A qué andén llega el próximo tren?',
        english: 'Which platform does the next train arrive at?',
        phonetic: 'ah keh ahn-DEHN YEH-gah ehl PROHK-see-moh trehn',
        category: 'Travel',
        level: 'A2',
        exampleSpanish: 'Mire la pantalla para ver a qué andén llega.',
        exampleEnglish: 'Look at the screen to see which platform it arrives at.',
        pronunciationTip: '"Próximo" has the accent on the "ó" — PROHK-see-moh.',
        difficulty: 3
      }
    ]
  },
  {
    id: 'unit-5',
    title: 'Rutina Diaria y Emociones',
    subtitle: 'Daily Habits, Reflexives & Personal Life',
    level: 'A2',
    iconName: 'Sun',
    color: 'from-orange-500 to-amber-600',
    description: 'Describe your day, speak about feelings, reflexive actions, and everyday routines.',
    items: [
      {
        id: 'u5-1',
        spanish: 'Me despierto temprano a las siete de la mañana',
        english: 'I wake up early at seven in the morning',
        phonetic: 'meh dehs-PYEHR-toh tehm-PRAH-noh ah lahs SYEH-teh deh lah mah-NYAH-nah',
        category: 'Routine',
        level: 'A2',
        exampleSpanish: 'Normalmente me despierto temprano para hacer ejercicio.',
        exampleEnglish: 'Normally I wake up early to exercise.',
        pronunciationTip: 'Notice the reflexive pronoun "me" before the verb "despierto".',
        difficulty: 2
      },
      {
        id: 'u5-2',
        spanish: 'Luego me ducho y desayuno café con tostadas',
        english: 'Then I take a shower and have breakfast of coffee with toast',
        phonetic: 'LWEH-goh meh DOO-choh ee deh-sah-YOO-noh kah-FEH kohn tohs-TAH-dhahs',
        category: 'Routine',
        level: 'A2',
        exampleSpanish: 'Me ducho rápido porque tengo prisa.',
        exampleEnglish: 'I take a quick shower because I am in a hurry.',
        pronunciationTip: '"Desayuno" has the "y" pronounced cleanly like "yoo".',
        difficulty: 3
      },
      {
        id: 'u5-3',
        spanish: 'Hoy me siento muy contento y motivado',
        english: 'Today I feel very happy and motivated',
        phonetic: 'oy meh SYEHN-toh moo-ee kohn-TEHN-toh ee moh-tee-VAH-dhoh',
        category: 'Emotions',
        level: 'A2',
        exampleSpanish: '¡Qué gran día! Hoy me siento muy contento.',
        exampleEnglish: 'What a great day! Today I feel very happy.',
        pronunciationTip: '"Muy" rhymes with the English word "gooey" but spoken as a tight single diphthong.',
        difficulty: 2
      },
      {
        id: 'u5-4',
        spanish: 'Tengo mucho sueño y estoy un poco cansado',
        english: 'I am very sleepy and I am a bit tired',
        phonetic: 'TEHN-goh MOO-choh SWEH-nyoh ee ehs-TOY oon POH-koh kahn-SAH-dhoh',
        category: 'Emotions',
        level: 'A2',
        exampleSpanish: 'Después del trabajo siempre tengo sueño.',
        exampleEnglish: 'After work I am always sleepy.',
        pronunciationTip: 'In Spanish you "have" sleepiness (tener sueño) rather than "are sleepy".',
        difficulty: 2
      },
      {
        id: 'u5-5',
        spanish: 'Me encanta escuchar música mientras cocino',
        english: 'I love listening to music while I cook',
        phonetic: 'meh ehn-KAHN-tah ehs-koo-CHAHR MOO-see-kah MYEHN-trahs koh-SEE-noh',
        category: 'Hobbies',
        level: 'A2',
        exampleSpanish: 'Me encanta escuchar música latina los fines de semana.',
        exampleEnglish: 'I love listening to Latin music on weekends.',
        pronunciationTip: '"Música" has stress on the first syllable due to the written accent.',
        difficulty: 3
      }
    ]
  },
  {
    id: 'unit-6',
    title: 'Contando el Pasado',
    subtitle: 'Past Stories: Pretérito vs Imperfecto',
    level: 'B1',
    iconName: 'BookOpen',
    color: 'from-indigo-500 to-blue-600',
    description: 'Transition to intermediate! Share past memories, vacation stories, and past events.',
    items: [
      {
        id: 'u6-1',
        spanish: 'Ayer fui al mercado y compré fruta fresca',
        english: 'Yesterday I went to the market and bought fresh fruit',
        phonetic: 'ah-YEHR fwee ahl mehr-KAH-dhoh ee kohm-PREH FROO-tah FREHS-kah',
        category: 'Past Actions',
        level: 'B1',
        exampleSpanish: 'Ayer fui al centro comercial con mis amigos.',
        exampleEnglish: 'Yesterday I went to the shopping mall with my friends.',
        pronunciationTip: '"Fui" is the irregular preterite form of both "ir" (to go) and "ser" (to be).',
        difficulty: 3
      },
      {
        id: 'u6-2',
        spanish: 'Cuando era niño, siempre jugaba en el parque',
        english: 'When I was a child, I always used to play in the park',
        phonetic: 'KWAHN-doh EH-rah NEE-nyoh, SYEHM-preh hoo-GAH-bvah ehn ehl PAHR-keh',
        category: 'Past Descriptions',
        level: 'B1',
        exampleSpanish: 'Cuando era pequeño vivía en un pueblo hermoso.',
        exampleEnglish: 'When I was little I lived in a beautiful town.',
        pronunciationTip: '"Jugaba" is the imperfect tense for ongoing habitual past actions.',
        difficulty: 3
      },
      {
        id: 'u6-3',
        spanish: 'El año pasado viajé a España y conocí Madrid',
        english: 'Last year I traveled to Spain and got to know Madrid',
        phonetic: 'ehl AH-nyoh pah-SAH-dhoh vyah-HEH ah ehs-PAH-nyah ee koh-noh-SEE mah-DREED',
        category: 'Past Experiences',
        level: 'B1',
        exampleSpanish: 'El año pasado viajé por toda la costa mediterránea.',
        exampleEnglish: 'Last year I traveled along the entire Mediterranean coast.',
        pronunciationTip: 'End "viajé" with a clear stressed "eh" sound.',
        difficulty: 3
      },
      {
        id: 'u6-4',
        spanish: 'Estaba lloviendo cuando salí de la oficina',
        english: 'It was raining when I left the office',
        phonetic: 'ehs-TAH-bvah yoh-VYEHN-doh KWAHN-doh sah-LEE deh lah oh-fee-SEE-nah',
        category: 'Past Continuous',
        level: 'B1',
        exampleSpanish: 'Estaba lloviendo muy fuerte y no tenía paraguas.',
        exampleEnglish: 'It was raining very heavily and I didn\'t have an umbrella.',
        pronunciationTip: 'Notice the contrast: ongoing background (estaba lloviendo) interrupted by single action (salí).',
        difficulty: 4
      },
      {
        id: 'u6-5',
        spanish: 'Fue una experiencia inolvidable que nunca olvidaré',
        english: 'It was an unforgettable experience that I will never forget',
        phonetic: 'fweh OO-nah ehks-peh-RYEHN-syah ee-nohl-vee-DHAH-bvleh keh NOON-kah ohl-vee-dhah-REH',
        category: 'Memories',
        level: 'B1',
        exampleSpanish: 'Conocer las montañas fue una experiencia inolvidable.',
        exampleEnglish: 'Seeing the mountains was an unforgettable experience.',
        pronunciationTip: 'Long word "inolvidable": break into syllables in-ol-vi-DA-ble.',
        difficulty: 4
      }
    ]
  },
  {
    id: 'unit-7',
    title: 'Opiniones, Deseos y el Subjuntivo',
    subtitle: 'Expressing Opinions, Hopes & Doubts',
    level: 'B1',
    iconName: 'Sparkles',
    color: 'from-pink-500 to-rose-600',
    description: 'Speak about wishes, hypothetical situations, recommendations, and give nuanced opinions.',
    items: [
      {
        id: 'u7-1',
        spanish: 'Espero que tengas un excelente y productivo día',
        english: 'I hope you have an excellent and productive day',
        phonetic: 'ehs-PEH-roh keh TEHN-gahs oon ehk-seh-LEHN-teh ee proh-dhook-TEE-bvoh DEE-ah',
        category: 'Subjunctive Wishes',
        level: 'B1',
        exampleSpanish: '¡Buen viaje amigo! Espero que disfrutes mucho.',
        exampleEnglish: 'Have a good trip friend! I hope you enjoy it a lot.',
        pronunciationTip: '"Tengas" is subjunctive triggered by the emotional wish "Espero que".',
        difficulty: 4
      },
      {
        id: 'u7-2',
        spanish: 'En mi opinión, es importante aprender varios idiomas',
        english: 'In my opinion, it is important to learn several languages',
        phonetic: 'ehn mee oh-pee-NYOHN, ehs eem-pohr-TAHN-teh ah-prehn-DEHR VAH-ryohs ee-DYOH-mahs',
        category: 'Opinions',
        level: 'B1',
        exampleSpanish: 'En mi opinión, viajar abre la mente a nuevas culturas.',
        exampleEnglish: 'In my opinion, traveling opens the mind to new cultures.',
        pronunciationTip: 'Notice "idioma" is masculine: "el idioma", "los idiomas".',
        difficulty: 3
      },
      {
        id: 'u7-3',
        spanish: 'Ojalá que haga buen tiempo este fin de semana',
        english: 'Hopefully the weather will be nice this weekend',
        phonetic: 'oh-hah-LAH keh AH-gah bwehn TYEHM-poh EHS-teh feen deh seh-MAH-nah',
        category: 'Subjunctive Wishes',
        level: 'B1',
        exampleSpanish: 'Ojalá que podamos ir a la montaña mañana.',
        exampleEnglish: 'Hopefully we can go to the mountain tomorrow.',
        pronunciationTip: '"Ojalá" comes from Arabic and always triggers the subjunctive ("haga").',
        difficulty: 4
      },
      {
        id: 'u7-4',
        spanish: 'Dudo que sea tan fácil como parece',
        english: 'I doubt that it is as easy as it seems',
        phonetic: 'DOO-dhoh keh SEH-ah tahn FAH-seel KOH-moh pah-REH-seh',
        category: 'Doubts',
        level: 'B1',
        exampleSpanish: 'Dudo que el tren llegue a tiempo con esta nieve.',
        exampleEnglish: 'I doubt the train will arrive on time with this snow.',
        pronunciationTip: 'Doubt triggers subjunctive: "Dudo que sea" (instead of "es").',
        difficulty: 4
      },
      {
        id: 'u7-5',
        spanish: 'Te sugiero que practiques hablar todos los días',
        english: 'I suggest that you practice speaking every day',
        phonetic: 'teh soo-HYEH-roh keh prahk-TEE-kehs ah-BLAHR TOH-dhohs lohs DEE-ahs',
        category: 'Suggestions',
        level: 'B1',
        exampleSpanish: 'Para tener fluidez, te sugiero que hables en voz alta.',
        exampleEnglish: 'To achieve fluency, I suggest that you speak out loud.',
        pronunciationTip: 'Subjunctive form "practiques" changes "c" to "qu" to preserve the "k" sound.',
        difficulty: 4
      }
    ]
  },
  {
    id: 'unit-8',
    title: 'Fluidez Total y Modismos',
    subtitle: 'Native Idioms, Slang & Fluent Conversations',
    level: 'B2',
    iconName: 'Flame',
    color: 'from-red-500 to-amber-500',
    description: 'Reach native-level fluency with Spanish idioms, natural speech rhythms, and cultural expressions.',
    items: [
      {
        id: 'u8-1',
        spanish: '¡No pasa nada, todo tiene solución!',
        english: 'No worries / It\'s okay, everything has a solution!',
        phonetic: 'noh PAH-sah NAH-dhah, TOH-dhoh TYEH-neh soh-loo-SYOHN',
        category: 'Idioms',
        level: 'B2',
        exampleSpanish: 'Si llegas tarde no pasa nada, te esperamos.',
        exampleEnglish: 'If you arrive late no worries, we will wait for you.',
        pronunciationTip: '"No pasa nada" is one of the most widely used colloquial phrases in Spain.',
        difficulty: 3
      },
      {
        id: 'u8-2',
        spanish: 'Tienes que ponerte las pilas para aprobar el examen',
        english: 'You have to get your act together to pass the exam',
        phonetic: 'TYEH-nehs keh poh-NEHR-teh lahs PEE-lahs PAH-rah ah-proh-BAHR ehl ehk-SAH-mehn',
        category: 'Idioms',
        level: 'B2',
        exampleSpanish: 'Hay mucho trabajo hoy, ¡vamos a ponernos las pilas!',
        exampleEnglish: 'There is a lot of work today, let\'s get energized and focused!',
        pronunciationTip: 'Idiom: "ponerse las pilas" literally means "to put your batteries in".',
        difficulty: 4
      },
      {
        id: 'u8-3',
        spanish: '¿Me estás tomando el pelo o me estás diciendo la verdad?',
        english: 'Are you pulling my leg or telling me the truth?',
        phonetic: 'meh ehs-TAHS toh-MAHN-doh ehl PEH-loh oh meh ehs-TAHS dee-SYEHN-doh lah vehr-DHAHD',
        category: 'Idioms',
        level: 'B2',
        exampleSpanish: 'No te creo nada, ¡me estás tomando el pelo!',
        exampleEnglish: 'I don\'t believe you at all, you are pulling my leg!',
        pronunciationTip: '"Tomar el pelo" = literally "to take the hair", equivalent to "pulling one\'s leg".',
        difficulty: 5
      },
      {
        id: 'u8-4',
        spanish: 'Si necesitas ayuda con la mudanza, cuenta conmigo',
        english: 'If you need help moving, you can count on me',
        phonetic: 'see neh-seh-SEE-tahs ah-YOO-dhah kohn lah moo-DHAHN-sah, KWEHN-tah kohn-MEE-goh',
        category: 'Friendship & Support',
        level: 'B2',
        exampleSpanish: 'Cualquier cosa que pase, siempre puedes contar conmigo.',
        exampleEnglish: 'Whatever happens, you can always count on me.',
        pronunciationTip: '"Conmigo" is a single word meaning "with me" (never say "con yo").',
        difficulty: 4
      },
      {
        id: 'u8-5',
        spanish: 'Ese proyecto me costó un ojo de la cara pero valió la pena',
        english: 'That project cost me an arm and a leg but was worth it',
        phonetic: 'EH-seh proh-YEHK-toh meh kohs-TOH oon OH-hoh deh lah KAH-rah PEH-roh vah-LYOH lah PEH-nah',
        category: 'Idioms',
        level: 'B2',
        exampleSpanish: 'Comprar ese coche nuevo me costó un ojo de la cara.',
        exampleEnglish: 'Buying that new car cost me an arm and a leg (literally "an eye of the face").',
        pronunciationTip: 'Colloquial idiom: "costar un ojo de la cara" = very expensive.',
        difficulty: 5
      }
    ]
  }
];

export const SPANISH_UNITS: LearningUnit[] = [...BASE_SPANISH_UNITS, ...CINEMA_UNITS];

export const ALL_SPANISH_WORDS: SpanishWordPhrase[] = SPANISH_UNITS.flatMap(u => u.items);
