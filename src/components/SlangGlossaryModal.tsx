'use client';

import React, { useState } from 'react';
import { X, Search, Copy, Check, BookOpen, Flame, Wrench, Shield, DollarSign } from 'lucide-react';
import { BIKER_SLANG_LIST } from '@/lib/slangList';
import { SLANG_DATABASE } from '@/lib/rpDictionary';

interface SlangGlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTerm?: (term: string) => void;
}

export function SlangGlossaryModal({ isOpen, onClose, onSelectTerm }: SlangGlossaryModalProps) {
  const [tab, setTab] = useState<'biker' | 'street'>('biker');
  const [search, setSearch] = useState('');
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTerm(text);
    setTimeout(() => setCopiedTerm(null), 1800);
  };

  const filteredBiker = BIKER_SLANG_LIST.filter(item => 
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.meaning.toLowerCase().includes(search.toLowerCase()) ||
    item.example.toLowerCase().includes(search.toLowerCase())
  );

  const filteredStreet = SLANG_DATABASE.filter(item =>
    item.indonesian.toLowerCase().includes(search.toLowerCase()) ||
    item.english.toLowerCase().includes(search.toLowerCase()) ||
    item.exampleIndo.toLowerCase().includes(search.toLowerCase()) ||
    item.exampleEn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl border border-slate-700/80 bg-[#0d1322] shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0a0e1a]">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Kamus Slang Roleplay & Biker
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  List Slank.txt Included
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Kamus lengkap slang Café Racer, Rocker, Gang, Polisi, dan Mekanik GTA SAMP
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Search Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-[#0b101e] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center space-x-1 p-1 bg-slate-900 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setTab('biker')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                tab === 'biker'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              Biker / Café Racer ({BIKER_SLANG_LIST.length})
            </button>
            <button
              onClick={() => setTab('street')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                tab === 'street'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              SAMP Gang & Street ({SLANG_DATABASE.length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kata atau arti..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900/80 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>
        </div>

        {/* Slang Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {tab === 'biker' ? (
            filteredBiker.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Tidak ada kata slang yang cocok dengan pencarian.
              </div>
            ) : (
              filteredBiker.map((item, idx) => (
                <div
                  key={idx}
                  className="group p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-cyan-300 font-mono">
                        {item.term}
                      </span>
                      <span className="text-xs text-slate-400">
                        — {item.meaning}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 italic font-mono bg-black/40 px-2.5 py-1 rounded border border-slate-800/60 inline-block">
                      &quot;{item.example}&quot;
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleCopy(item.term)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition"
                      title="Salin istilah"
                    >
                      {copiedTerm === item.term ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedTerm === item.term ? 'Copied' : 'Copy'}</span>
                    </button>
                    {onSelectTerm && (
                      <button
                        onClick={() => {
                          onSelectTerm(item.term);
                          onClose();
                        }}
                        className="px-2.5 py-1 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition"
                      >
                        Gunakan
                      </button>
                    )}
                  </div>
                </div>
              ))
            )
          ) : (
            filteredStreet.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                Tidak ada kosakata yang cocok.
              </div>
            ) : (
              filteredStreet.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-800/80 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-yellow-300">
                        {item.indonesian}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase tracking-wider font-mono">
                        {item.category}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(item.english)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition"
                    >
                      {copiedTerm === item.english ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy EN</span>
                    </button>
                  </div>
                  <div className="text-xs text-green-400 font-mono">
                    ➜ {item.english}
                  </div>
                  <div className="text-xs text-slate-400 space-y-0.5 border-t border-slate-800/60 pt-1.5">
                    <div><span className="text-slate-500">ID:</span> {item.exampleIndo}</div>
                    <div className="text-slate-300 font-mono"><span className="text-slate-500">EN:</span> {item.exampleEn}</div>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0a0e1a] flex justify-between items-center text-xs text-slate-500">
          <span>AI Translator secara otomatis memahami dan memasukkan slang ini saat relevan.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
