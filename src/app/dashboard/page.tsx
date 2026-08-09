"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, History, BookOpen } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

interface Detection {
  id: string;
  disease: string;
  confidence: number;
  createdAt: string;
  cropType?: string;
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const [detectionCount, setDetectionCount] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);

  useEffect(() => {
    const loadDetectionCounts = () => {
      try {
        const stored = localStorage.getItem('detection-history');
        if (stored) {
          const detections = JSON.parse(stored);
          setDetectionCount(detections.length);

          // Count this month
          const now = new Date();
          const thisMonth = detections.filter((d: Detection) => {
            const detectionDate = new Date(d.createdAt);
            return detectionDate.getMonth() === now.getMonth() &&
                   detectionDate.getFullYear() === now.getFullYear();
          }).length;
          setThisMonthCount(thisMonth);
        } else {
          setDetectionCount(0);
          setThisMonthCount(0);
        }
      } catch (error) {
        console.error('Failed to load detection counts:', error);
      }
    };

    loadDetectionCounts();

    // Reload counts when window gains focus (returning from other pages)
    const handleFocus = () => {
      loadDetectionCounts();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('dashboard.welcome')}!</p>
        </div>

        {/* Quick Actions */}
        <h2 className="text-2xl font-semibold mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Link href="/detect">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <Camera className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{t('dashboard.detectDisease')}</CardTitle>
                <CardDescription>
                  {t('dashboard.uploadCapture')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.getInstant')}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <History className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{t('dashboard.history')}</CardTitle>
                <CardDescription>
                  {t('dashboard.viewPast')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.trackActivity')}
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/knowledge">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{t('dashboard.knowledgeBase')}</CardTitle>
                <CardDescription>
                  {t('dashboard.learnDiseases')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t('dashboard.browse70')}
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Usage Stats */}
        <h2 className="text-2xl font-semibold mb-4">{t('dashboard.statistics')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('dashboard.detectionsMonth')}</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">{thisMonthCount}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.trackActivity')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('dashboard.totalDetections')}</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">{detectionCount}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.lifetimeDetections')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <h2 className="text-2xl font-semibold mt-8 mb-4">{t('dashboard.recentActivity')}</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>{t('dashboard.noActivity')}</p>
              <p className="text-sm mt-1">{t('dashboard.startFirst')}</p>
              <Link href="/detect">
                <Button className="mt-4">
                  <Camera className="mr-2 h-4 w-4" />
                  {t('dashboard.newDetection')}
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
