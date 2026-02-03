#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const templatePath = join(rootDir, 'figma-plugin/ui.template.html');
const outputPath = join(rootDir, 'figma-plugin/ui.html');

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

  // Check if ui.html already exists
  if (existsSync(outputPath)) {
    const overwrite = await ask('ui.html already exists. Overwrite? (y/N): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.\n');
      rl.close();
      process.exit(0);
    }
  }

  // Get values from user
  const defaultEndpoint = 'https://figma-copy-assistant.vercel.app/api/generate';

  console.log(`Default endpoint: ${defaultEndpoint}\n`);

  let endpoint = await ask('API Endpoint (press Enter for default): ');
  endpoint = endpoint.trim() || defaultEndpoint;

  console.log(''); // blank line
  let secret = await ask('API Secret (PLUGIN_API_SECRET value): ');
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
