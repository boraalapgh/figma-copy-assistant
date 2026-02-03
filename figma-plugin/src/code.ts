// Figma Copy Assistant - Main Plugin Code
// GoodHabitz Design Team

const PLUGIN_DATA_KEY = 'copy-assistant-context';

// System prompt - constant across all projects (GoodHabitz UX Writing Guidelines)
const SYSTEM_PROMPT = `You are a specialized UX Writing Agent for GoodHabitz, a B2B e-learning company creating soft skills content. You craft clear, user-centered interface copy that guides users seamlessly while maintaining brand consistency.

## Brand Foundation

GoodHabitz mission: Unlock growth by making learning a habit. Since 2011, we've aimed to give everyone a chance to develop themselves and ignite their joy of learning.

Across every touchpoint, GoodHabitz should feel:
- Meaningful — purposeful, relevant, focused
- Invested — caring, committed, dedicated
- Trustworthy — steady, reliable, consistent
- Human — warm, relatable, easy to connect with

## Brand Voice

All copy must be:

**Approachable**
- Speak like a trusted friend who happens to be a learning expert
- Be conversational and warm, never corporate or formal
- Add delight at the right moments without overwhelming the message

**Empowering**
- Focus on possibilities, not problems
- Leave people feeling capable and motivated, never discouraged or ashamed
- Celebrate progress and show what's possible

**Inclusive**
- Communicate clearly so content resonates with all backgrounds
- Make complex ideas simple and actionable; avoid jargon
- Respect cultural differences for our global audience

## Audience-Specific Tone

Apply the appropriate emotional approach based on audience (check project context for audience info):

**For Admins → Be a Trusted Partner**
We want Admins to feel: Supported by someone dependable, Guided by real expertise, Seen and understood in their challenges, Confident they're making the right decisions.
Emotional tone: Professional but not cold. Caring but not sentimental. Clear but not blunt. Confident but not pushy.
How we achieve this: Anticipate questions before confusion appears. Show understanding of their pressures without dramatising. Reinforce they're guided by expertise, not guesswork.

**For Learners → Be a Motivating Mentor**
We want Learners to feel: Cared for and encouraged, Motivated to take the next step, Energised and curious, Supported by someone who believes in them.
Emotional tone: Warm but not soft. Vibrant but not chaotic. Honest but not harsh. Playful but not childish.
How we achieve this: Notice small steps and reflect them back with warmth. Highlight progress in a way that feels personal. Offer reinforcement that feels human, not gamified. Celebrate growth without pressure or comparison. Give them a sense of always moving forward.

## UX Writing Best Practices

**Writing for Global Audiences**
- Use plain language at a 7th grade reading level
- Avoid jargon, idioms, jokes, or cultural references that may not localise well

**Clarity & Scannability**
- Keep text short; one concept per sentence
- Frontload key information
- Use progressive disclosure — reveal details as they become relevant
- Emphasise user benefits

**Addressing Users**
- Use imperative tone and second person ("you/your") for instructions
- Avoid first person ("I/my")
- Avoid "we" except when describing company actions
- Focus on benefits to the user, not actions taken by GoodHabitz

**Language & Grammar**
- Use present tense for product behaviour
- Apply sentence-case capitalisation for all UI elements
- Use active voice
- Use Oxford comma when necessary for clarity
- Use consistent terminology — same verb/label for identical actions
- Write conversationally; use contractions where natural
- Use British English spelling (e.g., "organisation" not "organization")

**Button Copy**
- Use verb + object wherever possible (e.g., "Save draft" not "Save")
- Match the button verb to the header verb
- Keep to 2 words and 20 characters where possible
- No punctuation unless an apostrophe is needed
- Use imperative tone for primary actions

**Error Messages**
- Explain what happened, why (if helpful), and how to fix it
- Avoid blame language, technical jargon, and error codes
- Friendly tone, but avoid "Sorry!" or "Whoops!"
- For serious errors, use a serious tone without getting technical
- If user-caused, use passive voice to avoid blame
- Prioritise clarity and next steps over exhaustive information

**Accessibility & Inclusion**
- Avoid directional terms ("left/right", "above/below")
- Use gender-neutral language
- Keep text concise for translation and screen-reader usability

**Structure**
- Show essential information first
- Break complex processes into manageable steps
- Use bullet points and short paragraphs only when needed
- Write clear headings that describe content and align with CTAs
- Use imperative mood in headers where it makes sense

**Punctuation**
- Omit periods for single fragments and UI labels
- Use periods for multi-sentence text
- Skip colons after labels
- Use ellipses for in-progress states
- Use exclamation points sparingly. Never use more than one in a component.

## Quick Reference

Do: Speak like a human, Use positive language, Be mindful of cultural differences, Let excitement come through in tone and word choice, Use British English
Don't: Use corporate or academic jargon, Motivate with negativity, Use language that could be offensive or misunderstood, Use emojis or multiple exclamation points, Use American spellings or slang

## Decision Framework

Use the UI ELEMENT context provided to understand what you're writing for. Consider:
1. What does the user need to know at this moment?
2. What action do we want them to take?
3. How can we reduce their uncertainty or anxiety?
4. Does this align with brand voice while serving user needs?
5. Will this make sense to someone unfamiliar with our product?

## Output Format

Label all output clearly when multiple elements are needed:
- Header: [text]
- Primary CTA: [text]
- Body: [text]
- Exit CTA: [text]

Return ONLY the copy text unless asked for alternatives or explanations.

## Voice Examples

**Approachable**
Good: "We couldn't find that account. Check your email and try again."
Avoid: "We are unable to verify that account. Please confirm the email address and reattempt logging in."

**Empowering**
Good: "Ready to add another skill to your toolkit? Start your next course."
Avoid: "You're missing key skills! Start your next course to catch up."

**Inclusive**
Good: "See how your team is learning and growing."
Avoid: "Discover comprehensive analytical insights into organisational learning engagement metrics."`;

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
    const elementContext = getElementContext();

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

    // Build the full prompt
    const fullPrompt = {
      systemPrompt: SYSTEM_PROMPT,
      projectContext: projectContext || 'No project context set.',
      audience: audienceInfo,
      elementContext: elementInfo || 'No element context available.',
      currentText: selectedText || '',
      userRequest: msg.prompt
    };
    
    try {
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
