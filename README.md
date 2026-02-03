# Figma Copy Assistant

AI-powered UX copywriting assistant for Figma. Built for GoodHabitz design team.

## Features

- **Three-layer context**: System prompt (brand guidelines) + Project context (per-file) + User request
- **Smart shortcuts**: Quick actions like "Make it concise", "Make it friendly"
- **Shared context**: Project context travels with the Figma file
- **Secure API**: OpenAI key stays on server, never exposed to client

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Figma Plugin   │────▶│  Vercel Edge Fn  │────▶│   OpenAI    │
│  (UI + Logic)   │◀────│  (API Proxy)     │◀────│   GPT-4     │
└─────────────────┘     └──────────────────┘     └─────────────┘
        │
        ▼
┌─────────────────┐
│  Project Context│
│  (Plugin Data)  │
└─────────────────┘
```

## Setup

### 1. Deploy the API to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd figma-copy-assistant
vercel

# Set environment variable
vercel env add OPENAI_API_KEY
```

### 2. Install the Figma Plugin

1. Open Figma Desktop
2. Go to Plugins → Development → Import plugin from manifest
3. Select the `manifest.json` from this repo

### 3. Configure the Plugin

1. Open the plugin in Figma
2. Go to Settings tab
3. Enter your Vercel API endpoint: `https://your-project.vercel.app/api/generate`
4. Save

## Usage

1. **Set Project Context** (once per file)
   - Open plugin → Context tab
   - Describe your project, audience, terminology
   - Save

2. **Generate Copy**
   - Select a text layer
   - Open plugin
   - Either type your request or use a shortcut
   - Click Generate
   - Apply or Copy the result

## Development

```bash
# Install dependencies
npm install

# Build plugin
npm run build

# Watch mode
npm run watch
```

## System Prompt

The system prompt is baked into `src/code.ts`. Edit it to match your team's writing guidelines.

## File Structure

```
├── manifest.json      # Figma plugin manifest
├── ui.html           # Plugin UI
├── src/
│   └── code.ts       # Plugin logic
├── api/
│   └── generate.ts   # Vercel Edge Function
├── vercel.json       # Vercel config
└── package.json
```

## License

Internal tool - GoodHabitz
