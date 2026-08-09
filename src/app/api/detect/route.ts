import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';

const DETECTION_MODEL = 'google/gemini-3.5-flash';

const DETECTION_PROMPT = `You are an expert plant pathologist. Analyze this plant image and identify any diseases.

IMPORTANT: Your response MUST be in this EXACT JSON format (no markdown, no code blocks, just raw JSON):
[
  {"label": "Plant___Disease_Name", "score": 0.XX},
  {"label": "Alternative___Disease", "score": 0.XX}
]

Rules:
1. Use underscores and triple underscores like: "Tomato___Late_blight" or "Potato___Early_blight"
2. If healthy, use format: "PlantName___healthy"
3. Score must be between 0 and 1 (confidence level)
4. Return top 5 possibilities
5. Most likely disease should have highest score
6. ONLY return the JSON array, nothing else

Common diseases format examples:
- Tomato___Late_blight
- Tomato___Early_blight
- Potato___Late_blight
- Corn___Northern_Leaf_Blight
- Apple___Apple_scab
- Grape___Black_rot
- Strawberry___Leaf_scorch
- Pepper___Bacterial_spot`;

export async function POST(request: NextRequest) {
  try {
    // Get the image from the request
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    const bytes = await imageFile.arrayBuffer();
    const imageData = new Uint8Array(bytes);

    const { text } = await generateText({
      model: DETECTION_MODEL,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: DETECTION_PROMPT },
            {
              type: 'file',
              data: imageData,
              mediaType: imageFile.type || 'image/jpeg',
            },
          ],
        },
      ],
    });

    // Parse JSON from response (remove markdown code blocks if present)
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\n?/g, '');
    }

    const predictions = JSON.parse(cleanText);

    if (!Array.isArray(predictions) || predictions.length === 0) {
      throw new Error('Model returned an unexpected response format');
    }

    return NextResponse.json({ results: predictions });
  } catch (error: unknown) {
    console.error('Detection error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
