export interface DetectionResult {
  disease: string;
  confidence: number;
  severity: number;
  affectedArea: number;
  recommendations?: string[]; // Optional for PDF generation
  alternativeDiseases?: Array<{ name: string; confidence: number }>;
  metadata: {
    inferenceTime: number;
    modelVersion: string;
    imageQuality: number;
  };
}

const modelVersion = 'production-v1.0.0';

// Hugging Face API configuration
// Using a verified plant disease detection model
const HF_API_URL = process.env.NEXT_PUBLIC_HF_API_URL || 
  'https://api-inference.huggingface.co/models/nateraw/plant-disease-classification-merged-38diseases';
const HF_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY || '';

// Debug logging
console.log('🔍 DEBUG: HF_API_KEY exists?', !!HF_API_KEY);
console.log('🔍 DEBUG: HF_API_KEY length:', HF_API_KEY.length);
console.log('🔍 DEBUG: HF_API_KEY prefix:', HF_API_KEY.substring(0, 10));
console.log('🔍 DEBUG: All NEXT_PUBLIC vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));

// Call Hugging Face API through our server-side API route (avoids CORS)
async function callHuggingFaceAPI(imageFile: File): Promise<{label: string; score: number}[]> {
  try {
    console.log('🚀 Calling detection API with:', {
      fileSize: imageFile.size,
      fileType: imageFile.type
    });
    
    // Create form data to send image
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Call our server-side API route instead of HF directly
    const response = await fetch('/api/detect', {
      method: 'POST',
      body: formData,
    });

    console.log('📡 API Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API Error Response:', errorData);
      
      if (response.status === 503) {
        throw new Error('Model is loading. Please wait 20 seconds and try again.');
      }
      
      throw new Error(errorData.error || `API error (${response.status})`);
    }

    const data = await response.json();
    console.log('✅ API Results:', data.results);
    
    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      throw new Error('No results returned from AI model');
    }
    
    return data.results;
  } catch (error) {
    console.error('💥 Detection API error:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to reach detection API. Please check your internet connection.');
    }
    throw error;
  }
}

// Verify API is configured
export function isAPIConfigured(): boolean {
  return !!HF_API_KEY && HF_API_KEY !== '';
}

// Calculate basic image quality
function calculateImageQuality(file: File): number {
  // Basic quality check based on file size and type
  const isValidType = file.type.startsWith('image/');
  const hasGoodSize = file.size > 10000 && file.size < 10000000; // 10KB - 10MB
  
  if (!isValidType) return 0;
  if (!hasGoodSize) return file.size < 10000 ? 30 : 50;
  
  return 85; // Good quality
}

// Calculate severity based on confidence
function calculateSeverity(confidence: number): number {
  if (confidence > 0.9) return 8;
  if (confidence > 0.8) return 7;
  if (confidence > 0.7) return 6;
  if (confidence > 0.6) return 5;
  return 4;
}

// Calculate affected area estimation
function calculateAffectedArea(confidence: number): number {
  // Estimate affected area based on confidence
  const baseArea = Math.round(confidence * 100);
  return Math.min(90, Math.max(10, baseArea * 0.4)); // 10-90% range
}

// REAL PRODUCTION AI DETECTION using Hugging Face API
export async function detectDisease(imageFile: File): Promise<DetectionResult> {
  const startTime = performance.now();
  
  // Validate image
  const imageQuality = calculateImageQuality(imageFile);
  if (imageQuality < 30) {
    throw new Error('Image quality is too low. Please upload a clearer image.');
  }
  
  // Check API configuration and log mode
  if (!isAPIConfigured()) {
    console.log('🎮 DEMO MODE: No API key configured - using sample predictions');
    console.log('ℹ️  To enable real AI, add NEXT_PUBLIC_HF_API_KEY to .env.local');
  } else {
    console.log('🤖 REAL AI MODE: Using Hugging Face API for detection');
  }
  
  try {
    // Call real AI API
    const predictions = await callHuggingFaceAPI(imageFile);
    
    if (!predictions || predictions.length === 0) {
      throw new Error('No predictions received from AI model');
    }
    
    // Get top prediction
    const topPrediction = predictions[0];
    const confidence = topPrediction.score;
    const disease = topPrediction.label;
    
    // Calculate metrics
    const severity = calculateSeverity(confidence);
    const affectedArea = calculateAffectedArea(confidence);
    
    // Get alternative diseases
    const alternativeDiseases = predictions
      .slice(1, 5)
      .map(p => ({
        name: p.label,
        confidence: p.score
      }));
    
    const inferenceTime = performance.now() - startTime;
    
    return {
      disease,
      confidence,
      severity,
      affectedArea,
      alternativeDiseases,
      metadata: {
        inferenceTime: Math.round(inferenceTime),
        modelVersion,
        imageQuality
      }
    };
  } catch (error) {
    console.error('AI Detection failed:', error);
    throw new Error('Failed to detect disease. Please try again or check your internet connection.');
  }
}

export async function detectDiseaseFromUrl(imageUrl: string): Promise<DetectionResult> {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const file = new File([blob], 'image.jpg', { type: blob.type });
  return detectDisease(file);
}

export async function batchDetect(imageFiles: File[]): Promise<DetectionResult[]> {
  const results: DetectionResult[] = [];
  
  for (const file of imageFiles) {
    try {
      const result = await detectDisease(file);
      results.push(result);
    } catch (error) {
      console.error('Batch detection error:', error);
      // Continue with next image
    }
  }
  
  return results;
}
export function formatDiseaseName(disease: string): string {
  return disease
    .replace(/___/g, ' - ')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export async function extractFramesFromVideo(
  videoFile: File,
  numFrames: number = 5
): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const frames: File[] = [];
    
    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const interval = video.duration / numFrames;
      
      let currentFrame = 0;
      video.currentTime = 0;
      
      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          canvas.toBlob((blob) => {
            if (blob) {
              frames.push(new File([blob], `frame-${currentFrame}.jpg`, { type: 'image/jpeg' }));
              currentFrame++;
              
              if (currentFrame < numFrames) {
                video.currentTime = interval * currentFrame;
              } else {
                resolve(frames);
              }
            }
          }, 'image/jpeg', 0.9);
        }
      };
      
      video.currentTime = 0;
    };
    
    video.onerror = reject;
    video.src = URL.createObjectURL(videoFile);
  });
}

// Check API health
export async function checkAPIHealth(): Promise<boolean> {
  if (!isAPIConfigured()) return false;
  
  try {
    const response = await fetch(HF_API_URL, {
      method: 'HEAD',
      headers: {
        'Authorization': `Bearer ${HF_API_KEY}`,
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}
