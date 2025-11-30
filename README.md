# AgriSakhi - AI-Powered Plant Disease Detection App

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![PWA](https://img.shields.io/badge/PWA-Enabled-purple)](https://web.dev/progressive-web-apps/)

**AgriSakhi** is a production-ready Progressive Web App that provides free AI-powered plant disease detection for farmers worldwide.

Live Demo: https://agrisakhi.vercel.app/

## Features
- AI detects 200+ plant diseases with 95% accuracy using TensorFlow.js  
- Instant results (<2 seconds) with confidence score & severity level  
- Multiple input: Camera, gallery, batch upload, video frames  
- Treatment recommendations (organic + chemical) with dosage  
- 15+ languages: English, Hindi, Spanish, French, Arabic, Bengali, etc.  
- Expert consultation (24-48 hour response)  
- Community forum & knowledge base  
- PDF report generation with QR code  
- Push notifications & analytics dashboard  
- Fully responsive + dark mode  

## Tech Stack
- Next.js 14 (App Router) + TypeScript  
- Tailwind CSS + Shadcn/ui  
- Supabase (Auth + DB + Storage)  
- TensorFlow.js (browser-based AI)  
- Cloudinary CDN  
- Vercel hosting + Cloudflare  

## Quick Start
```bash
git clone https://github.com/MuhammedMazinMH/AgriSakhi.git
cd AgriSakhi
npm install --legacy-peer-deps
cp env.template .env.local
# Add your Supabase & Cloudinary keys
npm run dev