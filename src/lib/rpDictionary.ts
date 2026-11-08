import { RoleplayPersona, SlangEntry, TranslationResult } from './types';

export const SLANG_DATABASE: SlangEntry[] = [
  // GANG & STREET
  {
    indonesian: "cepu / mata-mata / pembocor rahasia",
    english: "snitch / rat / narc / singing bird",
    category: "gang",
    exampleIndo: "Ada cepu di tongkrongan kita bro.",
    exampleEn: "We got a rat amongst our crew, bro."
  },
  {
    indonesian: "cabut / minggat / kabur",
    english: "bounce / scram / dip out / bail / roll out",
    category: "gang",
    exampleIndo: "Cabut woi, urusan gawat nih!",
    exampleEn: "Let's bounce, shit's getting heavy!"
  },
  {
    indonesian: "tongkrongan / wilayah kekuasaan",
    english: "turf / hood / block / ends",
    category: "gang",
    exampleIndo: "Jangan berani main di wilayah tongkrongan gua.",
    exampleEn: "Don't you dare stepping on my turf."
  },
  {
    indonesian: "sotot / baku tembak",
    english: "shootout / gunfight / popping off / heat",
    category: "gang",
    exampleIndo: "Tadi ada sotot kenceng di Seville.",
    exampleEn: "There was a heavy shootout down in Seville."
  },
  {
    indonesian: "habisi dia / tembak mati dia",
    english: "smoke him / waste him / whack him / put him down",
    category: "gang",
    exampleIndo: "Habisi dia sebelum dia lapor ke polisi!",
    exampleEn: "Smoke that fool before he runs to the cops!"
  },
  {
    indonesian: "cari masalah / ribut",
    english: "looking for trouble / starting beef / stepping to me / picking a fight",
    category: "gang",
    exampleIndo: "Lu mau cari masalah sama gua hah?",
    exampleEn: "You looking for beef with me, punk?"
  },
  {
    indonesian: "santai / tenang / kalem",
    english: "chill out / cool off / keep it easy / hold your horses",
    category: "casual",
    exampleIndo: "Santai dulu bang, kita omongin baik-baik.",
    exampleEn: "Chill out man, let's talk this through easy."
  },
  {
    indonesian: "omong kosong / bacot",
    english: "bullshit / talking smack / chatting shit / cap",
    category: "insult",
    exampleIndo: "Gausah banyak bacot lu, potong omong kosong lu!",
    exampleEn: "Cut the damn bullshit, stop chatting shit!"
  },
  // POLICE & LEGAL
  {
    indonesian: "polisi / silop",
    english: "cops / 12 / fuzz / pigs / PD / officers",
    category: "police",
    exampleIndo: "Awas ada silop lagi patroli!",
    exampleEn: "Heads up, the fuzz is rolling on patrol!"
  },
  {
    indonesian: "angkat tangan / jangan bergerak",
    english: "Hands where I can see them! / Freeze! / Don't move a muscle!",
    category: "police",
    exampleIndo: "Angkat tangan dan jangan bergerak!",
    exampleEn: "Put your hands where I can see 'em and freeze!"
  },
  {
    indonesian: "turun dari kendaraan",
    english: "Step out of the vehicle / Exit the vehicle immediately",
    category: "police",
    exampleIndo: "Matikan mesin dan turun dari kendaraan sekarang!",
    exampleEn: "Kill the engine and step out of the vehicle right now!"
  },
  {
    indonesian: "siap / dimengerti (radio polisi)",
    english: "10-4 / Copy that / Understood / Roger that",
    category: "police",
    exampleIndo: "10-4, unit sedang meluncur ke TKP.",
    exampleEn: "10-4, unit en route to the scene, code 3."
  },
  {
    indonesian: "lokasi (radio polisi)",
    english: "10-20 / Location / Grid",
    category: "police",
    exampleIndo: "Apa 10-20 lu sekarang?",
    exampleEn: "What's your 10-20 right now?"
  },
  // MONEY & ECONOMY
  {
    indonesian: "duit / uang",
    english: "bucks / bread / green / cash / dough / grand",
    category: "money",
    exampleIndo: "Gua butuh duit cepet buat nebus mobil.",
    exampleEn: "I need some quick bucks to get my whip back."
  },
  {
    indonesian: "harga murah / diskon",
    english: "cheap price / bargain / discount / steal deal",
    category: "money",
    exampleIndo: "Gua lepas harga murah aja buat lu.",
    exampleEn: "I'll let it go for cheap, just for you."
  },
  {
    indonesian: "utang / bayar nanti",
    english: "hit you back / owe you / put it on tab",
    category: "money",
    exampleIndo: "Ntar gua bayar pas udah gajian.",
    exampleEn: "I'll hit you back as soon as my paycheck drops."
  },
  // MECHANIC & CARS
  {
    indonesian: "mesin dan bodi",
    english: "engine and bodywork",
    category: "mechanic",
    exampleIndo: "Tolong perbaiki mesin sama bodinya mas.",
    exampleEn: "Need a full fix on the engine and the bodywork, mate."
  },
  {
    indonesian: "komponen / kompo",
    english: "car components / spare parts / scrap components",
    category: "mechanic",
    exampleIndo: "Kompo gua abis, kudu restok dulu.",
    exampleEn: "I'm all out of components, gotta restock first."
  },
  {
    indonesian: "mobil / motor",
    english: "ride / whip / wheels / bike",
    category: "mechanic",
    exampleIndo: "Mobil lu keren banget warnanya.",
    exampleEn: "Clean whip you got there, sweet paintjob."
  },
  // WEAPONS & DRUGS
  {
    indonesian: "senjata api / beceng",
    english: "piece / heat / strapped / iron / burner / heater",
    category: "weapons",
    exampleIndo: "Dia bawa beceng di balik jaketnya.",
    exampleEn: "He's strapped with heat tucked under his jacket."
  },
  {
    indonesian: "kokang senjata / siap menembak",
    english: "racking the slide / ready to fire / cocking the hammer",
    category: "weapons",
    exampleIndo: "* menarik kokangan shotgun lalu membidik",
    exampleEn: "* racks the pump of the shotgun, aiming straight ahead."
  },
  {
    indonesian: "obat / pot / crack",
    english: "weed / pot / greens / rock / crack / dope",
    category: "weapons",
    exampleIndo: "Lu punya stok pot ga?",
    exampleEn: "You holding any pot on ya?"
  }
];

// Phrase templates for rule-based matching
interface PhraseRule {
  pattern: RegExp;
  hood: string;
  uk_mandem: string;
  chicano: string;
  mobster: string;
  police: string;
  casual: string;
  action_me?: string;
  action_do?: string;
}

export const PHRASE_RULES: PhraseRule[] = [
  {
    pattern: /(lu|kamu|kau)\s+(mau|pengen)?\s*(cari|ajak)?\s*(masalah|ribut|berantem)\s*(sama|dengan)?\s*(gua|gw|aku|kami)\s*(hah|\?)?/i,
    hood: "You looking for beef with me, punk? Watch your damn mouth.",
    uk_mandem: "You trying to start trouble with me, mate? Don't chat shit.",
    chicano: "You looking for beef with me, vato? You messing with the wrong esse.",
    mobster: "You got a problem with me, pal? You better think twice before you open your trap.",
    police: "Step back and cease hostilities immediately, or you will be restrained.",
    casual: "Are you looking for trouble with me? Back off.",
    action_me: "glares threateningly at the person in front of him, clenching both fists."
  },
  {
    pattern: /(cabut|kabur|minggat|pergi)\s*(woi|skrg|sekarang|cepetan|yuk)/i,
    hood: "Bounce, y'all! Let's get the fuck outta here right now!",
    uk_mandem: "Dash, lads! Let's move our arses right now!",
    chicano: "Vamonos, carnal! Let's haul ass outta here!",
    mobster: "Scram, boys! Move it before somebody sees us!",
    police: "All units, fall back and regroup at designated sector.",
    casual: "Let's bounce right now, hurry up!",
    action_me: "signals his crew to move out quickly, glancing around suspiciously."
  },
  {
    pattern: /(ada|awas)\s*(polisi|silop|patroli)/i,
    hood: "Heads up, 12 is rolling! Fuzz on the block!",
    uk_mandem: "Oi, feds are lurking around the corner, watch out!",
    chicano: "Cuidado, la jura is crawling around the block!",
    mobster: "Pipe down, the badges are snooping around here.",
    police: "10-4 dispatch, unit is actively on patrol in the sector.",
    casual: "Look out, the police are heading our way.",
    action_me: "spots a patrol cruiser approaching, swiftly tucking his hands into his pockets."
  },
  {
    pattern: /(gua|gw|saya)\s*(ga|ngga|tidak)\s*(tau|tahu|paham)\s*(apa-apa|apapun)/i,
    hood: "I don't know shit about that, homie. Ain't got nothing to do with me.",
    uk_mandem: "I don't know fuck all about that, bruv. Wasn't me.",
    chicano: "I don't know nothing about that, ese. Don't pin that on me.",
    mobster: "I don't know nothing, capisce? I keep my nose out of others' business.",
    police: "Suspect denies any prior knowledge regarding the incident.",
    casual: "I really don't know anything about that, honestly.",
    action_me: "shrugs his shoulders dismissively, feigning total ignorance."
  },
  {
    pattern: /(jangan|gausah|ngapain)\s*(nuduh|tuduh|fitnah)\s*(gua|gw|gue|saya)/i,
    hood: "Don't you go putting that shit on me, dog! Back the fuck off!",
    uk_mandem: "Don't you dare accuse me of that bollocks, mate!",
    chicano: "Don't be pointing fingers at me, vato! Watch what you say!",
    mobster: "You throwing accusations at me? You're treading on thin ice, fella.",
    police: "I advise you to speak only on verified facts, sir.",
    casual: "Don't accuse me right away without any proof.",
    action_me: "points a stern finger at the accuser, visibly aggravated by the claim."
  },
  {
    pattern: /(halo|woi|bro|bang|hey|sup)\s*(ada\s*apa|lagi\s*ngapain|gimana)/i,
    hood: "Sup, fool? What's popping on the block today?",
    uk_mandem: "Alright mate, what's good with you today?",
    chicano: "Que pasa, carnal? What you got going on?",
    mobster: "Hey fella, what's cooking today?",
    police: "Good day, citizen. Is there an issue requiring attention?",
    casual: "Hey man, what's going on with you?",
    action_me: "gives a light nod of greeting towards the person approaching."
  },
  {
    pattern: /(angkat\s*tangan|jangan\s*bergerak|tiarap)/i,
    hood: "Hands in the air right now, fool! Don't you dare twitch!",
    uk_mandem: "Hands up right now, don't test me, mate!",
    chicano: "Manos arriba, put your hands up where I can see 'em, vato!",
    mobster: "Hands up, pal. Don't make me put a hole through ya.",
    police: "San Andreas Police Department! Hands up in the air and freeze!",
    casual: "Put your hands up and don't make any sudden moves!",
    action_me: "aims his firearm firmly, ordering the target to surrender."
  },
  {
    pattern: /(mau|tolong)?\s*(repair|benerin|servis)\s*(mesin|body|bodi|mobil|motor)?/i,
    hood: "Yo, need my ride fixed up. Engine and body need some heavy work.",
    uk_mandem: "Oi mate, can you sort my motor out? Engine's sounding proper dead.",
    chicano: "Hey carnal, hook my lowrider up, body and engine taken a beating.",
    mobster: "Hey pal, get my car in working order. Make it clean and silent.",
    police: "Fleet maintenance request for unit cruiser, engine and exterior.",
    casual: "Hey, can I get a repair on the engine and bodywork? How much will it be?",
    action_me: "pops the hood open with his right hand, examining the smoking engine block."
  },
  {
    pattern: /(berapa\s*(harganya|ongkos|biaya|harganya|total)?|harganya\s*berapa)/i,
    hood: "How much bread you asking for that, homie?",
    uk_mandem: "How much are you charging for this, bruv?",
    chicano: "How many bucks are we talking about here, ese?",
    mobster: "What's the tag on this, fella? Give it to me straight.",
    police: "State the estimated fine or administrative fee.",
    casual: "How much is that going to cost?",
    action_me: "pulls out a thin roll of dollar bills, ready to count the cash."
  },
  {
    pattern: /(makasih|terimakasih|thank\s*you|tengkyu)/i,
    hood: "Appreciate it, homie. Catch you on the flip side.",
    uk_mandem: "Cheers mate, respect.",
    chicano: "Gracias, carnal. Stay safe out there.",
    mobster: "Much obliged, fella. We'll be in touch.",
    police: "Thank you for your cooperation, stay safe.",
    casual: "Thanks a lot, see you later.",
    action_me: "gives a polite nod of gratitude before turning to leave."
  }
];

// Offline translation fallback logic
export function translateOffline(
  text: string, 
  persona: RoleplayPersona,
  charName: string = "Character"
): TranslationResult {
  const clean = text.trim();
  if (!clean) {
    return {
      primary: "",
      alternatives: [],
      engineUsed: 'offline',
      persona
    };
  }

  // Check for rule pattern match
  for (const rule of PHRASE_RULES) {
    if (rule.pattern.test(clean)) {
      const primaryText = rule[persona] || rule.casual;
      
      const alts = [
        { label: "Hood Style", text: rule.hood },
        { label: "UK Mandem", text: rule.uk_mandem },
        { label: "Chicano Vato", text: rule.chicano },
        { label: "Casual Street", text: rule.casual }
      ].filter(a => a.text !== primaryText);

      return {
        primary: primaryText,
        alternatives: alts,
        explanation: "Diterjemahkan via Offline RP Rule Engine (Pola Kalimat Terdeteksi).",
        engineUsed: 'offline',
        persona
      };
    }
  }

  // Word-by-word replacement dictionary for slang
  const wordMap: Record<string, string> = {
    "cepu": "snitch",
    "silop": "cops",
    "polisi": "cops",
    "duit": "bucks",
    "uang": "cash",
    "cabut": "bounce",
    "kabur": "bail out",
    "tongkrongan": "hood",
    "sotot": "shootout",
    "beceng": "heater",
    "senjata": "piece",
    "tembak": "shoot",
    "mati": "dead",
    "benci": "hate",
    "santai": "chill",
    "omong kosong": "bullshit",
    "bacot": "talking smack",
    "gua": "I",
    "gw": "I",
    "gue": "I",
    "aku": "I",
    "lu": "you",
    "kamu": "you",
    "kau": "you",
    "dia": "he",
    "mereka": "they",
    "kita": "we",
    "mobil": "ride",
    "motor": "bike",
    "mekanik": "mechanic",
    "kompo": "components",
    "kawan": "homie",
    "teman": "buddy",
    "musuh": "opps",
    "masalah": "trouble",
    "ngapain": "what are you doing",
    "kemana": "where are you heading",
    "dimana": "where",
    "siapa": "who",
    "kenapa": "why",
    "bang": "bro",
    "mas": "man"
  };

  // Generic natural conversion if no exact rule matched
  let converted = clean;
  // If it's an action (/me)
  if (persona === 'action_me' || clean.toLowerCase().startsWith('*') || clean.toLowerCase().startsWith('/me')) {
    const rawAction = clean.replace(/^\*|\/me/i, '').trim();
    return {
      primary: `* ${charName} ${rawAction} with caution, keeping an eye on his surroundings.`,
      alternatives: [
        { label: "Action (Detailed)", text: `* ${charName} quickly executes the action, remaining alert and ready.` },
        { label: "Action (Subtle)", text: `* ${charName} subtly conducts his movement without drawing undue attention.` }
      ],
      explanation: "Diformat ke SAMP /me action syntax.",
      engineUsed: 'offline',
      persona
    };
  }

  if (persona === 'action_do' || clean.toLowerCase().startsWith('/do')) {
    const rawDo = clean.replace(/^\/do/i, '').trim();
    return {
      primary: `(( ${rawDo} is clearly noticeable. ((${charName})) ))`,
      alternatives: [
        { label: "Do (State)", text: `(( The condition appears evident to anyone inspecting closely. ((${charName})) ))` }
      ],
      explanation: "Diformat ke SAMP /do environment syntax.",
      engineUsed: 'offline',
      persona
    };
  }

  // Simple token substitution with persona flavoring
  let words = clean.split(/\s+/);
  let translatedWords = words.map(w => {
    const low = w.toLowerCase().replace(/[^a-z0-9_-]/g, '');
    return wordMap[low] || w;
  });

  let baseSentence = translatedWords.join(' ');

  // Persona seasoning
  let flavorPrefix = "";
  let flavorSuffix = "";

  switch (persona) {
    case 'hood':
      flavorPrefix = "Yo, ";
      flavorSuffix = ", you feel me homie?";
      break;
    case 'uk_mandem':
      flavorPrefix = "Oi, ";
      flavorSuffix = ", innit bruv?";
      break;
    case 'chicano':
      flavorPrefix = "Oye carnal, ";
      flavorSuffix = ", you know what I mean, ese?";
      break;
    case 'mobster':
      flavorPrefix = "Listen here, ";
      flavorSuffix = ", capisce?";
      break;
    case 'police':
      flavorPrefix = "Dispatch, ";
      flavorSuffix = ", over.";
      break;
    default:
      flavorPrefix = "";
      flavorSuffix = ", man.";
      break;
  }

  const primaryResult = `${flavorPrefix}${clean}${flavorSuffix}`;

  return {
    primary: primaryResult,
    alternatives: [
      { label: "Hood Style", text: `Aight, ${clean}, don't play with me homie.` },
      { label: "UK Mandem", text: `Look mate, ${clean}, keep it 100.` },
      { label: "Chicano", text: `Hear me out vato, ${clean}, carnal.` }
    ],
    explanation: "Mode Offline: Untuk kalimat bebas dan percakapan kompleks yang 100% luwes seperti native speaker, aktifkan 'Mode AI (Groq / Llama 3)' dengan API key gratis.",
    engineUsed: 'offline',
    persona
  };
}
