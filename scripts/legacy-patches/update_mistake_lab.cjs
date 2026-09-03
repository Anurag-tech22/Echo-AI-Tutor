const fs = require('fs');
const content = fs.readFileSync('src/components/dashboard/MistakeLab.tsx', 'utf-8');
const newContent = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { motion } from 'motion/react';").replace(
  "className={cn(\"p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all h-full\", active ? colorMap[color] : defaultColors)}",
  "className={cn(\"p-4 rounded-xl border flex flex-col items-center justify-center text-center transition-all h-full\", active ? colorMap[color] : defaultColors)}\n      as={motion.button}\n      whileHover={{ scale: 1.05 }}\n      whileTap={{ scale: 0.95 }}"
).replace(
  "onClick={onClick}", "" // already in there 
);
fs.writeFileSync('src/components/dashboard/MistakeLab.tsx', newContent);
