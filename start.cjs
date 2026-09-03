/**
 * Production server runner with automatic fallback build detection
 * Ensures dist/server.cjs exists before launching the server.
 */
const fs = require('fs');
const { execSync } = require('child_process');

if (!fs.existsSync('dist/server.cjs') || !fs.existsSync('dist/index.html')) {
  console.log('==> [ECHO] dist/server.cjs not found. Automatically running build step...');
  const isBun = typeof Bun !== 'undefined' || Boolean(process.versions && process.versions.bun);
  const runner = isBun ? 'bun' : 'npm';
  try {
    execSync(`${runner} run build`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        NODE_OPTIONS: '--max-old-space-size=1024'
      }
    });
  } catch (error) {
    console.error('==> [ECHO] Build step failed during startup. Please ensure your Render Build Command is set to: bun install && bun run build');
    process.exit(1);
  }
}

console.log('==> [ECHO] Starting production server from dist/server.cjs...');
require('./dist/server.cjs');
