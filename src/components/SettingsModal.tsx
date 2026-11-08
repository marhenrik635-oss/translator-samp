'use client';

import React, { useState } from 'react';
import { X, Settings, Check, RefreshCw, Key, Globe, Cpu, AlertCircle } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  endpoint: string;
  setEndpoint: (ep: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (m: string) => void;
}

const PRESET_MODELS = [
  { id: 'oc/mimo-v2.6-flash-free', name: 'oc/mimo-v2.6-flash-free (Rekomendasi Utama)', desc: 'Cepat, cerdas, pemahaman context & slang tinggi' },
  { id: 'oc/deepseek-v4-flash-free', name: 'oc/deepseek-v4-flash-free', desc: 'Alternatif DeepSeek kencang & detail' },
  { id: 'oc/glm-5.3-flash-free', name: 'oc/glm-5.3-flash-free', desc: 'Model reasoning kuat' },
  { id: 'oc/nemotron-3.5-lightning-free', name: 'oc/nemotron-3.5-lightning-free', desc: 'Nvidia Nemotron super cepat' }
];

export function SettingsModal({
  isOpen,
  onClose,
  endpoint,
  setEndpoint,
  apiKey,
  setApiKey,
  model,
  setModel
}: SettingsModalProps) {
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700/80 bg-[#0d1322] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0e1a]">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Konfigurasi Model & Endpoint LLM</h2>
              <p className="text-xs text-slate-400">Atur AI backend untuk translator roleplay Anda</p>
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
        <div className="p-6 space-y-4 text-xs">
          {/* Model selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Pilih Model LLM
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 transition text-xs"
            >
              {PRESET_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500">
              Default adalah <code className="text-cyan-300">oc/mimo-v2.6-flash-free</code>. Jika model sedang busy/down, otomatis fallback ke backup.
            </p>
          </div>

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
          <div className="flex items-center justify-between pt-2">
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
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Simpan & Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
