"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/i18n';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LanguageSwitcher() {
  const { t } = useTranslation();
  const [lang, setLang] = useState('en'); // Always start with 'en' to match SSR
  const [mounted, setMounted] = useState(false);

  // Load saved language after mount to avoid hydration mismatch
  // This pattern is correct for fixing SSR hydration - setState after mount is intentional
  useEffect(() => {
    if (!mounted) {
      /* eslint-disable */
      setMounted(true);
      const savedLang = localStorage.getItem('lng') || 'en';
      if (savedLang !== 'en') {
        setLang(savedLang);
        if (i18n.language !== savedLang) {
          i18n.changeLanguage(savedLang);
        }
      }
      /* eslint-enable */
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, mounted]);

  const onChange = (value: string) => {
    setLang(value);
    localStorage.setItem('lng', value);
    i18n.changeLanguage(value);
    if (typeof document !== 'undefined') {
      const html = document.documentElement;
      html.lang = value;
    }
  };

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return (
      <div className="flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg border p-2">
        <div className="w-36 h-10" /> {/* Placeholder to prevent layout shift */}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-lg shadow-lg border p-2" suppressHydrationWarning>
      <Select value={lang} onValueChange={onChange}>
        <SelectTrigger className="w-36 border-0 focus:ring-0" suppressHydrationWarning>
          <SelectValue placeholder={t('lang.select')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">{t('lang.english')}</SelectItem>
          <SelectItem value="hi">{t('lang.hindi')}</SelectItem>
          <SelectItem value="kn">{t('lang.kannada')}</SelectItem>
          <SelectItem value="ur">{t('lang.urdu')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
