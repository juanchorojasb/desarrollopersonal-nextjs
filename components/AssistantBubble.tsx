'use client';

import { useState } from 'react';
import { Bot, X, Maximize2 } from 'lucide-react';
import Link from 'next/link';
import VoiceAssistant from './VoiceAssistant';

export default function AssistantBubble() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-80 sm:w-96 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Mini header */}
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white flex-1">Dora — Asistente IA</span>
            <Link
              href="/dashboard/asistente"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              title="Abrir en pantalla completa"
              onClick={() => setOpen(false)}
            >
              <Maximize2 className="w-4 h-4 text-white" />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Assistant */}
          <div className="flex-1 overflow-hidden">
            <VoiceAssistant compact />
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open
            ? 'bg-gray-700 hover:bg-gray-800 rotate-0'
            : 'bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
        }`}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente IA'}
      >
        {open ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Bot className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
}
