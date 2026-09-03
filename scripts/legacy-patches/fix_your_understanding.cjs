const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/YourUnderstanding.tsx', 'utf-8');

content = content.replace('interface YourUnderstandingProps {', 'interface YourUnderstandingProps {\n  className?: string;');
content = content.replace('export function YourUnderstanding({ onViewChange }: YourUnderstandingProps) {', 'export function YourUnderstanding({ onViewChange, className }: YourUnderstandingProps) {');
content = content.replace('className="h-full bg-slate-900/60', 'className={cn("h-full bg-slate-900/60"');
content = content.replace('backdrop-blur-md">', 'backdrop-blur-md", className)}>');
content = "import { cn } from '../../lib/utils';\n" + content;

fs.writeFileSync('src/components/dashboard/YourUnderstanding.tsx', content);
