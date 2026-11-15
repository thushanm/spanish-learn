export interface CinemaWordBreakdown {
  word: string;
  meaning: string;
  phonetic: string;
  notes?: string;
}

export interface CinemaClip {
  id: string;
  title: string;
  mediaType: 'series' | 'movie';
  country: string;
  countryCode: string;
  year: number;
  speaker: string;
  role: string;
  youtubeId: string;
  startSeconds: number;
  endSeconds: number;
  spanishDialogue: string;
  englishTranslation: string;
  phoneticDialogue: string;
  level: 'A1' | 'A2' | 'B1' | 'B2';
  themeBadge: string;
  culturalContext: string;
  grammarFocus: string;
  vocab: CinemaWordBreakdown[];
}

export const CINEMA_CLIPS: CinemaClip[] = [
  {
    id: 'clip-money-heist-profesor',
    title: 'La Casa de Papel (Money Heist)',
    mediaType: 'series',
    country: 'Spain 🇪🇸',
    countryCode: 'es-ES',
    year: 2017,
    speaker: 'El Profesor',
    role: 'Mastermind',
    youtubeId: '3pX_4yP7q4M',
    startSeconds: 12,
    endSeconds: 22,
    spanishDialogue: 'Primero: no habrá derramamiento de sangre. Segundo: nadie sabe nuestros nombres.',
    englishTranslation: 'First: there will be no bloodshed. Second: no one knows our names.',
    phoneticDialogue: 'pree-MEH-roh: noh ah-BRAH deh-rah-mah-MYEHN-toh deh SAHN-greh. seh-GOON-doh: NAH-dyeh SAH-beh NWEHS-trohs NOHM-brehs',
    level: 'B1',
    themeBadge: 'Peninsular Spanish · Strategy',
    culturalContext: 'In Peninsular Spanish, the future tense "habrá" is used with high authority. The word "derramamiento" comes from the verb "derramar" (to spill).',
    grammarFocus: 'Impersonal future of "haber" (habrá) + Negative indefinite pronoun "nadie".',
    vocab: [
      { word: 'Primero', meaning: 'First / Firstly', phonetic: 'pree-MEH-roh' },
      { word: 'Habrá', meaning: 'There will be (future of hay)', phonetic: 'ah-BRAH' },
      { word: 'Derramamiento', meaning: 'Spilling / Shedding', phonetic: 'deh-rah-mah-MYEHN-toh' },
      { word: 'Sangre', meaning: 'Blood', phonetic: 'SAHN-greh' },
      { word: 'Nadie', meaning: 'Nobody / No one', phonetic: 'NAH-dyeh' },
      { word: 'Nuestros', meaning: 'Our (plural masculine)', phonetic: 'NWEHS-trohs' },
      { word: 'Nombres', meaning: 'Names', phonetic: 'NOHM-brehs' }
    ]
  },
  {
    id: 'clip-coco-miguel',
    title: 'Coco (Disney / Pixar)',
    mediaType: 'movie',
    country: 'Mexico 🇲🇽',
    countryCode: 'es-MX',
    year: 2017,
    speaker: 'Miguel',
    role: 'Young Musician',
    youtubeId: 'awzWdtCkeMc',
    startSeconds: 45,
    endSeconds: 54,
    spanishDialogue: '¡La música es mi vida! No me puedes prohibir quién soy.',
    englishTranslation: 'Music is my life! You cannot forbid me from being who I am.',
    phoneticDialogue: 'lah MOO-see-kah ehs mee VEE-dah! noh meh PWEH-dehs proh-ee-BEER kyehn soy.',
    level: 'A1',
    themeBadge: 'Mexican Spanish · Passion & Family',
    culturalContext: 'Mexican Spanish pronunciation uses soft "s" sounds ("seseo") where "c" and "z" sound like "s". "Prohibir" has a silent "h".',
    grammarFocus: 'Modal verb "poder" (puedes) + Direct Object pronoun (me) + Infinitive (prohibir).',
    vocab: [
      { word: 'Música', meaning: 'Music', phonetic: 'MOO-see-kah' },
      { word: 'Vida', meaning: 'Life', phonetic: 'VEE-dah' },
      { word: 'Puedes', meaning: 'You can (from poder)', phonetic: 'PWEH-dehs' },
      { word: 'Prohibir', meaning: 'To forbid / prohibit', phonetic: 'proh-ee-BEER' },
      { word: 'Quién', meaning: 'Who', phonetic: 'kyehn' },
      { word: 'Soy', meaning: 'I am (from ser)', phonetic: 'soy' }
    ]
  },
  {
    id: 'clip-money-heist-nairobi',
    title: 'La Casa de Papel (Money Heist)',
    mediaType: 'series',
    country: 'Spain 🇪🇸',
    countryCode: 'es-ES',
    year: 2017,
    speaker: 'Nairobi',
    role: 'Heist Leader',
    youtubeId: 'totA3Uv0Dkc',
    startSeconds: 8,
    endSeconds: 17,
    spanishDialogue: '¡A ver, todos escuchen! A partir de ahora, empieza el matriarcado.',
    englishTranslation: 'Let’s see, everyone listen! From now on, the matriarchy begins.',
    phoneticDialogue: 'ah VEHR, TOH-dohs ehs-KOO-chehn! ah pahr-TEER deh ah-OH-rah, ehm-PYEH-sah ehl mah-tree-ahr-KAH-doh.',
    level: 'B1',
    themeBadge: 'Iconic TV Line · Madrid Slang',
    culturalContext: '"¡A ver!" is one of Spain’s most common everyday conversation starters, meaning "Listen up!" or "Let\'s see". This scene became a worldwide pop culture phenomenon.',
    grammarFocus: 'Idiomatic expression "A partir de ahora" (from now on) + Present indicative for assertive declaration.',
    vocab: [
      { word: 'A ver', meaning: 'Let’s see / Listen up', phonetic: 'ah VEHR' },
      { word: 'Todos', meaning: 'Everyone / All', phonetic: 'TOH-dohs' },
      { word: 'Escuchen', meaning: 'Listen! (imperative plural)', phonetic: 'ehs-KOO-chehn' },
      { word: 'A partir de', meaning: 'Starting from / as of', phonetic: 'ah pahr-TEER deh' },
      { word: 'Ahora', meaning: 'Now', phonetic: 'ah-OH-rah' },
      { word: 'Empieza', meaning: 'Begins / starts (empezar)', phonetic: 'ehm-PYEH-sah' },
      { word: 'Matriarcado', meaning: 'Matriarchy', phonetic: 'mah-tree-ahr-KAH-doh' }
    ]
  },
  {
    id: 'clip-elite-samuel',
    title: 'Élite (Netflix)',
    mediaType: 'series',
    country: 'Spain 🇪🇸',
    countryCode: 'es-ES',
    year: 2018,
    speaker: 'Samuel',
    role: 'Student',
    youtubeId: 'p4jS_c5kC7o',
    startSeconds: 20,
    endSeconds: 29,
    spanishDialogue: 'En este lugar todo el mundo miente, pero algunos mentimos mejor que otros.',
    englishTranslation: 'In this place everyone lies, but some of us lie better than others.',
    phoneticDialogue: 'ehn EHS-teh loo-GAHR TOH-doh ehl MOON-doh MYEHN-teh, PEH-roh ahl-GOO-nohs mehn-TEE-mohs meh-HOHR keh OH-trohs.',
    level: 'B1',
    themeBadge: 'Madrid Teen Drama · Daily Vocabulary',
    culturalContext: '"Todo el mundo" is the universal Spanish expression for "everyone" (literally "all the world"). Notice the verb conjugation difference: "miente" (singular for todo el mundo) vs "mentimos" (we lie).',
    grammarFocus: 'Irregular stem-changing verb "mentir" (e -> ie: él miente) vs regular nosotros form (mentimos).',
    vocab: [
      { word: 'Lugar', meaning: 'Place', phonetic: 'loo-GAHR' },
      { word: 'Todo el mundo', meaning: 'Everyone / everybody', phonetic: 'TOH-doh ehl MOON-doh' },
      { word: 'Miente', meaning: 'Lies (he/she lies)', phonetic: 'MYEHN-teh' },
      { word: 'Algunos', meaning: 'Some (people)', phonetic: 'ahl-GOO-nohs' },
      { word: 'Mentimos', meaning: 'We lie (mentir)', phonetic: 'mehn-TEE-mohs' },
      { word: 'Mejor que', meaning: 'Better than', phonetic: 'meh-HOHR keh' },
      { word: 'Otros', meaning: 'Others', phonetic: 'OH-trohs' }
    ]
  },
  {
    id: 'clip-encanto-mirabel',
    title: 'Encanto (Disney)',
    mediaType: 'movie',
    country: 'Colombia 🇨🇴',
    countryCode: 'es-CO',
    year: 2021,
    speaker: 'Mirabel Madrigal',
    role: 'Protagonist',
    youtubeId: 'Rvr68u635NI',
    startSeconds: 15,
    endSeconds: 25,
    spanishDialogue: 'Incluso en nuestros momentos más oscuros, siempre hay una luz.',
    englishTranslation: 'Even in our darkest moments, there is always a light.',
    phoneticDialogue: 'een-KLOO-soh ehn NWEHS-trohs moh-MEHN-tohs mahs ohs-KOO-rohs, SYEHM-preh eye OO-nah loos.',
    level: 'A2',
    themeBadge: 'Colombian Spanish · Inspiration',
    culturalContext: 'Colombian Spanish is known for its clear diction and musical rhythm. "Incluso" means "even", and "hay" means "there is / there are".',
    grammarFocus: 'Superlative construction "más + adjective" (más oscuros = darkest) + Existential "hay".',
    vocab: [
      { word: 'Incluso', meaning: 'Even / including', phonetic: 'een-KLOO-soh' },
      { word: 'Momentos', meaning: 'Moments', phonetic: 'moh-MEHN-tohs' },
      { word: 'Más', meaning: 'More / most', phonetic: 'mahs' },
      { word: 'Oscuros', meaning: 'Dark (plural)', phonetic: 'ohs-KOO-rohs' },
      { word: 'Siempre', meaning: 'Always', phonetic: 'SYEHM-preh' },
      { word: 'Hay', meaning: 'There is / there are', phonetic: 'eye' },
      { word: 'Luz', meaning: 'Light', phonetic: 'loos' }
    ]
  },
  {
    id: 'clip-laberinto-mercedes',
    title: 'El Laberinto del Fauno (Pan’s Labyrinth)',
    mediaType: 'movie',
    country: 'Spain 🇪🇸',
    countryCode: 'es-ES',
    year: 2006,
    speaker: 'Mercedes',
    role: 'Rebel Housekeeper',
    youtubeId: 'totA3Uv0Dkc',
    startSeconds: 40,
    endSeconds: 50,
    spanishDialogue: 'Hace mucho tiempo, en un reino subterráneo, existía una princesa que soñaba con el mundo humano.',
    englishTranslation: 'A long time ago, in an underground kingdom, there existed a princess who dreamed of the human world.',
    phoneticDialogue: 'AH-seh MOO-choh TYEHM-poh, ehn oon RRAY-noh soob-teh-RRAH-neh-oh, ehk-sees-TEE-ah OO-nah preen-SEH-sah keh soh-NYAH-bah kohn ehl MOON-doh oo-MAH-noh.',
    level: 'B2',
    themeBadge: 'Cinematic Masterpiece · Storytelling',
    culturalContext: 'Masterful Guillermo del Toro dialogue. "Hace mucho tiempo" is the classic Spanish opening for legends and fairy tales, equivalent to "Once upon a time".',
    grammarFocus: 'Past Imperfect tense for narrative scene setting ("existía", "soñaba") + Preposition "soñar con" (to dream of/about).',
    vocab: [
      { word: 'Hace mucho tiempo', meaning: 'A long time ago', phonetic: 'AH-seh MOO-choh TYEHM-poh' },
      { word: 'Reino', meaning: 'Kingdom / realm', phonetic: 'RRAY-noh' },
      { word: 'Subterráneo', meaning: 'Underground', phonetic: 'soob-teh-RRAH-neh-oh' },
      { word: 'Existía', meaning: 'There existed (imperfect)', phonetic: 'ehk-sees-TEE-ah' },
      { word: 'Princesa', meaning: 'Princess', phonetic: 'preen-SEH-sah' },
      { word: 'Soñaba con', meaning: 'Dreamed of / about', phonetic: 'soh-NYAH-bah kohn' },
      { word: 'Mundo humano', meaning: 'Human world', phonetic: 'MOON-doh oo-MAH-noh' }
    ]
  },
  {
    id: 'clip-cafe-madrid',
    title: 'Vida en Madrid (Everyday Street Spanish)',
    mediaType: 'series',
    country: 'Spain 🇪🇸',
    countryCode: 'es-ES',
    year: 2023,
    speaker: 'Cliente en Bar',
    role: 'Daily Spanish Speaker',
    youtubeId: 'awzWdtCkeMc',
    startSeconds: 5,
    endSeconds: 15,
    spanishDialogue: '¡Buenos días! ¿Nos puedes poner dos cafés con leche y unos churros, por favor?',
    englishTranslation: 'Good morning! Could you get us two coffees with milk and some churros, please?',
    phoneticDialogue: 'BWEH-nohs DEE-ahs! nohs PWEH-dehs poh-NEHR dohs kah-FEHS kohn LEH-cheh ee OO-nohs CHOO-rrohs, pohr fah-VOHR?',
    level: 'A1',
    themeBadge: 'Real-Life Survival · Spanish Tapas Bar',
    culturalContext: 'In Spain, Spaniards don\'t say "puedo tener" (can I have). Instead, they naturally say "¿Nos puedes poner...?" or simply "Ponme dos cafés". It is warm, polite, and authentic.',
    grammarFocus: 'Verbal idiom "poner" in Spanish hospitality + plural articles "unos churros".',
    vocab: [
      { word: 'Buenos días', meaning: 'Good morning', phonetic: 'BWEH-nohs DEE-ahs' },
      { word: 'Nos puedes poner', meaning: 'Could you serve/get us', phonetic: 'nohs PWEH-dehs poh-NEHR' },
      { word: 'Café con leche', meaning: 'Coffee with milk', phonetic: 'kah-FEH kohn LEH-cheh' },
      { word: 'Churros', meaning: 'Spanish churros', phonetic: 'CHOO-rrohs' },
      { word: 'Por favor', meaning: 'Please', phonetic: 'pohr fah-VOHR' }
    ]
  },
  {
    id: 'clip-roma-cuaron',
    title: 'Roma (Alfonso Cuarón)',
    mediaType: 'movie',
    country: 'Mexico 🇲🇽',
    countryCode: 'es-MX',
    year: 2018,
    speaker: 'Sofía',
    role: 'Mother',
    youtubeId: '3pX_4yP7q4M',
    startSeconds: 30,
    endSeconds: 39,
    spanishDialogue: 'No importa lo que te digan, las mujeres siempre estamos solas.',
    englishTranslation: 'No matter what they tell you, women are always alone.',
    phoneticDialogue: 'noh eem-POHR-tah loh keh teh DEE-gahn, lahs moo-HEH-rehs SYEHM-preh ehs-TAH-mohs SOH-lahs.',
    level: 'B2',
    themeBadge: 'Academy Award Winner · Deep Subjunctive',
    culturalContext: 'Deeply moving Oscar-winning line from Alfonso Cuarón\'s Roma. The subjunctive "digan" represents uncertainty or whatever people might say.',
    grammarFocus: 'Subjunctive mood after "lo que" with non-specific antecedent: "lo que te digan" (whatever they might tell you).',
    vocab: [
      { word: 'No importa', meaning: 'It doesn’t matter', phonetic: 'noh eem-POHR-tah' },
      { word: 'Lo que', meaning: 'What / that which', phonetic: 'loh keh' },
      { word: 'Te digan', meaning: 'They tell you (subjunctive of decir)', phonetic: 'teh DEE-gahn' },
      { word: 'Mujeres', meaning: 'Women', phonetic: 'moo-HEH-rehs' },
      { word: 'Estamos', meaning: 'We are (temporary state - estar)', phonetic: 'ehs-TAH-mohs' },
      { word: 'Solas', meaning: 'Alone (feminine plural)', phonetic: 'SOH-lahs' }
    ]
  }
];
