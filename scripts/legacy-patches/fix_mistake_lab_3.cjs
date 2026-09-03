const fs = require('fs');
let content = fs.readFileSync('src/components/dashboard/MistakeLab.tsx', 'utf-8');

// Fix the wrong closing tag
content = content.replace("Why Mistake Lab?\n        </motion.button>", "Why Mistake Lab?\n        </button>");

// Fix the LabModeCard button
const oldButton = `<button             className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all h-full", active ? colorMap[color] : defaultColors)}      as={motion.button}      whileHover={{ scale: 1.05 }}      whileTap={{ scale: 0.95 }}    >`;

const newButton = `<motion.button onClick={onClick} className={cn("p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all h-full", active ? colorMap[color] : defaultColors)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>`;

content = content.replace(oldButton, newButton);
const lastButtonClose = content.lastIndexOf("</button>");
content = content.substring(0, lastButtonClose) + "</motion.button>" + content.substring(lastButtonClose + 9);

fs.writeFileSync('src/components/dashboard/MistakeLab.tsx', content);
