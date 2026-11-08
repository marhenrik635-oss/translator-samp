'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Check, RefreshCw, Key, Globe, Cpu, AlertCircle, Sparkles, Search } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: string;
  setEndpoint: (ep: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (m: string) => void;
  availableModels: { id: string; owned_by?: string; context_length?: number }[];
  setAvailableModels: React.Dispatch<React.SetStateAction<{ id: string; owned_by?: string; context_length?: number }[]>>;
}

export function SettingsModal({
  isOpen,
  onClose,
  endpoint,
  setEndpoint,
  apiKey,
  setApiKey,
  model,
  setModel,
  availableModels,
  setAvailableModels
}: SettingsModalProps) {
  const [testing, setTesting] = useState(false);
  const [scraping, setScraping] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [modelSearch, setModelSearch] = useState('');

  if (!isOpen) return null;

  const handleScrapeModels = async () => {
    setScraping(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint, apiKey })
      });
      const data = await res.json();
      if (res.ok && Array.isArray(data.models) && data.models.length > 0) {
        setAvailableModels(data.models);
        setTestResult({
          ok: true,
          message: `Berhasil mengambil ${data.models.length} model langsung dari server endpoint!`
        });
      } else {
        throw new Error(data.error || 'Tidak ada model yang ditemukan.');
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: `Gagal scrape models: ${err.message}`
      });
    } finally {
      setScraping(false);
    }
  };

  const handleResetDefaults = () => {
    setEndpoint('https://rnrbmqc.abc-tunnel.us/v1');
    setApiKey('sk-dccd02cc8ccf53e8-zqx07k-0f0bc410');
    setModel('oc/mimo-v2.6-flash-free');
    setTestResult({ ok: true, message: 'Pengaturan dikembalikan ke default bawaan.' });
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: 'tes koneksi',
          persona: 'casual',
          commandType: 'says',
          slangLevel: 'light',
          endpoint,
          apiKey,
          model
        })
      });
      const data = await res.json();
      if (res.ok && data.translation) {
        setTestResult({
          ok: true,
          message: `Berhasil terhubung ke model: ${data.modelUsed || model}`
        });
      } else {
        setTestResult({
          ok: false,
          message: data.error || 'Koneksi gagal. Periksa endpoint & API key.'
        });
      }
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err.message || 'Gagal menghubungi server proxy.'
      });
    } finally {
      setTesting(false);
    }
  };

  const filteredModels = availableModels.filter(m => 
    m.id.toLowerCase().includes(modelSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl max-h-[90vh] rounded-2xl border border-slate-700/80 bg-[#0d1322] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0e1a]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Pengaturan Model & Endpoint LLM
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live Scrape Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">Pilih model langsung dari endpoint tanpa edit kode</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Endpoint */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-blue-400" />
              API Base Endpoint URL
            </label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Scrape Models Section */}
          <div className="p-3.5 rounded-xl border border-slate-800 bg-[#090e1a] space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Daftar Model Server ({availableModels.length} Model Terdeteksi)
              </label>
              <button
                type="button"
                onClick={handleScrapeModels}
                disabled={scraping}
                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${scraping ? 'animate-spin' : ''}`} />
                <span>{scraping ? 'Menyinkronkan...' : 'Sinkron / Scrape Ulang'}</span>
              </button>
            </div>

            {/* Search Model */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={modelSearch}
                onChange={(e) => setModelSearch(e.target.value)}
                placeholder="Cari nama model (misal: mimo, flash, deepseek, free)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            {/* Model Select Box */}
            <div className="space-y-1">
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                size={5}
                className="w-full p-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition text-xs font-mono"
              >
                {filteredModels.map((m) => (
                  <option key={m.id} value={m.id} className="py-1 px-2 hover:bg-cyan-950">
                    {m.id} {m.id.includes('free') ? '★ [FREE]' : ''}
                  </option>
                ))}
              </select>
              <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
                <span>Model Aktif: <strong className="text-cyan-300 font-mono">{model}</strong></span>
                <span className="text-slate-500 text-[10px]">Klik model di daftar untuk memilih</span>
              </div>
            </div>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border flex items-start gap-2 ${
                testResult.ok
                  ? 'bg-green-950/40 border-green-800/80 text-green-300'
                  : 'bg-red-950/40 border-red-800/80 text-red-300'
              }`}
            >
              {testResult.ok ? (
                <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              )}
              <span className="text-xs leading-relaxed">{testResult.message}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Default
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>{testing ? 'Testing...' : 'Tes Koneksi'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0a0e1a] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition"
          >
            Simpan & Gunakan
          </button>
        </div>
      </div>
    </div>
  );
}
