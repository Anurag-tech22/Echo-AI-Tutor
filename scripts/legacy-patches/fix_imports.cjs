const fs = require('fs');

let content = fs.readFileSync('src/components/dashboard/LiveSimulation.tsx', 'utf-8');

// Ensure useMemo is imported from react
if (!content.includes('useMemo } from \'react\'')) {
  content = content.replace(/import React, \{ useState, useEffect, useRef \} from 'react';/, "import React, { useState, useEffect, useRef, useMemo } from 'react';");
}

fs.writeFileSync('src/components/dashboard/LiveSimulation.tsx', content);
