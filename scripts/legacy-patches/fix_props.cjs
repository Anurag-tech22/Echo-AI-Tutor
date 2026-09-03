const fs = require('fs');

const fixFile = (file) => {
  let content = fs.readFileSync(file, 'utf-8');
  if (content.includes('interface ') && content.includes('Props {') && !content.includes('className?: string')) {
    content = content.replace(/Props \{/, "Props {\n  className?: string;");
    content = content.replace(/\{ onViewChange \}: \w+Props/, "{ className, onViewChange }: " + content.match(/(\w+Props)/)[1]);
    content = content.replace(/\{ \}: \w+Props/, "{ className }: " + (content.match(/(\w+Props)/)?.[1] || 'any'));
    
    // Add className to wrapper if possible
    if (content.includes('className="bg-slate-900/60')) {
      content = content.replace('className="bg-slate-900/60', 'className={cn("bg-slate-900/60');
      // this is tricky, I will just sed the specific files instead.
    }
  }
}

