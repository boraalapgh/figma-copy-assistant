// Vercel Edge Function - Copy Assistant API
// Proxies requests to OpenAI with secure API key

import { OpenAI } from 'openai';

export const config = {
  runtime: 'edge',
};

interface RequestBody {
  systemPrompt: string;
  projectContext: string;
  currentText: string;
  userRequest: string;
}

export default async function handler(request: Request) {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers }
    );
  }

  try {
    const body: RequestBody = await request.json();
    
    const { systemPrompt, projectContext, currentText, userRequest } = body;

    if (!userRequest) {
      return new Response(
        JSON.stringify({ error: 'Missing user request' }),
        { status: 400, headers }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Build the message with all context layers
    const userMessage = `
PROJECT CONTEXT:
${projectContext || 'No project context provided.'}

CURRENT TEXT (if any):
${currentText || '(No existing text)'}

USER REQUEST:
${userRequest}
`.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedText = completion.choices[0]?.message?.content?.trim() || '';

    return new Response(
      JSON.stringify({ text: generatedText }),
      { headers }
    );

  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Generation failed' 
      }),
      { status: 500, headers }
    );
  }
}
