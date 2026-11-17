export interface AlignedWordPair {
  id: string;
  spanish: string;
  english: string;
  phonetic: string;
  meaning: string;
  partOfSpeech?: string;
  note?: string;
}

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
  wordPairs: AlignedWordPair[];
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
  // STORY 1
  {
    id: 'story-perro-magico',
    title: 'El Perro Mágico de Barcelona',
    titleEnglish: 'The Magical Dog of Barcelona',
    level: 'A1',
    levelBadge: 'A1 · Starter Tale',
    genre: 'Charming Adventure',
    coverEmoji: '🐕🎨',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 3,
    synopsis: 'Mateo, a joyful small dog, explores Park Güell and makes a heartwarming friend over hot churros and chocolate.',
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
            wordPairs: [
              { id: 'w1-1', spanish: 'Mateo', english: 'Mateo', phonetic: 'mah-TEH-oh', meaning: 'Mateo (character name)', partOfSpeech: 'Proper Noun' },
              { id: 'w1-2', spanish: 'es', english: 'is', phonetic: 'ehs', meaning: 'is (permanent state - ser)', partOfSpeech: 'Verb' },
              { id: 'w1-3', spanish: 'un', english: 'a', phonetic: 'oon', meaning: 'a / an (masculine article)', partOfSpeech: 'Article' },
              { id: 'w1-4', spanish: 'perro', english: 'dog', phonetic: 'PEH-rroh', meaning: 'dog', partOfSpeech: 'Noun (m)', note: 'Roll the double "rr"!' },
              { id: 'w1-5', spanish: 'pequeño', english: 'small', phonetic: 'peh-KEH-nyoh', meaning: 'small / little', partOfSpeech: 'Adjective' },
              { id: 'w1-6', spanish: 'con', english: 'with', phonetic: 'kohn', meaning: 'with', partOfSpeech: 'Preposition' },
              { id: 'w1-7', spanish: 'ojos', english: 'eyes', phonetic: 'OH-hohs', meaning: 'eyes (j sounds like English h)', partOfSpeech: 'Noun (m pl)' },
              { id: 'w1-8', spanish: 'grandes', english: 'big', phonetic: 'GRAHN-dehs', meaning: 'big / large (plural)', partOfSpeech: 'Adjective' },
              { id: 'w1-9', spanish: 'y', english: 'and', phonetic: 'ee', meaning: 'and', partOfSpeech: 'Conjunction' },
              { id: 'w1-10', spanish: 'curiosos', english: 'curious', phonetic: 'koo-RYOH-sohs', meaning: 'curious / inquisitive', partOfSpeech: 'Adjective' }
            ]
          },
          {
            id: 's-1-2',
            spanish: 'Todos los días camina por las calles hermosas de Barcelona.',
            english: 'Every day he walks through the beautiful streets of Barcelona.',
            phonetic: 'TOH-dohs lohs DEE-ahs kah-MEE-nah pohr lahs KAH-lyehs ehr-MOH-sahs deh bahr-seh-LOH-nah.',
            wordPairs: [
              { id: 'w2-1', spanish: 'Todos', english: 'Every', phonetic: 'TOH-dohs', meaning: 'All / Every', partOfSpeech: 'Determiner' },
              { id: 'w2-2', spanish: 'los', english: 'the', phonetic: 'lohs', meaning: 'the (plural)', partOfSpeech: 'Article' },
              { id: 'w2-3', spanish: 'días', english: 'day', phonetic: 'DEE-ahs', meaning: 'days', partOfSpeech: 'Noun (m pl)' },
              { id: 'w2-4', spanish: 'camina', english: 'walks', phonetic: 'kah-MEE-nah', meaning: 'walks (caminar)', partOfSpeech: 'Verb' },
              { id: 'w2-5', spanish: 'por', english: 'through', phonetic: 'pohr', meaning: 'through / along', partOfSpeech: 'Preposition' },
              { id: 'w2-6', spanish: 'las', english: 'the', phonetic: 'lahs', meaning: 'the (feminine plural)', partOfSpeech: 'Article' },
              { id: 'w2-7', spanish: 'calles', english: 'streets', phonetic: 'KAH-lyehs', meaning: 'streets', partOfSpeech: 'Noun (f pl)' },
              { id: 'w2-8', spanish: 'hermosas', english: 'beautiful', phonetic: 'ehr-MOH-sahs', meaning: 'beautiful / lovely', partOfSpeech: 'Adjective' },
              { id: 'w2-9', spanish: 'de', english: 'of', phonetic: 'deh', meaning: 'of / from', partOfSpeech: 'Preposition' },
              { id: 'w2-10', spanish: 'Barcelona', english: 'Barcelona', phonetic: 'bahr-seh-LOH-nah', meaning: 'Barcelona city', partOfSpeech: 'Proper Noun' }
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
            wordPairs: [
              { id: 'w3-1', spanish: 'Una', english: 'One', phonetic: 'OO-nah', meaning: 'A / One (feminine)', partOfSpeech: 'Article' },
              { id: 'w3-2', spanish: 'mañana', english: 'morning', phonetic: 'mah-NYAH-nah', meaning: 'morning', partOfSpeech: 'Noun (f)' },
              { id: 'w3-3', spanish: 'de', english: 'of', phonetic: 'deh', meaning: 'of', partOfSpeech: 'Preposition' },
              { id: 'w3-4', spanish: 'sol', english: 'sun', phonetic: 'sohl', meaning: 'sun / sunshine', partOfSpeech: 'Noun (m)' },
              { id: 'w3-5', spanish: 'Mateo', english: 'Mateo', phonetic: 'mah-TEH-oh', meaning: 'Mateo', partOfSpeech: 'Proper Noun' },
              { id: 'w3-6', spanish: 'llega', english: 'arrives', phonetic: 'YEH-gah', meaning: 'arrives (llegar)', partOfSpeech: 'Verb' },
              { id: 'w3-7', spanish: 'al', english: 'at the', phonetic: 'ahl', meaning: 'to the (a + el)', partOfSpeech: 'Contraction' },
              { id: 'w3-8', spanish: 'famoso', english: 'famous', phonetic: 'fah-MOH-soh', meaning: 'famous / renowned', partOfSpeech: 'Adjective' },
              { id: 'w3-9', spanish: 'Park Güell', english: 'Park Güell', phonetic: 'pahrk gwehl', meaning: "Gaudí's iconic mosaic park", partOfSpeech: 'Proper Noun' }
            ]
          },
          {
            id: 's-2-2',
            spanish: 'Allí ve un dragón de colores brillantes que parece sonreír.',
            english: 'There he sees a brightly colored dragon that seems to smile.',
            phonetic: 'ah-YEE veh oon drah-GOHN deh koh-LOH-rehs bree-YAHN-tehs keh pah-REH-seh sohn-reh-EER.',
            wordPairs: [
              { id: 'w4-1', spanish: 'Allí', english: 'There', phonetic: 'ah-YEE', meaning: 'There / in that place', partOfSpeech: 'Adverb' },
              { id: 'w4-2', spanish: 've', english: 'sees', phonetic: 'veh', meaning: 'sees (ver)', partOfSpeech: 'Verb' },
              { id: 'w4-3', spanish: 'un', english: 'a', phonetic: 'oon', meaning: 'a / an', partOfSpeech: 'Article' },
              { id: 'w4-4', spanish: 'dragón', english: 'dragon', phonetic: 'drah-GOHN', meaning: 'dragon / salamander', partOfSpeech: 'Noun (m)' },
              { id: 'w4-5', spanish: 'de', english: 'of', phonetic: 'deh', meaning: 'of', partOfSpeech: 'Preposition' },
              { id: 'w4-6', spanish: 'colores', english: 'colors', phonetic: 'koh-LOH-rehs', meaning: 'colors', partOfSpeech: 'Noun (m pl)' },
              { id: 'w4-7', spanish: 'brillantes', english: 'bright', phonetic: 'bree-YAHN-tehs', meaning: 'bright / shiny', partOfSpeech: 'Adjective' },
              { id: 'w4-8', spanish: 'que', english: 'that', phonetic: 'keh', meaning: 'that / which', partOfSpeech: 'Pronoun' },
              { id: 'w4-9', spanish: 'parece', english: 'seems', phonetic: 'pah-REH-seh', meaning: 'seems / appears (parecer)', partOfSpeech: 'Verb' },
              { id: 'w4-10', spanish: 'sonreír', english: 'to smile', phonetic: 'sohn-reh-EER', meaning: 'to smile', partOfSpeech: 'Infinitive' }
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
            spanish: 'Una niña come churros con chocolate caliente y sonríe.',
            english: 'A girl eats churros with hot chocolate and smiles.',
            phonetic: 'OO-nah NEE-nyah KOH-meh CHOO-rrohs kohn choh-koh-LAH-teh kah-LYEHN-teh ee sohn-REE-eh.',
            wordPairs: [
              { id: 'w5-1', spanish: 'Una', english: 'A', phonetic: 'OO-nah', meaning: 'A (feminine)', partOfSpeech: 'Article' },
              { id: 'w5-2', spanish: 'niña', english: 'girl', phonetic: 'NEE-nyah', meaning: 'girl / child', partOfSpeech: 'Noun (f)' },
              { id: 'w5-3', spanish: 'come', english: 'eats', phonetic: 'KOH-meh', meaning: 'eats (comer)', partOfSpeech: 'Verb' },
              { id: 'w5-4', spanish: 'churros', english: 'churros', phonetic: 'CHOO-rrohs', meaning: 'Spanish fried dough pastry', partOfSpeech: 'Noun (m pl)' },
              { id: 'w5-5', spanish: 'con', english: 'with', phonetic: 'kohn', meaning: 'with', partOfSpeech: 'Preposition' },
              { id: 'w5-6', spanish: 'chocolate', english: 'chocolate', phonetic: 'choh-koh-LAH-teh', meaning: 'chocolate', partOfSpeech: 'Noun (m)' },
              { id: 'w5-7', spanish: 'caliente', english: 'hot', phonetic: 'kah-LYEHN-teh', meaning: 'hot / warm', partOfSpeech: 'Adjective' },
              { id: 'w5-8', spanish: 'y', english: 'and', phonetic: 'ee', meaning: 'and', partOfSpeech: 'Conjunction' },
              { id: 'w5-9', spanish: 'sonríe', english: 'smiles', phonetic: 'sohn-REE-eh', meaning: 'smiles (sonreír)', partOfSpeech: 'Verb' }
            ]
          },
          {
            id: 's-3-2',
            spanish: 'Mateo mueve la cola feliz. ¡Hoy es el mejor día!',
            english: 'Mateo wags his tail happily. Today is the best day!',
            phonetic: 'mah-TEH-oh MWEH-veh lah KOH-lah feh-LEES. oy ehs ehl meh-HOHR DEE-ah!',
            wordPairs: [
              { id: 'w6-1', spanish: 'Mateo', english: 'Mateo', phonetic: 'mah-TEH-oh', meaning: 'Mateo', partOfSpeech: 'Proper Noun' },
              { id: 'w6-2', spanish: 'mueve', english: 'wags', phonetic: 'MWEH-veh', meaning: 'moves / wags (mover)', partOfSpeech: 'Verb' },
              { id: 'w6-3', spanish: 'la', english: 'his', phonetic: 'lah', meaning: 'the (used for body parts in Spanish)', partOfSpeech: 'Article' },
              { id: 'w6-4', spanish: 'cola', english: 'tail', phonetic: 'KOH-lah', meaning: 'tail', partOfSpeech: 'Noun (f)' },
              { id: 'w6-5', spanish: 'feliz', english: 'happily', phonetic: 'feh-LEES', meaning: 'happy / joyful', partOfSpeech: 'Adjective' },
              { id: 'w6-6', spanish: 'Hoy', english: 'Today', phonetic: 'oy', meaning: 'Today (silent h)', partOfSpeech: 'Adverb' },
              { id: 'w6-7', spanish: 'es', english: 'is', phonetic: 'ehs', meaning: 'is', partOfSpeech: 'Verb' },
              { id: 'w6-8', spanish: 'el', english: 'the', phonetic: 'ehl', meaning: 'the (masculine)', partOfSpeech: 'Article' },
              { id: 'w6-9', spanish: 'mejor', english: 'best', phonetic: 'meh-HOHR', meaning: 'best / greatest', partOfSpeech: 'Adjective' },
              { id: 'w6-10', spanish: 'día', english: 'day', phonetic: 'DEE-ah', meaning: 'day', partOfSpeech: 'Noun (m)' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q1-1',
        question: 'Where does Mateo go on a sunny morning?',
        questionSpanish: '¿A dónde va Mateo una mañana de sol?',
        options: ['Al Park Güell', 'A la estación de tren', 'Al cine', 'A la playa'],
        correctIndex: 0,
        explanation: 'Mateo arrives at the famous mosaic Park Güell in Barcelona.'
      },
      {
        id: 'q1-2',
        question: 'What is the girl eating in the park?',
        questionSpanish: '¿Qué come la niña en el parque?',
        options: ['Manzanas verdes', 'Churros con chocolate caliente', 'Pizza italiana', 'Paella de mariscos'],
        correctIndex: 1,
        explanation: 'She is enjoying warm churros with hot chocolate!'
      }
    ]
  },

  // STORY 2
  {
    id: 'story-cafe-madrid',
    title: 'El Secreto del Café con Leche',
    titleEnglish: 'The Secret of the Café con Leche',
    level: 'A1',
    levelBadge: 'A1 · Daily Spanish',
    genre: 'Mystery & Comfort',
    coverEmoji: '☕🥐',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 3,
    synopsis: 'A warm autumn morning in Madrid’s Plaza Mayor leads Lucía to find a handwritten note with a lovely life lesson.',
    themeColor: 'from-amber-600/20 to-orange-500/20 border-amber-600/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-2-1-1',
            spanish: 'Son las ocho de la mañana en la Plaza Mayor de Madrid.',
            english: 'It is eight o’clock in the morning in the Plaza Mayor of Madrid.',
            phonetic: 'sohn lahs OH-choh deh lah mah-NYAH-nah ehn lah PLAH-sah mah-YOHR deh mah-DREED.',
            wordPairs: [
              { id: 'cm1-1', spanish: 'Son', english: 'It is', phonetic: 'sohn', meaning: 'They are (telling time in Spanish)', partOfSpeech: 'Verb' },
              { id: 'cm1-2', spanish: 'las', english: 'the', phonetic: 'lahs', meaning: 'the (used with hours)', partOfSpeech: 'Article' },
              { id: 'cm1-3', spanish: 'ocho', english: 'eight', phonetic: 'OH-choh', meaning: 'eight', partOfSpeech: 'Number' },
              { id: 'cm1-4', spanish: 'de', english: 'in', phonetic: 'deh', meaning: 'of / in', partOfSpeech: 'Preposition' },
              { id: 'cm1-5', spanish: 'la', english: 'the', phonetic: 'lah', meaning: 'the', partOfSpeech: 'Article' },
              { id: 'cm1-6', spanish: 'mañana', english: 'morning', phonetic: 'mah-NYAH-nah', meaning: 'morning', partOfSpeech: 'Noun (f)' },
              { id: 'cm1-7', spanish: 'en', english: 'in', phonetic: 'ehn', meaning: 'in / at', partOfSpeech: 'Preposition' },
              { id: 'cm1-8', spanish: 'la Plaza Mayor', english: 'the Plaza Mayor', phonetic: 'lah PLAH-sah mah-YOHR', meaning: "Madrid's historic central square", partOfSpeech: 'Proper Noun' },
              { id: 'cm1-9', spanish: 'de', english: 'of', phonetic: 'deh', meaning: 'of', partOfSpeech: 'Preposition' },
              { id: 'cm1-10', spanish: 'Madrid', english: 'Madrid', phonetic: 'mah-DREED', meaning: 'Capital of Spain', partOfSpeech: 'Proper Noun' }
            ]
          },
          {
            id: 's-2-1-2',
            spanish: 'El aroma a café caliente llena el aire fresco.',
            english: 'The aroma of hot coffee fills the crisp fresh air.',
            phonetic: 'ehl ah-ROH-mah ah kah-FEH kah-LYEHN-teh YEH-nah ehl EYE-reh FREHS-koh.',
            wordPairs: [
              { id: 'cm2-1', spanish: 'El', english: 'The', phonetic: 'ehl', meaning: 'The (masculine)', partOfSpeech: 'Article' },
              { id: 'cm2-2', spanish: 'aroma', english: 'aroma', phonetic: 'ah-ROH-mah', meaning: 'scent / aroma (masculine word)', partOfSpeech: 'Noun (m)' },
              { id: 'cm2-3', spanish: 'a café', english: 'of coffee', phonetic: 'ah kah-FEH', meaning: 'of coffee', partOfSpeech: 'Phrase' },
              { id: 'cm2-4', spanish: 'caliente', english: 'hot', phonetic: 'kah-LYEHN-teh', meaning: 'hot / steaming', partOfSpeech: 'Adjective' },
              { id: 'cm2-5', spanish: 'llena', english: 'fills', phonetic: 'YEH-nah', meaning: 'fills (llenar)', partOfSpeech: 'Verb' },
              { id: 'cm2-6', spanish: 'el', english: 'the', phonetic: 'ehl', meaning: 'the', partOfSpeech: 'Article' },
              { id: 'cm2-7', spanish: 'aire', english: 'air', phonetic: 'EYE-reh', meaning: 'air', partOfSpeech: 'Noun (m)' },
              { id: 'cm2-8', spanish: 'fresco', english: 'fresh', phonetic: 'FREHS-koh', meaning: 'fresh / cool', partOfSpeech: 'Adjective' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-2-2-1',
            spanish: 'Lucía encuentra una pequeña nota junto a su taza.',
            english: 'Lucía finds a small note next to her cup.',
            phonetic: 'loo-SEE-ah ehn-KWEHN-trah OO-nah peh-KEH-nyah NOH-tah HOON-toh ah soo TAH-sah.',
            wordPairs: [
              { id: 'cm3-1', spanish: 'Lucía', english: 'Lucía', phonetic: 'loo-SEE-ah', meaning: 'Lucía', partOfSpeech: 'Proper Noun' },
              { id: 'cm3-2', spanish: 'encuentra', english: 'finds', phonetic: 'ehn-KWEHN-trah', meaning: 'finds (encontrar)', partOfSpeech: 'Verb' },
              { id: 'cm3-3', spanish: 'una', english: 'a', phonetic: 'OO-nah', meaning: 'a', partOfSpeech: 'Article' },
              { id: 'cm3-4', spanish: 'pequeña', english: 'small', phonetic: 'peh-KEH-nyah', meaning: 'small / tiny', partOfSpeech: 'Adjective' },
              { id: 'cm3-5', spanish: 'nota', english: 'note', phonetic: 'NOH-tah', meaning: 'note / paper', partOfSpeech: 'Noun (f)' },
              { id: 'cm3-6', spanish: 'junto a', english: 'next to', phonetic: 'HOON-toh ah', meaning: 'beside / next to', partOfSpeech: 'Preposition' },
              { id: 'cm3-7', spanish: 'su', english: 'her', phonetic: 'soo', meaning: 'her / his', partOfSpeech: 'Possessive' },
              { id: 'cm3-8', spanish: 'taza', english: 'cup', phonetic: 'TAH-sah', meaning: 'cup / mug', partOfSpeech: 'Noun (f)' }
            ]
          },
          {
            id: 's-2-2-2',
            spanish: 'La nota dice: "El mejor café es el que compartes con amigos."',
            english: 'The note says: "The best coffee is the one you share with friends."',
            phonetic: 'lah NOH-tah DEE-seh: ehl meh-HOHR kah-FEH ehs ehl keh kohm-PAHR-tehs kohn ah-MEE-gohs.',
            wordPairs: [
              { id: 'cm4-1', spanish: 'La', english: 'The', phonetic: 'lah', meaning: 'The', partOfSpeech: 'Article' },
              { id: 'cm4-2', spanish: 'nota', english: 'note', phonetic: 'NOH-tah', meaning: 'note', partOfSpeech: 'Noun (f)' },
              { id: 'cm4-3', spanish: 'dice', english: 'says', phonetic: 'DEE-seh', meaning: 'says (decir)', partOfSpeech: 'Verb' },
              { id: 'cm4-4', spanish: 'El', english: 'The', phonetic: 'ehl', meaning: 'The', partOfSpeech: 'Article' },
              { id: 'cm4-5', spanish: 'mejor', english: 'best', phonetic: 'meh-HOHR', meaning: 'best', partOfSpeech: 'Adjective' },
              { id: 'cm4-6', spanish: 'café', english: 'coffee', phonetic: 'kah-FEH', meaning: 'coffee', partOfSpeech: 'Noun (m)' },
              { id: 'cm4-7', spanish: 'es', english: 'is', phonetic: 'ehs', meaning: 'is', partOfSpeech: 'Verb' },
              { id: 'cm4-8', spanish: 'el que', english: 'the one that', phonetic: 'ehl keh', meaning: 'that which / the one', partOfSpeech: 'Pronoun' },
              { id: 'cm4-9', spanish: 'compartes', english: 'you share', phonetic: 'kohm-PAHR-tehs', meaning: 'you share (compartir)', partOfSpeech: 'Verb' },
              { id: 'cm4-10', spanish: 'con', english: 'with', phonetic: 'kohn', meaning: 'with', partOfSpeech: 'Preposition' },
              { id: 'cm4-11', spanish: 'amigos', english: 'friends', phonetic: 'ah-MEE-gohs', meaning: 'friends', partOfSpeech: 'Noun (m pl)' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q2-1',
        question: 'What time is it in Madrid’s Plaza Mayor?',
        questionSpanish: '¿Qué hora es en la Plaza Mayor?',
        options: ['Las ocho de la mañana', 'Las doce de la noche', 'Las tres de la tarde', 'Las seis de la mañana'],
        correctIndex: 0,
        explanation: 'It is 8:00 AM (Son las ocho de la mañana).'
      },
      {
        id: 'q2-2',
        question: 'What does the secret note say about coffee?',
        questionSpanish: '¿Qué dice la nota sobre el café?',
        options: [
          'El mejor café es el que compartes con amigos',
          'El café cuesta cinco euros',
          'El café tiene mucha azúcar',
          'El café está muy frío'
        ],
        correctIndex: 0,
        explanation: 'The note teaches that coffee is best shared with friends!'
      }
    ]
  },

  // STORY 3
  {
    id: 'story-panaderia-carmen',
    title: 'La Panadería de Doña Carmen',
    titleEnglish: 'Doña Carmen’s Bakery',
    level: 'A1',
    levelBadge: 'A1 · Daily Life & Food',
    genre: 'Heartwarming Daily Story',
    coverEmoji: '🥖🥐',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 3,
    synopsis: 'Every sunrise in Valencia, Doña Carmen bakes golden bread and fresh croissants that bring joy to the whole neighborhood.',
    themeColor: 'from-amber-500/20 to-yellow-500/20 border-amber-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-3-1-1',
            spanish: 'Doña Carmen abre su panadería muy temprano cada mañana.',
            english: 'Doña Carmen opens her bakery very early every morning.',
            phonetic: 'DOH-nyah KAHR-mehn AH-breh soo pah-nah-deh-REE-ah MOO-ee tehm-PRAH-noh KAH-dah mah-NYAH-nah.',
            wordPairs: [
              { id: 'pc1-1', spanish: 'Doña Carmen', english: 'Doña Carmen', phonetic: 'DOH-nyah KAHR-mehn', meaning: 'Doña (respectful title for elder woman)', partOfSpeech: 'Title' },
              { id: 'pc1-2', spanish: 'abre', english: 'opens', phonetic: 'AH-breh', meaning: 'opens (abrir)', partOfSpeech: 'Verb' },
              { id: 'pc1-3', spanish: 'su', english: 'her', phonetic: 'soo', meaning: 'her', partOfSpeech: 'Possessive' },
              { id: 'pc1-4', spanish: 'panadería', english: 'bakery', phonetic: 'pah-nah-deh-REE-ah', meaning: 'bread bakery', partOfSpeech: 'Noun (f)' },
              { id: 'pc1-5', spanish: 'muy', english: 'very', phonetic: 'MOO-ee', meaning: 'very', partOfSpeech: 'Adverb' },
              { id: 'pc1-6', spanish: 'temprano', english: 'early', phonetic: 'tehm-PRAH-noh', meaning: 'early in the morning', partOfSpeech: 'Adverb' },
              { id: 'pc1-7', spanish: 'cada', english: 'every', phonetic: 'KAH-dah', meaning: 'each / every', partOfSpeech: 'Determiner' },
              { id: 'pc1-8', spanish: 'mañana', english: 'morning', phonetic: 'mah-NYAH-nah', meaning: 'morning', partOfSpeech: 'Noun (f)' }
            ]
          },
          {
            id: 's-3-1-2',
            spanish: 'Prepara pan caliente, cruasanes dorados y ricas empanadas.',
            english: 'She prepares warm bread, golden croissants, and delicious empanadas.',
            phonetic: 'preh-PAH-rah PAHN kah-LYEHN-teh, kroo-ah-SAH-nehs doh-RAH-dohs ee REE-kahs ehm-pah-NAH-dahs.',
            wordPairs: [
              { id: 'pc2-1', spanish: 'Prepara', english: 'She prepares', phonetic: 'preh-PAH-rah', meaning: 'prepares (preparar)', partOfSpeech: 'Verb' },
              { id: 'pc2-2', spanish: 'pan', english: 'bread', phonetic: 'PAHN', meaning: 'bread', partOfSpeech: 'Noun (m)' },
              { id: 'pc2-3', spanish: 'caliente', english: 'warm', phonetic: 'kah-LYEHN-teh', meaning: 'warm / hot', partOfSpeech: 'Adjective' },
              { id: 'pc2-4', spanish: 'cruasanes', english: 'croissants', phonetic: 'kroo-ah-SAH-nehs', meaning: 'croissants', partOfSpeech: 'Noun (m pl)' },
              { id: 'pc2-5', spanish: 'dorados', english: 'golden', phonetic: 'doh-RAH-dohs', meaning: 'golden / browned', partOfSpeech: 'Adjective' },
              { id: 'pc2-6', spanish: 'y', english: 'and', phonetic: 'ee', meaning: 'and', partOfSpeech: 'Conjunction' },
              { id: 'pc2-7', spanish: 'ricas', english: 'delicious', phonetic: 'REE-kahs', meaning: 'tasty / delicious', partOfSpeech: 'Adjective' },
              { id: 'pc2-8', spanish: 'empanadas', english: 'empanadas', phonetic: 'ehm-pah-NAH-dahs', meaning: 'Spanish stuffed pastries', partOfSpeech: 'Noun (f pl)' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-3-2-1',
            spanish: 'Los vecinos siempre hacen fila con sonrisas felices.',
            english: 'The neighbors always line up with happy smiles.',
            phonetic: 'lohs veh-SEE-nohs SYEHM-preh AH-sehn FEE-lah kohn sohn-REE-sahs feh-LEE-sehs.',
            wordPairs: [
              { id: 'pc3-1', spanish: 'Los', english: 'The', phonetic: 'lohs', meaning: 'The (plural)', partOfSpeech: 'Article' },
              { id: 'pc3-2', spanish: 'vecinos', english: 'neighbors', phonetic: 'veh-SEE-nohs', meaning: 'neighbors', partOfSpeech: 'Noun (m pl)' },
              { id: 'pc3-3', spanish: 'siempre', english: 'always', phonetic: 'SYEHM-preh', meaning: 'always', partOfSpeech: 'Adverb' },
              { id: 'pc3-4', spanish: 'hacen fila', english: 'line up', phonetic: 'AH-sehn FEE-lah', meaning: 'make a line / queue', partOfSpeech: 'Idiom' },
              { id: 'pc3-5', spanish: 'con', english: 'with', phonetic: 'kohn', meaning: 'with', partOfSpeech: 'Preposition' },
              { id: 'pc3-6', spanish: 'sonrisas', english: 'smiles', phonetic: 'sohn-REE-sahs', meaning: 'smiles', partOfSpeech: 'Noun (f pl)' },
              { id: 'pc3-7', spanish: 'felices', english: 'happy', phonetic: 'feh-LEE-sehs', meaning: 'happy / joyful', partOfSpeech: 'Adjective' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q3-1',
        question: 'What does Doña Carmen bake in her bakery?',
        questionSpanish: '¿Qué hornea Doña Carmen en su panadería?',
        options: ['Pan caliente y cruasanes dorados', 'Helado de fresa', 'Sopa de verduras', 'Pescado frito'],
        correctIndex: 0,
        explanation: 'She bakes warm bread and golden croissants.'
      }
    ]
  },

  // STORY 4
  {
    id: 'story-pinguino-volador',
    title: 'El Pingüino que Quería Volar',
    titleEnglish: 'The Penguin Who Wanted to Fly',
    level: 'A2',
    levelBadge: 'A2 · Patagonia Adventure',
    genre: 'Inspirational Nature',
    coverEmoji: '🐧❄️',
    accent: 'es-ES',
    country: 'Chile & Argentina 🇦🇷',
    readTimeMinutes: 4,
    synopsis: 'Pipo the penguin lives on the blue glaciers of Patagonia and discovers that swimming through the icy ocean is just like flying.',
    themeColor: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-4-1-1',
            spanish: 'Pipo es un pingüino alegre que vive en los glaciares azules de la Patagonia.',
            english: 'Pipo is a cheerful penguin who lives on the blue glaciers of Patagonia.',
            phonetic: 'PEE-poh ehs oon peen-GWEE-noh ah-LEH-greh keh VEE-veh ehn lohs glah-SYAH-rehs ah-SOO-lehs deh lah pah-tah-GOH-nyah.',
            wordPairs: [
              { id: 'pv1-1', spanish: 'Pipo', english: 'Pipo', phonetic: 'PEE-poh', meaning: 'Pipo (name)', partOfSpeech: 'Proper Noun' },
              { id: 'pv1-2', spanish: 'es', english: 'is', phonetic: 'ehs', meaning: 'is', partOfSpeech: 'Verb' },
              { id: 'pv1-3', spanish: 'un', english: 'a', phonetic: 'oon', meaning: 'a', partOfSpeech: 'Article' },
              { id: 'pv1-4', spanish: 'pingüino', english: 'penguin', phonetic: 'peen-GWEE-noh', meaning: 'penguin (umlaut ü is pronounced)', partOfSpeech: 'Noun (m)' },
              { id: 'pv1-5', spanish: 'alegre', english: 'cheerful', phonetic: 'ah-LEH-greh', meaning: 'cheerful / merry', partOfSpeech: 'Adjective' },
              { id: 'pv1-6', spanish: 'que', english: 'who', phonetic: 'keh', meaning: 'who / that', partOfSpeech: 'Pronoun' },
              { id: 'pv1-7', spanish: 'vive', english: 'lives', phonetic: 'VEE-veh', meaning: 'lives (vivir)', partOfSpeech: 'Verb' },
              { id: 'pv1-8', spanish: 'en', english: 'on', phonetic: 'ehn', meaning: 'in / on', partOfSpeech: 'Preposition' },
              { id: 'pv1-9', spanish: 'los glaciares', english: 'the glaciers', phonetic: 'lohs glah-SYAH-rehs', meaning: 'the glaciers', partOfSpeech: 'Noun (m pl)' },
              { id: 'pv1-10', spanish: 'azules', english: 'blue', phonetic: 'ah-SOO-lehs', meaning: 'blue (plural)', partOfSpeech: 'Adjective' }
            ]
          },
          {
            id: 's-4-1-2',
            spanish: 'Mira a las gaviotas en el cielo y sueña con volar muy alto.',
            english: 'He watches the seagulls in the sky and dreams of flying very high.',
            phonetic: 'MEE-rah ah lahs gah-VYOH-tahs ehn ehl SYEH-loh ee SWEH-nyah kohn voh-LAHR MOO-ee AHL-toh.',
            wordPairs: [
              { id: 'pv2-1', spanish: 'Mira', english: 'He watches', phonetic: 'MEE-rah', meaning: 'looks at / watches (mirar)', partOfSpeech: 'Verb' },
              { id: 'pv2-2', spanish: 'a las', english: 'the', phonetic: 'ah lahs', meaning: 'to the', partOfSpeech: 'Preposition' },
              { id: 'pv2-3', spanish: 'gaviotas', english: 'seagulls', phonetic: 'gah-VYOH-tahs', meaning: 'seagulls', partOfSpeech: 'Noun (f pl)' },
              { id: 'pv2-4', spanish: 'en', english: 'in', phonetic: 'ehn', meaning: 'in', partOfSpeech: 'Preposition' },
              { id: 'pv2-5', spanish: 'el', english: 'the', phonetic: 'ehl', meaning: 'the', partOfSpeech: 'Article' },
              { id: 'pv2-6', spanish: 'cielo', english: 'sky', phonetic: 'SYEH-loh', meaning: 'sky / heaven', partOfSpeech: 'Noun (m)' },
              { id: 'pv2-7', spanish: 'y', english: 'and', phonetic: 'ee', meaning: 'and', partOfSpeech: 'Conjunction' },
              { id: 'pv2-8', spanish: 'sueña con', english: 'dreams of', phonetic: 'SWEH-nyah kohn', meaning: 'dreams of (soñar con)', partOfSpeech: 'Verb phrase' },
              { id: 'pv2-9', spanish: 'volar', english: 'flying', phonetic: 'voh-LAHR', meaning: 'to fly', partOfSpeech: 'Infinitive' },
              { id: 'pv2-10', spanish: 'alto', english: 'high', phonetic: 'AHL-toh', meaning: 'high / tall', partOfSpeech: 'Adverb' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-4-2-1',
            spanish: 'Un día salta al océano y nada a gran velocidad entre peces de colores.',
            english: 'One day he leaps into the ocean and swims at high speed among colorful fish.',
            phonetic: 'oon DEE-ah SAHL-tah ahl oh-SEH-ah-noh ee NAH-dah ah grahn veh-loh-see-DAHD EHN-treh PEH-sehs deh koh-LOH-rehs.',
            wordPairs: [
              { id: 'pv3-1', spanish: 'Un día', english: 'One day', phonetic: 'oon DEE-ah', meaning: 'One day', partOfSpeech: 'Phrase' },
              { id: 'pv3-2', spanish: 'salta', english: 'leaps', phonetic: 'SAHL-tah', meaning: 'jumps / leaps (saltar)', partOfSpeech: 'Verb' },
              { id: 'pv3-3', spanish: 'al océano', english: 'into the ocean', phonetic: 'ahl oh-SEH-ah-noh', meaning: 'to the ocean', partOfSpeech: 'Phrase' },
              { id: 'pv3-4', spanish: 'y', english: 'and', phonetic: 'ee', meaning: 'and', partOfSpeech: 'Conjunction' },
              { id: 'pv3-5', spanish: 'nada', english: 'swims', phonetic: 'NAH-dah', meaning: 'swims (nadar)', partOfSpeech: 'Verb' },
              { id: 'pv3-6', spanish: 'a gran velocidad', english: 'at high speed', phonetic: 'ah grahn veh-loh-see-DAHD', meaning: 'at great speed', partOfSpeech: 'Idiom' },
              { id: 'pv3-7', spanish: 'entre', english: 'among', phonetic: 'EHN-treh', meaning: 'between / among', partOfSpeech: 'Preposition' },
              { id: 'pv3-8', spanish: 'peces', english: 'fish', phonetic: 'PEH-sehs', meaning: 'live fish (plural)', partOfSpeech: 'Noun (m pl)' }
            ]
          },
          {
            id: 's-4-2-2',
            spanish: '¡Comprende que nadar bajo el agua es su forma especial de volar!',
            english: 'He understands that swimming underwater is his special way of flying!',
            phonetic: 'kohm-PREHN-deh keh nah-DAHR BAH-hoh ehl AH-gwah ehs soo FOHR-mah ehs-peh-SYAHL deh voh-LAHR!',
            wordPairs: [
              { id: 'pv4-1', spanish: 'Comprende', english: 'He understands', phonetic: 'kohm-PREHN-deh', meaning: 'understands (comprender)', partOfSpeech: 'Verb' },
              { id: 'pv4-2', spanish: 'que', english: 'that', phonetic: 'keh', meaning: 'that', partOfSpeech: 'Conjunction' },
              { id: 'pv4-3', spanish: 'nadar', english: 'swimming', phonetic: 'nah-DAHR', meaning: 'to swim', partOfSpeech: 'Infinitive' },
              { id: 'pv4-4', spanish: 'bajo', english: 'under', phonetic: 'BAH-hoh', meaning: 'underneath', partOfSpeech: 'Preposition' },
              { id: 'pv4-5', spanish: 'el agua', english: 'the water', phonetic: 'ehl AH-gwah', meaning: 'the water (uses el despite feminine agua)', partOfSpeech: 'Noun' },
              { id: 'pv4-6', spanish: 'es', english: 'is', phonetic: 'ehs', meaning: 'is', partOfSpeech: 'Verb' },
              { id: 'pv4-7', spanish: 'su forma', english: 'his way', phonetic: 'soo FOHR-mah', meaning: 'his way / shape', partOfSpeech: 'Phrase' },
              { id: 'pv4-8', spanish: 'especial', english: 'special', phonetic: 'ehs-peh-SYAHL', meaning: 'special / unique', partOfSpeech: 'Adjective' },
              { id: 'pv4-9', spanish: 'de volar', english: 'of flying', phonetic: 'deh voh-LAHR', meaning: 'of flying', partOfSpeech: 'Phrase' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q4-1',
        question: 'What does Pipo realize about swimming underwater?',
        questionSpanish: '¿Qué comprende Pipo sobre nadar bajo el agua?',
        options: [
          'Es su forma especial de volar',
          'El agua está demasiado fría',
          'Prefiere caminar sobre la nieve',
          'Los peces tienen miedo'
        ],
        correctIndex: 0,
        explanation: 'He realizes that swimming underwater is his special way of flying!'
      }
    ]
  },

  // STORY 5
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
    synopsis: 'In an Andalusian white village, an olive tree guitar plays an enchanted flamenco melody under the full moon.',
    themeColor: 'from-purple-500/20 to-pink-500/20 border-purple-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-5-1-1',
            spanish: 'En un pueblo blanco de Andalucía vivía un joven músico llamado Manuel.',
            english: 'In a white village of Andalusia lived a young musician named Manuel.',
            phonetic: 'ehn oon PWEH-bloh BLAHN-koh deh ahn-dah-loo-SEE-ah vee-VEE-ah oon HOH-vehn MOO-see-koh yah-MAH-doh mah-NWEHL.',
            wordPairs: [
              { id: 'gl1-1', spanish: 'En', english: 'In', phonetic: 'ehn', meaning: 'In', partOfSpeech: 'Preposition' },
              { id: 'gl1-2', spanish: 'un pueblo', english: 'a village', phonetic: 'oon PWEH-bloh', meaning: 'a town / village', partOfSpeech: 'Noun (m)' },
              { id: 'gl1-3', spanish: 'blanco', english: 'white', phonetic: 'BLAHN-koh', meaning: 'white', partOfSpeech: 'Adjective' },
              { id: 'gl1-4', spanish: 'de Andalucía', english: 'of Andalusia', phonetic: 'deh ahn-dah-loo-SEE-ah', meaning: 'southern Spain region', partOfSpeech: 'Proper Noun' },
              { id: 'gl1-5', spanish: 'vivía', english: 'lived', phonetic: 'vee-VEE-ah', meaning: 'lived (imperfect of vivir)', partOfSpeech: 'Verb' },
              { id: 'gl1-6', spanish: 'un joven', english: 'a young', phonetic: 'oon HOH-vehn', meaning: 'a youth / young man', partOfSpeech: 'Noun' },
              { id: 'gl1-7', spanish: 'músico', english: 'musician', phonetic: 'MOO-see-koh', meaning: 'musician', partOfSpeech: 'Noun (m)' }
            ]
          },
          {
            id: 's-5-1-2',
            spanish: 'Manuel construyó una guitarra con madera de un olivo antiguo.',
            english: 'Manuel built a guitar with wood from an ancient olive tree.',
            phonetic: 'mah-NWEHL kohn-stroo-YOH OO-nah gee-TAH-rrah kohn mah-DEH-rah deh oon oh-LEE-voh ahn-TEE-gwoh.',
            wordPairs: [
              { id: 'gl2-1', spanish: 'Manuel', english: 'Manuel', phonetic: 'mah-NWEHL', meaning: 'Manuel', partOfSpeech: 'Proper Noun' },
              { id: 'gl2-2', spanish: 'construyó', english: 'built', phonetic: 'kohn-stroo-YOH', meaning: 'built (construir preterite)', partOfSpeech: 'Verb' },
              { id: 'gl2-3', spanish: 'una', english: 'a', phonetic: 'OO-nah', meaning: 'a', partOfSpeech: 'Article' },
              { id: 'gl2-4', spanish: 'guitarra', english: 'guitar', phonetic: 'gee-TAH-rrah', meaning: 'guitar', partOfSpeech: 'Noun (f)' },
              { id: 'gl2-5', spanish: 'con madera', english: 'with wood', phonetic: 'kohn mah-DEH-rah', meaning: 'with timber / wood', partOfSpeech: 'Phrase' },
              { id: 'gl2-6', spanish: 'de un olivo', english: 'from an olive tree', phonetic: 'deh oon oh-LEE-voh', meaning: 'of an olive tree', partOfSpeech: 'Phrase' },
              { id: 'gl2-7', spanish: 'antiguo', english: 'ancient', phonetic: 'ahn-TEE-gwoh', meaning: 'ancient / old', partOfSpeech: 'Adjective' }
            ]
          }
        ]
      },
      {
        id: 'p-2',
        paragraphIndex: 2,
        sentences: [
          {
            id: 's-5-2-1',
            spanish: 'Bajo la luna llena, la guitarra cantaba sola con una magia inolvidable.',
            english: 'Under the full moon, the guitar sang on its own with unforgettable magic.',
            phonetic: 'BAH-hoh lah LOO-nah YEH-nah, lah gee-TAH-rrah kahn-TAH-bah SOH-lah kohn OO-nah MAH-hyah een-ohl-vee-DAH-bleh.',
            wordPairs: [
              { id: 'gl3-1', spanish: 'Bajo', english: 'Under', phonetic: 'BAH-hoh', meaning: 'Under / Beneath', partOfSpeech: 'Preposition' },
              { id: 'gl3-2', spanish: 'la luna llena', english: 'the full moon', phonetic: 'lah LOO-nah YEH-nah', meaning: 'the full moon', partOfSpeech: 'Noun phrase' },
              { id: 'gl3-3', spanish: 'la guitarra', english: 'the guitar', phonetic: 'lah gee-TAH-rrah', meaning: 'the guitar', partOfSpeech: 'Noun (f)' },
              { id: 'gl3-4', spanish: 'cantaba', english: 'sang', phonetic: 'kahn-TAH-bah', meaning: 'sang (imperfect of cantar)', partOfSpeech: 'Verb' },
              { id: 'gl3-5', spanish: 'sola', english: 'alone', phonetic: 'SOH-lah', meaning: 'by itself / alone', partOfSpeech: 'Adverb' },
              { id: 'gl3-6', spanish: 'con magia', english: 'with magic', phonetic: 'kohn MAH-hyah', meaning: 'with enchantment', partOfSpeech: 'Phrase' },
              { id: 'gl3-7', spanish: 'inolvidable', english: 'unforgettable', phonetic: 'een-ohl-vee-DAH-bleh', meaning: 'unforgettable', partOfSpeech: 'Adjective' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q5-1',
        question: 'When did the guitar play on its own?',
        questionSpanish: '¿Cuándo cantaba sola la guitarra?',
        options: ['Bajo la luna llena', 'En una tarde lluviosa', 'Al mediodía', 'En una cueva oscura'],
        correctIndex: 0,
        explanation: 'Under the light of the full moon (Bajo la luna llena).'
      }
    ]
  },

  // STORY 6
  {
    id: 'story-fiesta-gatos',
    title: 'La Fiesta Secreta de los Gatos',
    titleEnglish: 'The Secret Party of the Cats',
    level: 'A2',
    levelBadge: 'A2 · Seville Humor',
    genre: 'Playful Fantasy',
    coverEmoji: '🐱🎉',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 4,
    synopsis: 'When midnight strikes over Seville, all the city cats gather on the historic tiled rooftops to dance flamenco.',
    themeColor: 'from-amber-400/20 to-purple-500/20 border-amber-400/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-6-1-1',
            spanish: 'A medianoche en Sevilla, cuando todos duermen, los gatos suben a los tejados.',
            english: 'At midnight in Seville, when everyone is sleeping, the cats climb up to the rooftops.',
            phonetic: 'ah meh-dyah-NOH-cheh ehn seh-VEE-yah, KWAHN-doh TOH-dohs DWEHR-mehn, lohs GAH-tohs SOO-behn ah lohs teh-HAH-dohs.',
            wordPairs: [
              { id: 'fg1-1', spanish: 'A medianoche', english: 'At midnight', phonetic: 'ah meh-dyah-NOH-cheh', meaning: 'At 12:00 AM', partOfSpeech: 'Idiom' },
              { id: 'fg1-2', spanish: 'en Sevilla', english: 'in Seville', phonetic: 'ehn seh-VEE-yah', meaning: 'in the city of Seville', partOfSpeech: 'Proper Noun' },
              { id: 'fg1-3', spanish: 'cuando', english: 'when', phonetic: 'KWAHN-doh', meaning: 'when', partOfSpeech: 'Conjunction' },
              { id: 'fg1-4', spanish: 'todos', english: 'everyone', phonetic: 'TOH-dohs', meaning: 'all people', partOfSpeech: 'Pronoun' },
              { id: 'fg1-5', spanish: 'duermen', english: 'sleep', phonetic: 'DWEHR-mehn', meaning: 'are sleeping (dormir)', partOfSpeech: 'Verb' },
              { id: 'fg1-6', spanish: 'los gatos', english: 'the cats', phonetic: 'lohs GAH-tohs', meaning: 'the cats', partOfSpeech: 'Noun (m pl)' },
              { id: 'fg1-7', spanish: 'suben', english: 'climb up', phonetic: 'SOO-behn', meaning: 'ascend / climb (subir)', partOfSpeech: 'Verb' },
              { id: 'fg1-8', spanish: 'a los tejados', english: 'to the rooftops', phonetic: 'ah lohs teh-HAH-dohs', meaning: 'to the roof tiles', partOfSpeech: 'Noun phrase' }
            ]
          },
          {
            id: 's-6-1-2',
            spanish: 'Un gato elegante con sombrero rojo toca castañuelas con sus patas.',
            english: 'An elegant cat with a red hat plays castanets with his paws.',
            phonetic: 'oon GAH-toh eh-leh-GAHN-teh kohn sohm-BREH-roh ROH-hoh TOH-kah kahs-tah-NYWEH-lahs kohn soos PAH-tahs.',
            wordPairs: [
              { id: 'fg2-1', spanish: 'Un gato', english: 'A cat', phonetic: 'oon GAH-toh', meaning: 'A cat', partOfSpeech: 'Noun (m)' },
              { id: 'fg2-2', spanish: 'elegante', english: 'elegant', phonetic: 'eh-leh-GAHN-teh', meaning: 'stylish / fancy', partOfSpeech: 'Adjective' },
              { id: 'fg2-3', spanish: 'con sombrero', english: 'with hat', phonetic: 'kohn sohm-BREH-roh', meaning: 'with a hat', partOfSpeech: 'Phrase' },
              { id: 'fg2-4', spanish: 'rojo', english: 'red', phonetic: 'ROH-hoh', meaning: 'red', partOfSpeech: 'Adjective' },
              { id: 'fg2-5', spanish: 'toca', english: 'plays', phonetic: 'TOH-kah', meaning: 'plays music (tocar)', partOfSpeech: 'Verb' },
              { id: 'fg2-6', spanish: 'castañuelas', english: 'castanets', phonetic: 'kahs-tah-NYWEH-lahs', meaning: 'wooden Spanish flamenco instruments', partOfSpeech: 'Noun (f pl)' },
              { id: 'fg2-7', spanish: 'con sus patas', english: 'with his paws', phonetic: 'kohn soos PAH-tahs', meaning: 'with his animal paws', partOfSpeech: 'Phrase' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q6-1',
        question: 'Where do the cats gather in Seville at midnight?',
        questionSpanish: '¿Dónde se reúnen los gatos a medianoche?',
        options: ['En los tejados de la ciudad', 'En el río', 'En el museo', 'En un barco'],
        correctIndex: 0,
        explanation: 'They climb up to the tiled rooftops (en los tejados).'
      }
    ]
  },

  // STORY 7
  {
    id: 'story-misterio-alhambra',
    title: 'El Misterio de la Alhambra',
    titleEnglish: 'The Mystery of the Alhambra',
    level: 'B1',
    levelBadge: 'B1 · Historical Mystery',
    genre: 'Archaeology & Code',
    coverEmoji: '🏰🗝️',
    accent: 'es-ES',
    country: 'Spain 🇪🇸',
    readTimeMinutes: 5,
    synopsis: 'An art restorer in Granada uncovers a bronze key with an Arabic poem hidden behind a tile in the Court of the Lions.',
    themeColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-7-1-1',
            spanish: 'La Alhambra guardaba secretos antiguos que pocos lograban comprender.',
            english: 'The Alhambra held ancient secrets that few managed to understand.',
            phonetic: 'lah ahl-AHM-brah gwahr-DAH-bah seh-KREH-tohs ahn-TEE-gwohs keh POH-kohs loh-GRAH-bahn kohm-prehn-DEHR.',
            wordPairs: [
              { id: 'ma1-1', spanish: 'La Alhambra', english: 'The Alhambra', phonetic: 'lah ahl-AHM-brah', meaning: 'Moorish palace fortress in Granada', partOfSpeech: 'Proper Noun' },
              { id: 'ma1-2', spanish: 'guardaba', english: 'held', phonetic: 'gwahr-DAH-bah', meaning: 'kept / guarded (guardar)', partOfSpeech: 'Verb' },
              { id: 'ma1-3', spanish: 'secretos', english: 'secrets', phonetic: 'seh-KREH-tohs', meaning: 'mysteries / secrets', partOfSpeech: 'Noun (m pl)' },
              { id: 'ma1-4', spanish: 'antiguos', english: 'ancient', phonetic: 'ahn-TEE-gwohs', meaning: 'ancient / antique', partOfSpeech: 'Adjective' },
              { id: 'ma1-5', spanish: 'que pocos', english: 'that few', phonetic: 'keh POH-kohs', meaning: 'that few people', partOfSpeech: 'Phrase' },
              { id: 'ma1-6', spanish: 'lograban', english: 'managed', phonetic: 'loh-GRAH-bahn', meaning: 'succeeded / achieved (lograr)', partOfSpeech: 'Verb' },
              { id: 'ma1-7', spanish: 'comprender', english: 'to understand', phonetic: 'kohm-prehn-DEHR', meaning: 'to comprehend', partOfSpeech: 'Infinitive' }
            ]
          },
          {
            id: 's-7-1-2',
            spanish: 'Elena descubrió una llave de bronce grabada con versos poéticos.',
            english: 'Elena discovered a bronze key engraved with poetic verses.',
            phonetic: 'eh-LEH-nah dehs-koo-BRYOH OO-nah YAH-veh deh BROHN-seh grah-BAH-dah kohn VEHR-sohs poh-EH-tee-kohs.',
            wordPairs: [
              { id: 'ma2-1', spanish: 'Elena', english: 'Elena', phonetic: 'eh-LEH-nah', meaning: 'Elena', partOfSpeech: 'Proper Noun' },
              { id: 'ma2-2', spanish: 'descubrió', english: 'discovered', phonetic: 'dehs-koo-BRYOH', meaning: 'uncovered / discovered (descubrir)', partOfSpeech: 'Verb' },
              { id: 'ma2-3', spanish: 'una llave', english: 'a key', phonetic: 'OO-nah YAH-veh', meaning: 'a key', partOfSpeech: 'Noun (f)' },
              { id: 'ma2-4', spanish: 'de bronce', english: 'of bronze', phonetic: 'deh BROHN-seh', meaning: 'made of bronze', partOfSpeech: 'Phrase' },
              { id: 'ma2-5', spanish: 'grabada', english: 'engraved', phonetic: 'grah-BAH-dah', meaning: 'carved / engraved', partOfSpeech: 'Participle' },
              { id: 'ma2-6', spanish: 'con versos', english: 'with verses', phonetic: 'kohn VEHR-sohs', meaning: 'with poetry lines', partOfSpeech: 'Phrase' },
              { id: 'ma2-7', spanish: 'poéticos', english: 'poetic', phonetic: 'poh-EH-tee-kohs', meaning: 'poetic', partOfSpeech: 'Adjective' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q7-1',
        question: 'What did Elena discover behind the palace tile?',
        questionSpanish: '¿Qué descubrió Elena detrás del azulejo?',
        options: ['Una llave de bronce con versos poéticos', 'Monedas romanas', 'Un libro de recetas', 'Una pluma dorada'],
        correctIndex: 0,
        explanation: 'She found an engraved bronze key with verses.'
      }
    ]
  },

  // STORY 8
  {
    id: 'story-galeon-perdido',
    title: 'El Enigma del Galeón Perdido',
    titleEnglish: 'The Enigma of the Lost Galleon',
    level: 'B1',
    levelBadge: 'B1 · Caribbean Mystery',
    genre: 'Seafaring Mystery',
    coverEmoji: '⛵🏴‍☠️',
    accent: 'es-ES',
    country: 'Colombia 🇨🇴',
    readTimeMinutes: 5,
    synopsis: 'Off the historic walled coast of Cartagena, a diver finds a sealed compass from a 17th-century treasure ship.',
    themeColor: 'from-blue-600/20 to-teal-500/20 border-blue-600/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-8-1-1',
            spanish: 'Frente a las murallas coloniales de Cartagena descansaba un barco hundido hace siglos.',
            english: 'In front of the colonial walls of Cartagena rested a ship sunken centuries ago.',
            phonetic: 'FREHN-teh ah lahs moo-RAH-yahs koh-loh-NYAH-lehs deh kahr-tah-HEH-nah dehs-kahn-SAH-bah oon BAHR-koh oon-DEE-doh AH-seh SEE-glohs.',
            wordPairs: [
              { id: 'gp1-1', spanish: 'Frente a', english: 'In front of', phonetic: 'FREHN-teh ah', meaning: 'Across from / in front of', partOfSpeech: 'Preposition' },
              { id: 'gp1-2', spanish: 'las murallas', english: 'the walls', phonetic: 'lahs moo-RAH-yahs', meaning: 'the fortified city walls', partOfSpeech: 'Noun (f pl)' },
              { id: 'gp1-3', spanish: 'coloniales', english: 'colonial', phonetic: 'koh-loh-NYAH-lehs', meaning: 'colonial historic', partOfSpeech: 'Adjective' },
              { id: 'gp1-4', spanish: 'de Cartagena', english: 'of Cartagena', phonetic: 'deh kahr-tah-HEH-nah', meaning: 'Cartagena de Indias', partOfSpeech: 'Proper Noun' },
              { id: 'gp1-5', spanish: 'descansaba', english: 'rested', phonetic: 'dehs-kahn-SAH-bah', meaning: 'rested / lay (descansar)', partOfSpeech: 'Verb' },
              { id: 'gp1-6', spanish: 'un barco', english: 'a ship', phonetic: 'oon BAHR-koh', meaning: 'a vessel / galleon', partOfSpeech: 'Noun (m)' },
              { id: 'gp1-7', spanish: 'hundido', english: 'sunken', phonetic: 'oon-DEE-doh', meaning: 'sunken (silent h)', partOfSpeech: 'Adjective' }
            ]
          },
          {
            id: 's-8-1-2',
            spanish: 'Un buzo halló una brújula de plata que aún señalaba hacia una isla secreta.',
            english: 'A diver found a silver compass that still pointed toward a secret island.',
            phonetic: 'oon BOO-soh ah-YOH OO-nah BROO-hoo-lah deh PLAH-tah keh ah-OON seh-nyah-LAH-bah AH-syah OO-nah EES-lah seh-KREH-tah.',
            wordPairs: [
              { id: 'gp2-1', spanish: 'Un buzo', english: 'A diver', phonetic: 'oon BOO-soh', meaning: 'A scuba diver', partOfSpeech: 'Noun (m)' },
              { id: 'gp2-2', spanish: 'halló', english: 'found', phonetic: 'ah-YOH', meaning: 'found / encountered (hallar)', partOfSpeech: 'Verb' },
              { id: 'gp2-3', spanish: 'una brújula', english: 'a compass', phonetic: 'OO-nah BROO-hoo-lah', meaning: 'a magnetic navigational compass', partOfSpeech: 'Noun (f)' },
              { id: 'gp2-4', spanish: 'de plata', english: 'of silver', phonetic: 'deh PLAH-tah', meaning: 'silver made', partOfSpeech: 'Phrase' },
              { id: 'gp2-5', spanish: 'que aún', english: 'that still', phonetic: 'keh ah-OON', meaning: 'that still / yet', partOfSpeech: 'Phrase' },
              { id: 'gp2-6', spanish: 'señalaba', english: 'pointed', phonetic: 'seh-nyah-LAH-bah', meaning: 'pointed / indicated (señalar)', partOfSpeech: 'Verb' },
              { id: 'gp2-7', spanish: 'hacia', english: 'toward', phonetic: 'AH-syah', meaning: 'toward (silent h)', partOfSpeech: 'Preposition' },
              { id: 'gp2-8', spanish: 'una isla', english: 'an island', phonetic: 'OO-nah EES-lah', meaning: 'an island', partOfSpeech: 'Noun (f)' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q8-1',
        question: 'What artifact did the diver find near Cartagena?',
        questionSpanish: '¿Qué artefacto encontró el buzo cerca de Cartagena?',
        options: ['Una brújula de plata', 'Un cofre de oro', 'Una campana de bronce', 'Un cañón antiguo'],
        correctIndex: 0,
        explanation: 'He found a silver compass that still pointed toward a secret island.'
      }
    ]
  },

  // STORY 9
  {
    id: 'story-jardin-medellin',
    title: 'El Jardín Botánico de Medellín',
    titleEnglish: 'The Botanical Garden of Medellín',
    level: 'B2',
    levelBadge: 'B2 · Science & Nature',
    genre: 'Colombian Wonder',
    coverEmoji: '🌺🌿',
    accent: 'es-ES',
    country: 'Colombia 🇨🇴',
    readTimeMinutes: 5,
    synopsis: 'In Medellín, the City of Eternal Spring, a botanist discovers an orchid with petals that illuminate softly at twilight.',
    themeColor: 'from-emerald-600/20 to-lime-500/20 border-emerald-600/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-9-1-1',
            spanish: 'Medellín, conocida como la ciudad de la eterna primavera, alberga miles de orquídeas exóticas.',
            english: 'Medellín, known as the city of eternal spring, shelters thousands of exotic orchids.',
            phonetic: 'meh-deh-YEEN, koh-noh-SEE-dah KOH-moh lah syoo-DAHD deh lah eh-TEHR-nah pree-mah-VEH-rah, ahl-BEHR-gah MEE-lehs deh ohr-KEE-dehyahs ehk-SOH-tee-kahs.',
            wordPairs: [
              { id: 'jm1-1', spanish: 'Medellín', english: 'Medellín', phonetic: 'meh-deh-YEEN', meaning: 'City in Colombia', partOfSpeech: 'Proper Noun' },
              { id: 'jm1-2', spanish: 'conocida como', english: 'known as', phonetic: 'koh-noh-SEE-dah KOH-moh', meaning: 'renowned as', partOfSpeech: 'Phrase' },
              { id: 'jm1-3', spanish: 'la ciudad', english: 'the city', phonetic: 'lah syoo-DAHD', meaning: 'the city', partOfSpeech: 'Noun (f)' },
              { id: 'jm1-4', spanish: 'de la eterna primavera', english: 'of eternal spring', phonetic: 'deh lah eh-TEHR-nah pree-mah-VEH-rah', meaning: 'celebrated Colombian moniker', partOfSpeech: 'Phrase' },
              { id: 'jm1-5', spanish: 'alberga', english: 'shelters', phonetic: 'ahl-BEHR-gah', meaning: 'houses / harbors (albergar)', partOfSpeech: 'Verb' },
              { id: 'jm1-6', spanish: 'orquídeas', english: 'orchids', phonetic: 'ohr-KEE-dehyahs', meaning: "Colombia's national flower", partOfSpeech: 'Noun (f pl)' }
            ]
          },
          {
            id: 's-9-1-2',
            spanish: 'Durante el crepúsculo, una flor brillante iluminó la sombra con resplandores esmeralda.',
            english: 'During twilight, a glowing flower illuminated the shade with emerald gleams.',
            phonetic: 'doo-RAHN-teh ehl kreh-POOS-koo-loh, OO-nah FLOHR bree-YAHN-teh ee-loo-mee-NOH lah SOHM-brah kohn rehs-plahn-DOH-rehs ehs-meh-RAHL-dah.',
            wordPairs: [
              { id: 'jm2-1', spanish: 'Durante', english: 'During', phonetic: 'doo-RAHN-teh', meaning: 'Throughout / during', partOfSpeech: 'Preposition' },
              { id: 'jm2-2', spanish: 'el crepúsculo', english: 'twilight', phonetic: 'ehl kreh-POOS-koo-loh', meaning: 'dusk / twilight', partOfSpeech: 'Noun (m)' },
              { id: 'jm2-3', spanish: 'una flor', english: 'a flower', phonetic: 'OO-nah FLOHR', meaning: 'a blossom / flower', partOfSpeech: 'Noun (f)' },
              { id: 'jm2-4', spanish: 'brillante', english: 'glowing', phonetic: 'bree-YAHN-teh', meaning: 'luminous / shiny', partOfSpeech: 'Adjective' },
              { id: 'jm2-5', spanish: 'iluminó', english: 'illuminated', phonetic: 'ee-loo-mee-NOH', meaning: 'lit up (iluminar)', partOfSpeech: 'Verb' },
              { id: 'jm2-6', spanish: 'la sombra', english: 'the shade', phonetic: 'lah SOHM-brah', meaning: 'shadow / shade', partOfSpeech: 'Noun (f)' },
              { id: 'jm2-7', spanish: 'esmeralda', english: 'emerald', phonetic: 'ehs-meh-RAHL-dah', meaning: 'emerald green', partOfSpeech: 'Adjective' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q9-1',
        question: 'What is Medellín famously known as?',
        questionSpanish: '¿Cómo es conocida popularmente Medellín?',
        options: [
          'La ciudad de la eterna primavera',
          'La ciudad de las murallas',
          'La capital del viento',
          'La isla del sol'
        ],
        correctIndex: 0,
        explanation: 'Medellín is celebrated worldwide as La Ciudad de la Eterna Primavera.'
      }
    ]
  },

  // STORY 10
  {
    id: 'story-reloj-oaxaca',
    title: 'El Reloj Perdido de Oaxaca',
    titleEnglish: 'The Lost Watch of Oaxaca',
    level: 'B2',
    levelBadge: 'B2 · Magical Realism',
    genre: 'Mexican Folklore & Wonder',
    coverEmoji: '⏳🏵️',
    accent: 'es-MX',
    country: 'Mexico 🇲🇽',
    readTimeMinutes: 5,
    synopsis: 'In an antique shop in Oaxaca, an antique pocket watch doesn’t count standard hours, but the moments of purest happiness.',
    themeColor: 'from-rose-500/20 to-amber-500/20 border-rose-500/40',
    paragraphs: [
      {
        id: 'p-1',
        paragraphIndex: 1,
        sentences: [
          {
            id: 's-10-1-1',
            spanish: 'En el colorido mercado de Oaxaca descansaba un reloj de bolsillo plateado y mágico.',
            english: 'In the colorful market of Oaxaca rested a silver and magical pocket watch.',
            phonetic: 'ehn ehl koh-loh-REE-doh mehr-KAH-doh deh wah-HAH-kah dehs-kahn-SAH-bah oon rreh-LOH deh bohl-SEE-yoh plah-teh-AH-doh ee MAH-hee-koh.',
            wordPairs: [
              { id: 'ro1-1', spanish: 'En el', english: 'In the', phonetic: 'ehn ehl', meaning: 'In the', partOfSpeech: 'Phrase' },
              { id: 'ro1-2', spanish: 'colorido mercado', english: 'colorful market', phonetic: 'koh-loh-REE-doh mehr-KAH-doh', meaning: 'vibrant bazaar', partOfSpeech: 'Noun phrase' },
              { id: 'ro1-3', spanish: 'de Oaxaca', english: 'of Oaxaca', phonetic: 'deh wah-HAH-kah', meaning: 'Oaxaca state in Mexico', partOfSpeech: 'Proper Noun' },
              { id: 'ro1-4', spanish: 'descansaba', english: 'rested', phonetic: 'dehs-kahn-SAH-bah', meaning: 'rested (descansar)', partOfSpeech: 'Verb' },
              { id: 'ro1-5', spanish: 'un reloj', english: 'a watch', phonetic: 'oon rreh-LOH', meaning: 'a timepiece / clock', partOfSpeech: 'Noun (m)' },
              { id: 'ro1-6', spanish: 'de bolsillo', english: 'pocket', phonetic: 'deh bohl-SEE-yoh', meaning: 'pocket style', partOfSpeech: 'Phrase' },
              { id: 'ro1-7', spanish: 'plateado', english: 'silver', phonetic: 'plah-teh-AH-doh', meaning: 'silver plated', partOfSpeech: 'Adjective' },
              { id: 'ro1-8', spanish: 'mágico', english: 'magical', phonetic: 'MAH-hee-koh', meaning: 'enchanted', partOfSpeech: 'Adjective' }
            ]
          },
          {
            id: 's-10-1-2',
            spanish: 'El anciano sonrió: "Este reloj solo cuenta los instantes en que fuiste feliz."',
            english: 'The old man smiled: "This watch only counts the moments in which you were happy."',
            phonetic: 'ehl ahn-SYAH-noh sohn-RYOH: EHS-teh rreh-LOH SOH-loh KWEHN-tah lohs eens-TAHN-tehs ehn keh FWEE-steh feh-LEES.',
            wordPairs: [
              { id: 'ro2-1', spanish: 'El anciano', english: 'The old man', phonetic: 'ehl ahn-SYAH-noh', meaning: 'The elder gentleman', partOfSpeech: 'Noun (m)' },
              { id: 'ro2-2', spanish: 'sonrió', english: 'smiled', phonetic: 'sohn-RYOH', meaning: 'smiled (sonreír)', partOfSpeech: 'Verb' },
              { id: 'ro2-3', spanish: 'Este reloj', english: 'This watch', phonetic: 'EHS-teh rreh-LOH', meaning: 'This timepiece', partOfSpeech: 'Phrase' },
              { id: 'ro2-4', spanish: 'solo', english: 'only', phonetic: 'SOH-loh', meaning: 'solely / only', partOfSpeech: 'Adverb' },
              { id: 'ro2-5', spanish: 'cuenta', english: 'counts', phonetic: 'KWEHN-tah', meaning: 'counts (contar)', partOfSpeech: 'Verb' },
              { id: 'ro2-6', spanish: 'los instantes', english: 'the moments', phonetic: 'lohs eens-TAHN-tehs', meaning: 'the moments', partOfSpeech: 'Noun (m pl)' },
              { id: 'ro2-7', spanish: 'en que', english: 'in which', phonetic: 'ehn keh', meaning: 'wherein / in which', partOfSpeech: 'Phrase' },
              { id: 'ro2-8', spanish: 'fuiste', english: 'you were', phonetic: 'FWEE-steh', meaning: 'you were (ser preterite)', partOfSpeech: 'Verb' },
              { id: 'ro2-9', spanish: 'feliz', english: 'happy', phonetic: 'feh-LEES', meaning: 'joyful / happy', partOfSpeech: 'Adjective' }
            ]
          }
        ]
      }
    ],
    comprehensionQuiz: [
      {
        id: 'q10-1',
        question: 'What do the hands of the antique watch measure?',
        questionSpanish: '¿Qué mide el reloj de bolsillo según el anciano?',
        options: [
          'Los instantes en que fuiste feliz',
          'Las horas de trabajo en el campo',
          'El precio del chocolate oaxaqueño',
          'Los días de lluvia del año'
        ],
        correctIndex: 0,
        explanation: 'It measures the precious moments in which you were genuinely happy!'
      }
    ]
  }
];
