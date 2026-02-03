#!/usr/bin/env node

/**
 * Regenerates ui.html from template using secrets from .env.local
 * Run this after template changes - no prompts needed
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const templatePath = join(rootDir, 'figma-plugin/ui.template.html');
const outputPath = join(rootDir, 'figma-plugin/ui.html');
const envLocalPath = join(rootDir, '.env.local');

const DEFAULT_ENDPOINT = 'https://figma-copy-assistant.vercel.app/api/generate';

// Parse .env file
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return null;

  const content = readFileSync(filePath, 'utf-8');
  const env = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function main() {
  console.log('\n✦ Figma Copy Assistant - Update UI\n');

  // Load from .env.local
  const env = parseEnvFile(envLocalPath);

  if (!env) {
    console.log('❌ No .env.local found. Run "npm run figma:setup" first.\n');
    process.exit(1);
  }

  const endpoint = env.PLUGIN_API_ENDPOINT || DEFAULT_ENDPOINT;
  const secret = env.PLUGIN_API_SECRET;

  if (!secret) {
    console.log('❌ PLUGIN_API_SECRET not found in .env.local');
    console.log('   Run "npm run figma:setup" to configure.\n');
    process.exit(1);
  }

  console.log(`Using secrets from .env.local`);
  console.log(`Endpoint: ${endpoint}`);
  console.log(`Secret:   ${secret.slice(0, 8)}${'*'.repeat(Math.max(0, secret.length - 8))}\n`);

  // Read template and replace placeholders
  let template = readFileSync(templatePath, 'utf-8');

  template = template.replace(
    "const API_ENDPOINT = 'YOUR_VERCEL_URL/api/generate';",
    `const API_ENDPOINT = '${endpoint}';`
  );

  template = template.replace(
    "const API_SECRET = 'YOUR_API_SECRET';",
    `const API_SECRET = '${secret}';`
  );

  // Write output
  writeFileSync(outputPath, template);

  console.log('✅ Updated figma-plugin/ui.html\n');
}

main();
