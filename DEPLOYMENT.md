# 🚀 Quick Deployment Guide

## Deploy Your Chatbot Widget to Vercel (5 Minutes)

### Step 1: Build the Widget

```bash
npm run build
```

This creates `dist/chatbot.js` - your embeddable widget file.

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI (one time only)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel deploy --prod
```

Vercel will ask you a few questions:
- **Set up and deploy?** → YES
- **Which scope?** → Your username
- **Link to existing project?** → NO
- **Project name?** → Press ENTER (or give it a custom name)
- **Directory?** → Press ENTER (current directory)

### Step 3: Add Your OpenAI API Key

1. Go to https://vercel.com/dashboard
2. Click on your deployed project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Add:
   - **Name**: `OPENAI_API_KEY`
   - **Value**: Your OpenAI API key (starts with `sk-proj-...`)
6. Click **Save**
7. Go to **Deployments** tab
8. Click the 3 dots on latest deployment → **Redeploy**

### Step 4: Get Your Widget Script

After deployment, Vercel gives you a URL like:
```
https://your-project-name.vercel.app
```

**Your embeddable script:**
```html
<script>
  window.CHATBOT_API_URL = 'https://your-project-name.vercel.app';
  window.CHATBOT_TITLE = 'Support Chat'; // Optional
</script>
<script src="https://your-project-name.vercel.app/chatbot.js" async></script>
```

---

## 📤 Share With Anyone!

### Option 1: Direct Copy-Paste

Send them this script (replace with your actual Vercel URL):

```html
<script>
  window.CHATBOT_API_URL = 'https://your-project-name.vercel.app';
</script>
<script src="https://your-project-name.vercel.app/chatbot.js" async></script>
```

They paste it before the closing `</body>` tag in their HTML.

### Option 2: WordPress

1. Go to WordPress Admin
2. **Appearance** → **Theme Editor**
3. Edit **footer.php**
4. Paste the script before `</body>`
5. Save

### Option 3: Shopify

1. Go to Shopify Admin
2. **Online Store** → **Themes**
3. Click **Actions** → **Edit code**
4. Open **theme.liquid**
5. Paste the script before `</body>`
6. Save

### Option 4: Any Website Builder

Most website builders (Wix, Squarespace, Webflow) have a "Custom Code" or "Footer Code" section. Paste the script there.

---

## ✅ Testing Your Deployed Widget

### Test on a Simple HTML Page

Create `test.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test My Chatbot</title>
</head>
<body>
  <h1>Test Page</h1>
  <p>Look for the chat button in the bottom-right corner!</p>

  <!-- Your widget script -->
  <script>
    window.CHATBOT_API_URL = 'https://your-project-name.vercel.app';
    window.CHATBOT_TITLE = 'Test Bot';
  </script>
  <script src="https://your-project-name.vercel.app/chatbot.js" async></script>
</body>
</html>
```

Open this file in a browser and you should see the purple chat button!

---

## 🎨 Customization Options

Users can customize the widget by changing these variables:

```html
<script>
  // Required: Your deployed Vercel URL
  window.CHATBOT_API_URL = 'https://your-project-name.vercel.app';

  // Optional: Custom chat title
  window.CHATBOT_TITLE = 'Customer Support';
</script>
```

---

## 🔧 Updating Your Widget

When you make changes to your widget:

```bash
# 1. Make your changes
# 2. Rebuild
npm run build

# 3. Redeploy
vercel deploy --prod
```

All websites using your widget will automatically get the update! (They may need to refresh their browser cache)

---

## 📊 What Gets Deployed

```
your-project.vercel.app/
├── chatbot.js          ← Main widget file (48KB gzipped)
└── api/
    └── chatkit-session ← Backend API endpoint
```

The API endpoint (`/api/chatkit-session`) handles:
- Creating ChatKit sessions
- Managing OpenAI API authentication
- Your API key stays secure (never exposed to client)

---

## 💡 Real-World Example

**You deploy to:** `https://mycompany-chatbot.vercel.app`

**Share this with clients:**
```html
<script>
  window.CHATBOT_API_URL = 'https://mycompany-chatbot.vercel.app';
  window.CHATBOT_TITLE = 'MyCompany Support';
</script>
<script src="https://mycompany-chatbot.vercel.app/chatbot.js" async></script>
```

**They paste it in their website** → Chat button appears → Works perfectly!

---

## 🌐 Alternative: Deploy to Netlify

If you prefer Netlify:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

Then add `OPENAI_API_KEY` in Netlify Dashboard → Site settings → Environment variables

---

## ❓ Troubleshooting

### Widget not appearing?
- Check browser console for errors
- Verify the script URL is correct
- Make sure `OPENAI_API_KEY` is set in Vercel

### Chat not working?
- Verify your OpenAI API key is valid
- Check Vercel Function Logs in dashboard
- Ensure you have OpenAI API credits

### CORS errors?
- The API is configured with CORS enabled for all origins
- Should work on any domain

---

## 🎉 That's It!

Your chatbot is now:
- ✅ Deployed to production
- ✅ Available as a single script
- ✅ Can be embedded ANYWHERE
- ✅ Works like Google Analytics or Intercom

Share the script with anyone and they can add your AI chatbot to their website in 30 seconds!
