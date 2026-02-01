#!/bin/bash

# Prepare Hostinger Deployment Package

echo "🚀 Preparing Hostinger Deployment Package..."
echo ""

# Create deployment folder
rm -rf hostinger-deploy
mkdir -p hostinger-deploy/widget
mkdir -p hostinger-deploy/api

# Build the widget
echo "📦 Building widget..."
npm run build

# Copy widget files
echo "📋 Copying widget files..."
cp dist/chatbot.js hostinger-deploy/widget/
cp .htaccess hostinger-deploy/widget/

# Copy API files
echo "📋 Copying API files..."
cp server.js hostinger-deploy/api/
cp production-package.json hostinger-deploy/api/package.json

# Create .env template
echo "📋 Creating .env template..."
cat > hostinger-deploy/api/.env << 'EOF'
OPENAI_API_KEY=sk-proj-your-api-key-here
PORT=3000
EOF

# Create README
echo "📋 Creating deployment instructions..."
cat > hostinger-deploy/README.txt << 'EOF'
HOSTINGER DEPLOYMENT FILES
==========================

📁 FOLDER STRUCTURE:

hostinger-deploy/
├── widget/                 → Upload to public_html/chatbot/
│   ├── chatbot.js
│   └── .htaccess
│
└── api/                    → Upload to chatbot-api/ (outside public_html)
    ├── server.js
    ├── package.json
    └── .env                → ADD YOUR OPENAI_API_KEY HERE!


📤 DEPLOYMENT STEPS:

1. WIDGET FILES (public_html/chatbot/):
   - Upload everything from widget/ folder
   - Path: public_html/chatbot/

2. API FILES (chatbot-api/):
   - Upload everything from api/ folder
   - Path: /domains/yourdomain.com/chatbot-api/
   - ⚠️  EDIT .env and add your real OpenAI API key!

3. SETUP NODE.JS APP (hPanel):
   - Go to: Advanced → Node.js
   - Create Application:
     * Application root: /domains/yourdomain.com/chatbot-api
     * Application URL: yourdomain.com/api
     * Startup file: server.js
     * Node.js version: 18.x
   - Install dependencies (NPM tab)
   - Start application


🔗 YOUR WIDGET SCRIPT:

<script>
  window.CHATBOT_API_URL = 'https://yourdomain.com';
  window.CHATBOT_TITLE = 'Support Chat';
</script>
<script src="https://yourdomain.com/chatbot/chatbot.js" async></script>


📖 Full Guide: See HOSTINGER-QUICK-START.md
EOF

# Create test page
cat > hostinger-deploy/test.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Test Chatbot Widget</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
    .info {
      background: #e7f3ff;
      border-left: 4px solid #2196F3;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>🧪 Chatbot Widget Test Page</h1>

  <div class="info">
    <strong>👉 Look at the bottom-right corner!</strong><br>
    You should see a purple chat button.<br>
    Click it to test the chatbot.
  </div>

  <h2>Instructions:</h2>
  <ol>
    <li>Upload this file to public_html/</li>
    <li>Replace <code>yourdomain.com</code> below with your actual domain</li>
    <li>Visit: https://yourdomain.com/test.html</li>
  </ol>

  <!-- ⚠️ REPLACE yourdomain.com WITH YOUR ACTUAL DOMAIN -->
  <script>
    window.CHATBOT_API_URL = 'https://yourdomain.com';
    window.CHATBOT_TITLE = 'Test Assistant';
  </script>
  <script src="https://yourdomain.com/chatbot/chatbot.js" async></script>
</body>
</html>
EOF

echo ""
echo "✅ Deployment package created successfully!"
echo ""
echo "📁 Location: hostinger-deploy/"
echo ""
echo "📂 Contents:"
echo "   ├── widget/            → Upload to public_html/chatbot/"
echo "   ├── api/               → Upload to chatbot-api/"
echo "   ├── test.html          → Upload to public_html/"
echo "   └── README.txt         → Read deployment instructions"
echo ""
echo "📖 Next steps:"
echo "   1. Open hostinger-deploy/api/.env"
echo "   2. Add your OpenAI API key"
echo "   3. Upload files to Hostinger"
echo "   4. Read HOSTINGER-QUICK-START.md for full instructions"
echo ""
echo "🎉 Ready to deploy!"
