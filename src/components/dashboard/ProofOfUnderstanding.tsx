import React from 'react';
import { Star, Check } from 'lucide-react';
import { cn } from '../../lib/utils';

export function ProofOfUnderstanding({ className }: { className?: string }) {
  const criteria = [
    'Direct Problems',
    'Changed Numbers',
    'Changed Context',
    'Edge Cases',
    'Explain to Someone'
  ];

  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-slate-100">Proof of Understanding</h3>
        <span className="text-xs text-slate-400">Newton's Second Law</span>
      </div>

      <div className="flex items-center justify-between mb-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
        <div>
          <h4 className="text-emerald-400 font-bold tracking-wide uppercase mb-1">Transfer Verified</h4>
          <p className="text-sm text-emerald-100/70">You can apply this concept in unfamiliar real-world situations.</p>
        </div>
        <div className="relative">
          <Star className="w-12 h-12 text-emerald-400 fill-emerald-500/20" />
          <div className="absolute top-1 right-0 text-emerald-300">
             <Star className="w-4 h-4 fill-emerald-300/50" />
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
        {criteria.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 text-slate-950 stroke-[3]" />
            </div>
            <span className="text-xs text-slate-300">{c}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 mt-auto">
        <span className="text-sm font-medium text-slate-400">Overall Mastery</span>
        <div className="w-12 h-12 rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <span className="text-sm font-bold text-white">92%</span>
        </div>
      </div>
    </div>
  );
}
