# Quick Vercel Deployment Guide

This is a quick reference guide for deploying the ChatKit Chatbot Widget to Vercel.

## Prerequisites

1. Vercel account (sign up at https://vercel.com)
2. OpenAI API key (get from https://platform.openai.com/api-keys)
3. Project built successfully (`npm run build` completed)

---

## Deployment Steps

### Option 1: Using Vercel CLI (Recommended)

#### 1. Install Vercel CLI

```bash
npm install -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

Follow the authentication prompts in your browser.

#### 3. Deploy

From the project root directory:

```bash
vercel
```

**First-time prompts:**
- Set up and deploy? → **Yes**
- Which scope? → **Select your account**
- Link to existing project? → **No**
- What's your project's name? → **Press Enter or type a name**
- In which directory is your code located? → **./  (press Enter)**

#### 4. Deploy to Production

After verifying the preview deployment:

```bash
vercel --prod
```

You'll get a production URL like: `https://your-project.vercel.app`

---

### Option 2: Using Vercel Dashboard (Git-based)

#### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

#### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Configure project:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. Click "Deploy"

---

## Post-Deployment Configuration

### Add Environment Variables

**Critical:** You MUST add your OpenAI API key to Vercel.

#### Via Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - **Key:** `OPENAI_API_KEY`
   - **Value:** `your_actual_openai_api_key_here`
   - **Environments:** Select all (Production, Preview, Development)
5. Click **Save**

#### Via Vercel CLI:

```bash
vercel env add OPENAI_API_KEY
```

Then paste your API key when prompted and select environments.

### Redeploy with Environment Variables

If you added environment variables after initial deployment:

```bash
vercel --prod
```

This ensures the serverless function has access to your API key.

---

## Verify Deployment

### 1. Check Deployment Status

Visit your Vercel dashboard to ensure:
- ✅ Build completed successfully
- ✅ Functions deployed
- ✅ Environment variables set

### 2. Test the Widget

Create a test HTML file:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Test</title>
</head>
<body>
  <h1>Test Page</h1>
  <p>The chatbot should appear in the bottom-right corner.</p>

  <!-- Replace YOUR_VERCEL_URL with your actual deployment URL -->
  <script>
    window.CHATBOT_API_URL = 'https://YOUR_VERCEL_URL.vercel.app';
    window.CHATBOT_TITLE = 'Support Chat';
  </script>
  <script src="https://YOUR_VERCEL_URL.vercel.app/chatbot.js" async></script>
</body>
</html>
```

### 3. Test Checklist

- [ ] Widget loads (check Network tab)
- [ ] Chat button appears bottom-right
- [ ] Clicking button opens chat
- [ ] Can send messages
- [ ] Receive AI responses
- [ ] No console errors
- [ ] No CORS errors

---

## Troubleshooting

### Widget Not Loading

**Check:**
1. Script URL is correct (with your domain)
2. `chatbot.js` returns 200 status (check Network tab)
3. No JavaScript errors in console
4. CHATBOT_API_URL is set correctly

### No AI Responses

**Check:**
1. Environment variable `OPENAI_API_KEY` is set in Vercel
2. API key is valid (test at https://platform.openai.com)
3. Function logs in Vercel dashboard for errors
4. `/api/chatkit-session` endpoint returns 200
5. No CORS errors in browser console

### CORS Errors

**Check:**
1. `api/chatkit-session.js` has proper CORS headers
2. API endpoint accessible from your domain
3. No browser extensions blocking requests

### View Function Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click **Functions** tab
4. Click on `chatkit-session`
5. View real-time logs

---

## Embedding on Your Website

Once deployed and tested, embed the widget on any website:

```html
<!-- Place before closing </body> tag -->
<script>
  window.CHATBOT_API_URL = 'https://your-project.vercel.app';
  window.CHATBOT_TITLE = 'Support Chat'; // Optional custom title
</script>
<script src="https://your-project.vercel.app/chatbot.js" async></script>
```

**Works on:**
- Static HTML sites
- WordPress (add to footer)
- React/Vue/Angular apps (add to index.html)
- Shopify stores
- Any website with HTML access

---

## Updating the Deployment

### After Code Changes

1. **Build locally:**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel:**
   ```bash
   vercel --prod
   ```

### Via Git (if using GitHub integration)

1. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update widget"
   git push origin main
   ```

2. Vercel automatically deploys on push

---

## Custom Domain Setup

### Add Custom Domain to Vercel

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Domains**
3. Add your domain (e.g., `chat.yourdomain.com`)
4. Follow DNS configuration instructions
5. Vercel provides SSL certificate automatically

### Update Widget Embed Code

After setting custom domain:

```html
<script>
  window.CHATBOT_API_URL = 'https://chat.yourdomain.com';
</script>
<script src="https://chat.yourdomain.com/chatbot.js" async></script>
```

---

## Vercel Configuration

The project includes `vercel.json` with optimal settings:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/**",
      "use": "@vercel/static"
    },
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/$1"
    }
  ]
}
```

This configuration:
- Serves `dist/` as static files
- Runs `api/` as serverless functions
- Routes API requests correctly
- Optimizes for CDN caching

---

## Performance

### What Vercel Provides

- **CDN:** Global edge network for fast loading
- **Compression:** Automatic Gzip/Brotli compression
- **Caching:** Smart caching of static assets
- **HTTPS:** Free SSL certificate
- **Serverless Functions:** Auto-scaling API endpoints

### Expected Performance

- **Widget Load Time:** ~500ms (fast connection)
- **API Response Time:** ~200-500ms
- **CDN Cache Hit:** <100ms

---

## Cost Estimates

### Vercel Free Tier Includes:

- **100 GB-hours** of Serverless Function execution
- **100 GB** bandwidth per month
- **100 hours** build time
- **Unlimited** deployments
- **Free** SSL certificates

**Typical Usage:** Most small-to-medium projects stay within free tier.

### OpenAI API Costs:

- **ChatKit Sessions:** ~$0.002 per session
- **Messages:** Varies by model and length
- **Estimated:** $0.01-0.05 per conversation

---

## Monitoring

### Vercel Analytics

Enable in Dashboard:
1. Project Settings → Analytics
2. View metrics: pageviews, visitors, performance

### Function Logs

Real-time logs available:
1. Dashboard → Functions → `chatkit-session`
2. Monitor errors, response times, invocations

### OpenAI Usage

Monitor at https://platform.openai.com/usage

---

## Security Checklist

- [x] API key stored in environment variables (not in code)
- [x] HTTPS enabled (Vercel default)
- [x] CORS headers configured
- [x] Shadow DOM prevents XSS
- [x] No sensitive data exposed to client

### Optional: Restrict CORS

For production, consider restricting CORS to your domain.

Edit `api/chatkit-session.js` line 7:

```javascript
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
```

Then redeploy.

---

## Rollback Deployments

If something breaks after deployment:

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"

---

## Support Resources

- **Vercel Support:** https://vercel.com/support
- **Vercel Docs:** https://vercel.com/docs
- **OpenAI Support:** https://help.openai.com
- **Project Issues:** Check browser console and Vercel function logs

---

## Quick Commands Reference

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy preview
vercel

# Deploy production
vercel --prod

# View logs
vercel logs

# Add environment variable
vercel env add OPENAI_API_KEY

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

---

## Next Steps After Deployment

1. **Test thoroughly** - Try the widget on different devices and browsers
2. **Monitor usage** - Check Vercel analytics and OpenAI usage
3. **Set up alerts** - Configure billing alerts on OpenAI
4. **Customize** - Update colors, text, starter prompts as needed
5. **Share** - Embed on your production website

---

**Deployment Complete! 🚀**

Your chatbot widget is now live and ready to be embedded on any website.

For detailed information, see [LOCAL_SETUP_AND_DEPLOYMENT.md](LOCAL_SETUP_AND_DEPLOYMENT.md)
