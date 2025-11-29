"use client";

import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Upload, Image as ImageIcon, Loader2, AlertCircle } from "lucide-react";
import { detectDisease } from "@/lib/ai/detection";
import { toast } from "@/components/ui/toaster";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DetectPage() {
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(t('detect.error.invalidFile'));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError(t('detect.error.tooLarge'));
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Helper function to compress image
  const compressImage = async (imageDataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Resize to max 400x300 to save space
        const maxWidth = 400;
        const maxHeight = 300;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Compress to 70% quality JPEG
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = imageDataUrl;
    });
  };

  const handleDetect = async () => {
    if (!fileInputRef.current?.files?.[0] && !cameraInputRef.current?.files?.[0]) {
      toast.error(t('detect.toast.noImage'));
      return;
    }

    setIsDetecting(true);
    setError(null);

    try {
      const file = fileInputRef.current?.files?.[0] || cameraInputRef.current?.files?.[0];
      if (!file) return;

      // Run disease detection
      const result = await detectDisease(file);

      // Compress the uploaded image for storage
      const compressedImage = selectedImage ? await compressImage(selectedImage) : '';
      const cropType = result.disease.split('___')[0] || 'Unknown';

      // Create detection record with compressed user image
      const detectionRecord = {
        id: `detection-${Date.now()}`,
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        affectedArea: result.affectedArea,
        imageUrl: compressedImage, // User's actual uploaded image (compressed)
        createdAt: new Date().toISOString(),
        cropType: cropType,
      };

      // Store as last detection for results page (with image for current session)
      localStorage.setItem('lastDetection', JSON.stringify({
        ...result,
        imageUrl: selectedImage,
        timestamp: new Date().toISOString()
      }));

      // Add to detection history (limit to last 50 detections to prevent quota issues)
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const storageKey = user ? `detection-history-${user.id}` : 'detection-history';
        
        const existingHistory = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const updatedHistory = [detectionRecord, ...existingHistory].slice(0, 50); // Keep only last 50
        localStorage.setItem(storageKey, JSON.stringify(updatedHistory));
      } catch {
        // If quota exceeded, clear old history and keep only new detection
        console.warn('LocalStorage quota exceeded, clearing old history');
        const { data: { user } } = await supabase.auth.getUser();
        const storageKey = user ? `detection-history-${user.id}` : 'detection-history';
        localStorage.setItem(storageKey, JSON.stringify([detectionRecord]));
      }

      toast.success(t('detect.toast.success'));
      router.push('/results');
    } catch (err) {
      console.error('Detection error:', err);
      const message = err instanceof Error ? err.message : "Failed to detect disease. Please try again.";
      setError(message);
      toast.error(err instanceof Error ? err.message : "Detection failed");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">{t('detect.title')}</h1>
          <p className="text-lg text-muted-foreground">{t('detect.subtitle')}</p>
        </div>

        {/* Main Card */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('detect.uploadCard.title')}</CardTitle>
            <CardDescription>{t('detect.uploadCard.tip')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Preview */}
            {selectedImage ? (
              <div className="relative w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Selected plant"
                  fill
                  className="object-contain"
                  unoptimized
                />
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setSelectedImage(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    if (cameraInputRef.current) cameraInputRef.current.value = '';
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div className="w-full aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="text-center">
                  <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No image selected</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            )}

            {/* Upload Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" /> {t('detect.button.upload')}
                    </span>
                  </Button>
                </label>
              </div>

              <div>
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="camera-capture"
                />
                <label htmlFor="camera-capture" className="cursor-pointer">
                  <Button variant="outline" className="w-full" asChild>
                    <span>
                      <Camera className="mr-2 h-4 w-4" /> {t('detect.button.camera')}
                    </span>
                  </Button>
                </label>
              </div>
            </div>

            {/* Detect Button */}
            <Button onClick={handleDetect} disabled={isDetecting} className="w-full">
              {isDetecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('detect.button.detecting')}
                </>
              ) : (
                <>
                  <ImageIcon className="mr-2 h-4 w-4" /> {t('detect.button.detect')}
                </>
              )}
            </Button>

            {/* Tips */}
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-sm">{t('detect.tips.title')}</CardTitle>
                <CardTitle className="text-sm">📸 Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Capture the affected area in good lighting</li>
                  <li>Hold camera steady and focus on the diseased part</li>
                  <li>Avoid shadows and blurry images</li>
                  <li>Include some healthy parts for comparison</li>
                  <li>Take multiple angles for better accuracy</li>
                </ul>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">⚡ Instant Results</CardTitle>
              <CardDescription className="text-xs">
                Get disease identification in under 2 seconds
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🎯 95% Accurate</CardTitle>
              <CardDescription className="text-xs">
                Powered by advanced AI trained on millions of images
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">🌍 200+ Diseases</CardTitle>
              <CardDescription className="text-xs">
                Covering major crops and plants worldwide
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
