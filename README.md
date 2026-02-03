# Figma Copy Assistant

AI-powered UX copywriting assistant for Figma. Built for GoodHabitz design team.

**[View Documentation →](https://figma-copy-assistant.vercel.app/docs)**

## Features

- **Three-layer context**: System prompt (brand guidelines) + Project context (per-file) + User request
- **Smart shortcuts**: Quick actions like "Make it concise", "Make it friendly"
- **Shared context**: Project context travels with the Figma file
- **Secure API**: OpenAI key and plugin secret stay on server, never exposed to client

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  Figma Plugin   │────▶│   Next.js API    │────▶│   OpenAI    │
│  (UI + Logic)   │◀────│   (Vercel)       │◀────│   GPT-4     │
└─────────────────┘     └──────────────────┘     └─────────────┘
        │                    ▲
        ▼                    │ Bearer token
┌─────────────────┐          │ (PLUGIN_API_SECRET)
│  Project Context│          │
│  (Plugin Data)  │──────────┘
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

# Add environment variables
vercel env add OPENAI_API_KEY        # Your OpenAI API key
vercel env add PLUGIN_API_SECRET     # A secret string (make one up)

# Deploy to production
vercel --prod
```

### 2. Set Up the Figma Plugin

**First time:**
```bash
# Build the plugin code
npm run figma:build

# Run setup wizard (prompts for secrets, saves to .env.local, creates ui.html)
npm run figma:setup
```

**After template updates:**
```bash
npm run figma:build    # Rebuild plugin code
npm run figma:update   # Regenerate ui.html from .env.local (no prompts)
```

Your secrets are stored in `.env.local` (gitignored):
```env
PLUGIN_API_ENDPOINT=https://figma-copy-assistant.vercel.app/api/generate
PLUGIN_API_SECRET=your-secret-here
```

### 3. Import into Figma

1. Open Figma Desktop
2. Go to **Plugins → Development → Import plugin from manifest**
3. Select `figma-plugin/manifest.json`

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
Edit the brand writing guidelines in `figma-plugin/src/code.ts`:
```javascript
const SYSTEM_PROMPT = `Your brand guidelines here...`;
```

### Quick Shortcuts
Add custom shortcuts in `figma-plugin/ui.template.html`:
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
├── .env.example               # Template for local secrets
├── .env.local                 # Your local secrets (gitignored)
├── figma-plugin/
│   ├── manifest.json          # Figma plugin manifest
│   ├── ui.template.html       # UI template
│   ├── ui.html                # Generated with secrets (gitignored)
│   └── src/
│       └── code.ts            # Plugin logic + system prompt
├── app/
│   ├── page.tsx               # Landing page
│   ├── docs/page.tsx          # Documentation
│   └── api/generate/
│       └── route.ts           # OpenAI API proxy
├── components/ui/             # shadcn/ui components
└── scripts/
    └── setup-plugin.mjs       # Setup wizard
```

## Security

- `OPENAI_API_KEY` - Stored in Vercel, never exposed
- `PLUGIN_API_SECRET` - Required for all API requests, prevents unauthorized usage
- `.env.local` - Gitignored, stores your local plugin secrets
- `figma-plugin/ui.html` - Gitignored, generated from template with your secrets

## License

Internal tool - GoodHabitz
