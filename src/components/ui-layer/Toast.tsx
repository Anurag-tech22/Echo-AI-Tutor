import React from 'react';
import { useUI } from '../../context/UIContext';
import { CheckCircle2 } from 'lucide-react';

export function Toast() {
  const { toastMessage } = useUI();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[150] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-800 border border-slate-700 shadow-2xl rounded-full px-5 py-3 flex items-center gap-3">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span className="text-sm font-medium text-slate-200">{toastMessage}</span>
      </div>
    </div>
  );
}
