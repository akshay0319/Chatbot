import React from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';
import './styles.css';

const ChatApp = () => {
  const { control } = useChatKit({
    api: {
      async getClientSecret(existing) {
        try {
          // Determine API URL based on environment
          const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:5173/api/chatkit-session'
            : '/api/chatkit-session';

          // Generate or retrieve device ID for user identification
          let deviceId = localStorage.getItem('chatbot_device_id');
          if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot_device_id', deviceId);
          }

          // Request client secret from our backend
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentClientSecret: existing,
              deviceId
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Failed to create ChatKit session');
          }

          const data = await response.json();
          return data.client_secret;
        } catch (error) {
          console.error('Error getting client secret:', error);
          throw error;
        }
      },
    },
  });

  return (
    <div className="chatkit-container">
      <ChatKit
        control={control}
        className="chatkit-widget"
      />
    </div>
  );
};

export default ChatApp;
