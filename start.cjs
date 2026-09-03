/**
 * Production server runner with automatic fallback build detection
 * Ensures dist/server.cjs exists before launching the server.
 */
const fs = require('fs');
const { execSync } = require('child_process');

if (!fs.existsSync('dist/server.cjs') || !fs.existsSync('dist/index.html')) {
  console.log('==> [ECHO] dist/server.cjs not found. Automatically running build step...');
  const isBun = typeof Bun !== 'undefined' || process.versions.bun;
  const runner = isBun ? 'bun' : 'npm';
  execSync(`${runner} run build`, { stdio: 'inherit' });
}

console.log('==> [ECHO] Starting production server from dist/server.cjs...');
require('./dist/server.cjs');
