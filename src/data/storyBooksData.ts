export interface StoryWordDetail {
  word: string;
  cleanWord: string;
  meaning: string;
  partOfSpeech: string;
  phonetic: string;
  note?: string;
}

export interface StorySentence {
  id: string;
  spanish: string;
  english: string;
  phonetic: string;
  vocab: StoryWordDetail[];
}

export interface StoryParagraph {
  id: string;
  paragraphIndex: number;
  sentences: StorySentence[];
}

export interface StoryQuizQuestion {
  id: string;
  question: string;
  questionSpanish: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface SpanishStory {
  id: string;
  title: string;
  titleEnglish: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  levelBadge: string;
  genre: string;
  coverEmoji: string;
  accent: 'es-ES' | 'es-MX';
  country: string;
  readTimeMinutes: number;
  synopsis: string;
  themeColor: string;
  paragraphs: StoryParagraph[];
  comprehensionQuiz: StoryQuizQuestion[];
}

export const SPANISH_STORIES: SpanishStory[] = [
  {
    id: 'story-perro-magico',
    title: 'El Perro Mágico de Barcelona',
    titleEnglish: 'The Magical Dog of Barcelona',
    level: 'A1',
    levelBadge: 'A1 · Beginner Friendly',
    genre: 'Charming Adventure',
    coverEmoji: '🐕🎨',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 3,
    synopsis: 'A friendly golden dog named Mateo wanders through Park Güell and makes a special friend who loves warm churros.',
    themeColor: 'from-amber-500/20 to-sky-500/20 border-amber-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-1-1',
            spanish: 'Mateo es un perro pequeño con ojos grandes y curiosos.',
            english: 'Mateo is a small dog with big and curious eyes.',
            phonetic: 'mah-TEH-oh ehs oon PEH-rroh peh-KEH-nyoh kohn OH-hohs GRAHN-dehs ee koo-RYOH-sohs.',
            vocab: [
              { word: 'Mateo', cleanWord: 'mateo', meaning: 'Mateo (name)', partOfSpeech: 'Proper Noun', phonetic: 'mah-TEH-oh' },
              { word: 'es', cleanWord: 'es', meaning: 'is (from ser)', partOfSpeech: 'Verb', phonetic: 'ehs', note: 'Permanent characteristic' },
              { word: 'un', cleanWord: 'un', meaning: 'a / an (masculine)', partOfSpeech: 'Article', phonetic: 'oon' },
              { word: 'perro', cleanWord: 'perro', meaning: 'dog', partOfSpeech: 'Noun (m)', phonetic: 'PEH-rroh', note: 'Roll the double "rr"!' },
              { word: 'pequeño', cleanWord: 'pequeno', meaning: 'small / little', partOfSpeech: 'Adjective', phonetic: 'peh-KEH-nyoh' },
              { word: 'con', cleanWord: 'con', meaning: 'with', partOfSpeech: 'Preposition', phonetic: 'kohn' },
              { word: 'ojos', cleanWord: 'ojos', meaning: 'eyes', partOfSpeech: 'Noun (m pl)', phonetic: 'OH-hohs', note: '"j" sounds like English "h"' },
              { word: 'grandes', cleanWord: 'grandes', meaning: 'big / large (plural)', partOfSpeech: 'Adjective', phonetic: 'GRAHN-dehs' },
              { word: 'y', cleanWord: 'y', meaning: 'and', partOfSpeech: 'Conjunction', phonetic: 'ee' },
              { word: 'curiosos', cleanWord: 'curiosos', meaning: 'curious (plural)', partOfSpeech: 'Adjective', phonetic: 'koo-RYOH-sohs' }
            ]
          },
          {
            id: 's-1-2',
            spanish: 'Todos los días, camina por las calles hermosas de Barcelona.',
            english: 'Every day, he walks through the beautiful streets of Barcelona.',
            phonetic: 'TOH-dohs lohs DEE-ahs, kah-MEE-nah pohr lahs KAH-lyehs ehr-MOH-sahs deh bahr-seh-LOH-nah.',
            vocab: [
              { word: 'Todos los días', cleanWord: 'todos los dias', meaning: 'Every day / daily', partOfSpeech: 'Idiom', phonetic: 'TOH-dohs lohs DEE-ahs' },
              { word: 'camina', cleanWord: 'camina', meaning: 'walks (caminar)', partOfSpeech: 'Verb', phonetic: 'kah-MEE-nah' },
              { word: 'por', cleanWord: 'por', meaning: 'through / by', partOfSpeech: 'Preposition', phonetic: 'pohr' },
              { word: 'las calles', cleanWord: 'las calles', meaning: 'the streets', partOfSpeech: 'Noun phrase', phonetic: 'lahs KAH-lyehs' },
              { word: 'hermosas', cleanWord: 'hermosas', meaning: 'beautiful (feminine plural)', partOfSpeech: 'Adjective', phonetic: 'ehr-MOH-sahs', note: 'Silent "h"' },
              { word: 'de', cleanWord: 'de', meaning: 'of / from', partOfSpeech: 'Preposition', phonetic: 'deh' },
              { word: 'Barcelona', cleanWord: 'barcelona', meaning: 'Barcelona', partOfSpeech: 'Proper Noun', phonetic: 'bahr-seh-LOH-nah' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-2-1',
            spanish: 'Una mañana de sol, Mateo llega al famoso Park Güell.',
            english: 'One sunny morning, Mateo arrives at the famous Park Güell.',
            phonetic: 'OO-nah mah-NYAH-nah deh sohl, mah-TEH-oh YEH-gah ahl fah-MOH-soh pahrk gwehl.',
            vocab: [
              { word: 'Una mañana', cleanWord: 'una manana', meaning: 'A morning', partOfSpeech: 'Noun phrase', phonetic: 'OO-nah mah-NYAH-nah' },
              { word: 'de sol', cleanWord: 'de sol', meaning: 'sunny (of sun)', partOfSpeech: 'Phrase', phonetic: 'deh sohl' },
              { word: 'llega', cleanWord: 'llega', meaning: 'arrives (llegar)', partOfSpeech: 'Verb', phonetic: 'YEH-gah' },
              { word: 'al', cleanWord: 'al', meaning: 'to the (a + el)', partOfSpeech: 'Contraction', phonetic: 'ahl' },
              { word: 'famoso', cleanWord: 'famoso', meaning: 'famous', partOfSpeech: 'Adjective', phonetic: 'fah-MOH-soh' }
            ]
          },
          {
            id: 's-2-2',
            spanish: 'Allí ve un dragón de colores brillantes que parece sonreír.',
            english: 'There he sees a brightly colored dragon that seems to smile.',
            phonetic: 'ah-YEE veh oon drah-GOHN deh koh-LOH-rehs bree-YAHN-tehs keh pah-REH-seh sohn-reh-EER.',
            vocab: [
              { word: 'Allí', cleanWord: 'alli', meaning: 'There', partOfSpeech: 'Adverb', phonetic: 'ah-YEE' },
              { word: 've', cleanWord: 've', meaning: 'sees (ver)', partOfSpeech: 'Verb', phonetic: 'veh' },
              { word: 'un dragón', cleanWord: 'un dragon', meaning: 'a dragon', partOfSpeech: 'Noun (m)', phonetic: 'oon drah-GOHN', note: "Gaudí's iconic mosaic salamander!" },
              { word: 'colores brillantes', cleanWord: 'colores brillantes', meaning: 'bright colors', partOfSpeech: 'Noun phrase', phonetic: 'koh-LOH-rehs bree-YAHN-tehs' },
              { word: 'parece', cleanWord: 'parece', meaning: 'seems / appears (parecer)', partOfSpeech: 'Verb', phonetic: 'pah-REH-seh' },
              { word: 'sonreír', cleanWord: 'sonreir', meaning: 'to smile', partOfSpeech: 'Infinitive Verb', phonetic: 'sohn-reh-EER' }
            ]
          }
        ]
      },
      {
        id: 'p-3',
        paragraphIndex: 3,
        sentences: [
          {
            id: 's-3-1',
            spanish: 'Una niña llamada Sofía come churros con chocolate caliente.',
            english: 'A girl named Sofía eats churros with hot chocolate.',
            phonetic: 'OO-nah NEE-nyah yah-MAH-dah soh-FEE-ah KOH-meh CHOO-rrohs kohn choh-koh-LAH-teh kah-LYEHN-teh.',
            vocab: [
              { word: 'Una niña', cleanWord: 'una nina', meaning: 'A girl / child', partOfSpeech: 'Noun (f)', phonetic: 'OO-nah NEE-nyah' },
              { word: 'llamada', cleanWord: 'llamada', meaning: 'named / called', partOfSpeech: 'Participle', phonetic: 'yah-MAH-dah' },
              { word: 'come', cleanWord: 'come', meaning: 'eats (comer)', partOfSpeech: 'Verb', phonetic: 'KOH-meh' },
              { word: 'churros', cleanWord: 'churros', meaning: 'churros (pastry)', partOfSpeech: 'Noun (m pl)', phonetic: 'CHOO-rrohs' },
              { word: 'chocolate caliente', cleanWord: 'chocolate caliente', meaning: 'hot chocolate', partOfSpeech: 'Noun phrase', phonetic: 'choh-koh-LAH-teh kah-LYEHN-teh' }
            ]
          },
          {
            id: 's-3-2',
            spanish: 'Sofía sonríe y dice: "¡Hola perrito, quieres ser mi amigo?"',
            english: 'Sofía smiles and says: "Hello little dog, do you want to be my friend?"',
            phonetic: 'soh-FEE-ah sohn-REE-eh ee DEE-seh: oh-lah peh-RREE-toh, KYEH-rehs sehr mee ah-MEE-goh?',
            vocab: [
              { word: 'sonríe', cleanWord: 'sonrie', meaning: 'smiles (sonreír)', partOfSpeech: 'Verb', phonetic: 'sohn-REE-eh' },
              { word: 'dice', cleanWord: 'dice', meaning: 'says (decir)', partOfSpeech: 'Verb', phonetic: 'DEE-seh' },
              { word: 'perrito', cleanWord: 'perrito', meaning: 'little dog / puppy', partOfSpeech: 'Diminutive noun', phonetic: 'peh-RREE-toh', note: '-ito suffix adds affection' },
              { word: 'quieres', cleanWord: 'quieres', meaning: 'you want (querer)', partOfSpeech: 'Verb', phonetic: 'KYEH-rehs' },
              { word: 'ser', cleanWord: 'ser', meaning: 'to be', partOfSpeech: 'Infinitive Verb', phonetic: 'sehr' },
              { word: 'mi amigo', cleanWord: 'mi amigo', meaning: 'my friend', partOfSpeech: 'Noun phrase', phonetic: 'mee ah-MEE-goh' }
            ]
          },
          {
            id: 's-3-3',
            spanish: 'Mateo mueve la cola feliz. ¡Hoy es el mejor día de su vida!',
            english: 'Mateo wags his tail happily. Today is the best day of his life!',
            phonetic: 'mah-TEH-oh MWEH-veh lah KOH-lah feh-LEES. oy ehs ehl meh-HOHR DEE-ah deh soo VEE-dah!',
            vocab: [
              { word: 'mueve', cleanWord: 'mueve', meaning: 'moves / wags (mover)', partOfSpeech: 'Verb', phonetic: 'MWEH-veh' },
              { word: 'la cola', cleanWord: 'la cola', meaning: 'the tail', partOfSpeech: 'Noun (f)', phonetic: 'lah KOH-lah' },
              { word: 'feliz', cleanWord: 'feliz', meaning: 'happy', partOfSpeech: 'Adjective', phonetic: 'feh-LEES' },
              { word: 'Hoy', cleanWord: 'hoy', meaning: 'Today', partOfSpeech: 'Adverb', phonetic: 'oy', note: 'Silent "h"' },
              { word: 'el mejor día', cleanWord: 'el mejor dia', meaning: 'the best day', partOfSpeech: 'Phrase', phonetic: 'ehl meh-HOHR DEE-ah' },
              { word: 'de su vida', cleanWord: 'de su vida', meaning: 'of his life', partOfSpeech: 'Phrase', phonetic: 'deh soo VEE-dah' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q-1',
        question: 'Where does Mateo arrive on a sunny morning?',
        questionSpanish: '¿A dónde llega Mateo una mañana de sol?',
        options: ['Al Park Güell', 'A la playa', 'Al aeropuerto', 'A la escuela'],
        correctIndex: 0,
        explanation: 'Mateo arrives at the famous Park Güell in Barcelona.'
      },
      {
        id: 'q-2',
        question: 'What is Sofía eating in the park?',
        questionSpanish: '¿Qué come Sofía en el parque?',
        options: ['Manzanas verdes', 'Churros con chocolate', 'Pizza italiana', 'Paella de mariscos'],
        correctIndex: 1,
        explanation: 'Sofía is eating delicious churros with hot chocolate!'
      },
      {
        id: 'q-3',
        question: 'What does Mateo do when Sofía speaks to him?',
        questionSpanish: '¿Qué hace Mateo cuando Sofía le habla?',
        options: ['Duerme profundamente', 'Corre lejos', 'Mueve la cola feliz', 'Come una manzana'],
        correctIndex: 2,
        explanation: 'Mateo wags his tail happily (mueve la cola feliz).'
      }
    ]
  },
  {
    id: 'story-cafe-madrid',
    title: 'El Secreto del Café con Leche',
    titleEnglish: 'The Secret of the Café con Leche',
    level: 'A2',
    levelBadge: 'A2 · Daily Spanish',
    genre: 'Mystery & Culture',
    coverEmoji: '☕🥐',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 4,
    synopsis: 'Lucía finds a mysterious handwritten recipe note left behind in a lively 100-year-old café in Madrid.',
    themeColor: 'from-amber-600/20 to-orange-500/20 border-amber-600/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-1-1',
            spanish: 'Son las ocho de la mañana en la Plaza Mayor de Madrid.',
            english: 'It is eight o’clock in the morning in the Plaza Mayor of Madrid.',
            phonetic: 'sohn lahs OH-choh deh lah mah-NYAH-nah ehn lah PLAH-sah mah-YOHR deh mah-DREED.',
            vocab: [
              { word: 'Son las ocho', cleanWord: 'son las ocho', meaning: "It is eight o'clock", partOfSpeech: 'Time Phrase', phonetic: 'sohn lahs OH-choh' },
              { word: 'de la mañana', cleanWord: 'de la manana', meaning: 'in the morning (AM)', partOfSpeech: 'Phrase', phonetic: 'deh lah mah-NYAH-nah' },
              { word: 'en', cleanWord: 'en', meaning: 'in / at', partOfSpeech: 'Preposition', phonetic: 'ehn' },
              { word: 'la Plaza Mayor', cleanWord: 'la plaza mayor', meaning: 'the Main Square', partOfSpeech: 'Proper Noun', phonetic: 'lah PLAH-sah mah-YOHR' }
            ]
          },
          {
            id: 's-1-2',
            spanish: 'El aroma a café recién tostado llena el aire frío del otoño.',
            english: 'The aroma of freshly roasted coffee fills the cool autumn air.',
            phonetic: 'ehl ah-ROH-mah ah kah-FEH rreh-SYEHN tohs-TAH-doh YEH-nah ehl EYE-reh FREE-oh dehl oh-TOH-nyoh.',
            vocab: [
              { word: 'aroma', cleanWord: 'aroma', meaning: 'aroma / scent', partOfSpeech: 'Noun (m)', phonetic: 'ah-ROH-mah', note: 'Masculine Greek origin: el aroma' },
              { word: 'recién tostado', cleanWord: 'recien tostado', meaning: 'freshly roasted', partOfSpeech: 'Adjective phrase', phonetic: 'rreh-SYEHN tohs-TAH-doh' },
              { word: 'llena', cleanWord: 'llena', meaning: 'fills (llenar)', partOfSpeech: 'Verb', phonetic: 'YEH-nah' },
              { word: 'aire frío', cleanWord: 'aire frio', meaning: 'cold / cool air', partOfSpeech: 'Noun phrase', phonetic: 'EYE-reh FREE-oh' },
              { word: 'otoño', cleanWord: 'otono', meaning: 'autumn / fall', partOfSpeech: 'Noun (m)', phonetic: 'oh-TOH-nyoh' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-2-1',
            spanish: 'Lucía se sienta en su rincón favorito junto a la ventana grande.',
            english: 'Lucía sits in her favorite corner next to the big window.',
            phonetic: 'loo-SEE-ah seh SYEHN-tah ehn soo reen-KOHN fah-voh-REE-toh HOON-toh ah lah vehn-TAH-nah GRAHN-deh.',
            vocab: [
              { word: 'se sienta', cleanWord: 'se sienta', meaning: 'sits down (sentarse)', partOfSpeech: 'Reflexive Verb', phonetic: 'seh SYEHN-tah' },
              { word: 'rincón favorito', cleanWord: 'rincon favorito', meaning: 'favorite corner', partOfSpeech: 'Noun phrase', phonetic: 'reen-KOHN fah-voh-REE-toh' },
              { word: 'junto a', cleanWord: 'junto a', meaning: 'next to / beside', partOfSpeech: 'Prepositional phrase', phonetic: 'HOON-toh ah' },
              { word: 'ventana', cleanWord: 'ventana', meaning: 'window', partOfSpeech: 'Noun (f)', phonetic: 'vehn-TAH-nah' }
            ]
          },
          {
            id: 's-2-2',
            spanish: 'Bajo su taza de cerámica, descubre una pequeña nota de papel antiguo.',
            english: 'Underneath her ceramic cup, she discovers a small note of vintage paper.',
            phonetic: 'BAH-hoh soo TAH-sah deh seh-RAH-mee-kah, dehs-KOO-breh OO-nah peh-KEH-nyah NOH-tah deh pah-PEHL ahn-TEE-gwoh.',
            vocab: [
              { word: 'Bajo', cleanWord: 'bajo', meaning: 'Under / underneath', partOfSpeech: 'Preposition', phonetic: 'BAH-hoh' },
              { word: 'taza', cleanWord: 'taza', meaning: 'cup / mug', partOfSpeech: 'Noun (f)', phonetic: 'TAH-sah' },
              { word: 'descubre', cleanWord: 'descubre', meaning: 'discovers (descubrir)', partOfSpeech: 'Verb', phonetic: 'dehs-KOO-breh' },
              { word: 'papel antiguo', cleanWord: 'papel antiguo', meaning: 'old / vintage paper', partOfSpeech: 'Noun phrase', phonetic: 'pah-PEHL ahn-TEE-gwoh' }
            ]
          }
        ]
      },
      {
        id: 'p-3',
        paragraphIndex: 3,
        sentences: [
          {
            id: 's-3-1',
            spanish: 'La nota dice: "El verdadero secreto no es el café, sino la compañía con quien lo compartes."',
            english: 'The note says: "The real secret is not the coffee, but the company you share it with."',
            phonetic: 'lah NOH-tah DEE-seh: ehl vehr-dah-DEH-roh seh-KREH-toh noh ehs ehl kah-FEH, SEE-noh lah kohm-pah-NYEE-ah kohn kyehn loh kohm-PAHR-tehs.',
            vocab: [
              { word: 'verdadero', cleanWord: 'verdadero', meaning: 'true / real', partOfSpeech: 'Adjective', phonetic: 'vehr-dah-DEH-roh' },
              { word: 'secreto', cleanWord: 'secreto', meaning: 'secret', partOfSpeech: 'Noun (m)', phonetic: 'seh-KREH-toh' },
              { word: 'sino', cleanWord: 'sino', meaning: 'but rather', partOfSpeech: 'Conjunction', phonetic: 'SEE-noh', note: 'Used after negative clause ("no es X, sino Y")' },
              { word: 'compañía', cleanWord: 'compania', meaning: 'company', partOfSpeech: 'Noun (f)', phonetic: 'kohm-pah-NYEE-ah' },
              { word: 'compartes', cleanWord: 'compartes', meaning: 'you share (compartir)', partOfSpeech: 'Verb', phonetic: 'kohm-PAHR-tehs' }
            ]
          },
          {
            id: 's-3-2',
            spanish: 'En ese momento, su mejor amiga entra por la puerta con una gran sonrisa.',
            english: 'At that moment, her best friend walks through the door with a big smile.',
            phonetic: 'ehn EH-seh moh-MEHN-toh, soo meh-HOHR ah-MEE-gah EHN-trah pohr lah PWEHR-tah kohn OO-nah grahn sohn-REE-sah.',
            vocab: [
              { word: 'En ese momento', cleanWord: 'en ese momento', meaning: 'At that moment', partOfSpeech: 'Idiom', phonetic: 'ehn EH-seh moh-MEHN-toh' },
              { word: 'mejor amiga', cleanWord: 'mejor amiga', meaning: 'best friend (female)', partOfSpeech: 'Noun phrase', phonetic: 'meh-HOHR ah-MEE-gah' },
              { word: 'entra', cleanWord: 'entra', meaning: 'enters / walks in', partOfSpeech: 'Verb', phonetic: 'EHN-trah' },
              { word: 'puerta', cleanWord: 'puerta', meaning: 'door', partOfSpeech: 'Noun (f)', phonetic: 'PWEHR-tah' },
              { word: 'gran sonrisa', cleanWord: 'gran sonrisa', meaning: 'big smile', partOfSpeech: 'Noun phrase', phonetic: 'grahn sohn-REE-sah' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q-1',
        question: 'Where is Lucía seated in the café?',
        questionSpanish: '¿Dónde está sentada Lucía en el café?',
        options: ['Junto a la ventana grande', 'Cerca de la cocina', 'En la terraza exterior', 'En el tejado'],
        correctIndex: 0,
        explanation: 'Lucía sits in her favorite corner next to the big window (junto a la ventana grande).'
      },
      {
        id: 'q-2',
        question: 'What did the secret note reveal?',
        questionSpanish: '¿Qué decía la nota secreta?',
        options: [
          'El secreto es el azúcar moreno',
          'El secreto es la compañía con quien lo compartes',
          'El café cuesta tres euros',
          'El café está cerrado mañana'
        ],
        correctIndex: 1,
        explanation: 'The note says that the true secret is the company you share it with!'
      }
    ]
  },
  {
    id: 'story-guitarra-luna',
    title: 'La Guitarra que Cantaba con la Luna',
    titleEnglish: 'The Guitar That Sang with the Moon',
    level: 'A2',
    levelBadge: 'A2 · Folk Legend',
    genre: 'Folklore & Music',
    coverEmoji: '🎸🌙',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 4,
    synopsis: 'In an old Andalusian village, a young luthier creates a flamenco guitar made from an olive tree that only sings under moonlight.',
    themeColor: 'from-purple-500/20 to-pink-500/20 border-purple-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-1-1',
            spanish: 'En un pequeño pueblo blanco de Andalucía vivía Manuel, un joven músico apasionado.',
            english: 'In a small white village of Andalusia lived Manuel, a passionate young musician.',
            phonetic: 'ehn oon peh-KEH-nyoh PWEH-bloh BLAHN-koh deh ahn-dah-loo-SEE-ah vee-VEE-ah mah-NWEHL, oon HOH-vehn MOO-see-koh ah-pah-syoh-NAH-doh.',
            vocab: [
              { word: 'pueblo blanco', cleanWord: 'pueblo blanco', meaning: 'white village', partOfSpeech: 'Noun phrase', phonetic: 'PWEH-bloh BLAHN-koh', note: 'Famous whitewashed towns in southern Spain' },
              { word: 'vivía', cleanWord: 'vivia', meaning: 'lived (imperfect of vivir)', partOfSpeech: 'Verb', phonetic: 'vee-VEE-ah' },
              { word: 'joven', cleanWord: 'joven', meaning: 'young / young person', partOfSpeech: 'Adjective/Noun', phonetic: 'HOH-vehn' },
              { word: 'apasionado', cleanWord: 'apasionado', meaning: 'passionate', partOfSpeech: 'Adjective', phonetic: 'ah-pah-syoh-NAH-doh' }
            ]
          },
          {
            id: 's-1-2',
            spanish: 'Manuel soñaba con crear una guitarra con un sonido único y mágico.',
            english: 'Manuel dreamed of creating a guitar with a unique and magical sound.',
            phonetic: 'mah-NWEHL soh-NYAH-bah kohn kreh-AHR OO-nah gee-TAH-rrah kohn oon soh-NEE-doh OO-nee-koh ee MAH-hee-koh.',
            vocab: [
              { word: 'soñaba con', cleanWord: 'sonaba con', meaning: 'dreamed of (soñar con)', partOfSpeech: 'Verb phrase', phonetic: 'soh-NYAH-bah kohn' },
              { word: 'crear', cleanWord: 'crear', meaning: 'to create', partOfSpeech: 'Infinitive Verb', phonetic: 'kreh-AHR' },
              { word: 'guitarra', cleanWord: 'guitarra', meaning: 'guitar', partOfSpeech: 'Noun (f)', phonetic: 'gee-TAH-rrah' },
              { word: 'sonido único', cleanWord: 'sonido unico', meaning: 'unique sound', partOfSpeech: 'Noun phrase', phonetic: 'soh-NEE-doh OO-nee-koh' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-2-1',
            spanish: 'Usó la madera de un olivo centenario que crecía en la cima de la colina.',
            english: 'He used the wood of a centenary olive tree that grew on top of the hill.',
            phonetic: 'oo-SOH lah mah-DEH-rah deh oon oh-LEE-voh sehn-teh-NAH-ryoh keh kreh-SEE-ah ehn lah SEE-mah deh lah koh-LEE-nah.',
            vocab: [
              { word: 'Usó', cleanWord: 'uso', meaning: 'Used (preterite of usar)', partOfSpeech: 'Verb', phonetic: 'oo-SOH' },
              { word: 'madera', cleanWord: 'madera', meaning: 'wood / timber', partOfSpeech: 'Noun (f)', phonetic: 'mah-DEH-rah' },
              { word: 'olivo centenario', cleanWord: 'olivo centenario', meaning: 'century-old olive tree', partOfSpeech: 'Noun phrase', phonetic: 'oh-LEE-voh sehn-teh-NAH-ryoh' },
              { word: 'cima', cleanWord: 'cima', meaning: 'top / summit', partOfSpeech: 'Noun (f)', phonetic: 'SEE-mah' }
            ]
          },
          {
            id: 's-2-2',
            spanish: 'Cuando la luna llena iluminó el valle, las cuerdas tocaron una melodía hermosa sin que nadie las tocara.',
            english: 'When the full moon illuminated the valley, the strings played a beautiful melody without anyone touching them.',
            phonetic: 'KWAHN-doh lah LOO-nah YEH-nah ee-loo-mee-NOH ehl VAH-lyeh, lahs KWEHR-dahs toh-KAH-rohn OO-nah meh-loh-DEE-ah ehr-MOH-sah seen keh NAH-dyeh lahs toh-KAH-rah.',
            vocab: [
              { word: 'luna llena', cleanWord: 'luna llena', meaning: 'full moon', partOfSpeech: 'Noun phrase', phonetic: 'LOO-nah YEH-nah' },
              { word: 'iluminó', cleanWord: 'ilumino', meaning: 'illuminated (iluminar)', partOfSpeech: 'Verb', phonetic: 'ee-loo-mee-NOH' },
              { word: 'valle', cleanWord: 'valle', meaning: 'valley', partOfSpeech: 'Noun (m)', phonetic: 'VAH-lyeh' },
              { word: 'cuerdas', cleanWord: 'cuerdas', meaning: 'strings', partOfSpeech: 'Noun (f pl)', phonetic: 'KWEHR-dahs' },
              { word: 'sin que nadie', cleanWord: 'sin que nadie', meaning: 'without anyone (triggers subjunctive)', partOfSpeech: 'Conjunctive phrase', phonetic: 'seen keh NAH-dyeh' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q-1',
        question: 'What wood did Manuel use to craft the guitar?',
        questionSpanish: '¿Qué madera utilizó Manuel para construir la guitarra?',
        options: ['Madera de pino', 'Madera de un olivo centenario', 'Madera de roble', 'Bambú'],
        correctIndex: 1,
        explanation: 'Manuel used wood from a century-old olive tree (un olivo centenario).'
      },
      {
        id: 'q-2',
        question: 'When did the guitar play its magical melody?',
        questionSpanish: '¿Cuándo tocó la guitarra su melodía mágica?',
        options: ['Bajo el sol de mediodía', 'Durante una tormenta', 'Cuando la luna llena iluminó el valle', 'Al amanecer'],
        correctIndex: 2,
        explanation: 'The guitar played when the full moon lit up the valley (la luna llena).'
      }
    ]
  },
  {
    id: 'story-misterio-alhambra',
    title: 'El Misterio de la Alhambra',
    titleEnglish: 'The Mystery of the Alhambra',
    level: 'B1',
    levelBadge: 'B1 · Intermediate Mystery',
    genre: 'Historical Thriller',
    coverEmoji: '🏰🗝️',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 5,
    synopsis: 'An archaeology student in Granada discovers a hidden key behind an ancient Moorish tile in the Court of the Lions.',
    themeColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-1-1',
            spanish: 'La Alhambra de Granada guardaba secretos que ni los historiadores más sabios habían podido descifrar.',
            english: 'The Alhambra of Granada held secrets that even the wisest historians had not been able to decipher.',
            phonetic: 'lah ahl-AHM-brah deh grah-NAH-dah gwahr-DAH-bah seh-KREH-tohs keh nee lohs ees-toh-ryah-DOH-rehs mahs SAH-byohs ah-BEE-ahn poh-DEE-doh dehs-see-FRAHR.',
            vocab: [
              { word: 'guardaba', cleanWord: 'guardaba', meaning: 'kept / held (guardar)', partOfSpeech: 'Verb', phonetic: 'gwahr-DAH-bah' },
              { word: 'sabios', cleanWord: 'sabios', meaning: 'wise (plural)', partOfSpeech: 'Adjective', phonetic: 'SAH-byohs' },
              { word: 'habían podido', cleanWord: 'habian podido', meaning: 'had been able to (past perfect)', partOfSpeech: 'Compound Verb', phonetic: 'ah-BEE-ahn poh-DEE-doh' },
              { word: 'descifrar', cleanWord: 'descifrar', meaning: 'to decipher / decode', partOfSpeech: 'Infinitive Verb', phonetic: 'dehs-see-FRAHR' }
            ]
          },
          {
            id: 's-1-2',
            spanish: 'Elena, una joven restauradora de arte, examinaba cuidadosamente los mosaicos del Patio de los Leones.',
            english: 'Elena, a young art restorer, was carefully examining the mosaics in the Court of the Lions.',
            phonetic: 'eh-LEH-nah, OO-nah HOH-vehn rehs-tow-rah-DOH-rah deh AHR-teh, ehk-sah-mee-NAH-bah kwee-dah-doh-sah-MEHN-teh lohs moh-SAH-ee-kohs dehl PAH-tyoh deh lohs leh-OH-nehs.',
            vocab: [
              { word: 'restauradora', cleanWord: 'restauradora', meaning: 'restorer (female)', partOfSpeech: 'Noun (f)', phonetic: 'rehs-tow-rah-DOH-rah' },
              { word: 'cuidadosamente', cleanWord: 'cuidadosamente', meaning: 'carefully', partOfSpeech: 'Adverb', phonetic: 'kwee-dah-doh-sah-MEHN-teh' },
              { word: 'mosaicos', cleanWord: 'mosaicos', meaning: 'mosaics / tiles', partOfSpeech: 'Noun (m pl)', phonetic: 'moh-SAH-ee-kohs' },
              { word: 'Patio de los Leones', cleanWord: 'patio de los leones', meaning: 'Court of the Lions', partOfSpeech: 'Proper Noun', phonetic: 'PAH-tyoh deh lohs leh-OH-nehs' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-2-1',
            spanish: 'De repente, una pieza de cerámica azul zafiro se deslizó bajo la suave presión de sus dedos.',
            english: 'Suddenly, a sapphire blue ceramic tile slid under the gentle pressure of her fingers.',
            phonetic: 'deh rreh-PEHN-teh, OO-nah PYEH-sah deh seh-RAH-mee-kah ah-SOOL sah-FEE-roh seh dehs-lee-SOH BAH-hoh lah SWAH-veh preh-SYOHN deh soos DEH-dohs.',
            vocab: [
              { word: 'De repente', cleanWord: 'de repente', meaning: 'Suddenly / all of a sudden', partOfSpeech: 'Idiom', phonetic: 'deh rreh-PEHN-teh' },
              { word: 'azul zafiro', cleanWord: 'azul zafiro', meaning: 'sapphire blue', partOfSpeech: 'Adjective phrase', phonetic: 'ah-SOOL sah-FEE-roh' },
              { word: 'se deslizó', cleanWord: 'se deslizo', meaning: 'slid / slipped (deslizarse)', partOfSpeech: 'Reflexive Verb', phonetic: 'seh dehs-lee-SOH' },
              { word: 'dedos', cleanWord: 'dedos', meaning: 'fingers', partOfSpeech: 'Noun (m pl)', phonetic: 'DEH-dohs' }
            ]
          },
          {
            id: 's-2-2',
            spanish: 'Detrás del azulejo había una llave de bronce grabada con una inscripción poética en caligrafía árabe.',
            english: 'Behind the tile there was a bronze key engraved with a poetic inscription in Arabic calligraphy.',
            phonetic: 'deh-TRAHS dehl ah-soo-LEH-hoh ah-BEE-ah OO-nah YAH-veh deh BROHN-seh grah-BAH-dah kohn OO-nah eens-kreep-SYOHN poh-EH-tee-kah ehn kah-lee-grah-FEE-ah AH-rah-beh.',
            vocab: [
              { word: 'Detrás de', cleanWord: 'detras de', meaning: 'Behind', partOfSpeech: 'Preposition', phonetic: 'deh-TRAHS deh' },
              { word: 'azulejo', cleanWord: 'azulejo', meaning: 'glazed ceramic tile', partOfSpeech: 'Noun (m)', phonetic: 'ah-soo-LEH-hoh', note: 'Essential Spanish architectural word' },
              { word: 'llave de bronce', cleanWord: 'llave de bronce', meaning: 'bronze key', partOfSpeech: 'Noun phrase', phonetic: 'YAH-veh deh BROHN-seh' },
              { word: 'grabada', cleanWord: 'grabada', meaning: 'engraved / carved', partOfSpeech: 'Participle', phonetic: 'grah-BAH-dah' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q-1',
        question: 'What is Elena’s profession?',
        questionSpanish: '¿Cuál es la profesión de Elena?',
        options: ['Guía turística', 'Restauradora de arte', 'Arquitecta moderna', 'Cantante de flamenco'],
        correctIndex: 1,
        explanation: 'Elena is an art restorer (restauradora de arte).'
      },
      {
        id: 'q-2',
        question: 'What was hidden behind the sapphire blue tile?',
        questionSpanish: '¿Qué había escondido detrás del azulejo azul?',
        options: ['Monedas de oro', 'Una llave de bronce con inscripción poética', 'Un mapa secreto', 'Un espejo antiguo'],
        correctIndex: 1,
        explanation: 'Behind the tile was a bronze key with an Arabic poetic inscription!'
      }
    ]
  },
  {
    id: 'story-reloj-oaxaca',
    title: 'El Reloj Perdido de Oaxaca',
    titleEnglish: 'The Lost Watch of Oaxaca',
    level: 'B2',
    levelBadge: 'B2 · Magical Realism',
    genre: 'Magical Realism',
    coverEmoji: '⏳🏵️',
    accent: 'es-MX',
    country: 'Mexico 🇲🇽',
    readTimeMinutes: 5,
    synopsis: 'In vibrant Oaxaca, an antique pocket watch doesn’t count hours, but rather the moments of genuine joy in a person’s life.',
    themeColor: 'from-rose-500/20 to-amber-500/20 border-rose-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-1-1',
            spanish: 'En el colorido mercado de Oaxaca, entre textiles bordados a mano y aromas a chocolate con canela, don Mateo atendía su tienda de antigüedades.',
            english: 'In the colorful market of Oaxaca, among hand-embroidered textiles and scents of cinnamon chocolate, Don Mateo ran his antique shop.',
            phonetic: 'ehn ehl koh-loh-REE-doh mehr-KAH-doh deh wah-HAH-kah, EHN-treh tehks-TEE-lehs bohr-DAH-dohs ah MAH-noh ee ah-ROH-mahs ah choh-koh-LAH-teh kohn kah-NEH-lah, dohn mah-TEH-oh ah-tehn-DEE-ah soo TYEHN-dah deh ahn-tee-gweh-DAH-dehs.',
            vocab: [
              { word: 'colorido mercado', cleanWord: 'colorido mercado', meaning: 'colorful market', partOfSpeech: 'Noun phrase', phonetic: 'koh-loh-REE-doh mehr-KAH-doh' },
              { word: 'bordados a mano', cleanWord: 'bordados a mano', meaning: 'hand-embroidered', partOfSpeech: 'Adjective phrase', phonetic: 'bohr-DAH-dohs ah MAH-noh' },
              { word: 'canela', cleanWord: 'canela', meaning: 'cinnamon', partOfSpeech: 'Noun (f)', phonetic: 'kah-NEH-lah' },
              { word: 'tienda de antigüedades', cleanWord: 'tienda de antiguedades', meaning: 'antique store', partOfSpeech: 'Noun phrase', phonetic: 'TYEHN-dah deh ahn-tee-gweh-DAH-dehs' }
            ]
          },
          {
            id: 's-1-2',
            spanish: 'Sobre una vitrina de caoba descansaba un reloj de bolsillo plateado cuyas manecillas giraban en sentido contrario.',
            english: 'Upon a mahogany display case rested a silver pocket watch whose hands turned in reverse.',
            phonetic: 'SOH-breh OO-nah vee-TREE-nah deh kah-OH-bah dehs-kahn-SAH-bah oon rreh-LOH deh bohl-SEE-yoh plah-teh-AH-doh KWOO-yahs mah-neh-SEE-yahs hee-RAH-bahn ehn sehn-TEE-doh kohn-TRAH-ryoh.',
            vocab: [
              { word: 'vitrina de caoba', cleanWord: 'vitrina de caoba', meaning: 'mahogany glass case', partOfSpeech: 'Noun phrase', phonetic: 'vee-TREE-nah deh kah-OH-bah' },
              { word: 'reloj de bolsillo', cleanWord: 'reloj de bolsillo', meaning: 'pocket watch', partOfSpeech: 'Noun phrase', phonetic: 'rreh-LOH deh bohl-SEE-yoh' },
              { word: 'cuyas manecillas', cleanWord: 'cuyas manecillas', meaning: 'whose clock hands', partOfSpeech: 'Relative clause', phonetic: 'KWOO-yahs mah-neh-SEE-yahs' },
              { word: 'sentido contrario', cleanWord: 'sentido contrario', meaning: 'opposite direction / reverse', partOfSpeech: 'Noun phrase', phonetic: 'sehn-TEE-doh kohn-TRAH-ryoh' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-2-1',
            spanish: '—Este artefacto no mide las horas ordinarias —explicó el anciano con una mirada pícara— sino los instantes en que fuiste profundamente feliz.',
            english: '—This artifact does not measure ordinary hours —explained the old man with a mischievous gaze— but rather the moments in which you were deeply happy.',
            phonetic: 'EHS-teh ahr-teh-FAHK-toh noh MEE-deh lahs OH-rahs ohr-dee-NAH-ryahs —ehks-plee-KOH ehl ahn-SYAH-noh kohn OO-nah mee-RAH-dah PEE-kah-rah— SEE-noh lohs eens-TAHN-tehs ehn keh FWEE-steh proh-foon-dah-MEHN-teh feh-LEES.',
            vocab: [
              { word: 'artefacto', cleanWord: 'artefacto', meaning: 'artifact / device', partOfSpeech: 'Noun (m)', phonetic: 'ahr-teh-FAHK-toh' },
              { word: 'mide', cleanWord: 'mide', meaning: 'measures (medir)', partOfSpeech: 'Verb', phonetic: 'MEE-deh' },
              { word: 'mirada pícara', cleanWord: 'mirada picara', meaning: 'mischievous look / wink', partOfSpeech: 'Noun phrase', phonetic: 'mee-RAH-dah PEE-kah-rah' },
              { word: 'profundamente feliz', cleanWord: 'profundamente feliz', meaning: 'deeply happy', partOfSpeech: 'Phrase', phonetic: 'proh-foon-dah-MEHN-teh feh-LEES' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q-1',
        question: 'Where is the antique store located?',
        questionSpanish: '¿Dónde está ubicada la tienda de antigüedades?',
        options: ['En el mercado de Oaxaca', 'En el centro de Madrid', 'En la playa de Cancún', 'En la montaña de Bogotá'],
        correctIndex: 0,
        explanation: 'It is situated in the colorful market of Oaxaca, Mexico.'
      },
      {
        id: 'q-2',
        question: 'What do the hands of the silver pocket watch measure?',
        questionSpanish: '¿Qué miden las manecillas del reloj plateado?',
        options: [
          'Los minutos de retraso de los trenes',
          'Los instantes en que fuiste profundamente feliz',
          'El peso del chocolate con canela',
          'Los días de lluvia en el año'
        ],
        correctIndex: 1,
        explanation: 'The watch measures the moments when a person was deeply happy!'
      }
    ]
  }
];
