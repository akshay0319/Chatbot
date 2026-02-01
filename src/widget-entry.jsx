import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

// Widget initialization function - Self-contained embeddable chatbot
(function initChatbotWidget() {
  'use strict';

  // Configuration from host page
  const CONFIG = {
    apiUrl: window.CHATBOT_API_URL || window.location.origin,
    title: window.CHATBOT_TITLE || 'Chat Assistant',
    workflowId: 'wf_696bcc7f84e881909b01275d5295ffef01bff0bf888519f7'
  };

  // Prevent double initialization
  if (window.__CHATBOT_WIDGET_LOADED__) {
    console.warn('Chatbot widget already loaded');
    return;
  }
  window.__CHATBOT_WIDGET_LOADED__ = true;

  // Wait for DOM ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidget);
    } else {
      createWidget();
    }
  }

  // Create widget components
  function createWidget() {
    // Create root containers
    const buttonContainer = document.createElement('div');
    buttonContainer.id = 'chatbot-widget-button-root';
    buttonContainer.style.cssText = 'position: fixed; bottom: 20px; right: 20px; z-index: 999999;';

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chatbot-widget-chat-root';
    chatContainer.style.cssText = `
      position: fixed;
      bottom: 90px;
      right: 20px;
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      z-index: 999998;
      display: none;
    `;

    // Append to body
    document.body.appendChild(buttonContainer);
    document.body.appendChild(chatContainer);

    // Create Shadow DOMs for isolation
    const buttonShadow = buttonContainer.attachShadow({ mode: 'open' });
    const chatShadow = chatContainer.attachShadow({ mode: 'open' });

    // Add button styles to shadow DOM
    const buttonStyles = document.createElement('style');
    buttonStyles.textContent = `
      .chatbot-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border: none;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .chatbot-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
      }
      .chatbot-button svg {
        width: 24px;
        height: 24px;
      }
    `;

    // Add chat styles to shadow DOM
    const chatStyles = document.createElement('style');
    chatStyles.textContent = `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      .chatbot-container {
        width: 100%;
        height: 100%;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        background: white;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      .chatbot-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .chatbot-header h3 {
        font-size: 18px;
        font-weight: 600;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      .chatbot-close {
        background: rgba(255,255,255,0.2);
        border: none;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
      }
      .chatbot-close:hover {
        background: rgba(255,255,255,0.3);
      }
      .chatbot-close svg {
        width: 16px;
        height: 16px;
      }
      .chatbot-content {
        flex: 1;
        overflow: hidden;
        position: relative;
      }
      .starter-prompts-container {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: calc(100% - 40px);
        max-width: 340px;
        background: white;
        z-index: 1000;
        animation: fadeIn 0.4s ease-out;
      }
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translate(-50%, -45%);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%);
        }
      }
      .starter-prompts-welcome {
        text-align: center;
        margin-bottom: 20px;
      }
      .starter-prompts-welcome h4 {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
      .starter-prompts-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 12px;
      }
      .starter-prompt-btn {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: #f8f9fa;
        border: 2px solid #e9ecef;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        font-size: 15px;
        color: #495057;
        text-align: left;
        width: 100%;
      }
      .starter-prompt-btn:hover {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-color: #667eea;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
      }
      .starter-prompt-icon {
        font-size: 24px;
        flex-shrink: 0;
      }
      .starter-prompt-text {
        flex: 1;
        font-weight: 500;
      }
      @media (max-width: 768px) {
        .chatbot-container {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
        }
        .starter-prompts-container {
          width: calc(100% - 30px);
        }
        .starter-prompt-btn {
          padding: 14px;
          font-size: 14px;
        }
      }
    `;

    buttonShadow.appendChild(buttonStyles);
    chatShadow.appendChild(chatStyles);

    // Create button element
    const buttonDiv = document.createElement('div');
    buttonShadow.appendChild(buttonDiv);

    // Create chat container element
    const chatDiv = document.createElement('div');
    chatDiv.className = 'chatbot-container';
    chatShadow.appendChild(chatDiv);

    // Render button with React
    const buttonRoot = createRoot(buttonDiv);
    buttonRoot.render(<ChatButton onToggle={() => toggleChat(chatContainer)} />);

    // Render chat with React (lazy)
    let chatRoot = null;
    let isOpen = false;

    function toggleChat(container) {
      isOpen = !isOpen;
      container.style.display = isOpen ? 'block' : 'none';

      if (isOpen && !chatRoot) {
        // Lazy load chat on first open
        chatRoot = createRoot(chatDiv);
        chatRoot.render(<ChatWidget config={CONFIG} onClose={() => toggleChat(container)} />);
      }
    }

    // Add mobile responsiveness
    const mobileStyles = document.createElement('style');
    mobileStyles.textContent = `
      @media (max-width: 480px) {
        #chatbot-widget-button-root {
          bottom: 16px !important;
          right: 16px !important;
        }
        #chatbot-widget-chat-root {
          bottom: 80px !important;
          right: 16px !important;
        }
      }
    `;
    document.head.appendChild(mobileStyles);
  }

  // Chat Button Component
  function ChatButton({ onToggle }) {
    return (
      <button className="chatbot-button" onClick={onToggle} aria-label="Open chat">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
          <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="white"/>
        </svg>
      </button>
    );
  }

  // Starter Prompts Component
  function StarterPrompts({ onSelect }) {
    const prompts = [
      { text: 'What products do you sell?', icon: '🛍️' },
      { text: 'How can I place an order?', icon: '🛒' },
      { text: 'Where is my order?', icon: '📦' },
      { text: 'How can I contact support?', icon: '💬' }
    ];

    return (
      <div className="starter-prompts-container">
        <div className="starter-prompts-welcome">
          <h4>👋 Welcome! How can I help you today?</h4>
        </div>
        <div className="starter-prompts-grid">
          {prompts.map((prompt, index) => (
            <button
              key={index}
              className="starter-prompt-btn"
              onClick={() => onSelect(prompt.text)}
            >
              <span className="starter-prompt-icon">{prompt.icon}</span>
              <span className="starter-prompt-text">{prompt.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat Widget Component
  function ChatWidget({ config, onClose }) {
    const [showStarters, setShowStarters] = useState(true);
    const [isReady, setIsReady] = useState(false);

    const { control } = useChatKit({
      api: {
        async getClientSecret(existing) {
          try {
            // Device ID management
            let deviceId = localStorage.getItem('chatbot_device_id');
            if (!deviceId) {
              deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
              localStorage.setItem('chatbot_device_id', deviceId);
            }

            // Call backend API
            const response = await fetch(`${config.apiUrl}/api/chatkit-session`, {
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

    // Wait for control to be ready
    useEffect(() => {
      if (control) {
        setIsReady(true);
      }
    }, [control]);

    // Handle starter prompt selection
    const handlePromptSelect = (text) => {
      if (control && control.sendMessage) {
        control.sendMessage(text);
        setShowStarters(false);
      }
    };

    return (
      <>
        <div className="chatbot-header">
          <h3>{config.title}</h3>
          <button className="chatbot-close" onClick={onClose} aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z"/>
            </svg>
          </button>
        </div>
        <div className="chatbot-content">
          <ChatKit control={control} style={{ width: '100%', height: '100%' }} />
          {showStarters && isReady && (
            <StarterPrompts onSelect={handlePromptSelect} />
          )}
        </div>
      </>
    );
  }

  // Load ChatKit script first, then initialize
  const chatkitScript = document.createElement('script');
  chatkitScript.src = 'https://cdn.platform.openai.com/deployments/chatkit/chatkit.js';
  chatkitScript.async = true;
  chatkitScript.onload = init;
  chatkitScript.onerror = () => console.error('Failed to load ChatKit script');
  document.head.appendChild(chatkitScript);

})();
