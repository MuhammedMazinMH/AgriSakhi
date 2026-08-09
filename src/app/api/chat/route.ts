import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';

const CHAT_MODEL = 'google/gemini-3.5-flash';

const SYSTEM_PROMPT = `You are Sakhi-AI, an expert agricultural assistant for AgriSakhi app. You help farmers with:
- Plant disease identification and treatment
- Crop management advice
- Organic and chemical treatment recommendations
- Weather-based farming guidance
- Best agricultural practices

Be helpful, concise, and practical. Respond in the same language as the user's question. If asked in Hindi, respond in Hindi. If asked in Kannada, respond in Kannada.`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const { text } = await generateText({
      model: CHAT_MODEL,
      system: SYSTEM_PROMPT,
      prompt: message,
      temperature: 0.7,
    });

    return NextResponse.json({
      response: text || 'Sorry, I could not generate a response.',
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
