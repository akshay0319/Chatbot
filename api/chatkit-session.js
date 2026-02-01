// Serverless function for ChatKit session creation
// Compatible with Vercel and Netlify

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currentClientSecret } = req.body;

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
        user: req.body.deviceId || `user_${Date.now()}`
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
}
