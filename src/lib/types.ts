export type RoleplayPersona = 
  | 'hood'        // West Coast Gangster (Ballas, Grove, Bloods/Crips)
  | 'uk_mandem'   // UK Roadman / Mandem (Harold Ortega style)
  | 'chicano'     // Latino / Vato / Chicano (Julian Dalopez / Fernando style)
  | 'mobster'     // Italian Mafia / Wise guy
  | 'police'      // Law Enforcement / SAPD tactical
  | 'casual'      // Civilian / Mechanic / Street casual
  | 'action_me'   // /me action roleplay generator
  | 'action_do';  // /do environment/state description

export type ChatCommandType = 'says' | 'shouts' | 'whispers' | 'me' | 'do' | 'raw';

export type TranslationEngine = 'rule_based' | 'groq_ai' | 'openai' | 'gemini';

export interface TranslationResult {
  primary: string;
  alternatives: {
    label: string;
    text: string;
  }[];
  explanation?: string;
  sampFormatted?: string;
  engineUsed: 'offline' | 'ai';
  persona: RoleplayPersona;
}

export interface SlangEntry {
  indonesian: string;
  english: string;
  category: 'gang' | 'police' | 'money' | 'weapons' | 'mechanic' | 'insult' | 'casual';
  exampleIndo: string;
  exampleEn: string;
  notes?: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: string;
  output: string;
  persona: RoleplayPersona;
  commandType: ChatCommandType;
  characterName: string;
}
