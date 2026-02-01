(function() {
  'use strict';

  // Configuration
  const WIDGET_CONFIG = {
    apiUrl: window.CHATBOT_API_URL || 'http://localhost:5173',
    theme: window.CHATBOT_THEME || 'light',
    title: window.CHATBOT_TITLE || 'Chat Assistant',
    position: window.CHATBOT_POSITION || 'bottom-right'
  };

  // State
  let isOpen = false;
  let iframe = null;
  let button = null;
  let container = null;

  // Initialize widget
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', createWidget);
    } else {
      createWidget();
    }
  }

  // Create widget elements
  function createWidget() {
    // Create floating button
    button = document.createElement('button');
    button.id = 'chatbot-widget-button';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
        <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="white"/>
      </svg>
    `;
    button.setAttribute('aria-label', 'Open chat');
    button.style.cssText = `
      position: fixed;
      ${WIDGET_CONFIG.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
      ${WIDGET_CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 999999;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Hover effect
    button.addEventListener('mouseenter', function() {
      button.style.transform = 'scale(1.1)';
      button.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
    });

    button.addEventListener('mouseleave', function() {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    });

    // Create iframe container
    container = document.createElement('div');
    container.id = 'chatbot-widget-container';
    container.style.cssText = `
      position: fixed;
      ${WIDGET_CONFIG.position.includes('bottom') ? 'bottom: 90px;' : 'top: 90px;'}
      ${WIDGET_CONFIG.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
      width: 380px;
      height: 600px;
      max-height: calc(100vh - 120px);
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      z-index: 999998;
      display: none;
      overflow: hidden;
      background: white;
    `;

    // Add button click handler
    button.addEventListener('click', toggleChat);

    // Append to body
    document.body.appendChild(button);
    document.body.appendChild(container);

    // Add mobile responsiveness
    addMobileStyles();
  }

  // Toggle chat open/close
  function toggleChat() {
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  }

  // Open chat
  function openChat() {
    if (!iframe) {
      // Lazy load iframe on first open
      iframe = document.createElement('iframe');
      iframe.id = 'chatbot-widget-iframe';
      iframe.src = `${WIDGET_CONFIG.apiUrl}/src/?theme=${WIDGET_CONFIG.theme}&title=${encodeURIComponent(WIDGET_CONFIG.title)}`;
      iframe.style.cssText = `
        width: 100%;
        height: 100%;
        border: none;
        border-radius: 12px;
      `;
      iframe.setAttribute('allow', 'clipboard-write');
      container.appendChild(iframe);
    }

    container.style.display = 'block';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41Z" fill="white"/>
      </svg>
    `;
    button.setAttribute('aria-label', 'Close chat');
    isOpen = true;
  }

  // Close chat
  function closeChat() {
    container.style.display = 'none';
    button.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z" fill="white"/>
        <path d="M7 9H17V11H7V9ZM7 12H14V14H7V12Z" fill="white"/>
      </svg>
    `;
    button.setAttribute('aria-label', 'Open chat');
    isOpen = false;
  }

  // Add mobile responsive styles
  function addMobileStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        #chatbot-widget-container {
          width: calc(100vw - 40px) !important;
          height: calc(100vh - 120px) !important;
          max-height: calc(100vh - 120px) !important;
        }
      }

      @media (max-width: 480px) {
        #chatbot-widget-button {
          width: 56px !important;
          height: 56px !important;
          bottom: 16px !important;
          right: 16px !important;
        }

        #chatbot-widget-container {
          bottom: 80px !important;
          right: 16px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Start initialization
  init();
})();
