const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all origins (required for embeddable widget)
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ChatKit session endpoint
app.post('/api/chatkit-session', async (req, res) => {
  try {
    const { currentClientSecret, deviceId } = req.body;

    // Validate API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured in environment variables');
      return res.status(500).json({ error: 'API configuration error' });
    }

    // Workflow ID for ChatKit
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
          console.log('Session refreshed successfully');
          return res.status(200).json({
            client_secret: refreshData.client_secret
          });
        }
      } catch (error) {
        console.log('Session refresh failed, creating new session:', error.message);
      }
    }

    // Create new ChatKit session
    console.log('Creating new ChatKit session for device:', deviceId);
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
        return res.status(500).json({ error: 'API authentication failed. Check your OpenAI API key.' });
      }
      if (sessionResponse.status === 429) {
        return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
      }

      return res.status(500).json({ error: 'Failed to create ChatKit session' });
    }

    const sessionData = await sessionResponse.json();
    console.log('ChatKit session created successfully');

    // Return client secret
    return res.status(200).json({
      client_secret: sessionData.client_secret
    });

  } catch (error) {
    console.error('Error in ChatKit session handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 Chatbot API server started');
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🔧 API endpoint: http://localhost:${PORT}/api/chatkit-session`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('✅ Ready to handle ChatKit session requests!');
});
