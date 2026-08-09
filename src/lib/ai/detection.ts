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

// Call the detection API route (server-side inference)
async function callDetectionAPI(imageFile: File): Promise<{label: string; score: number}[]> {
  try {
    // Create form data to send image
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('/api/detect', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error (${response.status})`);
    }

    const data = await response.json();

    if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
      throw new Error('No results returned from detection service');
    }

    return data.results;
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error: Unable to reach detection API. Please check your internet connection.');
    }
    throw error;
  }
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

// Disease detection via the server-side detection API
export async function detectDisease(imageFile: File): Promise<DetectionResult> {
  const startTime = performance.now();

  // Validate image
  const imageQuality = calculateImageQuality(imageFile);
  if (imageQuality < 30) {
    throw new Error('Image quality is too low. Please upload a clearer image.');
  }

  try {
    const predictions = await callDetectionAPI(imageFile);

    if (!predictions || predictions.length === 0) {
      throw new Error('No predictions received from detection service');
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
    console.error('Detection failed:', error);
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
