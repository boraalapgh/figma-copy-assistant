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

  console.log(`Default endpoint: ${defaultEndpoint}`);
  const endpoint = await ask('API Endpoint (press Enter for default): ') || defaultEndpoint;
  const secret = await ask('API Secret (PLUGIN_API_SECRET value): ');

  if (!secret) {
    console.log('\n❌ API Secret is required.\n');
    rl.close();
    process.exit(1);
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
