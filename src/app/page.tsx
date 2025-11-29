"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, BookOpen, Globe, Zap, Heart, TrendingUp, Sparkles } from "lucide-react";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { TestimonialsSection } from "@/components/ui/testimonials-with-marquee";
import { useTranslation } from "react-i18next";

import { Footer } from "@/components/footer";

export default function Home() {
  const { t } = useTranslation();
  return (
    <div className="overflow-hidden">
      {/* Hero Section with Animated Background Paths */}
      <BackgroundPaths 
        title={t('home.hero.title')} 
        subtitle={t('home.hero.subtitle')}
        buttonText={t('home.startDetectionNow')}
        buttonHref="/detect"
      />

      {/* Rest of Landing Page */}
      <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900">
      {/* Features Section with Glassmorphism */}
      <section className="container mx-auto px-4 py-32 md:py-40">
        <div className="text-center mb-24">
          <span className="inline-block px-6 py-3 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-base font-bold mb-6 shadow-md">
            {t('home.whyChoose')}
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('home.powerfulfeat')}
            <span className="block text-green-600 dark:text-green-400 mt-2">{t('home.modernFarmers')}</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('home.everythingNeed')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 md:gap-12 max-w-6xl mx-auto">
          <Card className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4">
            <CardHeader className="space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                <Camera className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors leading-tight">{t('home.diseaseDetection')}</CardTitle>
              <CardDescription className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {t('home.diseaseDetectionDesc')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 dark:border-gray-700 hover:border-yellow-300 dark:hover:border-yellow-600 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4">
            <CardHeader className="space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors leading-tight">{t('home.instantResults')}</CardTitle>
              <CardDescription className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {t('home.instantResultsDesc')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4">
            <CardHeader className="space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{t('home.treatmentPlans')}</CardTitle>
              <CardDescription className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {t('home.treatmentPlansDesc')}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-2xl transition-all duration-500 border-2 border-gray-100 dark:border-gray-700 hover:border-teal-300 dark:hover:border-teal-600 hover:scale-105 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4">
            <CardHeader className="space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-2 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                <Globe className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">{t('home.multiLanguages')}</CardTitle>
              <CardDescription className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                {t('home.multiLanguagesDesc')}
              </CardDescription>
            </CardHeader>
          </Card>

        </div>
      </section>

      {/* How It Works Section with Modern Timeline */}
      <section className="relative container mx-auto px-4 py-32 md:py-40 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-50/50 to-transparent dark:via-green-950/20 pointer-events-none" />
        
        <div className="relative text-center mb-28">
          <span className="inline-block px-6 py-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-base font-bold mb-6 shadow-md">
            {t('home.simpleProcess')}
          </span>
          <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('home.howWorks')}
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{t('home.simpleFastEffective')}</p>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-20">
          {/* Connection Line (Desktop) */}
          <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-gradient-to-r from-green-200 via-emerald-300 to-green-200 dark:from-green-800 dark:via-emerald-700 dark:to-green-800" />
          
          <div className="relative text-center space-y-8 group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-green-400 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full w-28 h-28 flex items-center justify-center text-5xl font-extrabold mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                1
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{t('home.capture')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed px-4">
              {t('home.captureDesc')}
            </p>
          </div>
          
          <div className="relative text-center space-y-8 group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-emerald-400 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-full w-28 h-28 flex items-center justify-center text-5xl font-extrabold mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                2
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{t('home.aiAnalysis')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed px-4">
              {t('home.aiAnalysisDesc')}
            </p>
          </div>
          
          <div className="relative text-center space-y-8 group">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-teal-400 rounded-full blur-3xl opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative bg-gradient-to-br from-teal-500 to-cyan-600 text-white rounded-full w-28 h-28 flex items-center justify-center text-5xl font-extrabold mx-auto shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                3
              </div>
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{t('home.getTreatment')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-xl leading-relaxed px-4">
              {t('home.getTreatmentDesc')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section with Gradient Cards */}
      <section className="container mx-auto px-4 py-32 md:py-40">
        <div className="relative rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-12 md:p-16 shadow-2xl overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="text-center mb-12">
              <TrendingUp className="h-12 w-12 text-white/90 mx-auto mb-4 animate-bounce" />
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                {t('home.trustedFarmers')}
              </h2>
              <p className="text-white/90 text-lg">{t('home.helpingFarmers')}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-3">{t('home.plantDiseases')}</div>
                <div className="text-white/90 text-lg font-semibold">{t('home.plantDiseasesLabel')}</div>
                <div className="text-white/70 text-sm mt-2">{t('home.identifiedTreated')}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-3">{t('home.detectionAccuracy')}</div>
                <div className="text-white/90 text-lg font-semibold">{t('home.detectionAccuracyLabel')}</div>
                <div className="text-white/70 text-sm mt-2">{t('home.aiPoweredPrecision')}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-4xl md:text-5xl font-extrabold text-white mb-3">{t('home.multiLang')}</div>
                <div className="text-white/90 text-lg font-semibold">{t('home.multiLangLabel')}</div>
                <div className="text-white/70 text-sm mt-2">{t('home.globalAccessibility')}</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all hover:scale-105">
                <div className="text-5xl md:text-6xl font-extrabold text-white mb-3">{t('home.freeForever')}</div>
                <div className="text-white/90 text-lg font-semibold">{t('home.freeForeverLabel')}</div>
                <div className="text-white/70 text-sm mt-2">{t('home.noHiddenCosts')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="container mx-auto px-4 py-32 md:py-40">
        <div className="relative max-w-4xl mx-auto">
          <Card className="border-2 border-green-200 dark:border-green-700 shadow-2xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-200/30 dark:bg-green-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-200/30 dark:bg-emerald-500/10 rounded-full blur-3xl" />
            
            <CardHeader className="relative text-center space-y-6 pt-12">
              <div className="relative inline-block">
                <Heart className="h-16 w-16 text-red-500 mx-auto animate-pulse" />
                <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
              </div>
              
              <CardTitle className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
                {t('home.readyProtect')}
              </CardTitle>
              
              <CardDescription className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                {t('home.joinThousands')}
                <span className="block mt-3 text-lg font-semibold text-green-700 dark:text-green-300">{t('home.startFreeDetections')}</span>
              </CardDescription>
            </CardHeader>
            
            <CardContent className="relative pb-12">
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/detect">
                  <Button size="lg" className="group text-lg px-12 py-7 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
                    <Camera className="mr-2 h-6 w-6 group-hover:rotate-12 transition-transform" />
                    {t('home.startDetectionNow')}
                    <Sparkles className="ml-2 h-5 w-5 animate-pulse" />
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="lg" variant="outline" className="text-lg px-12 py-7 border-2 border-green-600 hover:bg-green-50 dark:hover:bg-green-950 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    {t('home.createAccount')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection
        title="Trusted by Farmers Worldwide"
        description="Join thousands of farmers using AgriSakhi to protect their crops and increase yields"
        testimonials={[
          {
            author: {
              name: "Rajesh Kumar",
              handle: "Tomato Farmer, Karnataka",
              avatar: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=150&h=150&fit=crop&crop=face"
            },
            text: "AgriSakhi detected early blight on my tomatoes before I even noticed symptoms. The treatment plan saved my entire crop. It's like having an agriculture expert in my pocket!"
          },
          {
            author: {
              name: "Priya Sharma",
              handle: "Rice Farmer, Punjab",
              avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
            },
            text: "The offline detection feature is amazing! I can check my crops even without internet. The multi-language support in Punjabi helps me understand everything clearly."
          },
          {
            author: {
              name: "Mohammed Aziz",
              handle: "Wheat Farmer, Maharashtra",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            },
            text: "I identified rust disease on my wheat using AgriSakhi and got instant treatment recommendations. My yield increased by 30% this season. Best free tool for farmers!"
          },
          {
            author: {
              name: "Lakshmi Devi",
              handle: "Cotton Farmer, Telangana",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
            },
            text: "The AI is incredibly accurate! It detected bacterial blight before it spread. The prevention tips have helped me avoid diseases in future plantings."
          },
          {
            author: {
              name: "Suresh Patel",
              handle: "Vegetable Farmer, Gujarat",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
            },
            text: "Using AgriSakhi has cut my crop losses by 50%. The knowledge base taught me so much about disease prevention. Every farmer needs this app!"
          },
          {
            author: {
              name: "Anita Singh",
              handle: "Fruit Farmer, Himachal",
              avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face"
            },
            text: "My apple orchard was suffering from powdery mildew. AgriSakhi gave me both organic and chemical treatment options. Saved thousands in losses!"
          }
        ]}
      />

      {/* Footer with Modern Design */}
      <Footer />

      </div>
    </div>
  );
}
