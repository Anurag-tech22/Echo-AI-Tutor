const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

content = content.replace(
  "import { Toast } from './components/ui-layer/Toast';",
  "import { Toast } from './components/ui-layer/Toast';\nimport { AICopilot } from './components/AICopilot';"
);

content = content.replace(
  "<Toast />",
  "<Toast />\n      <AICopilot />"
);

fs.writeFileSync('src/App.tsx', content);
