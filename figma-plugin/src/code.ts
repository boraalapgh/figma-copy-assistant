// Figma Copy Assistant - Main Plugin Code
// GoodHabitz Design Team

const PLUGIN_DATA_KEY = 'copy-assistant-context';
const HISTORY_DATA_KEY = 'copy-assistant-history';
const MAX_HISTORY_ENTRIES = 40;
const MAX_SNIPPET_LENGTH = 160;
const MAX_SURROUNDING_CHARS = 4000;
const PER_LEVEL_LIMIT = 10;

type HistoryEntry = {
  timestamp: string;
  layerName: string;
  componentPath: string[];
  userRequest: string;
  generatedText: string;
};

// Show the UI (themeColors enables resizing)
figma.showUI(__html__, { width: 320, height: 480, themeColors: true });

// Get current project context from file
function getProjectContext(): string {
  return figma.root.getPluginData(PLUGIN_DATA_KEY) || '';
}

// Save project context to file
function setProjectContext(context: string): void {
  figma.root.setPluginData(PLUGIN_DATA_KEY, context);
}

// Get selected text content
function getSelectedText(): string | null {
  const selectedNode = getSelectedTextNode();
  if (selectedNode) {
    return selectedNode.characters;
  }
  return null;
}

function getSelectedTextNode(): TextNode | null {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'TEXT') {
    return selection[0] as TextNode;
  }
  return null;
}

// Get element context (layer name, parent component, etc.)
function getElementContext(): { layerName: string; componentName: string | null; componentPath: string[] } | null {
  const selection = figma.currentPage.selection;
  if (selection.length !== 1 || selection[0].type !== 'TEXT') {
    return null;
  }

  const textNode = selection[0] as TextNode;
  const layerName = textNode.name;

  // Traverse up to find parent component/instance
  const componentPath: string[] = [];
  let componentName: string | null = null;
  let current: BaseNode | null = textNode.parent;

  while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
    // Check if this is a component or instance
    if (current.type === 'INSTANCE' || current.type === 'COMPONENT') {
      const node = current as InstanceNode | ComponentNode;
      if (!componentName) {
        // First (closest) component becomes the main component name
        componentName = node.name;
      }
      componentPath.unshift(node.name);
    } else if (current.type === 'FRAME' && (current as FrameNode).name) {
      // Also track named frames (they often represent sections)
      componentPath.unshift((current as FrameNode).name);
    }
    current = current.parent;
  }

  return { layerName, componentName, componentPath };
}

function getGenerationHistory(): HistoryEntry[] {
  const raw = figma.root.getPluginData(HISTORY_DATA_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter((entry) => entry && typeof entry === 'object');
  } catch {
    return [];
  }
}

function saveGenerationHistory(entries: HistoryEntry[]): void {
  figma.root.setPluginData(HISTORY_DATA_KEY, JSON.stringify(entries));
}

function appendHistoryEntry(entry: HistoryEntry): void {
  const entries = getGenerationHistory();
  entries.unshift(entry);
  saveGenerationHistory(entries.slice(0, MAX_HISTORY_ENTRIES));
}

function normalizeText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  if (maxLength <= 3) {
    return text.slice(0, maxLength);
  }
  return `${text.slice(0, maxLength - 3)}...`;
}

function formatNodeType(type: string): string {
  return type
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function formatAncestorLabel(node: BaseNode, level: number, relation: 'Ancestor' | 'Sibling'): string {
  const typeLabel = formatNodeType(node.type);
  const nameSuffix = node.name ? ` "${node.name}"` : '';
  return `Level ${level} • ${relation} ${typeLabel}${nameSuffix}`;
}

function hasChildren(node: BaseNode): node is BaseNode & ChildrenMixin {
  return 'children' in node;
}

function collectTextFromNode(options: {
  node: BaseNode;
  label: string;
  output: string[];
  seen: Set<string>;
  levelCount: { value: number };
  perLevelLimit: number;
  totalChars: { value: number };
  totalCharLimit: number;
  maxSnippetLength: number;
  skipNode?: BaseNode | null;
}): boolean {
  const {
    node,
    label,
    output,
    seen,
    levelCount,
    perLevelLimit,
    totalChars,
    totalCharLimit,
    maxSnippetLength,
    skipNode
  } = options;

  if (levelCount.value >= perLevelLimit || totalChars.value >= totalCharLimit) {
    return true;
  }

  if (skipNode && node === skipNode) {
    return false;
  }

  if (node.type === 'TEXT') {
    const raw = (node as TextNode).characters;
    const normalized = normalizeText(raw);
    if (normalized && !seen.has(normalized)) {
      const remaining = totalCharLimit - totalChars.value;
      if (remaining <= 0) {
        return true;
      }
      const allowed = Math.min(maxSnippetLength, remaining);
      const snippet = truncateText(normalized, allowed);
      if (snippet) {
        seen.add(normalized);
        output.push(`${label}: "${snippet}"`);
        levelCount.value += 1;
        totalChars.value += snippet.length;
        if (levelCount.value >= perLevelLimit || totalChars.value >= totalCharLimit) {
          return true;
        }
      }
    }
  }

  if (hasChildren(node)) {
    for (const child of node.children) {
      if (collectTextFromNode({
        node: child,
        label,
        output,
        seen,
        levelCount,
        perLevelLimit,
        totalChars,
        totalCharLimit,
        maxSnippetLength,
        skipNode
      })) {
        return true;
      }
    }
  }

  return false;
}

function buildSurroundingCopyContext(
  textNode: TextNode,
  maxLevels = 4,
  perLevelLimit = PER_LEVEL_LIMIT,
  totalCharLimit = MAX_SURROUNDING_CHARS
): string {
  const snippets: string[] = [];
  const seen = new Set<string>();
  const totalChars = { value: 0 };

  let current: BaseNode | null = textNode.parent;
  let previous: BaseNode | null = textNode;
  let level = 1;

  while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT' && level <= maxLevels) {
    const levelCount = { value: 0 };
    const ancestorLabel = formatAncestorLabel(current, level, 'Ancestor');

    collectTextFromNode({
      node: current,
      label: ancestorLabel,
      output: snippets,
      seen,
      levelCount,
      perLevelLimit,
      totalChars,
      totalCharLimit,
      maxSnippetLength: MAX_SNIPPET_LENGTH,
      skipNode: previous
    });

    const parent = current.parent;
    if (parent && hasChildren(parent)) {
      for (const sibling of parent.children) {
        if (sibling === current) {
          continue;
        }
        const siblingLabel = formatAncestorLabel(sibling, level, 'Sibling');
        const shouldStop = collectTextFromNode({
          node: sibling,
          label: siblingLabel,
          output: snippets,
          seen,
          levelCount,
          perLevelLimit,
          totalChars,
          totalCharLimit,
          maxSnippetLength: MAX_SNIPPET_LENGTH,
          skipNode: null
        });
        if (shouldStop) {
          break;
        }
      }
    }

    if (totalChars.value >= totalCharLimit) {
      break;
    }

    previous = current;
    current = current.parent;
    level += 1;
  }

  if (snippets.length === 0) {
    return 'No nearby copy detected.';
  }

  return snippets.join('\n');
}

function formatHistoryForRequest(entries: HistoryEntry[]): string {
  if (entries.length === 0) {
    return '';
  }

  return entries.map((entry) => {
    const parts: string[] = [];
    parts.push(entry.timestamp);
    if (entry.layerName) {
      parts.push(`Layer: "${truncateText(entry.layerName, 60)}"`);
    }
    if (entry.componentPath && entry.componentPath.length > 0) {
      parts.push(`Path: ${entry.componentPath.join(' > ')}`);
    }
    if (entry.userRequest) {
      parts.push(`Prompt: ${truncateText(entry.userRequest, 140)}`);
    }
    if (entry.generatedText) {
      parts.push(`Output: ${truncateText(entry.generatedText, 160)}`);
    }
    return parts.join(' • ');
  }).join('\n');
}

// Set text on selected node
async function setSelectedText(text: string): Promise<boolean> {
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'TEXT') {
    const textNode = selection[0] as TextNode;
    
    // Load fonts before editing
    const fonts = textNode.getRangeAllFontNames(0, textNode.characters.length);
    for (const font of fonts) {
      await figma.loadFontAsync(font);
    }
    
    textNode.characters = text;
    return true;
  }
  return false;
}

// Handle messages from UI
figma.ui.onmessage = async (msg: {
  type: string;
  context?: string;
  prompt?: string;
  audience?: string;
  apiEndpoint?: string;
  apiSecret?: string;
}) => {
  
  if (msg.type === 'get-context') {
    // Send current context and selection to UI
    const context = getProjectContext();
    const selectedText = getSelectedText();
    const elementContext = getElementContext();
    figma.ui.postMessage({
      type: 'context-data',
      context,
      selectedText,
      hasSelection: selectedText !== null,
      elementContext
    });
  }
  
  else if (msg.type === 'save-context') {
    setProjectContext(msg.context || '');
    figma.notify('Project context saved ✓');
  }
  
  else if (msg.type === 'generate') {
    const projectContext = getProjectContext();
    const selectedText = getSelectedText();
    const selectedNode = getSelectedTextNode();
    const elementContext = getElementContext();
    const surroundingCopyContext = selectedNode
      ? buildSurroundingCopyContext(selectedNode)
      : '';
    const generationHistory = formatHistoryForRequest(getGenerationHistory());

    if (!msg.apiEndpoint) {
      figma.notify('API endpoint not configured', { error: true });
      return;
    }

    // Format element context for AI
    let elementInfo = '';
    if (elementContext) {
      const parts: string[] = [];
      if (elementContext.layerName) {
        parts.push(`Layer: "${elementContext.layerName}"`);
      }
      if (elementContext.componentName) {
        parts.push(`Component: "${elementContext.componentName}"`);
      }
      if (elementContext.componentPath.length > 0) {
        parts.push(`Path: ${elementContext.componentPath.join(' → ')}`);
      }
      elementInfo = parts.join(' | ');
    }

    // Format audience for AI
    const audienceInfo = msg.audience === 'admin'
      ? 'Admin (use Trusted Partner tone: professional, caring, clear, confident)'
      : 'Learner (use Motivating Mentor tone: warm, vibrant, honest, playful)';

    // Build the request payload (system prompt now lives server-side)
    const fullPrompt = {
      projectContext: projectContext || 'No project context set.',
      audience: audienceInfo,
      elementContext: elementInfo || 'No element context available.',
      surroundingCopyContext,
      generationHistory,
      currentText: selectedText || '',
      userRequest: msg.prompt
    };
    
    try {
      console.log('Request payload:', fullPrompt);
      console.log('Calling API:', msg.apiEndpoint);

      const response = await fetch(msg.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${msg.apiSecret || ''}`
        },
        body: JSON.stringify(fullPrompt)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('API response:', data);
      if (selectedNode && data?.text) {
        appendHistoryEntry({
          timestamp: new Date().toISOString(),
          layerName: elementContext?.layerName || selectedNode.name || '',
          componentPath: elementContext?.componentPath || [],
          userRequest: msg.prompt || '',
          generatedText: data.text
        });
      }
      figma.ui.postMessage({ type: 'generated', text: data.text });

    } catch (error) {
      console.error('Fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      });
    }
  }
  
  else if (msg.type === 'apply-text') {
    const success = await setSelectedText(msg.prompt || '');
    if (success) {
      figma.notify('Text applied ✓');
    } else {
      figma.notify('Select a text layer first', { error: true });
    }
  }
  
  else if (msg.type === 'close') {
    figma.closePlugin();
  }
};

// Listen for selection changes
figma.on('selectionchange', () => {
  const selectedText = getSelectedText();
  const elementContext = getElementContext();
  figma.ui.postMessage({
    type: 'selection-changed',
    selectedText,
    hasSelection: selectedText !== null,
    elementContext
  });
});
