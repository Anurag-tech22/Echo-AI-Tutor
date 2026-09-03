const fs = require('fs');

let viewContent = fs.readFileSync('src/components/views/MistakeLabView.tsx', 'utf-8');
viewContent = viewContent.replace(
  '<MistakeLab className="h-[300px]" activeModifiers={activeModifiers} />',
  '<MistakeLab className="min-h-[400px]" activeModifiers={activeModifiers} hideHeader={true} />'
);
fs.writeFileSync('src/components/views/MistakeLabView.tsx', viewContent);

let compContent = fs.readFileSync('src/components/dashboard/MistakeLab.tsx', 'utf-8');
if (!compContent.includes('hideHeader?: boolean')) {
  compContent = compContent.replace(
    'activeModifiers?: string[];',
    'activeModifiers?: string[];\n  hideHeader?: boolean;'
  );
  compContent = compContent.replace(
    'activeModifiers = [] }: MistakeLabProps)',
    'activeModifiers = [], hideHeader = false }: MistakeLabProps)'
  );
  
  const headerCode = `<div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-slate-100">Mistake Lab</h3>
        <button 
          onClick={() => onViewChange?.('mistake-lab')}
          className="text-sm font-medium text-indigo-400 hover:text-indigo-300"
        >
          Why Mistake Lab?
        </button>
      </div>`;
      
  compContent = compContent.replace(
    headerCode,
    `{!hideHeader && (${headerCode})}`
  );
  fs.writeFileSync('src/components/dashboard/MistakeLab.tsx', compContent);
}

