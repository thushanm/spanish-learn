import { DialogueScenario } from '../types';

export const DIALOGUE_SCENARIOS: DialogueScenario[] = [
  {
    id: 'cafe-madrid',
    title: 'Café y Churros en Madrid',
    description: 'Order breakfast at a traditional café in Madrid with Mateo the barista.',
    level: 'A1',
    category: 'Food & Dining',
    partnerName: 'Mateo',
    partnerRole: 'Barista en Café Central',
    partnerAvatar: '☕',
    context: 'Estás en una cafetería clásica en la Plaza Mayor de Madrid. Es una mañana soleada y quieres desayunar.',
    lines: [
      {
        id: 'd1-1',
        speaker: 'agent',
        spanish: '¡Buenos días! Bienvenido a Café Central. ¿Qué le pongo para empezar?',
        english: 'Good morning! Welcome to Café Central. What can I get you to start?',
        phonetic: 'BWEH-nohs DEE-ahs! Byehn-veh-NEE-dhoh ah kah-FEH sehn-TRAHL. keh leh POHN-goh PAH-rah ehm-peh-ZAHR?'
      },
      {
        id: 'd1-2',
        speaker: 'user',
        spanish: 'Buenos días. Quisiera un café con leche y una porción de churros, por favor.',
        english: 'Good morning. I would like a coffee with milk and a serving of churros, please.',
        phonetic: 'BWEH-nohs DEE-ahs. kee-SYEH-rah oon kah-FEH kohn LEH-cheh ee OO-nah pohr-SYOHN deh CHOO-rrohs, pohr fah-BVOHR.',
        userHint: 'Start with: Buenos días. Quisiera un café con leche...'
      },
      {
        id: 'd1-3',
        speaker: 'agent',
        spanish: '¡Perfecto! ¿El café lo prefiere con leche caliente o templada? ¿Y azúcar o sacarina?',
        english: 'Perfect! Do you prefer the coffee with hot or warm milk? And sugar or sweetener?',
        phonetic: 'pehr-FEHK-toh! ehl kah-FEH loh preh-FYEH-reh kohn LEH-cheh kah-LYEHN-teh oh tehm-PLAH-dhah? ee ah-SOO-kahr oh sah-kah-REE-nah?'
      },
      {
        id: 'd1-4',
        speaker: 'user',
        spanish: 'Con leche caliente y un poco de azúcar, muchas gracias.',
        english: 'With hot milk and a little bit of sugar, thank you very much.',
        phonetic: 'kohn LEH-cheh kah-LYEHN-teh ee oon POH-koh deh ah-SOO-kahr, MOO-chahs GRAH-syahs.',
        userHint: 'Say: Con leche caliente y un poco de azúcar...'
      },
      {
        id: 'd1-5',
        speaker: 'agent',
        spanish: 'Aquí tiene su café y sus churros recién hechos. ¡Que aproveche!',
        english: 'Here is your coffee and your freshly made churros. Enjoy your meal!',
        phonetic: 'ah-KEE TYEH-neh soo kah-FEH ee soos CHOO-rrohs reh-SYEHN EH-chohs. keh ah-proh-VEH-cheh!'
      },
      {
        id: 'd1-6',
        speaker: 'user',
        spanish: '¡Muchas gracias Mateo, todo tiene un aspecto increíble!',
        english: 'Thank you very much Mateo, everything looks incredible!',
        phonetic: 'MOO-chahs GRAH-syahs mah-TEH-oh, TOH-dhoh TYEH-neh oon ahs-PEHK-toh een-kreh-EE-bvleh!',
        userHint: 'Compliment the food: Muchas gracias Mateo, todo tiene un aspecto increíble!'
      }
    ]
  },
  {
    id: 'barcelona-directions',
    title: 'Camino a la Sagrada Família',
    description: 'Ask a local resident, Sofía, for directions in Barcelona when your phone battery dies.',
    level: 'A2',
    category: 'Travel & Navigation',
    partnerName: 'Sofía',
    partnerRole: 'Vecina de Barcelona',
    partnerAvatar: '🏛️',
    context: 'Te encuentras en el Passeig de Gràcia. Se te apagó el teléfono y necesitas llegar a la Sagrada Família antes de las 11:00.',
    lines: [
      {
        id: 'd2-1',
        speaker: 'user',
        spanish: 'Disculpe, buenas tardes. ¿Me puede ayudar? Busco la Sagrada Família.',
        english: 'Excuse me, good afternoon. Can you help me? I am looking for the Sagrada Familia.',
        phonetic: 'dees-KOOL-peh, BWEH-nahs TAHR-dehs. meh PWEH-deh ah-yoo-DHAHR? BOOS-koh lah sah-GRAH-dhah fah-MEE-lyah.',
        userHint: 'Ask politely: Disculpe, buenas tardes. ¿Me puede ayudar?'
      },
      {
        id: 'd2-2',
        speaker: 'agent',
        spanish: '¡Hola! Claro que sí, no te preocupes. ¿Vas caminando o quieres tomar el metro?',
        english: 'Hello! Of course, do not worry. Are you walking or do you want to take the metro?',
        phonetic: 'OH-lah! KLAH-roh keh see, noh teh preh-oh-KOO-pehs. vahs kah-mee-NAHN-doh oh KYEH-rehs toh-MAHR ehl MEH-troh?'
      },
      {
        id: 'd2-3',
        speaker: 'user',
        spanish: 'Prefiero ir caminando si no está demasiado lejos de aquí.',
        english: 'I prefer walking if it is not too far from here.',
        phonetic: 'preh-FYEH-roh eer kah-mee-NAHN-doh see noh ehs-TAH deh-mah-SYAH-dhoh LEH-hohs deh ah-KEE.',
        userHint: 'Express preference: Prefiero ir caminando si no está demasiado lejos...'
      },
      {
        id: 'd2-4',
        speaker: 'agent',
        spanish: 'Está a solo quince minutos. Sigue todo recto por esta calle y gira a la izquierda en Carrer de Mallorca.',
        english: 'It is only fifteen minutes away. Go straight ahead down this street and turn left on Carrer de Mallorca.',
        phonetic: 'ehs-TAH ah SOH-loh KEEN-seh mee-NOO-tohs. SEE-geh TOH-dhoh REHK-toh pohr EHS-tah KAH-lyeh ee HEE-rah ah lah ees-KYEHR-dhah...'
      },
      {
        id: 'd2-5',
        speaker: 'user',
        spanish: 'Entendido. Sigo recto y giro a la izquierda. ¡Muchísimas gracias por su amabilidad!',
        english: 'Understood. I go straight and turn left. Thank you very much for your kindness!',
        phonetic: 'ehn-tehn-DEE-dhoh. SEE-goh REHK-toh ee HEE-roh ah lah ees-KYEHR-dhah. moo-CHEE-see-mahs GRAH-syahs!',
        userHint: 'Confirm the route: Entendido. Sigo recto y giro a la izquierda...'
      }
    ]
  },
  {
    id: 'hotel-mexico',
    title: 'Registro en el Hotel en Ciudad de México',
    description: 'Check in, request a quiet room with a city view, and ask for restaurant recommendations.',
    level: 'B1',
    category: 'Travel & Accommodation',
    partnerName: 'Camila',
    partnerRole: 'Recepcionista del Hotel Reforma',
    partnerAvatar: '🏨',
    context: 'Acabas de llegar a tu hotel en el Paseo de la Reforma tras un vuelo largo. Quieres hacer el check-in.',
    lines: [
      {
        id: 'd3-1',
        speaker: 'agent',
        spanish: '¡Buenas noches y bienvenido a Ciudad de México! ¿Tiene una reserva con nosotros?',
        english: 'Good evening and welcome to Mexico City! Do you have a reservation with us?',
        phonetic: 'BWEH-nahs NOH-chehs ee byehn-veh-NEE-dhoh ah syoo-DHAHD deh MEH-hee-koh! TYEH-neh OO-nah reh-SEHR-bvah...?'
      },
      {
        id: 'd3-2',
        speaker: 'user',
        spanish: 'Buenas noches. Sí, tengo una reserva a nombre de David Smith por cuatro noches.',
        english: 'Good evening. Yes, I have a reservation under the name of David Smith for four nights.',
        phonetic: 'BWEH-nahs NOH-chehs. see, TEHN-goh OO-nah reh-SEHR-bvah ah NOHM-breh deh... pohr KWAH-troh NOH-chehs.',
        userHint: 'Confirm reservation: Sí, tengo una reserva a nombre de David Smith...'
      },
      {
        id: 'd3-3',
        speaker: 'agent',
        spanish: 'Aquí está su reserva. ¿Tiene alguna preferencia especial para su habitación?',
        english: 'Here is your reservation. Do you have any special preference for your room?',
        phonetic: 'ah-KEE ehs-TAH soo reh-SEHR-bvah. TYEH-neh ahl-GOO-nah preh-feh-REHN-syah ehs-peh-SYAHL...?'
      },
      {
        id: 'd3-4',
        speaker: 'user',
        spanish: 'Si es posible, me gustaría una habitación en un piso alto que sea muy tranquila.',
        english: 'If possible, I would like a room on a high floor that is very quiet.',
        phonetic: 'see ehs poh-SEE-bvleh, meh goos-tah-REE-ah OO-nah ah-bvee-tah-SYOHN ehn oon PEE-soh AHL-toh keh SEH-ah moo-ee trahn-KEE-lah.',
        userHint: 'Subjunctive request: Si es posible, me gustaría una habitación en un piso alto que sea muy tranquila.'
      },
      {
        id: 'd3-5',
        speaker: 'agent',
        spanish: '¡Por supuesto! Le he asignado el piso doce con vista hermosa a la avenida y sin ruidos de la calle.',
        english: 'Of course! I have assigned you floor twelve with a beautiful view of the avenue and no street noise.',
        phonetic: 'pohr soo-PWEHS-toh! leh eh ah-seeg-NAH-dhoh ehl PEE-soh DOH-seh kohn VEES-tah ehr-MOH-sah...'
      },
      {
        id: 'd3-6',
        speaker: 'user',
        spanish: '¡Excelente servicio Camila! ¿A qué hora sirven el desayuno por la mañana?',
        english: 'Excellent service Camila! What time do they serve breakfast in the morning?',
        phonetic: 'ehk-seh-LEHN-teh sehr-VEE-syoh kah-MEE-lah! ah keh OH-rah SEER-bvehn ehl deh-sah-YOO-noh...?',
        userHint: 'Ask about breakfast: ¡Excelente servicio Camila! ¿A qué hora sirven el desayuno...?'
      }
    ]
  },
  {
    id: 'opinions-cinema',
    title: 'Debate de Cine y Planes de Fin de Semana',
    description: 'Share opinions about movies, recommend directors, and plan an evening out with a friend in Buenos Aires.',
    level: 'B2',
    category: 'Culture & Opinions',
    partnerName: 'Lucas',
    partnerRole: 'Amigo de Buenos Aires',
    partnerAvatar: '🎬',
    context: 'Estás tomando un mate con Lucas hablando sobre la última película española que vieron en el cine.',
    lines: [
      {
        id: 'd4-1',
        speaker: 'agent',
        spanish: 'Che, ¿qué te pareció la película que vimos anoche? A mí me dejó pensando todo el día.',
        english: 'Hey, what did you think of the movie we watched last night? It kept me thinking all day.',
        phonetic: 'cheh, keh teh pah-reh-SYOH lah peh-LEE-koo-lah keh VEE-mohs ah-NOH-cheh? ah mee meh deh-HOH pehn-SAHN-doh...'
      },
      {
        id: 'd4-2',
        speaker: 'user',
        spanish: 'La verdad es que me impresionó mucho la actuación, aunque el final fue bastante inesperado.',
        english: 'The truth is that the acting impressed me a lot, although the ending was quite unexpected.',
        phonetic: 'lah vehr-DHAHD ehs keh meh eem-preh-syoh-NOH MOO-choh lah ahk-twah-SYOHN, owng-keh ehl fee-NAHL fweh...',
        userHint: 'Express opinion: La verdad es que me impresionó mucho la actuación, aunque el final...'
      },
      {
        id: 'd4-3',
        speaker: 'agent',
        spanish: 'Coincido totalmente. Dudo que este año estrenen otra película con semejante nivel de guion.',
        english: 'I completely agree. I doubt they will release another movie this year with such script quality.',
        phonetic: 'koh-een-SEE-dhoh toh-tahl-MEHN-teh. DOO-dhoh keh EHS-teh AH-nyoh ehs-TREH-nehn OH-trah peh-LEE-koo-lah...'
      },
      {
        id: 'd4-4',
        speaker: 'user',
        spanish: 'Ojalá que los directores sigan arriesgándose con historias tan creativas y originales.',
        english: 'Hopefully directors will continue taking risks with such creative and original stories.',
        phonetic: 'oh-hah-LAH keh lohs dee-rehk-TOH-rehs SEE-gahn ah-rryehs-GAHN-doh-seh kohn ees-TOH-ryahs tahn kreh-ah-TEE-bvahs...',
        userHint: 'Use subjunctive: Ojalá que los directores sigan arriesgándose con historias...'
      }
    ]
  }
];
