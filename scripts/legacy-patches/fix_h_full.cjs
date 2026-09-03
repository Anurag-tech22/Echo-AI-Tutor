const fs = require('fs');

const files = [
  'src/components/dashboard/YourUnderstanding.tsx',
  'src/components/dashboard/UnderstandingMap.tsx',
  'src/components/dashboard/FutureMistakeForecast.tsx',
  'src/components/dashboard/MistakeLab.tsx',
  'src/components/dashboard/LiveSimulation.tsx',
  'src/components/dashboard/ReasoningXRay.tsx',
  'src/components/dashboard/Counterexample.tsx',
  'src/components/dashboard/LearningLoop.tsx',
  'src/components/dashboard/TransferChallenge.tsx',
  'src/components/dashboard/ProofOfUnderstanding.tsx',
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('className={cn("bg-slate-900/60')) {
    content = content.replace('className={cn("bg-slate-900/60', 'className={cn("h-full bg-slate-900/60');
  } else if (content.includes('className="bg-slate-900/60')) {
    content = content.replace('className="bg-slate-900/60', 'className="h-full bg-slate-900/60');
  } else if (content.includes('export function LiveSimulation') && content.includes('<div className="flex-1 bg-black')) {
    // skip LiveSimulation for now, it's more complex, wait, LiveSimulation has a wrapper in the Dashboard? No it returns the inner wrapper.
    // wait, LiveSimulation isn't wrapped in bg-slate-900/60? Let's check LiveSimulation.
  }
  fs.writeFileSync(file, content);
}
