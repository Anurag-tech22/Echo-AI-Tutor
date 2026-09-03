const fs = require('fs');
let compContent = fs.readFileSync('src/components/dashboard/MistakeLab.tsx', 'utf-8');

// Update grid and card container styles
compContent = compContent.replace(
  '<div className="grid grid-cols-2 gap-3 flex-1">',
  '<div className="grid grid-cols-2 gap-3">'
);

compContent = compContent.replace(
  'className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all h-full", active ? colorMap[color] : defaultColors)}',
  'className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all min-h-[120px]", active ? colorMap[color] : defaultColors)}'
);

// If the parent container has h-full but the content exceeds it, we might want overflow-y-auto, 
// or just remove the h-full constraints so it grows naturally.
compContent = compContent.replace(
  'className={cn("bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col", className)}',
  'className={cn("h-full bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 relative overflow-y-auto backdrop-blur-md flex flex-col", className)}'
);

fs.writeFileSync('src/components/dashboard/MistakeLab.tsx', compContent);
