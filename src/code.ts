// Figma Copy Assistant - Main Plugin Code
// GoodHabitz Design Team

const PLUGIN_DATA_KEY = 'copy-assistant-context';

// System prompt - constant across all projects (content writer guidelines)
const SYSTEM_PROMPT = `You are a UX copywriter for GoodHabitz, a B2B learning platform.

Writing guidelines:
- Tone: Friendly, encouraging, professional but not corporate
- Audience: HR professionals and employees ("reluctant learners")
- Keep it concise - every word earns its place
- Use active voice
- Be inclusive and accessible
- Avoid jargon unless necessary for the context
- Match the formality to the UI context (buttons are punchy, descriptions can breathe)

Your task: Write or improve UI copy based on the project context and user request.
Return ONLY the copy text, no explanations or alternatives unless asked.`;

// Show the UI
figma.showUI(__html__, { width: 320, height: 400 });

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
  const selection = figma.currentPage.selection;
  if (selection.length === 1 && selection[0].type === 'TEXT') {
    return (selection[0] as TextNode).characters;
  }
  return null;
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
  apiEndpoint?: string;
}) => {
  
  if (msg.type === 'get-context') {
    // Send current context and selection to UI
    const context = getProjectContext();
    const selectedText = getSelectedText();
    figma.ui.postMessage({ 
      type: 'context-data', 
      context,
      selectedText,
      hasSelection: selectedText !== null
    });
  }
  
  else if (msg.type === 'save-context') {
    setProjectContext(msg.context || '');
    figma.notify('Project context saved ✓');
  }
  
  else if (msg.type === 'generate') {
    const projectContext = getProjectContext();
    const selectedText = getSelectedText();
    
    if (!msg.apiEndpoint) {
      figma.notify('API endpoint not configured', { error: true });
      return;
    }
    
    // Build the full prompt
    const fullPrompt = {
      systemPrompt: SYSTEM_PROMPT,
      projectContext: projectContext || 'No project context set.',
      currentText: selectedText || '',
      userRequest: msg.prompt
    };
    
    try {
      const response = await fetch(msg.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullPrompt)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      figma.ui.postMessage({ type: 'generated', text: data.text });
      
    } catch (error) {
      figma.ui.postMessage({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Unknown error' 
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
  figma.ui.postMessage({
    type: 'selection-changed',
    selectedText,
    hasSelection: selectedText !== null
  });
});
