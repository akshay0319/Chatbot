# 🚀 Deploy to Your Own Server

## Overview

Your chatbot widget consists of:
1. **Static file**: `dist/chatbot.js` (the widget)
2. **API endpoint**: `api/chatkit-session.js` (backend for OpenAI)

You can deploy this on ANY server: VPS, shared hosting, cloud, etc.

---

## 📦 What You Need on Your Server

- **Node.js** (v18 or higher) - for the API endpoint
- **Web server** (Nginx, Apache, or just Node.js)
- **HTTPS** (recommended for production)

---

## 🎯 Deployment Steps

### Step 1: Build the Widget

On your local machine:

```bash
npm run build
```

This creates:
- `dist/chatbot.js` - The widget file
- `api/chatkit-session.js` - The backend API

### Step 2: Upload to Your Server

Upload these files to your server:

```
your-server.com/
├── chatbot.js              ← dist/chatbot.js
├── api/
│   └── chatkit-session.js  ← api/chatkit-session.js
├── server.js               ← Production server (create this - see below)
├── package.json
├── .env                    ← Your OPENAI_API_KEY
└── node_modules/           ← Run npm install on server
```

**Upload via:**
- FTP/SFTP (FileZilla, WinSCP)
- SSH: `scp -r dist/ user@your-server.com:/path/`
- Git: Push to repo and pull on server

---

## 🔧 Option 1: Simple Node.js Server (Recommended)

### Create Production Server

Create `server.js` on your server:

```javascript
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (widget needs this)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files (chatbot.js)
app.use(express.static('dist'));

// API endpoint for ChatKit sessions
app.post('/api/chatkit-session', async (req, res) => {
  try {
    const { currentClientSecret, deviceId } = req.body;

    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Workflow ID
    const workflowId = 'wf_696bcc7f84e881909b01275d5295ffef01bff0bf888519f7';

    // If there's a current client secret, try to refresh the session
    if (currentClientSecret) {
      try {
        const refreshResponse = await fetch('https://api.openai.com/v1/chatkit/sessions/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'chatkit_beta=v1'
          },
          body: JSON.stringify({
            client_secret: currentClientSecret
          })
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          return res.status(200).json({
            client_secret: refreshData.client_secret
          });
        }
      } catch (error) {
        console.log('Session refresh failed, creating new session:', error.message);
      }
    }

    // Create new ChatKit session
    const sessionResponse = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'chatkit_beta=v1'
      },
      body: JSON.stringify({
        workflow: {
          id: workflowId
        },
        user: deviceId || `user_${Date.now()}`
      })
    });

    if (!sessionResponse.ok) {
      const errorData = await sessionResponse.json().catch(() => ({}));
      console.error('ChatKit API error:', errorData);

      if (sessionResponse.status === 401) {
        return res.status(500).json({ error: 'API authentication failed' });
      }
      if (sessionResponse.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      }

      return res.status(500).json({ error: 'Failed to create ChatKit session' });
    }

    const sessionData = await sessionResponse.json();

    // Return client secret
    return res.status(200).json({
      client_secret: sessionData.client_secret
    });

  } catch (error) {
    console.error('Error in ChatKit session handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Chatbot server running on port ${PORT}`);
  console.log(`📡 Widget URL: http://localhost:${PORT}/chatbot.js`);
  console.log(`🔧 API endpoint: http://localhost:${PORT}/api/chatkit-session`);
});
```

### Install Dependencies on Server

```bash
npm install express cors dotenv
```

### Create .env File

```bash
OPENAI_API_KEY=sk-proj-your-api-key-here
PORT=3000
```

### Start the Server

```bash
# Option 1: Direct
node server.js

# Option 2: With PM2 (keeps running forever)
npm install -g pm2
pm2 start server.js --name chatbot-widget
pm2 save
pm2 startup
```

**Your widget is now available at:**
- Widget: `http://your-server.com:3000/chatbot.js`
- API: `http://your-server.com:3000/api/chatkit-session`

---

## 🔧 Option 2: Nginx + Node.js (Production)

### 1. Run Node.js Server (as above)

```bash
pm2 start server.js --name chatbot-widget
```

### 2. Configure Nginx as Reverse Proxy

Create `/etc/nginx/sites-available/chatbot`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Serve static files directly
    location /chatbot.js {
        root /path/to/your/project/dist;
        add_header Access-Control-Allow-Origin *;
        add_header Cache-Control "public, max-age=3600";
    }

    # Proxy API requests to Node.js
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods 'GET, POST, OPTIONS';
        add_header Access-Control-Allow-Headers 'Content-Type';
    }
}
```

Enable the site:
```bash
ln -s /etc/nginx/sites-available/chatbot /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 3. Add HTTPS with Let's Encrypt (Free SSL)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**Now available at:**
- `https://your-domain.com/chatbot.js`
- `https://your-domain.com/api/chatkit-session`

---

## 🔧 Option 3: Apache + Node.js

### 1. Run Node.js Server

```bash
pm2 start server.js --name chatbot-widget
```

### 2. Configure Apache

Enable required modules:
```bash
a2enmod proxy
a2enmod proxy_http
a2enmod headers
systemctl restart apache2
```

Create `/etc/apache2/sites-available/chatbot.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com

    # Serve static file
    DocumentRoot /path/to/your/project/dist

    <Directory /path/to/your/project/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride None
        Require all granted

        # CORS headers
        Header set Access-Control-Allow-Origin "*"
    </Directory>

    # Proxy API to Node.js
    ProxyPass /api/ http://localhost:3000/api/
    ProxyPassReverse /api/ http://localhost:3000/api/

    # CORS for API
    <Location /api/>
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
        Header set Access-Control-Allow-Headers "Content-Type"
    </Location>
</VirtualHost>
```

Enable:
```bash
a2ensite chatbot
systemctl restart apache2
```

---

## 🔧 Option 4: Shared Hosting (cPanel, etc.)

If you have shared hosting with Node.js support:

### 1. Upload Files via FTP

Upload to public_html:
```
public_html/
├── chatbot/
│   ├── chatbot.js      (from dist/)
│   └── index.html      (test page)
```

### 2. Setup Node.js App (cPanel)

1. Go to cPanel → Setup Node.js App
2. Create new application:
   - Node.js version: 18.x
   - Application root: `/home/user/chatbot-api`
   - Application URL: `api.your-domain.com` or `/api`
3. Upload `server.js` and `package.json`
4. Install dependencies
5. Start application

### 3. Add .htaccess for CORS

In `public_html/chatbot/.htaccess`:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type"
</IfModule>
```

---

## 📤 Share Your Widget

Once deployed, share this script:

```html
<script>
  window.CHATBOT_API_URL = 'https://your-domain.com';
  window.CHATBOT_TITLE = 'Support Chat';
</script>
<script src="https://your-domain.com/chatbot.js" async></script>
```

---

## 🧪 Test Your Deployment

Create `test.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test Chatbot Widget</title>
</head>
<body>
  <h1>Test Page</h1>
  <p>Look for chat button in bottom-right!</p>

  <script>
    window.CHATBOT_API_URL = 'https://your-domain.com';
    window.CHATBOT_TITLE = 'Test Bot';
  </script>
  <script src="https://your-domain.com/chatbot.js" async></script>
</body>
</html>
```

---

## 📊 File Structure on Server

```
/var/www/chatbot/          (or your server path)
├── dist/
│   └── chatbot.js         ← Built widget (148KB)
├── node_modules/          ← Dependencies
├── server.js              ← Production server
├── package.json
├── .env                   ← OPENAI_API_KEY
└── pm2.config.js          ← Optional: PM2 config
```

---

## 🔐 Security Checklist

✅ Add `.env` to `.gitignore`
✅ Never expose `OPENAI_API_KEY` to client
✅ Use HTTPS in production
✅ Set up firewall rules
✅ Keep Node.js updated
✅ Use PM2 or systemd to auto-restart on crash

---

## 🔄 Updating Your Widget

When you make changes:

```bash
# Local machine
npm run build

# Upload new chatbot.js to server
scp dist/chatbot.js user@your-server.com:/var/www/chatbot/dist/

# If you changed API code, restart server
ssh user@your-server.com "pm2 restart chatbot-widget"
```

All websites using your widget will automatically get updates!

---

## ⚡ Performance Tips

1. **Enable Gzip** in Nginx/Apache:
```nginx
gzip on;
gzip_types application/javascript;
```

2. **Add Caching Headers**:
```nginx
location /chatbot.js {
    expires 1h;
    add_header Cache-Control "public, max-age=3600";
}
```

3. **Use CDN** (optional):
Upload `chatbot.js` to Cloudflare CDN for faster global delivery.

---

## ❓ Troubleshooting

### Widget not loading?
- Check CORS headers are set
- Verify chatbot.js is accessible: `curl https://your-domain.com/chatbot.js`
- Check browser console for errors

### API errors?
- Check Node.js server is running: `pm2 status`
- Check logs: `pm2 logs chatbot-widget`
- Verify OPENAI_API_KEY in .env

### Port already in use?
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>

# Or use different port in .env
PORT=8080
```

---

## 🎉 Done!

Your chatbot widget is now deployed on YOUR server!

**Share this with anyone:**
```html
<script>
  window.CHATBOT_API_URL = 'https://your-domain.com';
</script>
<script src="https://your-domain.com/chatbot.js" async></script>
```

They paste it → Chat button appears → Connected to your AI! 🚀
