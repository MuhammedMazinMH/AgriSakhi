"use client";

import { useEffect, useState, startTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  ArrowLeft,
  Leaf,
  TrendingUp,
  Activity,
  Target
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatDiseaseName } from "@/lib/ai/detection";
import { useTranslation } from "react-i18next";
import { getTreatmentRecommendations } from "@/lib/treatments";
import { generatePDFReport } from "@/lib/pdf/final-report-generator";
import type { DetectionResult as PDFDetectionResult } from "@/lib/ai/detection";
import { toast } from "sonner";
import { getDiseaseTranslation } from "@/lib/disease-translations";

interface DetectionResult {
  disease: string;
  confidence: number;
  severity: number;
  affectedArea: number;
  alternativeDiseases: Array<{ name: string; confidence: number }>;
  metadata: {
    inferenceTime: number;
    modelVersion: string;
    imageQuality: number;
  };
  imageUrl: string;
  timestamp: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Load from localStorage on client side only
    const loadData = () => {
      const stored = localStorage.getItem('lastDetection');
      if (stored) {
        startTransition(() => {
          setResult(JSON.parse(stored));
          setIsLoading(false);
        });
      } else {
        // Redirect if no result found
        router.push('/detect');
      }
    };
    
    loadData();
  }, [router]);

  if (isLoading || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "text-red-600";
    if (severity >= 5) return "text-yellow-600";
    return "text-green-600";
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 8) return t('results.severity.severe');
    if (severity >= 5) return t('results.severity.moderate');
    return t('results.severity.mild');
  };

  const handleDownloadReport = async () => {
    if (!result) return;
    
    try {
      // Show loading toast
      toast.loading('Generating PDF report...', { id: 'pdf-generation' });
      
      // Get treatment recommendations
      const treatments = getTreatmentRecommendations(result.disease);
      
      // Convert to PDF format with recommendations
      const pdfResult: PDFDetectionResult = {
        disease: result.disease,
        confidence: result.confidence,
        severity: result.severity,
        affectedArea: result.affectedArea,
        recommendations: [
          `Disease identified: ${formatDiseaseName(result.disease)}`,
          `Confidence level: ${Math.round(result.confidence * 100)}% - ${result.confidence >= 0.8 ? 'High confidence detection' : 'Consider expert consultation'}`,
          `Organic Treatment: ${treatments.organic}`,
          `Chemical Treatment: ${treatments.chemical}`,
          `Cultural Practice: ${treatments.cultural}`,
          `Prevention: ${treatments.prevention}`,
        ],
        metadata: {
          inferenceTime: result.metadata.inferenceTime,
          modelVersion: result.metadata.modelVersion,
          imageQuality: result.metadata.imageQuality,
        },
      };
      
      // Generate PDF in current language
      await generatePDFReport(pdfResult, result.imageUrl, i18n.language);
      
      // Success toast
      toast.success('PDF report downloaded successfully!', { id: 'pdf-generation' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('Failed to generate PDF report. Please try again.', { id: 'pdf-generation' });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "AgriSakhi Detection Result",
        text: `Disease detected: ${formatDiseaseName(result.disease)}`,
        url: window.location.href,
      });
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/detect">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('nav.newDetection')}
            </Button>
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              {t('results.share')}
            </Button>
            <Button variant="outline" onClick={handleDownloadReport}>
              <Download className="mr-2 h-4 w-4" />
              {t('results.download')}
            </Button>
          </div>
        </div>

        {/* Main Result Card */}
        <Card className="shadow-lg mb-8">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Leaf className="h-6 w-6" />
              {t('results.header.title')}
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              {t('results.header.desc', { ms: result.metadata.inferenceTime })}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image */}
              <div className="relative w-full aspect-video">
                <Image
                  src={result.imageUrl}
                  alt="Detected plant"
                  fill
                  className="rounded-lg shadow-md object-contain"
                  unoptimized
                />
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  {t('results.detectedOn')} {new Date(result.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {/* Disease Name */}
                <div>
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    {t('results.identifiedDisease')}
                  </h3>
                  <p className="text-3xl font-bold text-primary">
                    {getDiseaseTranslation(result.disease, i18n.language)}
                  </p>
                </div>

                {/* Confidence */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('results.confidence')}</span>
                    <span className="text-sm font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all"
                      style={{ width: `${result.confidence * 100}%` }}
                    ></div>
                  </div>
                  {result.confidence > 0.8 ? (
                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {t('results.highConfidence')}
                    </p>
                  ) : (
                    <p className="text-sm text-yellow-600 mt-1 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      {t('results.considerExpert')}
                    </p>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Activity className={`h-8 w-8 mx-auto mb-2 ${getSeverityColor(result.severity)}`} />
                      <p className="text-2xl font-bold">{result.severity}/10</p>
                      <p className="text-xs text-muted-foreground">{t('results.severity')}</p>
                      <p className={`text-sm font-semibold ${getSeverityColor(result.severity)}`}>
                        {getSeverityLabel(result.severity)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 text-center">
                      <Target className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                      <p className="text-2xl font-bold">{Math.round(result.affectedArea)}%</p>
                      <p className="text-xs text-muted-foreground">{t('results.affectedArea')}</p>
                      <p className="text-sm font-semibold text-orange-600">
                        {result.affectedArea > 50 ? t('results.area.high') : result.affectedArea > 25 ? t('results.area.medium') : t('results.area.low')}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6 text-center">
                      <TrendingUp className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">{result.metadata.imageQuality}%</p>
                      <p className="text-xs text-muted-foreground">{t('results.imageQuality')}</p>
                      <p className="text-sm font-semibold text-blue-600">
                        {result.metadata.imageQuality > 70 ? t('results.quality.good') : t('results.quality.fair')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alternative Diseases */}
        {result.alternativeDiseases.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{t('results.alternatives.title')}</CardTitle>
              <CardDescription>
                {t('results.alternatives.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.alternativeDiseases.map((alt, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="font-medium">{getDiseaseTranslation(alt.name, i18n.language)}</span>
                    <span className="text-sm text-muted-foreground">
                      {(alt.confidence * 100).toFixed(1)}% {t('results.confidence.label')}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Treatment Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{t('results.recommendations.title')}</CardTitle>
            <CardDescription>
              {t('results.recommendations.desc', { disease: getDiseaseTranslation(result.disease, i18n.language) })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const treatments = getTreatmentRecommendations(result.disease);
              return (
                <div className="space-y-4">
                  <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
                    <h4 className="font-semibold mb-2">🌿 {t('results.organic')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {treatments.organic}
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
                    <h4 className="font-semibold mb-2">⚗️ {t('results.chemical')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {treatments.chemical}
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                    <h4 className="font-semibold mb-2">🌾 {t('results.cultural')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {treatments.cultural}
                    </p>
                  </div>

                  <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
                    <h4 className="font-semibold mb-2">🛡️ {t('results.prevention')}</h4>
                    <p className="text-sm text-muted-foreground">
                      {treatments.prevention}
                    </p>
                  </div>
                </div>
              );
            })()}
          </CardContent>
        </Card>

        {/* Next Steps */}

      </div>
    </div>
  );
}
