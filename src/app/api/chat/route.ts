import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Build conversation context with agriculture focus
    const systemPrompt = `You are Sakhi-AI, an expert agricultural assistant for AgriSakhi app. You help farmers with:
- Plant disease identification and treatment
- Crop management advice
- Organic and chemical treatment recommendations
- Weather-based farming guidance
- Best agricultural practices

Be helpful, concise, and practical. Respond in the same language as the user's question. If asked in Hindi, respond in Hindi. If asked in Kannada, respond in Kannada.`;

    // Format for Gemini API v1
    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;

    // Call Gemini API using v1 endpoint with gemini-2.5-flash (latest model)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullPrompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      console.error('Using API Key prefix:', GEMINI_API_KEY?.substring(0, 10));
      console.error('Full URL used:', `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent`);
      console.error('Response status:', response.status);
      console.error('Error details:', JSON.stringify(errorData, null, 2));
      return NextResponse.json(
        { error: `Failed to get AI response: ${errorData?.error?.message || 'Unknown error'}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
