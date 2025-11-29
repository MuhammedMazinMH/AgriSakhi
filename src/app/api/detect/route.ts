import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';
import { GoogleGenerativeAI } from '@google/generative-ai';

const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY || '';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

// Initialize Hugging Face Inference client
const hf = HF_API_KEY ? new HfInference(HF_API_KEY) : null;

// Initialize Gemini AI client
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// Demo mode - sample predictions for when API key is not configured
const DEMO_PREDICTIONS = [
  { label: 'Tomato___Late_blight', score: 0.87 },
  { label: 'Tomato___Early_blight', score: 0.06 },
  { label: 'Potato___Late_blight', score: 0.03 },
  { label: 'Tomato___Septoria_leaf_spot', score: 0.02 },
  { label: 'Tomato___healthy', score: 0.02 }
];

const DEMO_PREDICTIONS_VARIANTS = [
  [
    { label: 'Strawberry_with_Leaf_scorch', score: 0.92 },
    { label: 'Strawberry___healthy', score: 0.04 },
    { label: 'Raspberry___healthy', score: 0.02 },
    { label: 'Grape___Black_rot', score: 0.01 },
    { label: 'Grape___healthy', score: 0.01 }
  ],
  [
    { label: 'Corn___Northern_Leaf_Blight', score: 0.89 },
    { label: 'Corn___Common_rust_', score: 0.07 },
    { label: 'Corn___healthy', score: 0.03 },
    { label: 'Potato___Early_blight', score: 0.01 }
  ],
  [
    { label: 'Apple___Apple_scab', score: 0.84 },
    { label: 'Apple___Cedar_apple_rust', score: 0.09 },
    { label: 'Apple___Black_rot', score: 0.04 },
    { label: 'Apple___healthy', score: 0.03 }
  ],
  [
    { label: 'Grape___Black_rot', score: 0.91 },
    { label: 'Grape___Esca__(Black_Measles)', score: 0.05 },
    { label: 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)', score: 0.02 },
    { label: 'Grape___healthy', score: 0.02 }
  ]
];

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

    // Try GEMINI VISION AI first (if available)
    if (GEMINI_API_KEY && genAI) {
      try {
        console.log('🤖 REAL AI MODE: Using Gemini Vision for plant disease detection');
        
        // Convert image to base64
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Image = buffer.toString('base64');
        
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `You are an expert plant pathologist. Analyze this plant image and identify any diseases.

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

        const result = await model.generateContent([
          prompt,
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          }
        ]);

        const response = await result.response;
        const text = response.text();
        
        console.log('📤 Gemini raw response:', text);
        
        // Parse JSON from response (remove markdown code blocks if present)
        let cleanText = text.trim();
        if (cleanText.startsWith('```json')) {
          cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (cleanText.startsWith('```')) {
          cleanText = cleanText.replace(/```\n?/g, '');
        }
        
        const predictions = JSON.parse(cleanText);
        
        console.log('✅ Gemini Vision Results:', predictions);
        return NextResponse.json({ results: predictions, ai: 'gemini' });
        
      } catch (error) {
        console.error('⚠️ Gemini Vision failed, trying Hugging Face...', error);
        // Continue to HF fallback
      }
    }

    // Try HUGGING FACE (fallback)
    if (HF_API_KEY && hf) {
      try {
        console.log('🤖 REAL AI MODE: Using Hugging Face API');
        console.log('📤 Using official HF Inference SDK:', {
          fileSize: imageFile.size,
          fileType: imageFile.type
        });

        // Convert file to blob
        const imageBlob = new Blob([await imageFile.arrayBuffer()], { type: imageFile.type });

        // Use official Hugging Face Inference SDK
        const MODEL_ID = 'linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification';
        
        console.log('🤖 Calling model:', MODEL_ID);

        const result = await hf.imageClassification({
          data: imageBlob,
          model: MODEL_ID,
        });

        console.log('✅ HF SDK Results:', result);
        return NextResponse.json({ results: result, ai: 'huggingface' });
        
      } catch (error: unknown) {
        console.error('⚠️ Hugging Face failed:', error);
        // Continue to demo mode fallback
      }
    }

    // DEMO MODE - No AI configured or all failed
    console.log('🎮 DEMO MODE: No AI key configured or all AI methods failed');
    console.log('ℹ️  Add NEXT_PUBLIC_GEMINI_API_KEY or NEXT_PUBLIC_HF_API_KEY to .env.local');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return random demo predictions
    const randomIndex = Math.floor(Math.random() * DEMO_PREDICTIONS_VARIANTS.length);
    const demoPredictions = Math.random() > 0.5 
      ? DEMO_PREDICTIONS 
      : DEMO_PREDICTIONS_VARIANTS[randomIndex];
    
    console.log('✅ DEMO Results:', demoPredictions);
    return NextResponse.json({ results: demoPredictions, demo: true });
    
  } catch (error: unknown) {
    console.error('💥 Server error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
