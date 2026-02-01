// Simple development server to handle API requests
// Run this alongside `npm run dev` for local testing

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ChatKit session endpoint
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

      return res.status(500).json({ error: 'Failed to create ChatKit session', details: errorData });
    }

    const sessionData = await sessionResponse.json();

    // Return client secret
    return res.status(200).json({
      client_secret: sessionData.client_secret
    });

  } catch (error) {
    console.error('Error in ChatKit session handler:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🚀 Dev API server running on http://localhost:${PORT}`);
  console.log(`📡 ChatKit session endpoint: http://localhost:${PORT}/api/chatkit-session\n`);
  console.log('Make sure to also run: npm run dev\n');
});
