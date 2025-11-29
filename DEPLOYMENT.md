# 🚀 Deployment Guide - AgriSakhi

This guide covers deploying AgriSakhi to production using free-tier services.

## 📋 Prerequisites

Before deploying, ensure you have:

- [ ] GitHub repository created
- [ ] All environment variables ready
- [ ] Supabase project created
- [ ] Vercel account created
- [ ] Domain name (optional, Vercel provides free subdomain)

## 🗄️ Database Setup (Supabase)

### 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and project name
4. Set database password (save it securely)
5. Select region (closest to your users)
6. Wait for project to be ready (~2 minutes)

### 2. Run Database Migrations

1. Copy SQL from `supabase/schema.sql`
2. Go to SQL Editor in Supabase dashboard
3. Paste and run the SQL
4. Verify tables are created in Table Editor

### 3. Setup Row Level Security

1. Copy SQL from `supabase/policies.sql`
2. Run in SQL Editor
3. Verify policies in Authentication > Policies

### 4. Configure Authentication

**Email/Password:**
1. Go to Authentication > Providers
2. Enable Email provider
3. Configure email templates

**Google OAuth:**
1. Create project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Google+ API
3. Create OAuth credentials
4. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
5. Copy Client ID and Secret to Supabase

**Facebook OAuth:**
1. Create app in [Facebook Developers](https://developers.facebook.com)
2. Add Facebook Login product
3. Configure OAuth redirect URIs
4. Copy App ID and Secret to Supabase

### 5. Setup Storage

1. Go to Storage in Supabase dashboard
2. Create buckets:
   - `plant-images` (public)
   - `user-avatars` (public)
   - `reports` (private)
3. Set storage policies for each bucket

### 6. Get API Keys

1. Go to Project Settings > API
2. Copy:
   - Project URL (`NEXT_PUBLIC_SUPABASE_URL`)
   - Anon/Public key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - Service Role key (`SUPABASE_SERVICE_ROLE_KEY`) - Keep secret!

## 🖼️ Image Storage (Cloudinary)

### 1. Create Cloudinary Account

1. Sign up at [https://cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy:
   - Cloud name (`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`)
   - API Key (`CLOUDINARY_API_KEY`)
   - API Secret (`CLOUDINARY_API_SECRET`)

### 2. Configure Upload Presets

1. Go to Settings > Upload
2. Create upload preset:
   - Name: `agrisakhi-plants`
   - Signing Mode: Unsigned
   - Folder: `plant-images`
   - Transformations: Auto format, Auto quality

## 📧 Email Service (Resend)

### 1. Setup Resend

1. Sign up at [https://resend.com](https://resend.com)
2. Create API key
3. Verify domain (optional, for production)
4. Copy:
   - API Key (`RESEND_API_KEY`)
   - From Email (`RESEND_FROM_EMAIL`)

### 2. Email Templates

Create templates for:
- Welcome email
- Password reset
- Detection complete
- Expert response

## 🔍 Error Tracking (Sentry)

### 1. Create Sentry Project

1. Sign up at [https://sentry.io](https://sentry.io)
2. Create new project (Next.js)
3. Copy DSN (`NEXT_PUBLIC_SENTRY_DSN`)
4. Install Sentry wizard:
```bash
npx @sentry/wizard@latest -i nextjs
```

### 2. Configure Source Maps

1. Get auth token from Sentry
2. Add to env: `SENTRY_AUTH_TOKEN`
3. Source maps upload automatically on build

## 📊 Analytics

### Google Analytics 4

1. Create property in [Google Analytics](https://analytics.google.com)
2. Get Measurement ID (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
3. Add to environment variables

### Vercel Analytics

- Automatically enabled on Vercel
- No configuration needed

## 🚀 Deploy to Vercel

### Method 1: GitHub Integration (Recommended)

1. **Connect Repository**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Grant Vercel access

2. **Configure Project**
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`

3. **Add Environment Variables**
   
   Add all variables from `env.template`:
   
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   
   # Cloudinary
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789
   CLOUDINARY_API_SECRET=abc123...
   
   # Resend
   RESEND_API_KEY=re_xxx...
   RESEND_FROM_EMAIL=noreply@yourdomain.com
   
   # Sentry
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   SENTRY_AUTH_TOKEN=sntrys_xxx...
   
   # Google Analytics
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=https://agrisakhi.vercel.app
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~3-5 minutes)
   - Visit your deployment URL

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Method 3: Manual Deploy

```bash
# Build locally
npm run build

# Test production build
npm run start

# Deploy
vercel --prod
```

## 🌐 Custom Domain

### Add Custom Domain

1. Go to Project Settings > Domains
2. Add your domain
3. Configure DNS:
   - Add A record: `76.76.21.21`
   - Add CNAME record: `cname.vercel-dns.com`
4. Wait for DNS propagation (~5-10 minutes)
5. SSL certificate is automatically provisioned

## 🔒 Security Configuration

### Environment Variables

- Never commit `.env.local` to Git
- Use different keys for staging/production
- Rotate keys regularly
- Use Vercel's environment variable encryption

### Rate Limiting

Configure in `src/middleware.ts`:
```typescript
export const config = {
  matcher: '/api/:path*',
};
```

### CORS

Update `next.config.ts` if needed:
```typescript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: 'https://yourdomain.com' },
      ],
    },
  ];
},
```

## 📱 PWA Configuration

### Service Worker

- Automatically generated on build
- Cached assets are defined in `next.config.ts`
- Update manifest.json with production URLs

### Web App Manifest

Update `public/manifest.json`:
```json
{
  "start_url": "https://yourdomain.com",
  "scope": "https://yourdomain.com"
}
```

## 🧪 Pre-Deployment Checklist

### Testing

- [ ] Run all unit tests: `npm test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Test offline functionality
- [ ] Check Lighthouse scores

### Performance

- [ ] Optimize images (WebP/AVIF)
- [ ] Minimize bundle size
- [ ] Enable compression
- [ ] Configure CDN caching
- [ ] Test Core Web Vitals

### Security

- [ ] Update dependencies
- [ ] Run security audit: `npm audit`
- [ ] Check for exposed secrets
- [ ] Configure security headers
- [ ] Enable HTTPS only
- [ ] Setup CORS properly

### SEO

- [ ] Add meta tags
- [ ] Configure Open Graph
- [ ] Add Twitter cards
- [ ] Create sitemap.xml
- [ ] Add robots.txt
- [ ] Configure canonical URLs

## 🔄 CI/CD Pipeline

### GitHub Actions

Already configured in `.github/workflows/ci.yml`:

- ✅ Runs on push and PR
- ✅ Tests, builds, and deploys
- ✅ Automatic preview deployments
- ✅ Production deployment on merge to main

### Workflow Steps

1. **On Pull Request:**
   - Run linters
   - Run tests
   - Build application
   - Deploy to preview URL
   - Run E2E tests

2. **On Merge to Main:**
   - All above steps
   - Deploy to production
   - Send notification

## 📊 Monitoring

### Vercel Dashboard

Monitor:
- Deployment status
- Build logs
- Real-time analytics
- Error tracking

### Supabase Dashboard

Monitor:
- Database performance
- API requests
- Authentication logs
- Storage usage

### Sentry

Monitor:
- Error rates
- Performance issues
- User feedback
- Release health

## 🔧 Troubleshooting

### Build Failures

**Error: Module not found**
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install --legacy-peer-deps
```

**Error: Environment variable missing**
- Check Vercel environment variables
- Ensure all required vars are set
- Check variable names (case-sensitive)

### Runtime Errors

**Database connection failed**
- Verify Supabase URL and keys
- Check RLS policies
- Ensure tables are created

**Image upload failed**
- Verify Cloudinary credentials
- Check upload preset
- Verify CORS configuration

### Performance Issues

**Slow page loads**
- Enable CDN caching
- Optimize images
- Use code splitting
- Enable compression

**High memory usage**
- Optimize dependencies
- Use dynamic imports
- Implement lazy loading

## 📈 Scaling

### Free Tier Limits

- **Vercel**: Unlimited bandwidth, 100GB/month
- **Supabase**: 500MB database, 1GB storage
- **Cloudinary**: 25GB bandwidth/month

### When to Upgrade

Consider upgrading when:
- Database > 400MB
- Storage > 800MB
- > 20GB bandwidth/month
- Need advanced features

### Cost Optimization

- Optimize images before upload
- Use CDN for static assets
- Implement caching
- Monitor usage regularly

## 🎉 Post-Deployment

### Launch Checklist

- [ ] Test all features in production
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Test from different locations
- [ ] Verify email delivery
- [ ] Test authentication flows
- [ ] Monitor database performance

### Marketing

- [ ] Submit to PWA directories
- [ ] Create social media posts
- [ ] Reach out to farming communities
- [ ] Create demo video
- [ ] Write blog post
- [ ] Submit to ProductHunt

## 📞 Support

Need help deploying?

- 📖 [Vercel Documentation](https://vercel.com/docs)
- 📖 [Supabase Documentation](https://supabase.com/docs)
- 💬 [Discord Community](https://discord.gg/agrisakhi)
- 📧 Email: support@agrisakhi.app

---

🌾 Happy Deploying! Your AgriSakhi app is ready to help farmers worldwide!
