import { NextRequest, NextResponse } from 'next/server';
import { BIKER_SLANG_TEXT } from '@/lib/slangList';

const DEFAULT_ENDPOINT = process.env.DEFAULT_LLM_ENDPOINT || 'https://rnrbmqc.abc-tunnel.us/v1';
const DEFAULT_KEY = process.env.DEFAULT_LLM_API_KEY || 'sk-dccd02cc8ccf53e8-zqx07k-0f0bc410';
const DEFAULT_MODEL = process.env.DEFAULT_LLM_MODEL || 'oc/mimo-v2.6-flash-free';

// Fallback models if primary model is unavailable or encounters error
const BACKUP_MODELS = [
  'oc/deepseek-v4-flash-free',
  'oc/glm-5.3-flash-free',
  'oc/nemotron-3.5-lightning-free',
  'oc/mimo-v2.5-free'
];

function buildSystemPrompt(persona: string, commandType: string, characterName: string): string {
  return `You are the master English Roleplay (RP) Translator for GTA San Andreas Multiplayer (SAMP).
Your job is to translate Indonesian player dialogue or roleplay actions into 100% natural, immersive, authentic English.

CRITICAL RULES:
1. DILARANG KERAS KAKU seperti Google Translate! No literal, robotic word-for-word translation.
   - Example BAD (Google): "Do you want to search problem with me?"
   - Example GOOD (Roleplay): "You looking for beef with me, punk?" or "You wanna test me, dog?"
2. Understand Indonesian slang, street terms, and abbreviations used by gamers:
   (e.g., "cepu" = snitch/rat; "silop" = cops/fuzz/12; "sotot" = shootout; "cabut" = bounce/scram; "geber" = rev/blast; "jebol" = blown/busted; "bacot" = chatting shit/talking smack; "kompo" = scrap components; "beceng" = heat/piece/burner).
3. Adapting to Roleplay Persona:
   - If 'uk_biker' (UK Biker / Rocker / Cafe Racer): Inspired by Ace Cafe London & classic bike culture. Use UK slang naturally (mate, bruv, innit, bloke, old girl, thumper, throttle, ton, lid, ragged, custom, built not bought, grease). Do not force slang if it doesn't fit, but keep the authentic British biker cadence.
   - If 'hood' (West Coast Gang / Hood): West Coast street dialogue (homie, dog, turf, fool, ain't, cops/12, heat, straight up, mess with).
   - If 'chicano' (Latino / Chicano Vato): Hispanic/Mexican-American street swagger (vato, ese, carnal, hermano, cabron, de puta madre).
   - If 'mobster' (Italian Mafia): Classic wise guy tone (fella, pal, capisce, whack, business, tone down).
   - If 'police' (SAPD / Cop): Authoritative, tactical, professional law enforcement with 10-codes where appropriate (10-4, 10-20, suspect, non-compliant, step out).
   - If 'mechanic' (Garage / Tuning): Automobile & motorcycle shop talk (engine block, bodywork, torque, clip-ons, spark plug, transmission, paintjob).
   - If 'casual': Everyday smooth, modern casual English without awkward formality.
4. Roleplay Command Formatting:
   - Command Type: '${commandType}', Character Name: '${characterName || 'Character'}'.
   - If command is 'me' or action: Write in third-person present tense starting with a vivid action verb (e.g. "reaches into his leather jacket...", "pulls the throttle and revs...", "inspects the frame...").
   - If command is 'do': Describe the state, physical observation, or environment in passive or objective voice (e.g. "The motorcycle engine emits thick white smoke as oil drips onto the asphalt.").
   - If command is 'says', 'shouts', or 'whispers': Produce direct quoted dialogue suitable for SAMP in-game chat.

REFERENCE BIKER SLANG (FROM BIKER / ROCKER LORE):
${BIKER_SLANG_TEXT}

RESPONSE FORMAT:
You MUST return ONLY valid JSON matching this structure:
{
  "translation": "The best, most natural translation",
  "commandFormatted": "Formatted with SAMP prefix, e.g.: Harold Ortega says: ... OR * Harold Ortega reaches into... OR (( The engine is smoking. ((Harold Ortega)) ))",
  "alternatives": [
    { "label": "Casual / Chill", "text": "alternative translation 1" },
    { "label": "More Aggressive / Raw", "text": "alternative translation 2" },
    { "label": "Heavy Slang", "text": "alternative translation 3" }
  ],
  "notes": "Short Indonesian breakdown of why these words were chosen and the nuance behind them."
}`;
}

async function callChatCompletion(
  endpoint: string,
  apiKey: string,
  model: string,
  systemPrompt: string,
  userMessage: string
) {
  const url = `${endpoint.replace(/\/+$/, '')}/chat/completions`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 750,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model ${model} failed (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  if (!choice) {
    throw new Error('No completion choice returned from API');
  }

  // Handle models that output inside content or reasoning
  const rawContent = choice.message?.content || choice.text || '';
  return rawContent;
}

function cleanAndParseJSON(raw: string) {
  // Strip special tokens like <|im_end|>, markdown code fences
  let cleaned = raw
    .replace(/<\|im_end\|>/g, '')
    .replace(/<\|endoftext\|>/g, '')
    .trim();

  // Remove markdown codeblock if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```$/, '');
  }
  cleaned = cleaned.trim();

  // Find first { and last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return JSON.parse(cleaned);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      text,
      persona = 'uk_biker',
      commandType = 'says',
      characterName = 'Harold Ortega',
      endpoint = DEFAULT_ENDPOINT,
      apiKey = DEFAULT_KEY,
      model = DEFAULT_MODEL
    } = body;

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Input text is required' },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(persona, commandType, characterName);
    const userMessage = `Character: ${characterName}
Command: ${commandType}
Persona: ${persona}
Indonesian Input: "${text.trim()}"

Please translate into natural, living RP English according to the prompt instructions.`;

    let rawOutput = '';
    let usedModel = model;
    let errors: string[] = [];

    // Attempt with requested model
    try {
      rawOutput = await callChatCompletion(endpoint, apiKey, model, systemPrompt, userMessage);
    } catch (err: any) {
      console.warn(`Primary model ${model} failed, trying backups:`, err.message);
      errors.push(`${model}: ${err.message}`);

      // Try fallback models
      for (const backup of BACKUP_MODELS) {
        if (backup === model) continue;
        try {
          rawOutput = await callChatCompletion(endpoint, apiKey, backup, systemPrompt, userMessage);
          usedModel = backup;
          break;
        } catch (backupErr: any) {
          console.warn(`Backup model ${backup} failed:`, backupErr.message);
          errors.push(`${backup}: ${backupErr.message}`);
        }
      }
    }

    if (!rawOutput) {
      return NextResponse.json(
        { 
          error: 'Semua model LLM gagal merespons. Periksa koneksi endpoint / API key.',
          details: errors 
        },
        { status: 502 }
      );
    }

    let parsed;
    try {
      parsed = cleanAndParseJSON(rawOutput);
    } catch (parseErr) {
      // Fallback if JSON parsing fails: return the text directly
      parsed = {
        translation: rawOutput.replace(/<\|im_end\|>/g, '').trim(),
        commandFormatted: `${characterName} ${commandType}: ${rawOutput.trim()}`,
        alternatives: [],
        notes: "Hasil terjemahan mentah dari model AI."
      };
    }

    // Format SAMP command string if not already done nicely
    let formattedCommand = parsed.commandFormatted;
    const translation = parsed.translation || '';
    if (!formattedCommand) {
      if (commandType === 'me') {
        formattedCommand = `* ${characterName} ${translation}`;
      } else if (commandType === 'do') {
        formattedCommand = `(( ${translation} ((${characterName})) ))`;
      } else if (commandType === 'shouts') {
        formattedCommand = `${characterName} shouts: ${translation}!`;
      } else if (commandType === 'whispers') {
        formattedCommand = `${characterName} whispers: ${translation}`;
      } else {
        formattedCommand = `${characterName} says: ${translation}`;
      }
    }

    return NextResponse.json({
      success: true,
      translation: parsed.translation,
      commandFormatted: formattedCommand,
      alternatives: parsed.alternatives || [],
      notes: parsed.notes || '',
      modelUsed: usedModel,
      persona,
      commandType,
      characterName
    });

  } catch (error: any) {
    console.error('API Translate Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
