# ⚡ Hostinger Quick Deployment Checklist

## 📋 Before You Start

- ✅ Hostinger account with Premium plan or higher (Node.js support required)
- ✅ Domain name connected
- ✅ OpenAI API key ready

---

## 🚀 Step-by-Step (15 Minutes)

### Step 1: Build Widget (Local Machine)

```bash
npm run build
```

You'll get: `dist/chatbot.js` (148KB)

---

### Step 2: Upload Widget File to Hostinger

**Method 1: File Manager**
1. Login to hPanel: https://hpanel.hostinger.com
2. Go to **Files** → **File Manager**
3. Navigate to `public_html/`
4. Create folder: `chatbot/`
5. Upload `dist/chatbot.js` → rename to just `chatbot.js`
6. Upload `.htaccess` (from project root)

**Method 2: FTP**
1. Use FileZilla or WinSCP
2. Connect to: `ftp.yourdomain.com`
3. Upload to: `public_html/chatbot/`

Your widget is now at: `https://yourdomain.com/chatbot/chatbot.js` ✅

---

### Step 3: Setup Node.js API

#### 3.1: Create Node.js App

1. hPanel → **Advanced** → **Node.js**
2. Click **Create Application**
3. Fill in:
   - **Node.js version**: 18.x
   - **Application root**: `/domains/yourdomain.com/chatbot-api`
   - **Application URL**: Select your domain → type `/api`
   - **Application startup file**: `server.js`
4. Click **Create**

#### 3.2: Upload API Files

Using File Manager or FTP, create folder `chatbot-api/` (same level as `public_html/`):

Upload these 3 files:
1. **`server.js`** (from your project)
2. **`production-package.json`** → rename to `package.json`
3. **`.env`** with content:
   ```
   OPENAI_API_KEY=sk-proj-your-actual-api-key-here
   PORT=3000
   ```

#### 3.3: Install Dependencies

1. hPanel → Node.js → Click your app
2. Click **NPM** tab
3. Click **Install** button
4. Wait for installation to complete

#### 3.4: Start Application

1. Make sure **Application Mode** = **Production**
2. Click **Start Application**
3. Status should show "Running" ✅

Your API is now at: `https://yourdomain.com/api/chatkit-session` ✅

---

### Step 4: Test It!

#### Test Widget File
Visit in browser: `https://yourdomain.com/chatbot/chatbot.js`

You should see JavaScript code (not a 404).

#### Test API
```bash
curl -X POST https://yourdomain.com/api/chatkit-session \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test123"}'
```

Should return: `{"client_secret":"..."}`

#### Test Full Integration

Create `test.html` in `public_html/`:

```html
<!DOCTYPE html>
<html>
<head><title>Test</title></head>
<body>
  <h1>Look for chat button!</h1>

  <script>
    window.CHATBOT_API_URL = 'https://yourdomain.com';
    window.CHATBOT_TITLE = 'Test Bot';
  </script>
  <script src="https://yourdomain.com/chatbot/chatbot.js" async></script>
</body>
</html>
```

Visit: `https://yourdomain.com/test.html`

Purple chat button should appear in bottom-right! 🎉

---

## 📤 Share Your Widget

Give this script to anyone:

```html
<script>
  window.CHATBOT_API_URL = 'https://yourdomain.com';
  window.CHATBOT_TITLE = 'Support Chat';
</script>
<script src="https://yourdomain.com/chatbot/chatbot.js" async></script>
```

They paste it before `</body>` → Done! ✅

---

## 📁 Final File Structure

```
/domains/yourdomain.com/
├── public_html/
│   ├── chatbot/
│   │   ├── chatbot.js      ← Your widget
│   │   └── .htaccess       ← CORS settings
│   └── test.html           ← Test page
│
└── chatbot-api/            ← OUTSIDE public_html (secure!)
    ├── server.js
    ├── package.json
    ├── .env                ← API key here!
    └── node_modules/
```

---

## ❓ Troubleshooting

### Widget not loading?
- Check URL: `https://yourdomain.com/chatbot/chatbot.js` should show JavaScript
- Check `.htaccess` is uploaded
- Clear browser cache

### API errors?
- Check Node.js app is "Running" in hPanel
- View logs: hPanel → Node.js → View Logs
- Verify `OPENAI_API_KEY` in `.env`
- Test health: `curl https://yourdomain.com/api/health`

### Chat button not appearing?
- Open browser DevTools → Console
- Look for errors
- Verify `window.CHATBOT_API_URL` is set correctly

### "CORS error"?
- Upload `.htaccess` to `public_html/chatbot/`
- Make sure it has CORS headers

---

## 🔄 Updating

### Update Widget:
1. Build: `npm run build`
2. Upload new `dist/chatbot.js` to `public_html/chatbot/`
3. Done! All sites get update automatically.

### Update API:
1. Upload new `server.js`
2. hPanel → Node.js → Restart Application

---

## 💰 Hostinger Plans

**Need Node.js?** → Premium plan or higher

Check your plan: hPanel → Dashboard → Subscription

Upgrade: hPanel → Billing → Upgrade Plan

---

## 🎉 Done!

Your chatbot is live on Hostinger!

**URLs:**
- Widget: `https://yourdomain.com/chatbot/chatbot.js`
- API: `https://yourdomain.com/api/chatkit-session`
- Test page: `https://yourdomain.com/test.html`

**Share with anyone:**
```html
<script>
  window.CHATBOT_API_URL = 'https://yourdomain.com';
</script>
<script src="https://yourdomain.com/chatbot/chatbot.js" async></script>
```

---

## 📚 Files You Need to Upload

From your project:

**To `public_html/chatbot/`:**
- ✅ `dist/chatbot.js` → rename to `chatbot.js`
- ✅ `.htaccess`

**To `chatbot-api/` (outside public_html):**
- ✅ `server.js`
- ✅ `production-package.json` → rename to `package.json`
- ✅ `.env` (create with your API key)

That's it! 🚀
