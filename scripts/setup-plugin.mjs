#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const templatePath = join(rootDir, 'figma-plugin/ui.template.html');
const outputPath = join(rootDir, 'figma-plugin/ui.html');
const envLocalPath = join(rootDir, '.env.local');
const envPath = join(rootDir, '.env');

const DEFAULT_ENDPOINT = 'https://figma-copy-assistant.vercel.app/api/generate';

// Parse .env file
function parseEnvFile(filePath) {
  if (!existsSync(filePath)) return {};

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

// Load env from .env.local or .env
function loadEnv() {
  // .env.local takes priority
  if (existsSync(envLocalPath)) {
    return { env: parseEnvFile(envLocalPath), source: '.env.local' };
  }
  if (existsSync(envPath)) {
    return { env: parseEnvFile(envPath), source: '.env' };
  }
  return { env: {}, source: null };
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  console.log('\n✦ Figma Copy Assistant - Plugin Setup\n');

  // Try to load from env file
  const { env, source } = loadEnv();
  let endpoint = env.PLUGIN_API_ENDPOINT || DEFAULT_ENDPOINT;
  let secret = env.PLUGIN_API_SECRET || '';

  if (source && secret) {
    // Found env file with secret - use it automatically
    console.log(`Found ${source} with credentials\n`);
    console.log('─────────────────────────────────────');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Secret:   ${secret.slice(0, 8)}${'*'.repeat(Math.max(0, secret.length - 8))}`);
    console.log('─────────────────────────────────────\n');
  } else {
    // No env file or missing secret - prompt user
    if (!source) {
      console.log('No .env.local found. You can create one to skip prompts next time.\n');
    }

    console.log(`Default endpoint: ${DEFAULT_ENDPOINT}\n`);

    const inputEndpoint = await ask('API Endpoint (press Enter for default): ');
    endpoint = inputEndpoint.trim() || endpoint;

    console.log('');
    secret = await ask('API Secret (PLUGIN_API_SECRET value): ');
    secret = secret.trim();

    if (!secret) {
      console.log('\n❌ API Secret is required.\n');
      rl.close();
      process.exit(1);
    }

    // Confirm values
    console.log('\n─────────────────────────────────────');
    console.log(`Endpoint: ${endpoint}`);
    console.log(`Secret:   ${secret.slice(0, 8)}${'*'.repeat(Math.max(0, secret.length - 8))}`);
    console.log('─────────────────────────────────────\n');

    const confirm = await ask('Create ui.html with these values? (Y/n): ');
    if (confirm.toLowerCase() === 'n') {
      console.log('Setup cancelled. Run again to retry.\n');
      rl.close();
      process.exit(0);
    }

    // Offer to save to .env.local
    const saveEnv = await ask('Save to .env.local for future runs? (Y/n): ');
    if (saveEnv.toLowerCase() !== 'n') {
      const envContent = `# Figma Copy Assistant - Local Configuration
# This file is gitignored - your secrets stay local

PLUGIN_API_ENDPOINT=${endpoint}
PLUGIN_API_SECRET=${secret}
`;
      writeFileSync(envLocalPath, envContent);
      console.log('✅ Saved to .env.local');
    }
  }

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

  console.log('\n✅ Created figma-plugin/ui.html');
  console.log('\nNext steps:');
  console.log('1. Build the plugin: npm run figma:build');
  console.log('2. Import in Figma: Plugins → Development → Import plugin from manifest');
  console.log('3. Select: figma-plugin/manifest.json\n');

  rl.close();
}

main().catch((err) => {
  console.error('Error:', err.message);
  rl.close();
  process.exit(1);
});
