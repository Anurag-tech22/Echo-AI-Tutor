import React from 'react';
import { FutureMistakeForecast } from '../dashboard/FutureMistakeForecast';
import { AlertTriangle, TrendingDown, ArrowRight } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { ViewType } from '../Sidebar';

interface ForecastViewProps {
  onViewChange?: (view: ViewType) => void;
}

export function ForecastView({ onViewChange }: ForecastViewProps) {
  const { showToast } = useUI();

  
  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20 fade-in h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Mistake Forecast</h1>
        <p className="text-slate-400">Predictive analytics identifying where your mental models might break next.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Highest Probability</h2>
          <FutureMistakeForecast className="h-full min-h-[420px]" onViewChange={onViewChange} />
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white mb-4">Upcoming Risks</h2>
          
          {[
            { concept: 'Kinetic Friction', prob: '62%', context: 'Inclined Planes', color: 'amber' },
            { concept: 'Tension', prob: '45%', context: 'Multi-Pulley Systems', color: 'indigo' },
            { concept: 'Conservation of Energy', prob: '30%', context: 'Non-conservative Forces', color: 'emerald' },
          ].map((risk, i) => (
            <div 
              key={i} 
              onClick={() => {
                showToast(`Loading module for ${risk.concept}...`);
                onViewChange?.('mistake-lab');
              }}
              className={`bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-md flex items-center gap-4 hover:bg-slate-800/50 transition-colors cursor-pointer`}
            >
              <div className={`w-12 h-12 rounded-full bg-${risk.color}-500/10 border border-${risk.color}-500/30 flex items-center justify-center shrink-0`}>
                <TrendingDown className={`w-6 h-6 text-${risk.color}-400`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-medium text-slate-200">{risk.concept}</h4>
                  <span className={`text-sm font-bold text-${risk.color}-400`}>{risk.prob} Risk</span>
                </div>
                <p className="text-sm text-slate-400">Context: {risk.context}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-500" />
            </div>
          ))}
          
          <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-indigo-400 shrink-0 mt-1" />
              <div>
                <h4 className="font-medium text-indigo-300 mb-2">ECHO Insight</h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Your recent performance shows a pattern of conflating scalar and vector quantities under time pressure. Reviewing vector addition before tackling 2D kinematics will reduce your error rate by an estimated 24%.
                </p>
                <button 
                  onClick={() => {
                    showToast("Opening Vector Addition review module...");
                    onViewChange?.('mistake-lab');
                  }}
                  className="mt-4 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Review Vector Addition
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
