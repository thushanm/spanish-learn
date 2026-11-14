import { TrickySound } from '../types';

export const TRICKY_SOUNDS: TrickySound[] = [
  {
    id: 'sound-rr',
    symbol: 'rr / r-',
    name: 'El Rolled R (Trill Alveolar)',
    description: 'The famous Spanish rolled R is created when the tip of your tongue vibrates against the alveolar ridge (just behind your upper front teeth) powered by exhaled airflow.',
    howToProduce: [
      'Relax your tongue and place the very tip against the roof of your mouth, just behind your upper teeth.',
      'Do not push hard — keep the sides of your tongue sealed against your upper molars while leaving the tip relaxed.',
      'Exhale air forcefully over the tongue tip so the air pressure makes the tip flutter like a flag in high wind.',
      'Practice saying "butter", "ladder", or "pot of tea" quickly in American English to feel the tongue tap the same spot!'
    ],
    audioExamples: [
      { spanish: 'perro', english: 'dog (contrast with "pero" = but)', phonetic: 'PEH-rroh' },
      { spanish: 'ferrocarril', english: 'railroad (double test!)', phonetic: 'feh-rroh-kah-RREEL' },
      { spanish: 'guitarra', english: 'guitar', phonetic: 'gee-TAH-rrah' },
      { spanish: 'rápido', english: 'fast (starts with rolled r)', phonetic: 'RRAH-pee-dhoh' }
    ],
    challengeWords: [
      {
        id: 'tc-1',
        spanish: 'El perro corre rápido por el ferrocarril',
        english: 'The dog runs fast along the railroad',
        phonetic: 'ehl PEH-rroh KOH-rreh RRAH-pee-dhoh pohr ehl feh-rroh-kah-RREEL',
        category: 'Trill Drill',
        level: 'A2',
        exampleSpanish: 'Un trabalenguas clásico para ejercitar la lengua.',
        exampleEnglish: 'A classic tongue twister to exercise the tongue.',
        difficulty: 4
      },
      {
        id: 'tc-2',
        spanish: 'Erre con erre cigarro, erre con erre barril',
        english: 'R with R cigar, R with R barrel (famous Spanish tongue twister)',
        phonetic: 'EH-rreh kohn EH-rreh see-GAH-rroh, EH-rreh kohn EH-rreh bah-RREEL',
        category: 'Tongue Twister',
        level: 'B1',
        exampleSpanish: 'Rápido corren los carros cargados de azúcar del ferrocarril.',
        exampleEnglish: 'Fast run the cars loaded with sugar on the railroad.',
        difficulty: 5
      }
    ]
  },
  {
    id: 'sound-j',
    symbol: 'j / ge, gi',
    name: 'La Jota y Ge (Fricativa Velar)',
    description: 'In Spanish, "J" (and "G" before E or I) is pronounced from the back of the throat. In Spain it has a raspy, forceful friction, while in Latin America it is softer like a breathy English "H".',
    howToProduce: [
      'Raise the back of your tongue toward your soft palate (the roof of your throat).',
      'Blow air through the narrow channel to create a friction sound, like clearing your throat or whispering the word "loch".',
      'Never pronounce Spanish "J" like the English "J" in "jump"!'
    ],
    audioExamples: [
      { spanish: 'jamón', english: 'ham', phonetic: 'hah-MOHN' },
      { spanish: 'gente', english: 'people', phonetic: 'HEHN-teh' },
      { spanish: 'rojo', english: 'red', phonetic: 'RROH-hoh' },
      { spanish: 'jardín', english: 'garden', phonetic: 'hahr-DHEEN' }
    ],
    challengeWords: [
      {
        id: 'tc-3',
        spanish: 'Jorge come jamón con jugo de naranja en el jardín',
        english: 'Jorge eats ham with orange juice in the garden',
        phonetic: 'HOHR-heh KOH-meh hah-MOHN kohn HOO-goh deh nah-RAHN-hah ehn ehl hahr-DHEEN',
        category: 'Jota Drill',
        level: 'A2',
        exampleSpanish: 'Practica la fuerza de la garganta en cada jota.',
        exampleEnglish: 'Practice throat friction on each J.',
        difficulty: 3
      }
    ]
  },
  {
    id: 'sound-enye',
    symbol: 'ñ',
    name: 'La Eñe [ɲ] (Nasal Palatal)',
    description: 'The unique Spanish letter Ñ is an icon of the language. It sounds like the "ny" in "canyon" or the "ni" in "onion".',
    howToProduce: [
      'Flatten the middle of your tongue firmly against the hard roof of your mouth.',
      'Release the air through your nose while voicing a sound, transitioning smoothly into the following vowel.'
    ],
    audioExamples: [
      { spanish: 'niño', english: 'boy / child', phonetic: 'NEE-nyoh' },
      { spanish: 'año', english: 'year', phonetic: 'AH-nyoh' },
      { spanish: 'mañana', english: 'tomorrow / morning', phonetic: 'mah-NYAH-nah' },
      { spanish: 'montaña', english: 'mountain', phonetic: 'mohn-TAH-nyah' }
    ],
    challengeWords: [
      {
        id: 'tc-4',
        spanish: 'El niño sueña con viajar a las montañas este año',
        english: 'The boy dreams of traveling to the mountains this year',
        phonetic: 'ehl NEE-nyoh SWEH-nyah kohn vyah-HAHR ah lahs mohn-TAH-nyahs EHS-teh AH-nyoh',
        category: 'Eñe Drill',
        level: 'A2',
        exampleSpanish: 'Un ejemplo hermoso con cuatro sonidos de eñe.',
        exampleEnglish: 'A beautiful sentence featuring four Ñ sounds.',
        difficulty: 3
      }
    ]
  },
  {
    id: 'sound-bv',
    symbol: 'b / v',
    name: 'La B y V (Fricativa Bilabial)',
    description: 'In Spanish, B and V make the exact same sound! Between vowels, both become a soft bilabial fricative where the lips do not fully press together, allowing air to glide through.',
    howToProduce: [
      'Unlike English "V", your upper teeth NEVER bite down on your lower lip.',
      'Instead, bring both lips close together without touching completely and let your voice hum through them gently.'
    ],
    audioExamples: [
      { spanish: 'beber vino', english: 'to drink wine (sounds identical in initial consonant)', phonetic: 'beh-BVEHR VEE-noh' },
      { spanish: 'la vida', english: 'life (soft between vowels)', phonetic: 'lah VEE-dhah' },
      { spanish: 'abuela', english: 'grandmother', phonetic: 'ah-BVWEH-lah' }
    ],
    challengeWords: [
      {
        id: 'tc-5',
        spanish: 'Vamos a beber buen vino y vivir la vida buena',
        english: 'Let us drink good wine and live the good life',
        phonetic: 'VAH-mohs ah beh-BVEHR bwehn VEE-noh ee vee-VEER lah VEE-dhah BWEH-nah',
        category: 'B and V Harmony',
        level: 'B1',
        exampleSpanish: 'Observa cómo los labios se mueven con suavidad.',
        exampleEnglish: 'Notice how the lips move with soft gentleness.',
        difficulty: 3
      }
    ]
  }
];
