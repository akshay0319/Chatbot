# 🚀 Deploy to Hostinger

## Overview

Hostinger provides **shared hosting** with **Node.js support**. Here's how to deploy your chatbot widget.

---

## 📋 Prerequisites

1. **Hostinger account** with Node.js hosting plan
2. **Domain name** (e.g., `yourdomain.com`)
3. Access to **hPanel** (Hostinger control panel)
4. **FTP/SFTP access** or **File Manager**

---

## 🎯 Deployment Steps

### Step 1: Build the Widget Locally

On your computer:

```bash
npm run build
```

This creates:
- `dist/chatbot.js` - Your widget file (148KB)

---

### Step 2: Upload Files to Hostinger

#### Option A: Using File Manager (Easy)

1. **Login to hPanel**: https://hpanel.hostinger.com
2. Go to **Files** → **File Manager**
3. Navigate to `public_html/` (or your domain folder)
4. Create new folder: `chatbot/`
5. Upload these files:
   ```
   public_html/chatbot/
   ├── chatbot.js          (from dist/chatbot.js)
   └── .htaccess           (create this - see below)
   ```

#### Option B: Using FTP (FileZilla, WinSCP)

1. Get FTP credentials from hPanel → **Files** → **FTP Accounts**
2. Connect with FTP client:
   - Host: `ftp.yourdomain.com`
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21
3. Upload `dist/chatbot.js` to `public_html/chatbot/`

---

### Step 3: Setup Node.js Application (for API)

Hostinger supports Node.js apps! Here's how to set it up:

#### 3.1: Create Node.js App in hPanel

1. **Login to hPanel**
2. Go to **Advanced** → **Node.js**
3. Click **Create Application**
4. Fill in:
   - **Application root**: `/home/u123456789/domains/yourdomain.com/chatbot-api`
   - **Application URL**: `yourdomain.com/api` or `api.yourdomain.com`
   - **Application startup file**: `server.js`
   - **Node.js version**: 18.x or higher
5. Click **Create**

#### 3.2: Upload API Files

Create a folder `chatbot-api/` in your domain root (outside public_html).

Upload these files to `chatbot-api/`:

**server.js**:
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// ChatKit session endpoint
app.post('/api/chatkit-session', async (req, res) => {
  try {
    const { currentClientSecret, deviceId } = req.body;

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API configuration error' });
    }

    const workflowId = 'wf_696bcc7f84e881909b01275d5295ffef01bff0bf888519f7';

    // Try to refresh existing session
    if (currentClientSecret) {
      try {
        const refreshResponse = await fetch('https://api.openai.com/v1/chatkit/sessions/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'chatkit_beta=v1'
          },
          body: JSON.stringify({ client_secret: currentClientSecret })
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          return res.status(200).json({ client_secret: refreshData.client_secret });
        }
      } catch (error) {
        console.log('Refresh failed, creating new session');
      }
    }

    // Create new session
    const sessionResponse = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'chatkit_beta=v1'
      },
      body: JSON.stringify({
        workflow: { id: workflowId },
        user: deviceId || `user_${Date.now()}`
      })
    });

    if (!sessionResponse.ok) {
      return res.status(500).json({ error: 'Failed to create ChatKit session' });
    }

    const sessionData = await sessionResponse.json();
    return res.status(200).json({ client_secret: sessionData.client_secret });

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**package.json**:
```json
{
  "name": "chatbot-api",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1"
  }
}
```

**.env**:
```
OPENAI_API_KEY=sk-proj-your-api-key-here
PORT=3000
```

#### 3.3: Install Dependencies

In hPanel Node.js section:
1. Click on your app
2. Go to **NPM** tab
3. Click **Install** to run `npm install`

#### 3.4: Start the Application

In Node.js section:
1. Make sure **Application Mode** is set to **Production**
2. Click **Start Application**

Your API is now running at: `https://yourdomain.com/api/chatkit-session`

---

### Step 4: Add CORS Headers for Static File

Create `.htaccess` in `public_html/chatbot/`:

```apache
<IfModule mod_headers.c>
    # Enable CORS
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"

    # Enable Gzip compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE application/javascript
    </IfModule>

    # Cache control
    <FilesMatch "\.(js)$">
        Header set Cache-Control "max-age=3600, public"
    </FilesMatch>
</IfModule>
```

---

### Step 5: Test Your Deployment

Your files are now accessible:
- **Widget**: `https://yourdomain.com/chatbot/chatbot.js`
- **API**: `https://yourdomain.com/api/chatkit-session`

Test the API:
```bash
curl https://yourdomain.com/api/chatkit-session -X POST \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"test123"}'
```

---

## 📤 Share Your Widget Script

Now anyone can embed your chatbot with this script:

```html
<script>
  window.CHATBOT_API_URL = 'https://yourdomain.com';
  window.CHATBOT_TITLE = 'Support Chat';
</script>
<script src="https://yourdomain.com/chatbot/chatbot.js" async></script>
```

---

## 🧪 Create Test Page

Upload `test.html` to `public_html/`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Chatbot</title>
</head>
<body>
  <h1>Test Page</h1>
  <p>Look for chat button in bottom-right!</p>

  <script>
    window.CHATBOT_API_URL = 'https://yourdomain.com';
    window.CHATBOT_TITLE = 'Test Assistant';
  </script>
  <script src="https://yourdomain.com/chatbot/chatbot.js" async></script>
</body>
</html>
```

Visit: `https://yourdomain.com/test.html`

---

## 📂 Final File Structure on Hostinger

```
/home/u123456789/domains/yourdomain.com/
├── public_html/
│   ├── chatbot/
│   │   ├── chatbot.js       ← Your widget
│   │   └── .htaccess        ← CORS headers
│   └── test.html            ← Test page
│
└── chatbot-api/             ← Outside public_html (secure)
    ├── server.js
    ├── package.json
    ├── .env                 ← OPENAI_API_KEY (never in public_html!)
    └── node_modules/
```

---

## 🔄 Updating Your Widget

When you make changes:

1. **Build locally**:
   ```bash
   npm run build
   ```

2. **Upload new `chatbot.js`**:
   - Via File Manager: Upload to `public_html/chatbot/`
   - Via FTP: Upload `dist/chatbot.js` to `public_html/chatbot/`

3. **Update API (if needed)**:
   - Upload new `server.js`
   - In hPanel → Node.js → Restart Application

All websites using your script will get the update automatically!

---

## 🎨 Alternative: Use Subdomain

For cleaner URLs, create a subdomain:

1. **hPanel** → **Domains** → **Subdomains**
2. Create: `widget.yourdomain.com`
3. Point to `public_html/chatbot/`

Now share:
```html
<script>
  window.CHATBOT_API_URL = 'https://yourdomain.com';
</script>
<script src="https://widget.yourdomain.com/chatbot.js" async></script>
```

---

## ⚡ Performance Optimization

### Enable Gzip Compression

Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

### Add Cloudflare (Free CDN)

1. Sign up at cloudflare.com
2. Add your domain
3. Update nameservers at Hostinger
4. Your widget will be cached globally for faster loading!

---

## 🔐 Security Best Practices

✅ **Never upload `.env` to `public_html/`** - Keep it in `chatbot-api/`
✅ **Use HTTPS** - Hostinger provides free SSL
✅ **Keep Node.js updated** - Check hPanel for updates
✅ **Monitor API logs** - Check Node.js logs in hPanel

---

## ❓ Troubleshooting

### Widget not loading?
1. Check file is accessible: Visit `https://yourdomain.com/chatbot/chatbot.js` in browser
2. Check CORS headers: Use browser DevTools → Network tab
3. Verify `.htaccess` is uploaded

### API not working?
1. Check Node.js app status in hPanel
2. View logs: hPanel → Node.js → View Logs
3. Test API directly: `curl https://yourdomain.com/api/chatkit-session -X POST`
4. Verify `OPENAI_API_KEY` in `.env`

### 404 errors?
- Make sure files are in correct folders
- Check capitalization (Linux is case-sensitive!)
- Verify application URL matches in Node.js settings

### CORS errors?
- Make sure `.htaccess` is in the same folder as `chatbot.js`
- Clear browser cache
- Check CORS headers: `curl -I https://yourdomain.com/chatbot/chatbot.js`

---

## 💰 Hostinger Plans That Support Node.js

- **Premium** and above plans support Node.js
- Check your plan: hPanel → Dashboard → Plan details
- Upgrade if needed: hPanel → Billing → Upgrade

---

## 🎉 You're Done!

Your chatbot is now live on Hostinger!

**Share this script with anyone:**
```html
<script>
  window.CHATBOT_API_URL = 'https://yourdomain.com';
</script>
<script src="https://yourdomain.com/chatbot/chatbot.js" async></script>
```

They paste it → Purple chat button appears → AI chatbot works! 🚀

---

## 📞 Need Help?

- **Hostinger Support**: Live chat in hPanel
- **Node.js Docs**: Check Hostinger Knowledge Base → Node.js
- **SSL Issues**: Use Hostinger's free SSL certificate tool in hPanel
