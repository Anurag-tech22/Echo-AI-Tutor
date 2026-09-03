const fs = require('fs');

let viewContent = fs.readFileSync('src/components/views/MistakeLabView.tsx', 'utf-8');
viewContent = viewContent.replace(
  '<MistakeLab className="min-h-[400px]" activeModifiers={activeModifiers} hideHeader={true} />',
  '<MistakeLab className="h-auto" activeModifiers={activeModifiers} hideHeader={true} />'
);
fs.writeFileSync('src/components/views/MistakeLabView.tsx', viewContent);

let compContent = fs.readFileSync('src/components/dashboard/MistakeLab.tsx', 'utf-8');
compContent = compContent.replace(
  'className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}',
  'className={cn("bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}'
);
fs.writeFileSync('src/components/dashboard/MistakeLab.tsx', compContent);
