'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';

interface SAMPPreviewBoxProps {
  characterName: string;
  commandType: string;
  translation: string;
  commandFormatted: string;
}

export function SAMPPreviewBox({
  characterName,
  commandType,
  translation,
  commandFormatted
}: SAMPPreviewBoxProps) {
  const [copied, setCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState('18:45:12');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${h}:${m}:${s}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(commandFormatted || translation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!translation) return null;

  // Color matching according to SAMP client
  let textColorClass = 'text-white';
  let chatDisplay = '';

  const cleanTranslation = translation.replace(/^["']|["']$/g, '');

  if (commandFormatted) {
    chatDisplay = commandFormatted;
  } else if (commandType === 'me') {
    textColorClass = 'text-[#c2a2da] font-medium'; // SAMP Purple /me
    chatDisplay = `* ${characterName || 'Player'} ${cleanTranslation}`;
  } else if (commandType === 'do') {
    textColorClass = 'text-[#c2a2da] italic'; // SAMP Purple /do
    chatDisplay = `(( ${cleanTranslation} ((${characterName || 'Player'})) ))`;
  } else if (commandType === 'shouts') {
    textColorClass = 'text-white font-semibold';
    chatDisplay = `${characterName || 'Player'} shouts: ${cleanTranslation}!`;
  } else if (commandType === 'whispers') {
    textColorClass = 'text-[#fff7c2] italic';
    chatDisplay = `${characterName || 'Player'} whispers: ${cleanTranslation}`;
  } else {
    textColorClass = 'text-[#ffffff]';
    chatDisplay = `${characterName || 'Player'} says: ${cleanTranslation}`;
  }

  return (
    <div className="relative mt-4 rounded-xl border border-slate-800 bg-[#060911]/90 shadow-2xl backdrop-blur-md overflow-hidden">
      {/* Header bar */}
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-slate-800/80 bg-[#0a0f1d]/60">
        <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
          <Terminal className="w-3.5 h-3.5" />
          <span>SAMP In-Game Chat Preview (JGRP Style)</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
          title="Salin persis format chat SAMP"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          <span>{copied ? 'Tersalin!' : 'Copy Chat'}</span>
        </button>
      </div>

      {/* Simulated SAMP Chat Screen */}
      <div className="p-4 samp-chat-font bg-black/70 min-h-[72px] flex items-center">
        <div className="w-full">
          <span className="text-slate-500 mr-2">[{currentTime}]</span>
          <span className={textColorClass}>{chatDisplay}</span>
        </div>
      </div>
    </div>
  );
}
