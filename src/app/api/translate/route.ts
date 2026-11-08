import { NextRequest, NextResponse } from 'next/server';
import { BIKER_SLANG_TEXT } from '@/lib/slangList';

const DEFAULT_ENDPOINT = process.env.DEFAULT_LLM_ENDPOINT || 'https://rnrbmqc.abc-tunnel.us/v1';
const DEFAULT_KEY = process.env.DEFAULT_LLM_API_KEY || 'sk-dccd02cc8ccf53e8-zqx07k-0f0bc410';
const DEFAULT_MODEL = process.env.DEFAULT_LLM_MODEL || 'oc/mimo-v2.6-flash-free';

// Fallback models in priority order
const BACKUP_MODELS = [
  'ag/claude-sonnet-4-6',
  'ag/gemini-3.8-flash',
  'ag/gpt-oss-120b-medium',
  'oc/mimo-v2.6-flash-free',
  'oc/deepseek-v4-flash-free'
];

function buildSystemPrompt(
  persona: string, 
  commandType: string, 
  characterName: string, 
  slangLevel: string
): string {
  let slangInstruction = "";
  if (slangLevel === 'none') {
    slangInstruction = "SLANG LEVEL: NONE (STANDARD / CLEAN RP ENGLISH). Do NOT use heavy street slang or local slurs. Translate into clean, natural, immersive, conversational English without sounding robotic or formal like a textbook.";
  } else if (slangLevel === 'light') {
    slangInstruction = "SLANG LEVEL: LIGHT / CASUAL (SLIGHT TOUCH). Use natural conversational idioms and very subtle British/street colloquialisms (e.g., 'mate', 'reckon', 'proper', 'fair enough'). Keep it light, smooth, and easy to read. Do not oversaturate with heavy jargon.";
  } else if (slangLevel === 'medium') {
    slangInstruction = "SLANG LEVEL: MEDIUM (BALANCED RP STREET). A solid, balanced roleplay flavor. Authentic conversational flow with natural vocabulary suitable for the character persona.";
  } else {
    slangInstruction = "SLANG LEVEL: HEAVY (FULL CULTURE IMMERSION). Use authentic subculture vocabulary (e.g. traditional British biker, rocker, cafe racer, mechanical terminology) without making it unintelligible.";
  }

  return `You are the master English Roleplay (RP) Translator for GTA San Andreas Multiplayer (SAMP).
Your job is to translate Indonesian player dialogue or roleplay actions into 100% natural, immersive, authentic English.

CRITICAL INSTRUCTIONS & STRICT CONSTRAINTS:
1. DILARANG KERAS KAKU seperti Google Translate! No literal, robotic word-for-word translation.
2. STRICT CULTURE / SLANG RULE:
   - When using British / UK slang, use exclusively WHITE BRITISH / COCKNEY / WORKING-CLASS / ROCKER & BIKER UK slang (e.g., mate, bloke, lad, reckon, proper, dodgy, bollocks, bloody, innit, cheer, gaffer, old girl, sorted).
   - STRICTLY FORBIDDEN: DO NOT use African-American Vernacular English (AAVE) or UK drill/black slang (STRICTLY NO: 'n-word', 'bruv/mandem' forced overuse, 'fam', 'cuz', 'blood', 'wagwan', 'wasteman', 'opp', 'finna', 'trippin', etc.). Keep it strictly classic White UK Rocker / Biker / Working-class English or natural casual conversational English.
3. ${slangInstruction}
4. Adhere to User Slang Level:
   - If user sets Slang Level to None or Light, do NOT over-slang the output. Keep it clean, fluid, and natural.
5. Understand Indonesian street words, gamer lingo, and samp context:
   ("cepu" = snitch/rat; "silop" = cops/police; "sotot" = shootout/gunfire; "cabut" = leave/take off; "geber" = rev the engine; "jebol" = blown/busted/broken; "bacot" = talking rubbish/nonsense; "kompo" = scrap components; "beceng" = piece/gun).
6. Roleplay Command Formatting:
   - Command Type: '${commandType}', Character Name: '${characterName || 'Character'}'.
   - If command is 'me': Write third-person present tense starting with a vivid action verb (e.g., "reaches into his jacket...", "cranks the throttle...", "inspects the engine block...").
   - If command is 'do': Objective observation or environmental state (e.g., "The motorcycle engine emits thick white smoke as oil drips onto the pavement.").
   - If command is 'says', 'shouts', 'whispers': Natural direct spoken dialogue.

REFERENCE BIKER / ROCKER DICTIONARY:
${BIKER_SLANG_TEXT}

RESPONSE FORMAT:
You MUST return ONLY valid JSON matching this structure:
{
  "translation": "The best, most natural translation matching the requested slang level",
  "commandFormatted": "Formatted with SAMP prefix, e.g.: Harold Ortega says: ... OR * Harold Ortega reaches into...",
  "alternatives": [
    { "label": "Clean / Natural", "text": "alternative with minimal slang" },
    { "label": "Moderate Vibe", "text": "alternative with balanced flavor" },
    { "label": "Raw / Expressive", "text": "alternative with stronger expression" }
  ],
  "notes": "Short Indonesian breakdown of the chosen words, tone, and why it fits the slang level."
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
      stream: false,
      max_tokens: 750,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Model ${model} failed (${response.status}): ${errorText}`);
  }

  const rawText = await response.text();

  // Handle case where endpoint returns Server-Sent Events (SSE / streaming) even if stream: false
  if (rawText.startsWith('data:')) {
    const lines = rawText.split('\n');
    let accumulatedContent = '';
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('data:') && !trimmed.includes('[DONE]')) {
        try {
          const jsonStr = trimmed.replace(/^data:\s*/, '');
          const chunk = JSON.parse(jsonStr);
          const delta = chunk.choices?.[0]?.delta?.content || chunk.choices?.[0]?.message?.content || '';
          accumulatedContent += delta;
        } catch (_) {}
      }
    }
    if (accumulatedContent) return accumulatedContent;
  }

  const data = JSON.parse(rawText);
  const choice = data.choices?.[0];
  if (!choice) {
    throw new Error('No completion choice returned from API');
  }

  const rawContent = choice.message?.content || choice.text || '';
  return rawContent;
}

function cleanAndParseJSON(raw: string) {
  let cleaned = raw
    .replace(/<\|im_end\|>/g, '')
    .replace(/<\|endoftext\|>/g, '')
    .trim();

  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```$/, '');
  }
  cleaned = cleaned.trim();

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
      slangLevel = 'light',
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

    const systemPrompt = buildSystemPrompt(persona, commandType, characterName, slangLevel);
    const userMessage = `Character: ${characterName}
Command: ${commandType}
Persona: ${persona}
Slang Level: ${slangLevel}
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
      parsed = {
        translation: rawOutput.replace(/<\|im_end\|>/g, '').trim(),
        commandFormatted: `${characterName} ${commandType}: ${rawOutput.trim()}`,
        alternatives: [],
        notes: "Hasil terjemahan mentah dari model AI."
      };
    }

    // Format alternatives if strings
    let altList: { label: string; text: string }[] = [];
    if (Array.isArray(parsed.alternatives)) {
      altList = parsed.alternatives.map((a: any, idx: number) => {
        if (typeof a === 'string') {
          return { label: `Opsi ${idx + 1}`, text: a };
        }
        return { label: a.label || `Opsi ${idx + 1}`, text: a.text || String(a) };
      });
    }

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
      alternatives: altList,
      notes: parsed.notes || '',
      modelUsed: usedModel,
      persona,
      commandType,
      characterName,
      slangLevel
    });

  } catch (error: any) {
    console.error('API Translate Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
