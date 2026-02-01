# ChatKit Embeddable Widget

A production-ready, standalone embeddable chatbot widget powered by OpenAI's ChatKit. Can be embedded in ANY website with a single `<script>` tag - similar to Google Analytics, Intercom, or Drift.

## ✨ Features

- **Single File Embed**: Just one `<script>` tag
- **No Iframe**: Direct DOM injection using Shadow DOM
- **CSS Isolation**: No style conflicts with host website
- **Lightweight**: 140KB gzipped (includes React + ChatKit)
- **Mobile Responsive**: Works on all devices
- **Session Persistence**: Conversations persist across page reloads
- **Easy Deployment**: Deploy to Vercel/Netlify in minutes
- **Modern Browsers**: Chrome, Firefox, Safari, Edge

## 🚀 Quick Start

### 1. Build the Widget

```bash
npm install
npm run build
```

This creates:
- `dist/chatbot.js` - Standalone widget file (140KB gzipped)
- `dist/api/` - Backend API functions

### 2. Deploy to Vercel

```bash
npm install -g vercel
vercel login
vercel deploy --prod
```

Your widget will be available at: `https://your-project.vercel.app/chatbot.js`

### 3. Embed on Any Website

Add these two lines before closing `</body>` tag:

```html
<script>
  window.CHATBOT_API_URL = 'https://your-project.vercel.app';
  window.CHATBOT_TITLE = 'Support Chat'; // Optional
</script>
<script src="https://your-project.vercel.app/chatbot.js" async></script>
```

That's it! The chat widget will appear in the bottom-right corner.

## 📦 What's Included

```
chatbot-widget/
├── dist/
│   ├── chatbot.js          # Standalone widget bundle
│   └── api/                # Backend serverless functions
│       └── chatkit-session.js
├── src/
│   └── widget-entry.jsx    # Widget source code
├── api/
│   └── chatkit-session.js  # Serverless function (Vercel/Netlify)
├── dev-server.js           # Local development API server
├── index.html              # Demo e-commerce page
├── test-embed.html         # Test embedding page
├── .env                    # Environment variables
└── README.md
```

## 🛠️ Development

### Local Development

1. **Start API Server** (Terminal 1):
```bash
npm run dev:api
```

2. **Start Vite Dev Server** (Terminal 2):
```bash
npm run dev
```

3. **Open Demo Page**:
```
http://localhost:5173/
```

### Test the Built Widget Locally

1. **Build the widget**:
```bash
npm run build
```

2. **Serve the dist folder**:
```bash
npx serve dist -l 8080
```

3. **Open test page**:
```
http://localhost:5173/test-embed.html
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file:

```bash
OPENAI_API_KEY=sk-proj-your-api-key-here
```

### Widget Configuration Options

```html
<script>
  // Required: Your deployed widget URL
  window.CHATBOT_API_URL = 'https://your-project.vercel.app';

  // Optional: Custom title
  window.CHATBOT_TITLE = 'Support Chat';
</script>
```

### Workflow ID

The widget connects to this OpenAI agent workflow:
```
wf_696bcc7f84e881909b01275d5295ffef01bff0bf888519f7
```

To change it, edit `src/widget-entry.jsx` line 13:
```javascript
workflowId: 'your-workflow-id-here'
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy**:
```bash
vercel deploy --prod
```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Add `OPENAI_API_KEY` environment variable
   - Redeploy if needed

### Deploy to Netlify

1. **Install Netlify CLI**:
```bash
npm install -g netlify-cli
```

2. **Login to Netlify**:
```bash
netlify login
```

3. **Deploy**:
```bash
netlify deploy --prod
```

4. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site settings > Environment variables
   - Add `OPENAI_API_KEY`

### Custom Server

If deploying to a custom server:

1. **Build the widget**:
```bash
npm run build
```

2. **Upload `dist/` folder to your server**

3. **Set up API endpoint**:
   - Use `api/chatkit-session.js` as serverless function
   - Or run `dev-server.js` with Node.js/Express
   - Ensure CORS is enabled for all origins

4. **Serve files**:
   - `chatbot.js` - Main widget file
   - `/api/chatkit-session` - API endpoint

## 📝 How It Works

### Architecture

```
External Website
    └─> <script src="yourserver.com/chatbot.js">
        └─> Widget loads (140KB gzipped)
        └─> Creates chat button in Shadow DOM
        └─> User clicks button
        └─> ChatKit loads in Shadow DOM (no iframe!)
        └─> Calls /api/chatkit-session for auth
        └─> Connects to OpenAI workflow
        └─> User chats with AI agent
```

### Session Flow

1. Widget requests client secret from `/api/chatkit-session`
2. Backend creates ChatKit session with OpenAI
3. Backend returns client_secret
4. Widget uses client_secret to authenticate ChatKit
5. ChatKit connects to your agent workflow
6. User messages → Workflow → AI responses

### Shadow DOM Isolation

The widget uses Shadow DOM to prevent CSS conflicts:
- Widget styles don't affect host page
- Host page styles don't affect widget
- Complete isolation for buttons and chat interface

## 🧪 Testing

### Test on Multiple Sites

The widget works on any website. Test it on:

**Plain HTML site**:
```html
<!DOCTYPE html>
<html>
<body>
  <h1>My Website</h1>
  <script>window.CHATBOT_API_URL = 'https://your-url.vercel.app';</script>
  <script src="https://your-url.vercel.app/chatbot.js" async></script>
</body>
</html>
```

**WordPress**: Add to footer.php or use a plugin

**React site**: Add scripts to index.html

**Any CMS**: Add to template footer

### Verify Functionality

✅ Chat button appears in bottom-right corner
✅ Click opens ChatKit (no iframe, direct DOM)
✅ Can send messages and get AI responses
✅ Close button (X) works
✅ No CSS conflicts with host page
✅ Mobile responsive
✅ Sessions persist across page reloads

## 📊 Bundle Size

- **Uncompressed**: 452KB
- **Gzipped**: 140KB
- **Includes**: React + ReactDOM + ChatKit + Widget code

## 🔒 Security

- API key never exposed to client
- ChatKit handles authentication securely
- CORS properly configured
- Shadow DOM prevents XSS attacks
- HTTPS required for production

## 🎨 Customization

### Change Button Position

Currently fixed at bottom-right. To customize, edit `src/widget-entry.jsx`:

```javascript
// Line 36
buttonContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999;';
```

### Change Colors

Edit the gradient in `src/widget-entry.jsx`:

```javascript
// Line 47
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

After changes, rebuild:
```bash
npm run build
```

## 🐛 Troubleshooting

### Widget Not Appearing

- Check browser console for errors
- Verify script URL is correct
- Ensure CHATBOT_API_URL is set
- Check network tab for 404 errors

### Chat Not Opening

- Verify ChatKit script loaded (check Network tab)
- Check if `@openai/chatkit-react` is installed
- Look for errors in browser console

### API Errors

- Verify `OPENAI_API_KEY` is set correctly in environment
- Check OpenAI API quota and billing
- Review serverless function logs in Vercel/Netlify dashboard
- Ensure workflow ID is valid

### Build Errors

If build fails:
```bash
# Clean and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## 📚 Resources

- [OpenAI ChatKit Documentation](https://platform.openai.com/docs/guides/chatkit)
- [Agent Builder Guide](https://platform.openai.com/docs/guides/agent-builder)
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Netlify Deployment Docs](https://docs.netlify.com/)

## 💡 Use Cases

- **E-commerce**: Product recommendations, order support
- **SaaS**: Customer support, onboarding help
- **Documentation**: Interactive help assistant
- **Real Estate**: Property search assistant
- **Education**: Tutoring and Q&A bot
- **Healthcare**: Appointment scheduling, FAQs

## 🤝 Support

For issues:
1. Check troubleshooting section above
2. Review ChatKit documentation
3. Check Vercel/Netlify logs for API errors

## 📄 License

MIT

---

**Built with React, Vite, and OpenAI ChatKit**
