'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Settings as SettingsIcon, 
  BookOpen, 
  Flame, 
  RotateCcw, 
  Terminal,
  Shield, 
  Wrench, 
  Radio, 
  MessageSquare,
  Clock,
  Trash2,
  Cpu,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { SAMPPreviewBox } from '@/components/SAMPPreviewBox';
import { SlangGlossaryModal } from '@/components/SlangGlossaryModal';
import { SettingsModal } from '@/components/SettingsModal';

interface TranslationOutput {
  translation: string;
  commandFormatted: string;
  alternatives: { label: string; text: string }[];
  notes: string;
  modelUsed: string;
  slangLevel?: string;
}

interface HistoryItem {
  id: string;
  indonesian: string;
  translation: string;
  commandFormatted: string;
  persona: string;
  commandType: string;
  characterName: string;
  slangLevel: string;
  timestamp: number;
}

const PERSONAS = [
  {
    id: 'uk_biker',
    label: 'White UK Biker / Rocker',
    icon: Flame,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    desc: 'Ace Cafe, Norton, Triumph, ton-up, mate, bloke, lad, reckon (No black slang)'
  },
  {
    id: 'mechanic',
    label: 'Mechanic / Garage',
    icon: Wrench,
    color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
    desc: 'Bengkel motor & mobil, mesin, karburator, bodywork, torque, scrap parts'
  },
  {
    id: 'chicano',
    label: 'Chicano Chopper',
    icon: Sparkles,
    color: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10',
    desc: 'Latino street rider, vato, carnal, custom chopper, old-school'
  },
  {
    id: 'police',
    label: 'Police / SAPD',
    icon: Shield,
    color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
    desc: 'Radio 10-codes (10-4, 10-20), taktis, formal penegak hukum'
  },
  {
    id: 'mobster',
    label: 'Wise Guy / Mob',
    icon: Terminal,
    color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
    desc: 'Discrete tone, business, capisce, respectful'
  },
  {
    id: 'casual',
    label: 'Natural RP (Clean)',
    icon: MessageSquare,
    color: 'text-slate-300 border-slate-600/30 bg-slate-800/40',
    desc: 'Bahasa Inggris percakapan santai, jernih, luwes, anti-kaku'
  }
];

const SLANG_LEVELS = [
  {
    id: 'none',
    label: 'Tanpa Slang (0%)',
    badge: 'Standard Clean',
    desc: 'Bahasa Inggris santai natural tanpa istilah jalanan'
  },
  {
    id: 'light',
    label: 'Slang Ringan (30%)',
    badge: 'Rekomendasi',
    desc: 'Hanya sentuhan santai (mate, reckon, proper) — tidak berlebihan'
  },
  {
    id: 'medium',
    label: 'Slang Sedang (60%)',
    badge: 'Balanced RP',
    desc: 'Cita rasa roleplay seimbang, natural street flow'
  },
  {
    id: 'heavy',
    label: 'Slang Kental (100%)',
    badge: 'Full Biker Lore',
    desc: 'Kental dengan istilah White UK Biker / Rocker (thumper, ton, lid, etc.)'
  }
];

const QUICK_PROMPTS = [
  "Bro, mesin motor tua gue suaranya kasar pas digeber, tolong cekin di bengkel lu dong",
  "Lu mau cari masalah sama gua hah? Jangan macem-macem lu",
  "Cabut woi, ada polisi lagi patroli di sekitar sini!",
  "Gua ga terima lu nuduh gua cepu di depan anak-anak!",
  "Santai dulu kawan, kita omongin baik-baik sambil ngopi",
  "Ambil obeng dan kunci pas dari tas lalu mulai benerin karburator motor"
];

export default function TranslatorPage() {
  // Config state
  const [endpoint, setEndpoint] = useState('https://rnrbmqc.abc-tunnel.us/v1');
  const [apiKey, setApiKey] = useState('sk-dccd02cc8ccf53e8-zqx07k-0f0bc410');
  const [model, setModel] = useState('oc/mimo-v2.6-flash-free');
  const [availableModels, setAvailableModels] = useState<{ id: string; owned_by?: string; context_length?: number }[]>([
    { id: 'oc/mimo-v2.6-flash-free' },
    { id: 'oc/deepseek-v4-flash-free' },
    { id: 'oc/glm-5.3-flash-free' },
    { id: 'oc/nemotron-3.5-lightning-free' },
    { id: 'oc/mimo-v2.5-free' },
    { id: 'cl/openai/gpt-4o' },
    { id: 'getunikey/gemini-3.5-flash' },
  ]);
  
  // App state
  const [characterName, setCharacterName] = useState('Harold Ortega');
  const [persona, setPersona] = useState('uk_biker');
  const [slangLevel, setSlangLevel] = useState('light');
  const [commandType, setCommandType] = useState('says');
  const [inputPrompt, setInputPrompt] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<TranslationOutput | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  
  // Modals & History
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load saved state & auto-fetch models
  useEffect(() => {
    try {
      const savedEndpoint = localStorage.getItem('samp_endpoint');
      const savedKey = localStorage.getItem('samp_apikey');
      const savedModel = localStorage.getItem('samp_model');
      const savedChar = localStorage.getItem('samp_charname');
      const savedSlang = localStorage.getItem('samp_slang_level');
      const savedHistory = localStorage.getItem('samp_history');
      const savedModels = localStorage.getItem('samp_scraped_models');

      if (savedEndpoint) setEndpoint(savedEndpoint);
      if (savedKey) setApiKey(savedKey);
      if (savedModel) setModel(savedModel);
      if (savedChar) setCharacterName(savedChar);
      if (savedSlang) setSlangLevel(savedSlang);
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedModels) setAvailableModels(JSON.parse(savedModels));

      // Auto scrape if never fetched
      if (!savedModels) {
        fetch('/api/models', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            endpoint: savedEndpoint || 'https://rnrbmqc.abc-tunnel.us/v1',
            apiKey: savedKey || 'sk-dccd02cc8ccf53e8-zqx07k-0f0bc410'
          })
        })
          .then(res => res.json())
          .then(data => {
            if (data.models && data.models.length > 0) {
              setAvailableModels(data.models);
              localStorage.setItem('samp_scraped_models', JSON.stringify(data.models));
            }
          })
          .catch(e => console.warn('Background model fetch error:', e));
      }
    } catch (e) {
      console.warn('LocalStorage load error', e);
    }
  }, []);

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem('samp_endpoint', endpoint);
      localStorage.setItem('samp_apikey', apiKey);
      localStorage.setItem('samp_model', model);
      localStorage.setItem('samp_charname', characterName);
      localStorage.setItem('samp_slang_level', slangLevel);
      if (availableModels.length > 0) {
        localStorage.setItem('samp_scraped_models', JSON.stringify(availableModels));
      }
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [endpoint, apiKey, model, characterName, slangLevel, availableModels]);

  const handleTranslate = async () => {
    if (!inputPrompt.trim()) return;
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputPrompt,
          persona,
          commandType,
          characterName: characterName.trim() || 'Player',
          slangLevel,
          endpoint,
          apiKey,
          model
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menerjemahkan.');
      }

      const newResult: TranslationOutput = {
        translation: data.translation,
        commandFormatted: data.commandFormatted,
        alternatives: data.alternatives || [],
        notes: data.notes || '',
        modelUsed: data.modelUsed || model,
        slangLevel
      };
      setResult(newResult);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        indonesian: inputPrompt,
        translation: data.translation,
        commandFormatted: data.commandFormatted,
        persona,
        commandType,
        characterName: characterName.trim() || 'Player',
        slangLevel,
        timestamp: Date.now()
      };
      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem('samp_history', JSON.stringify(updatedHistory));

    } catch (err: any) {
      setErrorMsg(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const copyText = (text: string, type: 'raw' | 'command') => {
    const clean = text.replace(/^["']|["']$/g, '');
    navigator.clipboard.writeText(clean);
    if (type === 'raw') {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 2000);
    } else {
      setCopiedCommand(true);
      setTimeout(() => setCopiedCommand(false), 2000);
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('samp_history');
  };

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-[#0a0f1d]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center shadow-lg shadow-cyan-900/30">
              <Flame className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wider text-base text-white">
                  SAMP<span className="text-cyan-400">RP</span> TRANSLATOR
                </span>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  WHITE UK BIKER
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Tingkat Slang Dapat Disesuaikan • Scrape Model Langsung dari Server
              </p>
            </div>
          </div>

          {/* Quick Model Selector in Navbar */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="bg-transparent text-slate-200 font-mono text-[11px] focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[200px] truncate"
                title="Pilih Model AI Aktif"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id} className="bg-slate-900 text-white">
                    {m.id}
                  </option>
                ))}
              </select>
            </div>

            {/* Biker Slang Glossary Button */}
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 text-xs font-medium transition"
              title="Kamus Slang Biker List Slank.txt"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kamus Slang</span>
            </button>

            {/* Settings Modal Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white transition"
              title="Pengaturan Endpoint, Scrape Models & API Key"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Row 1: Character Name & SAMP Command */}
        <div className="p-4 rounded-2xl border border-slate-800 bg-[#0d1324]/80 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Character Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Nama Karakter Roleplay</span>
              <span className="text-[10px] text-slate-500 font-mono">Contoh: Harold_Ortega</span>
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Contoh: Harold Ortega, Julian Dalopez"
              className="w-full px-3.5 py-2 rounded-xl bg-[#090d18] border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition font-mono"
            />
          </div>

          {/* Command Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Format Chat / Command SAMP
            </label>
            <div className="grid grid-cols-5 gap-1 bg-[#090d18] p-1 rounded-xl border border-slate-800 text-xs">
              {[
                { id: 'says', label: 'says:' },
                { id: 'shouts', label: 'shouts!' },
                { id: 'whispers', label: 'whisper' },
                { id: 'me', label: '/me' },
                { id: 'do', label: '/do' }
              ].map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => setCommandType(cmd.id)}
                  className={`py-1.5 text-center font-mono rounded-lg transition ${
                    commandType === cmd.id
                      ? cmd.id === 'me' || cmd.id === 'do'
                        ? 'bg-[#c2a2da]/20 text-[#e6d0ff] border border-[#c2a2da]/40 font-bold'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 2: Slang Level Selector (Pengatur Tingkatan Slang) */}
        <div className="p-4 rounded-2xl border border-slate-800/90 bg-[#0c1221] space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Tingkat Kepadatan Slang (Slang Level)</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Pilih seberapa santai / kental slang yang diinginkan
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SLANG_LEVELS.map((lvl) => {
              const isSelected = slangLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setSlangLevel(lvl.id)}
                  className={`p-3 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400'
                      : 'border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {lvl.label}
                    </span>
                    {isSelected && <span className="w-2 h-2 rounded-full bg-cyan-400"></span>}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {lvl.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Persona Selector Chips */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Gaya Karakter Roleplay (White UK Biker Lore Focus)
            </span>
            <span className="text-[10px] text-slate-500">Khusus British / Rocker, dilarang AAVE black slang</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {PERSONAS.map((p) => {
              const Icon = p.icon;
              const isActive = persona === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition group relative overflow-hidden ${
                    isActive
                      ? `${p.color} border-current shadow-lg ring-1 ring-current`
                      : 'border-slate-800/80 bg-slate-900/30 hover:bg-slate-900/80 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon className="w-4 h-4 shrink-0" />
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold leading-tight">{p.label}</div>
                    <div className="text-[10px] opacity-75 line-clamp-1 mt-0.5">{p.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input & Output Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Input Textarea */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Ketik Kalimat Bahasa Indonesia</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                  Bebas slang & bahasa gaul
                </span>
              </label>
              {inputPrompt && (
                <button
                  onClick={() => setInputPrompt('')}
                  className="text-xs text-slate-500 hover:text-slate-300 transition"
                >
                  Bersihkan
                </button>
              )}
            </div>

            <div className="relative flex-1">
              <textarea
                ref={textareaRef}
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={7}
                placeholder="Contoh: Bro, mesin motor gue kayaknya jebol nih, pas digeber bunyi kasar banget... atau /me: ngambil kunci dari tas lalu benerin motor"
                className="w-full h-full min-h-[170px] p-4 rounded-2xl bg-[#090d18] border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition resize-none text-sm leading-relaxed"
              />
              <div className="absolute right-3 bottom-3 text-[11px] text-slate-600 font-mono">
                Ctrl + Enter untuk kirim
              </div>
            </div>

            {/* Quick Sample Prompts */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Contoh Percakapan Cepat:</span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((qp, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputPrompt(qp);
                      if (textareaRef.current) textareaRef.current.focus();
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-cyan-300 transition text-left truncate max-w-full"
                  >
                    {qp}
                  </button>
                ))}
              </div>
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={loading || !inputPrompt.trim()}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-cyan-950/40 flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin text-slate-950" />
                  <span>Menerjemahkan dengan AI ({model.split('/').pop()})...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>TERJEMAHKAN KE BAHASA RP</span>
                </>
              )}
            </button>
          </div>

          {/* Right: Output Card & SAMP Preview */}
          <div className="space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Hasil Terjemahan Natural Roleplay</span>
              </label>
              {result && (
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <Check className="w-3 h-3" /> Siap Paste ke SAMP
                </span>
              )}
            </div>

            {errorMsg && (
              <div className="p-4 rounded-2xl bg-red-950/30 border border-red-800/60 text-red-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-red-400" />
                  Gagal Memanggil LLM:
                </div>
                <div>{errorMsg}</div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Tips: Coba pilih model lain di dropdown kanan atas atau klik tombol gear pengaturan.
                </div>
              </div>
            )}

            {!result && !errorMsg && !loading && (
              <div className="h-full min-h-[220px] rounded-2xl border border-dashed border-slate-800 bg-[#090d18]/40 flex flex-col items-center justify-center p-6 text-center text-slate-500 space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
                  <Terminal className="w-6 h-6" />
                </div>
                <p className="text-xs font-medium text-slate-400">Belum ada hasil terjemahan</p>
                <p className="text-[11px] text-slate-600 max-w-xs">
                  Ketik kalimat di sebelah kiri, pilih tingkat slang yang cocok, lalu klik &quot;TERJEMAHKAN KE BAHASA RP&quot;.
                </p>
              </div>
            )}

            {loading && (
              <div className="h-full min-h-[220px] rounded-2xl border border-slate-800 bg-[#090d18]/60 flex flex-col items-center justify-center p-6 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-cyan-300 font-medium font-mono animate-pulse">
                  AI sedang meracik dialog roleplay natural ({slangLevel} slang)...
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {/* Primary Card */}
                <div className="p-5 rounded-2xl border border-cyan-500/30 bg-[#0b1222] shadow-xl space-y-4">
                  {/* English output */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-cyan-400 font-bold">
                        Natural English RP
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
                        Level: {slangLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-white leading-relaxed font-sans">
                      &quot;{result.translation.replace(/^["']|["']$/g, '')}&quot;
                    </p>
                  </div>

                  {/* Copy Action Buttons */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => copyText(result.translation, 'raw')}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      {copiedRaw ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRaw ? 'Tersalin!' : 'Copy English Polos'}</span>
                    </button>

                    <button
                      onClick={() => copyText(result.commandFormatted || result.translation, 'command')}
                      className="flex-1 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      {copiedCommand ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Terminal className="w-3.5 h-3.5" />}
                      <span>{copiedCommand ? 'Tersalin Format Chat!' : 'Copy Format SAMP'}</span>
                    </button>
                  </div>

                  {/* Notes / Slang Explanation */}
                  {result.notes && (
                    <div className="text-xs bg-slate-900/80 p-3 rounded-xl border border-slate-800/60 text-slate-400 space-y-1">
                      <span className="font-semibold text-cyan-300">Penjelasan Gaya & Nada:</span>
                      <p className="leading-relaxed text-[11px] text-slate-300">{result.notes}</p>
                    </div>
                  )}

                  {/* Alternative Vibes */}
                  {result.alternatives && result.alternatives.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-[11px] font-semibold text-slate-400">Variasi Vibe Lainnya:</span>
                      <div className="space-y-1.5">
                        {result.alternatives.map((alt, i) => (
                          <div
                            key={i}
                            onClick={() => copyText(alt.text, 'raw')}
                            className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition flex items-center justify-between text-xs"
                            title="Klik untuk salin variasi ini"
                          >
                            <div className="pr-2">
                              <span className="text-[10px] font-mono text-cyan-400 font-bold block">{alt.label}</span>
                              <span className="text-slate-300">&quot;{alt.text.replace(/^["']|["']$/g, '')}&quot;</span>
                            </div>
                            <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Live SAMP In-Game Chat Box Simulation */}
                <SAMPPreviewBox
                  characterName={characterName}
                  commandType={commandType}
                  translation={result.translation}
                  commandFormatted={result.commandFormatted}
                />
              </div>
            )}
          </div>
        </div>

        {/* Translation History Section */}
        {history.length > 0 && (
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span>Riwayat Terjemahan Sesi Ini ({history.length})</span>
              </div>
              <button
                onClick={clearHistory}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hapus Riwayat</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {history.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-800/70 bg-slate-900/40 hover:bg-slate-900/80 transition flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="text-slate-400 truncate">ID: &quot;{item.indonesian}&quot;</div>
                    <div className="text-white font-medium font-mono truncate text-[11px] text-cyan-300">
                      EN: &quot;{item.translation}&quot;
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.characterName} • {item.commandType} • {item.persona} • Slang: {item.slangLevel || 'light'}
                    </div>
                  </div>
                  <button
                    onClick={() => copyText(item.commandFormatted || item.translation, 'command')}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 transition"
                    title="Salin chat SAMP"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#060912] py-4 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            SAMP RP Translator • White UK Biker & Ace Cafe Lore Edition
          </span>
          <span className="font-mono text-cyan-400 text-[11px]">
            Model: {model} • Ready for vercel.app
          </span>
        </div>
      </footer>

      {/* Modals */}
      <SlangGlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
        onSelectTerm={(term) => {
          setInputPrompt((prev) => (prev ? `${prev} ${term}` : term));
          if (textareaRef.current) textareaRef.current.focus();
        }}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        endpoint={endpoint}
        setEndpoint={setEndpoint}
        apiKey={apiKey}
        setApiKey={setApiKey}
        model={model}
        setModel={setModel}
        availableModels={availableModels}
        setAvailableModels={setAvailableModels}
      />
    </div>
  );
}
