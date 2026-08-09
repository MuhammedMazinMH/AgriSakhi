import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';

// Models tried in order. If one is rate-limited, the next is used.
const CHAT_MODELS = [
  'google/gemini-2.5-flash',
  'google/gemini-2.5-flash-lite',
  'openai/gpt-5-nano',
];

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

    let text = '';
    let lastError: unknown = null;
    for (const model of CHAT_MODELS) {
      try {
        const result = await generateText({
          model,
          maxRetries: 1,
          system: SYSTEM_PROMPT,
          prompt: message,
          temperature: 0.7,
        });
        text = result.text;
        break;
      } catch (err) {
        lastError = err;
      }
    }

    if (!text) {
      throw lastError ?? new Error('All chat models are currently unavailable');
    }

    return NextResponse.json({
      response: text,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
