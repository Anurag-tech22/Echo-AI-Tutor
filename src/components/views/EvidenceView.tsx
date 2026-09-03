import React from 'react';
import { TransferChallenge } from '../dashboard/TransferChallenge';
import { ProofOfUnderstanding } from '../dashboard/ProofOfUnderstanding';

export function EvidenceView() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 fade-in h-full flex flex-col">
      <div className="mb-8 shrink-0">
        <h1 className="text-3xl font-bold text-white mb-2">Learning Evidence</h1>
        <p className="text-slate-400">Cryptographically verifiable proof of your cognitive mastery across domains.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">Verified Concepts</h2>
          <ProofOfUnderstanding />
          
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md mt-6">
            <h3 className="text-lg font-semibold text-slate-200 mb-4">Recent Verifications</h3>
            <div className="space-y-4">
              {[
                { title: 'Conservation of Momentum', date: '2 days ago', score: '94%' },
                { title: 'Kinetic Friction', date: '5 days ago', score: '88%' },
                { title: 'Projectile Motion', date: '1 week ago', score: '91%' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 border-b border-slate-800 last:border-0">
                  <div>
                    <h4 className="font-medium text-slate-200">{item.title}</h4>
                    <p className="text-xs text-slate-500">{item.date}</p>
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded text-sm font-bold border border-emerald-500/20">
                    {item.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Transfer Capabilities</h2>
          <TransferChallenge className="h-full" />
        </div>
      </div>
    </div>
  );
}
