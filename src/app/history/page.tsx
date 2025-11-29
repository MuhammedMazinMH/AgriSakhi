"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Search, Filter, Download, Eye, Trash2, TrendingUp } from "lucide-react";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { formatDiseaseName } from "@/lib/ai/detection";
import { useTranslation } from "react-i18next";

interface Detection {
  id: string;
  disease: string;
  confidence: number;
  severity?: number;
  affectedArea?: number;
  imageUrl: string;
  createdAt: string;
  cropType?: string;
}

export default function HistoryPage() {
  const { t } = useTranslation();
  const [detections, setDetections] = useState<Detection[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const supabase = createClientComponentClient();

  // Load real detections from localStorage
  useEffect(() => {
    const loadDetections = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const storageKey = user ? `detection-history-${user.id}` : 'detection-history';
        
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          setDetections(parsed);
        } else {
          setDetections([]);
        }
      } catch (error) {
        console.error('Failed to load detection history:', error);
      }
    };

    loadDetections();

    // Reload when window gains focus (after adding new detection)
    const handleFocus = () => {
      loadDetections();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [supabase]);

  const filteredDetections = detections.filter((detection) => {
    const matchesSearch = formatDiseaseName(detection.disease)
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate real stats
  const totalDetections = detections.length;
  const thisMonth = detections.filter(d => {
    const detectionDate = new Date(d.createdAt);
    const now = new Date();
    return detectionDate.getMonth() === now.getMonth() && 
           detectionDate.getFullYear() === now.getFullYear();
  }).length;
  const avgConfidence = detections.length > 0
    ? Math.round(detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length * 100)
    : 0;
  const detectionsLeft = Math.max(0, 50 - totalDetections);

  const handleDelete = async (id: string) => {
    const confirmed = confirm(t('history.confirmDelete'));
    if (confirmed) {
      const updated = detections.filter(d => d.id !== id);
      setDetections(updated);
      
      const { data: { user } } = await supabase.auth.getUser();
      const storageKey = user ? `detection-history-${user.id}` : 'detection-history';
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 8) return "text-red-600 bg-red-50 dark:bg-red-900/20";
    if (severity >= 5) return "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20";
    return "text-green-600 bg-green-50 dark:bg-green-900/20";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('history.title')}</h1>
          <p className="text-lg text-muted-foreground">
            {t('history.subtitle')}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('history.totalDetections')}</p>
                  <p className="text-2xl font-bold">{totalDetections}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('history.thisMonth')}</p>
                  <p className="text-2xl font-bold">{thisMonth}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('history.avgConfidence')}</p>
                  <p className="text-2xl font-bold">{avgConfidence}%</p>
                </div>
                <Eye className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{t('history.detectionsLeft')}</p>
                  <p className="text-2xl font-bold">{detectionsLeft}</p>
                </div>
                <Filter className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('history.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                suppressHydrationWarning
              />
            </div>
          </CardContent>
        </Card>

        {/* Detection List */}
        <div className="space-y-4">
          {filteredDetections.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-2">
                  {detections.length === 0 
                    ? t('history.noHistory')
                    : t('history.noResults')}
                </p>
                <Link href="/detect" className="inline-block mt-4">
                  <Button>{t('history.startDetection')}</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            filteredDetections.map((detection) => (
              <Card key={detection.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Image */}
                    <div className="relative w-full md:w-48 h-36 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={detection.imageUrl}
                        alt={formatDiseaseName(detection.disease)}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {formatDiseaseName(detection.disease)}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {detection.cropType} • {t('history.detectedOn')}{" "}
                            {new Date(detection.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        {detection.severity && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(
                              detection.severity
                            )}`}
                          >
                            {t('history.severity')}: {detection.severity}/10
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">{t('history.confidence')}</p>
                          <p className="text-lg font-semibold">
                            {(detection.confidence * 100).toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('history.affectedArea')}</p>
                          <p className="text-lg font-semibold">{detection.affectedArea}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">{t('history.status')}</p>
                          <p className="text-lg font-semibold text-green-600">{t('history.treated')}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/results?id=${detection.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            {t('history.view')}
                          </Button>
                        </Link>
                        <Button variant="outline" size="sm">
                          <Download className="mr-2 h-4 w-4" />
                          {t('history.downloadReport')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(detection.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('history.delete')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredDetections.length > 0 && (
          <div className="mt-8 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {t('history.showing')} {filteredDetections.length} {t('history.of')} {totalDetections} {t('history.detections')}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                {t('history.previous')}
              </Button>
              <Button variant="outline" size="sm">
                1
              </Button>
              <Button variant="outline" size="sm">
                2
              </Button>
              <Button variant="outline" size="sm">
                3
              </Button>
              <Button variant="outline" size="sm">
                {t('history.next')}
              </Button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Link href="/" className="text-primary hover:underline">
            ← {t('history.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
