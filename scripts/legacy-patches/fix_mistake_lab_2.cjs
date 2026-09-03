const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MistakeLab.tsx', 'utf-8');

// Undo the wrong replace:
content = content.replace("Why Mistake Lab?</motion.button>", "Why Mistake Lab?</button>");

// Redo the replace on LabModeCard
const oldCardStr = `<h4 className={cn("text-sm font-medium mb-1 transition-colors", active ? 'text-white' : 'text-slate-200')}>{title}</h4>      <p className="text-xs opacity-70 leading-tight">{desc}</p>    </button>  );}`;

const newCardStr = `<h4 className={cn("text-sm font-medium mb-1 transition-colors", active ? 'text-white' : 'text-slate-200')}>{title}</h4>      <p className="text-xs opacity-70 leading-tight">{desc}</p>    </motion.button>  );}`;

content = content.replace(oldCardStr, newCardStr);

fs.writeFileSync('src/components/dashboard/MistakeLab.tsx', content);
