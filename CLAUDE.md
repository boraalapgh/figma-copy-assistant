# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run build      # Build plugin code (src/code.ts → dist/code.js)
npm run watch      # Build with file watching
npm run dev        # Build plugin and UI
```

No test framework is configured. Verify changes by loading the plugin in Figma Desktop.

## Deploy Commands

```bash
vercel                          # Deploy API to Vercel
vercel env add OPENAI_API_KEY   # Set OpenAI key in Vercel environment
```

## Architecture

This is a **Figma plugin** with a **Vercel Edge Function** backend that proxies OpenAI API calls.

### Communication Flow

```
Figma Plugin Sandbox (code.ts)  ←──postMessage──→  UI Frame (ui.html)  ──fetch──→  Vercel Edge (api/generate.ts)  ──→  OpenAI
```

- **Plugin sandbox** (`src/code.ts`): Runs in Figma's sandbox with access to the Figma API but limited network. Handles text selection, font loading, and plugin data storage.
- **UI frame** (`ui.html`): Embedded iframe with full network access but no Figma API. Contains all HTML/CSS/JS in a single file.
- **Edge function** (`api/generate.ts`): Vercel Edge Function that keeps the OpenAI API key secure. Receives the three-layer prompt structure and returns generated copy.

### Three-Layer Prompt System

1. **System prompt** (constant): GoodHabitz writing guidelines, baked into `src/code.ts`
2. **Project context** (per-file): Stored in `figma.root.pluginData`, travels with the Figma file
3. **User request** (per-generation): The immediate instruction from the user

### Key Integration Points

- **API endpoint**: Hardcoded in `ui.html` line 286 as `API_ENDPOINT`
- **System prompt**: Defined in `src/code.ts` lines 7-19 as `SYSTEM_PROMPT`
- **Plugin data key**: `copy-assistant-context` used for persistent storage

## Plugin Development Notes

- The `manifest.json` points to `dist/code.js` - always run build before testing
- UI-to-plugin messages use `parent.postMessage({ pluginMessage: {...} }, '*')`
- Plugin-to-UI messages use `figma.ui.postMessage({...})`
- Font loading is required before modifying text content (see `setSelectedText` function)
