import React from 'react';
import { Clock, Navigation2, FlaskConical, PenTool, Trophy, Medal, ArrowRight } from 'lucide-react';
import { cn } from '../../lib/utils';

export function LearningLoop({ className }: { className?: string }) {
  const steps = [
    { icon: Clock, label: 'Understand', desc: 'Build your base', active: false },
    { icon: Navigation2, label: 'Predict', desc: 'See future mistakes', active: false },
    { icon: FlaskConical, label: 'Stress-Test', desc: 'Break your assumptions', active: true },
    { icon: PenTool, label: 'Repair', desc: 'Fix your mental model', active: false },
    { icon: Trophy, label: 'Transfer', desc: 'Apply in new contexts', active: false },
    { icon: Medal, label: 'Prove', desc: 'Demonstrate mastery', active: false },
  ];

  return (
    <div className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md", className)}>
      <h3 className="text-lg font-medium text-slate-100 mb-8">The ECHO Learning Loop</h3>

      <div className="flex items-start justify-between relative mt-4">
        {/* Connecting Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-slate-800 -z-10">
           <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-500/0 w-[45%]"></div>
        </div>

        {steps.map((step, i) => (
          <div key={i} className="flex flex-col items-center group flex-1">
            <div className={cn(
              "w-12 h-12 rounded-full border-2 flex items-center justify-center mb-3 transition-all relative",
              step.active 
                ? "bg-slate-900 border-indigo-400 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)]" 
                : "bg-slate-900 border-slate-700 text-slate-500 group-hover:border-slate-500 group-hover:text-slate-300"
            )}>
              <step.icon className="w-5 h-5" />
              {i < steps.length - 1 && (
                <div className="absolute -right-[calc(50%+12px)] top-1/2 -translate-y-1/2 text-slate-700 pointer-events-none hidden sm:block">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </div>
            <span className={cn("text-xs font-semibold mb-1 text-center", step.active ? "text-slate-200" : "text-slate-400")}>{step.label}</span>
            <span className="text-[10px] text-slate-500 text-center leading-tight hidden sm:block">{step.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
