# AgriSakhi - AI-Powered Plant Disease Detection App

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://web.dev/progressive-web-apps/)

**AgriSakhi** is a Progressive Web App that provides free AI-powered plant disease detection for farmers worldwide. No sign-up required — upload a photo and get instant results.

Live Demo: https://agrisakhi.vercel.app/

## Features

- AI-powered detection of 200+ plant diseases from a photo
- Instant results with confidence score, severity level, and affected-area estimate
- Multiple input methods: camera capture or gallery upload
- Treatment recommendations (organic + chemical) with dosage guidance
- Sakhi-AI chatbot for farming questions in multiple languages
- 4 languages: English, Hindi, Kannada, Urdu
- Knowledge base covering common crop diseases and prevention
- Detection history and analytics dashboard
- PDF report generation
- PWA with offline support, fully responsive + dark mode

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- AI SDK with Vercel AI Gateway (disease detection + chatbot)
- i18next (multi-language support)
- jsPDF (report generation)
- Vercel hosting

## Quick Start

```bash
git clone https://github.com/MuhammedMazinMH/AgriSakhi.git
cd AgriSakhi
npm install --legacy-peer-deps
cp env.template .env.local
# Add your AI Gateway key (not needed when deployed on Vercel)
npm run dev
```

## How It Works

1. **Capture** — Take or upload a photo of the affected plant
2. **Analyze** — The image is analyzed server-side and matched against known disease patterns
3. **Treat** — Get a diagnosis with confidence score and actionable treatment recommendations

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run test:ci      # Run unit tests
npm run test:e2e     # Run Playwright E2E tests
npm run type-check   # TypeScript check
```

## License

MIT
