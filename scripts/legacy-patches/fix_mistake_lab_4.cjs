const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MistakeLab.tsx', 'utf-8');

const regex = /function LabModeCard\(\[\s\S]*\}\)/;

const newFn = `
function LabModeCard({ icon: Icon, title, desc, active, color, onClick }: { icon: any, title: string, desc: string, active?: boolean, color: 'emerald' | 'amber' | 'rose' | 'purple', onClick: () => void }) {
  const colorMap = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10 hover:border-emerald-500/50',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/10 hover:border-amber-500/50',
    rose: 'text-rose-400 border-rose-500/30 bg-rose-500/10 hover:border-rose-500/50',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/10 hover:border-purple-500/50',
  };
  
  const defaultColors = 'text-slate-400 border-slate-800 bg-slate-900/50 hover:border-slate-700 hover:bg-slate-800';
  return (
    <motion.button 
      onClick={onClick}
      className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all h-full", active ? colorMap[color] : defaultColors)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center mb-3 transition-colors", active ? 'bg-current/10' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700')}>
        <Icon className="w-5 h-5" />
      </div>
      <h4 className={cn("text-sm font-medium mb-1 transition-colors", active ? 'text-white' : 'text-slate-200')}>{title}</h4>
      <p className="text-xs opacity-70 leading-tight">{desc}</p>
    </motion.button>
  );
}
`;

content = content.replace(/function LabModeCard\(\{[\s\S]*\}\s*\n*\s*\}\s*$/m, newFn.trim());

fs.writeFileSync('src/components/dashboard/MistakeLab.tsx', content);
