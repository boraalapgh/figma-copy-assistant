import { NextResponse } from 'next/server';
import OpenAI from 'openai';

interface RequestBody {
  systemPrompt: string;
  projectContext: string;
  currentText: string;
  userRequest: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { systemPrompt, projectContext, currentText, userRequest } = body;

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
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
