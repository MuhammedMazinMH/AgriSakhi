"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, AlertTriangle, Shield, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { getDiseaseCategories } from "@/data/diseases-data";

export default function KnowledgeBasePage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<{
    nameKey: string;
    symptomsKey: string;
    causesKey: string;
    treatmentKey: string;
    preventionKey: string;
    severityKey: string;
  } | null>(null);

  const diseaseCategories = getDiseaseCategories(t);
  
  const filteredCategories = diseaseCategories.filter((cat) =>
    searchQuery
      ? cat.diseases.some((d) =>
          t(d.nameKey).toLowerCase().includes(searchQuery.toLowerCase())
        )
      : true
  );

  const getSeverityColor = (severityKey: string) => {
    if (severityKey.includes('veryHigh')) {
      return "text-red-700 bg-red-100 dark:bg-red-900/30 border-red-300";
    } else if (severityKey.includes('high')) {
      return "text-orange-700 bg-orange-100 dark:bg-orange-900/30 border-orange-300";
    } else if (severityKey.includes('medium')) {
      return "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300";
    } else {
      return "text-green-700 bg-green-100 dark:bg-green-900/30 border-green-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-10 w-10 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              {t('knowledge.title')}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {t('knowledge.subtitle')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('knowledge.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              suppressHydrationWarning
            />
          </div>
        </div>

        {selectedDisease ? (
          // Disease Detail View
          <div className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={() => setSelectedDisease(null)}
              className="mb-6"
            >
              ← {t('knowledge.backToCategories')}
            </Button>

            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-3xl mb-2">
                      {t(selectedDisease.nameKey)}
                    </CardTitle>
                    <div
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(
                        selectedDisease.severityKey
                      )}`}
                    >
                      {t('knowledge.severity')}: {t(selectedDisease.severityKey)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {t('knowledge.symptoms')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t(selectedDisease.symptomsKey)}
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    {t('knowledge.causes')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t(selectedDisease.causesKey)}
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    {t('knowledge.treatment')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t(selectedDisease.treatmentKey)}
                  </p>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    {t('knowledge.prevention')}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {t(selectedDisease.preventionKey)}
                  </p>
                </div>

                <div className="pt-4 border-t">
                  <Link href="/detect">
                    <Button className="w-full" size="lg">
                      {t('knowledge.detectNow')} →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Category & Disease List View
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Categories */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-4">{t('knowledge.categories')}</h2>
              <div className="space-y-3">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Card
                      key={category.id}
                      className={`cursor-pointer transition-all hover:scale-105 ${
                        selectedCategory === category.id
                          ? "ring-2 ring-green-500 shadow-lg"
                          : ""
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg bg-${category.color}-100 dark:bg-${category.color}-900/30`}
                            >
                              <Icon
                                className={`h-6 w-6 text-${category.color}-600`}
                              />
                            </div>
                            <div>
                              <CardTitle className="text-lg">
                                {t(category.nameKey)}
                              </CardTitle>
                              <CardDescription>
                                {category.count} {t('knowledge.diseases')}
                              </CardDescription>
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Disease List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">
                {selectedCategory
                  ? t(filteredCategories.find((c) => c.id === selectedCategory)?.nameKey || '')
                  : t('knowledge.allDiseases')}
              </h2>
              <div className="space-y-4">
                {(selectedCategory
                  ? filteredCategories
                      .find((c) => c.id === selectedCategory)
                      ?.diseases.filter((d) =>
                        t(d.nameKey).toLowerCase().includes(searchQuery.toLowerCase())
                      )
                  : filteredCategories.flatMap((c) =>
                      c.diseases.filter((d) =>
                        t(d.nameKey)
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase())
                      )
                    )
                )?.map((disease, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setSelectedDisease(disease)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">
                            {t(disease.nameKey)}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {t(disease.symptomsKey)}
                          </CardDescription>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getSeverityColor(
                            disease.severityKey
                          )}`}
                        >
                          {t(disease.severityKey)}
                        </div>
                      </div>
                      <Button variant="ghost" className="mt-4 w-full" suppressHydrationWarning>
                        {t('knowledge.viewDetails')} →
                      </Button>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
