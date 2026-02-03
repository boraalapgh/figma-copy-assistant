# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev            # Run Next.js dev server
npm run build          # Build Next.js for production
npm run figma:build    # Build Figma plugin (figma-plugin/src/code.ts → figma-plugin/dist/code.js)
npm run figma:watch    # Build Figma plugin with file watching
npm run figma:setup    # First-time setup: prompts for secrets, saves to .env.local, creates ui.html
npm run figma:update   # Regenerates ui.html from .env.local (after template changes)
```

No test framework is configured. Verify changes by loading the plugin in Figma Desktop.

## Deploy Commands

```bash
vercel --prod                       # Deploy to Vercel
vercel env add OPENAI_API_KEY       # Set OpenAI key
vercel env add PLUGIN_API_SECRET    # Set plugin API secret (for security)
```

## Architecture

This is a **Figma plugin** with a **Next.js API** backend that proxies OpenAI API calls.

### Communication Flow

```
Figma Plugin Sandbox  ←──postMessage──→  UI Frame  ──fetch + Bearer token──→  Next.js API  ──→  OpenAI
(figma-plugin/src/code.ts)              (figma-plugin/ui.html)              (app/api/generate/route.ts)
```

- **Plugin sandbox** (`figma-plugin/src/code.ts`): Runs in Figma's sandbox. Handles text selection, font loading, and plugin data storage.
- **UI frame** (`figma-plugin/ui.html`): Embedded iframe with network access. Contains HTML/CSS/JS. Created from `ui.template.html`.
- **API route** (`app/api/generate/route.ts`): Next.js API that verifies the plugin secret and proxies to OpenAI.

### Security

- API requests require a Bearer token (`PLUGIN_API_SECRET` env var)
- `.env.local` stores local secrets (gitignored)
- `figma-plugin/ui.html` is generated from template with secrets (gitignored)
- `npm run figma:setup` reads from `.env.local` or prompts user

### Four-Layer Prompt System

1. **System prompt** (constant): GoodHabitz UX writing guidelines in `figma-plugin/src/code.ts`
2. **Element context** (auto-detected): Layer name, parent component, hierarchy path
3. **Project context** (per-file): Stored in `figma.root.pluginData`, travels with the Figma file
4. **User request** (per-generation): The immediate instruction from the user

### Key Files

| File | Purpose |
|------|---------|
| `.env.example` | Template for local secrets |
| `.env.local` | Local secrets (gitignored) |
| `figma-plugin/manifest.json` | Figma plugin manifest |
| `figma-plugin/ui.template.html` | UI template |
| `figma-plugin/src/code.ts` | Plugin logic + GoodHabitz UX writing guidelines |
| `app/api/generate/route.ts` | OpenAI API proxy |
| `scripts/setup-plugin.mjs` | Setup wizard (reads .env.local, creates ui.html) |

## Plugin Development Notes

- Run `npm run figma:build` before testing in Figma
- Run `npm run figma:setup` to create `ui.html` with your API endpoint and secret
- The manifest points to `figma-plugin/dist/code.js`
- UI-to-plugin: `parent.postMessage({ pluginMessage: {...} }, '*')`
- Plugin-to-UI: `figma.ui.postMessage({...})`
