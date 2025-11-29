"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User as UserIcon, Camera, History, BookOpen, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/components/ui/toaster";
import type { User } from "@supabase/supabase-js";
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
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [detectionCount, setDetectionCount] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const loadDetectionCounts = (userId: string) => {
      try {
        const stored = localStorage.getItem(`detection-history-${userId}`);
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
          // Reset counts if no history found for this user
          setDetectionCount(0);
          setThisMonthCount(0);
        }
      } catch (error) {
        console.error('Failed to load detection counts:', error);
      }
    };

    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        router.push('/auth/signin');
        return;
      }

      setUser(user);
      setLoading(false);
      loadDetectionCounts(user.id);
    };

    getUser();

    // Reload counts when window gains focus (returning from other pages)
    const handleFocus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        loadDetectionCounts(user.id);
      }
    };
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [router, supabase]);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      router.push('/');
      router.refresh();
    } catch {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
            <p className="text-muted-foreground mt-1">
              {t('dashboard.welcome')}, {user?.user_metadata?.full_name || user?.email?.split('@')[0]}!
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('nav.signOut')}
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              {t('dashboard.accountInfo')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.email')}</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.fullName')}</p>
                <p className="font-medium">{user?.user_metadata?.full_name || t('dashboard.notSet')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.memberSince')}</p>
                <p className="font-medium">
                  {user?.created_at 
                    ? new Date(user.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('dashboard.accountStatus')}</p>
                <p className="font-medium text-green-600">{t('dashboard.active')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <h2 className="text-2xl font-semibold mb-4">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link href="/detect">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('dashboard.detectionsMonth')}</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">{thisMonthCount} / 50</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {50 - thisMonthCount} {t('dashboard.freeRemaining')}
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

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t('dashboard.accountType')}</CardTitle>
              <div className="text-3xl font-bold text-primary mt-2">{t('dashboard.free')}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {t('dashboard.50perMonth')}
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
