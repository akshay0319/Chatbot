# ChatKit Chatbot Widget - Complete Setup and Deployment Guide

This document contains the complete process for setting up the ChatKit Chatbot Widget locally and deploying it to Vercel.

## Table of Contents
- [Project Overview](#project-overview)
- [Local Setup Process](#local-setup-process)
- [Project Structure](#project-structure)
- [Building for Production](#building-for-production)
- [Vercel Deployment](#vercel-deployment)
- [Post-Deployment Configuration](#post-deployment-configuration)
- [Testing the Widget](#testing-the-widget)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

This is an embeddable chatbot widget powered by OpenAI's ChatKit. It can be embedded on any website with a single `<script>` tag.

**Tech Stack:**
- React 18.2.0
- Vite 5.0.0 (Build tool)
- OpenAI ChatKit React
- Express (for local dev server)
- Serverless functions (Vercel/Netlify compatible)

**Key Features:**
- Single file embed (no iframe)
- Shadow DOM for CSS isolation
- Session persistence across page reloads
- Mobile responsive
- Lightweight bundle (~48KB gzipped)

---

## Local Setup Process

### Step 1: Create Environment File

Create a `.env` file in the project root with your OpenAI API key:

```bash
OPENAI_API_KEY=your_openai_api_key_here
CHATBOT_SYSTEM_PROMPT=You are a helpful website assistant. Answer questions clearly and concisely.
```

**Important:** You need a valid OpenAI API key from https://platform.openai.com/api-keys

### Step 2: Install Dependencies

Run the following command to install all required npm packages:

```bash
npm install
```

This will install:
- React and ReactDOM
- @openai/chatkit-react
- Vite and build tools
- Express and CORS (for local development)
- Other dev dependencies

**Installation Output:**
- 138 packages installed
- Takes approximately 10-15 seconds

### Step 3: Run Local Development Servers

The project requires TWO servers running simultaneously:

#### Terminal 1 - API Server (Port 3000)
```bash
npm run dev:api
```

This starts the Express server on `http://localhost:3000` that handles ChatKit session creation.

#### Terminal 2 - Vite Dev Server (Port 5173)
```bash
npm run dev
```

This starts the Vite development server on `http://localhost:5173` with hot module replacement.

**Vite Configuration:**
- The Vite server proxies `/api/*` requests to the API server (port 3000)
- This simulates the production serverless function setup

### Step 4: Access the Local Demo

Open your browser and navigate to:
```
http://localhost:5173/
```

You should see the demo e-commerce page with the chatbot button in the bottom-right corner.

**What to Test:**
1. Click the chat button - chat window should open
2. Send a message - should get AI response
3. Close and reopen - session should persist
4. Check browser console for any errors
5. Test on mobile viewport (responsive design)

---

## Project Structure

After cleanup, here's the clean project structure:

```
Chatbot/
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── .gitignore             # Git ignore rules
├── package.json           # NPM dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── vite.config.js         # Vite build configuration
├── vercel.json            # Vercel deployment configuration
├── README.md              # Project documentation
├── index.html             # Demo e-commerce page
│
├── src/                   # Source files
│   ├── widget-entry.jsx   # Main widget entry point
│   ├── chat/              # Chat components (if any)
│   └── ...
│
├── api/                   # Serverless functions
│   └── chatkit-session.js # ChatKit session handler
│
├── dist/                  # Production build output
│   └── chatbot.js         # Built widget bundle (150KB)
│
└── node_modules/          # NPM packages (not in git)
```

**Files Removed During Cleanup:**
- `netlify.toml` - Netlify config (not needed for Vercel)
- `.htaccess` - Apache config (not needed for Vercel)
- `prepare-hostinger.sh` - Hostinger deployment script
- `production-package.json` - Alternative server package file
- `server.js` - Standalone Express server
- `dev-server.js` - Dev server (available in node_modules)
- `chatbot_dataset.txt` - Training data
- `Hallucination guardrail.txt` - Documentation
- `example-embed.html` - Test file
- `test-embed.html` - Test file
- `public/` folder - Old build artifacts
- Multiple deployment MD files for other platforms

---

## Building for Production

### Build Command

To create the production-ready bundle:

```bash
npm run build
```

**Build Process:**
1. Vite reads `src/widget-entry.jsx`
2. Bundles React + ChatKit + widget code
3. Minifies with Terser
4. Outputs to `dist/chatbot.js`

**Build Output:**
- File: `dist/chatbot.js`
- Size: 150.07 KB (uncompressed)
- Gzipped: 48.43 KB
- Format: IIFE (Immediately Invoked Function Expression)

**Vite Configuration Details (`vite.config.js`):**
```javascript
{
  input: 'src/widget-entry.jsx',
  output: {
    entryFileNames: 'chatbot.js',
    format: 'iife',
    inlineDynamicImports: true
  },
  minify: 'terser'
}
```

### Verify Build

After building, check the dist folder:
```bash
ls -la dist/
```

You should see:
- `chatbot.js` - Main widget file

---

## Vercel Deployment

### Prerequisites

1. **Vercel Account:** Sign up at https://vercel.com
2. **Vercel CLI:** Install globally
   ```bash
   npm install -g vercel
   ```

### Deployment Steps

#### Step 1: Login to Vercel

```bash
vercel login
```

Follow the prompts to authenticate with your Vercel account.

#### Step 2: Deploy to Vercel

From the project root directory:

```bash
vercel
```

**First-time deployment prompts:**
- Set up and deploy? → Yes
- Which scope? → Select your account
- Link to existing project? → No
- What's your project's name? → (Enter name or press Enter for default)
- In which directory is your code located? → ./ (press Enter)

**Deployment Process:**
1. Vercel reads `vercel.json` configuration
2. Builds the project (`npm run build`)
3. Deploys static files from `dist/`
4. Deploys serverless functions from `api/`
5. Provides preview URL

#### Step 3: Deploy to Production

Once preview is verified, deploy to production:

```bash
vercel --prod
```

You'll receive a production URL like: `https://your-project.vercel.app`

### Vercel Configuration Explained

The `vercel.json` file configures the deployment:

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

**What this does:**
- Serves `dist/` files as static assets
- Runs `api/` files as Node.js serverless functions
- Routes `/api/*` requests to serverless functions
- Routes all other requests to static files

---

## Post-Deployment Configuration

### Step 1: Add Environment Variables to Vercel

After deployment, you MUST add your OpenAI API key to Vercel:

**Via Vercel Dashboard:**
1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add variable:
   - Name: `OPENAI_API_KEY`
   - Value: `your_actual_openai_api_key_here`
   - Environments: Production, Preview, Development
5. Click Save

**Via Vercel CLI:**
```bash
vercel env add OPENAI_API_KEY
```
Then paste your API key when prompted.

### Step 2: Redeploy (if needed)

If you added environment variables after initial deployment:

```bash
vercel --prod
```

This ensures the serverless function has access to your API key.

### Step 3: Test the Deployed Widget

Create a simple HTML file to test your deployed widget:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Chatbot Widget</title>
</head>
<body>
  <h1>My Website</h1>
  <p>The chatbot widget should appear in the bottom-right corner.</p>

  <!-- Chatbot Widget -->
  <script>
    window.CHATBOT_API_URL = 'https://your-project.vercel.app';
    window.CHATBOT_TITLE = 'Support Chat';
  </script>
  <script src="https://your-project.vercel.app/chatbot.js" async></script>
</body>
</html>
```

**Replace `your-project.vercel.app` with your actual Vercel domain.**

---

## Testing the Widget

### Local Testing Checklist

- [ ] API server running on port 3000
- [ ] Vite server running on port 5173
- [ ] Chat button appears bottom-right
- [ ] Clicking button opens chat window
- [ ] Can send messages and receive responses
- [ ] Close button works
- [ ] Session persists on page reload
- [ ] No console errors
- [ ] Responsive on mobile viewport

### Production Testing Checklist

- [ ] Widget loads from Vercel CDN
- [ ] HTTPS connection secure
- [ ] API endpoint responds (check Network tab)
- [ ] Chat functions properly
- [ ] No CORS errors
- [ ] Works on different websites
- [ ] Mobile responsive
- [ ] Fast load time (<2 seconds)

### Debugging Tools

**Browser Console:**
```javascript
// Check if widget loaded
window.__CHATBOT_WIDGET_LOADED__

// Check configuration
window.CHATBOT_API_URL
window.CHATBOT_TITLE
```

**Network Tab:**
- Check for `chatbot.js` download
- Check for `/api/chatkit-session` POST request
- Verify 200 status codes

**Vercel Function Logs:**
1. Go to Vercel Dashboard
2. Select project
3. Go to Functions tab
4. Click on `chatkit-session`
5. View real-time logs

---

## Troubleshooting

### Issue: Widget Not Appearing

**Possible Causes:**
1. Script URL incorrect
2. CHATBOT_API_URL not set
3. JavaScript errors blocking execution

**Solutions:**
- Check browser console for errors
- Verify script src attribute
- Ensure CHATBOT_API_URL is set before loading script
- Check if chatbot.js returns 200 status

### Issue: Chat Opens But No Response

**Possible Causes:**
1. API key not configured in Vercel
2. Invalid workflow ID
3. OpenAI API quota exceeded
4. CORS issues

**Solutions:**
- Check Vercel environment variables
- Verify OPENAI_API_KEY is set correctly
- Check OpenAI API usage at https://platform.openai.com/usage
- Review Vercel function logs for errors
- Check Network tab for failed API requests

### Issue: Session Not Persisting

**Possible Causes:**
1. localStorage blocked
2. Device ID not being saved
3. Cookies disabled

**Solutions:**
- Check browser privacy settings
- Ensure localStorage is enabled
- Test in incognito mode
- Check browser console for storage errors

### Issue: CORS Errors

**Possible Causes:**
1. API endpoint not returning CORS headers
2. Incorrect API URL
3. Vercel configuration issue

**Solutions:**
- Verify `api/chatkit-session.js` has CORS headers
- Check vercel.json routes configuration
- Ensure API endpoint returns proper headers
- Test API endpoint directly with curl/Postman

### Issue: Build Failures

**Possible Causes:**
1. Missing dependencies
2. Vite configuration errors
3. Memory issues

**Solutions:**
```bash
# Clean rebuild
rm -rf node_modules dist package-lock.json
npm install
npm run build
```

### Issue: Vercel Deployment Fails

**Possible Causes:**
1. Build command failed
2. vercel.json misconfigured
3. File size limits exceeded

**Solutions:**
- Check build logs in Vercel dashboard
- Verify vercel.json syntax
- Ensure dist/ folder is created during build
- Check file sizes (Vercel has limits)

---

## Widget Configuration Options

### Available Options

Set these BEFORE loading the widget script:

```javascript
// Required: Your Vercel deployment URL
window.CHATBOT_API_URL = 'https://your-project.vercel.app';

// Optional: Custom title (default: 'Chat Assistant')
window.CHATBOT_TITLE = 'Support Chat';
```

### Customizing Workflow ID

To use a different OpenAI agent workflow:

1. Edit `src/widget-entry.jsx` (line 13):
   ```javascript
   workflowId: 'your-workflow-id-here'
   ```

2. Edit `api/chatkit-session.js` (line 36):
   ```javascript
   const workflowId = 'your-workflow-id-here';
   ```

3. Rebuild and redeploy:
   ```bash
   npm run build
   vercel --prod
   ```

### Customizing Starter Prompts

Edit `src/widget-entry.jsx` (lines 246-265):

```javascript
startScreen: {
  greeting: "How can I help you today?",
  prompts: [
    {
      label: "Your question here",
      prompt: "Your question here"
    },
    // Add more prompts...
  ]
}
```

Then rebuild and redeploy.

---

## Performance Optimization

### Current Bundle Size
- Uncompressed: 150.07 KB
- Gzipped: 48.43 KB
- Load time: ~500ms on fast connection

### Tips for Faster Loading

1. **Use async loading:**
   ```html
   <script src="..." async></script>
   ```

2. **Load at end of body:**
   Place scripts before `</body>` tag

3. **Enable CDN caching:**
   Vercel automatically handles this

4. **Lazy load chat:**
   Widget only loads ChatKit when button clicked (already implemented)

---

## Security Considerations

### API Key Protection
- API key stored in Vercel environment variables
- Never exposed to client-side code
- Only used in serverless function

### CORS Configuration
- Currently set to `*` (allow all origins)
- For production, consider restricting to specific domains
- Edit `api/chatkit-session.js` line 7:
  ```javascript
  res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
  ```

### Shadow DOM Isolation
- Prevents XSS attacks from host page
- CSS isolation prevents style injection
- Widget runs in isolated context

### HTTPS Requirement
- Vercel provides HTTPS by default
- Required for production use
- LocalStorage access requires secure context

---

## Monitoring and Analytics

### Vercel Analytics

Enable analytics in Vercel dashboard:
1. Go to project settings
2. Enable Analytics
3. View real-time data on usage

### Function Logs

Monitor serverless function calls:
1. Vercel Dashboard → Project
2. Click Functions tab
3. Select `chatkit-session`
4. View logs and metrics

### OpenAI Usage

Monitor API usage:
1. Go to https://platform.openai.com/usage
2. Track requests and costs
3. Set up billing alerts

---

## Maintenance and Updates

### Updating Dependencies

Check for updates:
```bash
npm outdated
```

Update packages:
```bash
npm update
```

For major version updates:
```bash
npm install package-name@latest
```

### Rebuilding After Changes

After any code changes:
```bash
npm run build
vercel --prod
```

### Rolling Back Deployments

Via Vercel Dashboard:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." menu
4. Select "Promote to Production"

---

## Cost Estimates

### Vercel (Free Tier)
- Serverless Functions: 100GB-hours/month
- Bandwidth: 100GB/month
- Build time: 100 hours/month
- **Typical usage:** Free for most small projects

### OpenAI API
- ChatKit sessions: $0.002 per session
- Messages: Depends on model and usage
- **Estimate:** ~$0.01-0.05 per conversation

---

## Support and Resources

### Official Documentation
- OpenAI ChatKit: https://platform.openai.com/docs/guides/chatkit
- Vercel Docs: https://vercel.com/docs
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev

### Useful Commands

```bash
# Development
npm run dev           # Start Vite dev server
npm run dev:api       # Start API dev server

# Building
npm run build         # Build production bundle
npm run preview       # Preview production build locally

# Deployment
vercel                # Deploy preview
vercel --prod         # Deploy to production
vercel logs           # View function logs

# Testing
npx serve dist -l 8080  # Serve dist folder locally
```

---

## Changelog

### Version 1.0.0 (Current)
- Initial production release
- React + Vite setup
- OpenAI ChatKit integration
- Vercel serverless deployment
- Shadow DOM isolation
- Session persistence
- Mobile responsive design

---

## Next Steps

1. **Get OpenAI API Key:**
   - Sign up at https://platform.openai.com
   - Create API key
   - Add to `.env` file

2. **Test Locally:**
   - Follow local setup steps
   - Verify everything works
   - Fix any issues

3. **Deploy to Vercel:**
   - Follow deployment steps
   - Add environment variables
   - Test production deployment

4. **Embed on Your Website:**
   - Copy embed code
   - Replace with your Vercel URL
   - Test on production site

5. **Monitor and Optimize:**
   - Check Vercel analytics
   - Monitor OpenAI usage
   - Optimize based on feedback

---

## License

MIT License - Feel free to use in your projects.

---

**Generated on:** 2026-02-02
**Author:** Claude Code Assistant
**Project:** ChatKit Embeddable Widget
