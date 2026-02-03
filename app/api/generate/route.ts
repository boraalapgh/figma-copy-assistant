import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface RequestBody {
  systemPrompt: string;
  projectContext: string;
  audience?: string;
  elementContext?: string;
  currentText: string;
  userRequest: string;
}

export async function POST(request: Request) {
  try {
    // Verify API secret
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    const expectedSecret = process.env.PLUGIN_API_SECRET;

    if (expectedSecret && token !== expectedSecret) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body: RequestBody = await request.json();
    const { systemPrompt, projectContext, audience, elementContext, currentText, userRequest } = body;

    if (!userRequest) {
      return NextResponse.json(
        { error: 'Missing user request' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const userMessage = `
PROJECT CONTEXT:
${projectContext || 'No project context provided.'}

TARGET AUDIENCE:
${audience || 'Not specified (default to Learner tone)'}

UI ELEMENT:
${elementContext || 'No element context available.'}

CURRENT TEXT (if any):
${currentText || '(No existing text)'}

USER REQUEST:
${userRequest}
`.trim();

    const completion = await openai.chat.completions.create({
      model: 'gpt-5.2-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const generatedText = completion.choices[0]?.message?.content?.trim() || '';

    return NextResponse.json({ text: generatedText });

  } catch (error) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Generation failed' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
