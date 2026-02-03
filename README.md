# Figma Copy Assistant

AI-powered UX copywriting assistant for Figma. Built for GoodHabitz design team.

**[View Documentation →](https://figma-copy-assistant.vercel.app/docs)**

## Features

- **Three-layer context**: System prompt (brand guidelines) + Project context (per-file) + User request
- **Smart shortcuts**: Quick actions like "Make it concise", "Make it friendly"
- **Shared context**: Project context travels with the Figma file
- **Secure API**: OpenAI key stays on server, never exposed to client

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Figma Plugin   │────▶│   Next.js API    │────▶│   OpenAI    │
│  (UI + Logic)   │◀────│   (Vercel)       │◀────│   GPT-4     │
└─────────────────┘     └──────────────────┘     └─────────────┘
        │
        ▼
┌─────────────────┐
│  Project Context│
│  (Plugin Data)  │
└─────────────────┘
```

## Quick Start

### 1. Deploy the API

```bash
# Clone the repo
git clone https://github.com/boraalapgh/figma-copy-assistant.git
cd figma-copy-assistant

# Install dependencies
npm install

# Deploy to Vercel
vercel

# Add your OpenAI API key
vercel env add OPENAI_API_KEY

# Deploy to production
vercel --prod
```

### 2. Install the Figma Plugin

```bash
# Build the plugin
npm run figma:build
```

Then in Figma Desktop:
1. Go to **Plugins → Development → Import plugin from manifest**
2. Select the `manifest.json` from this repo

### 3. Update API Endpoint (if needed)

The API endpoint is configured in `ui.html` at line 286. Update it to match your Vercel deployment:

```javascript
const API_ENDPOINT = 'https://your-project.vercel.app/api/generate';
```

## Usage

1. **Set Project Context** (once per file)
   - Open plugin → Project Context tab
   - Describe your project, audience, terminology
   - Click Save Context

2. **Generate Copy**
   - Select a text layer in your design
   - Open the plugin
   - Type your request or use a quick shortcut
   - Click Generate Copy
   - Apply or Copy the result

## Development

```bash
# Install dependencies
npm install

# Build Figma plugin
npm run figma:build

# Watch mode for plugin development
npm run figma:watch

# Run Next.js dev server (for API/website)
npm run dev

# Build everything for production
npm run build
```

## Customization

### System Prompt
Edit the brand writing guidelines in `src/code.ts`:
```javascript
const SYSTEM_PROMPT = `Your brand guidelines here...`;
```

### Quick Shortcuts
Add custom shortcuts in `ui.html`:
```html
<span class="shortcut" data-prompt="Your custom prompt">🎯 Label</span>
```

### AI Model
Change the model in `app/api/generate/route.ts`:
```javascript
model: 'gpt-4o-mini'  // or 'gpt-4o', etc.
```

## File Structure

```
├── manifest.json          # Figma plugin manifest
├── ui.html                # Plugin UI (HTML/CSS/JS)
├── src/
│   └── code.ts            # Plugin logic (Figma API)
├── app/
│   ├── page.tsx           # Landing page
│   ├── docs/page.tsx      # Documentation
│   └── api/generate/
│       └── route.ts       # OpenAI API proxy
├── components/ui/         # shadcn/ui components
└── package.json
```

## License

Internal tool - GoodHabitz
