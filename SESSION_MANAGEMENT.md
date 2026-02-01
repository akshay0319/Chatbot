# Chat Session Management Guide

This document explains how the chatbot manages user sessions and how to customize session behavior.

## Current Session Implementation

### How Sessions Work

The chatbot uses **browser localStorage** to manage chat sessions:

1. **Session ID Creation** - A unique session ID is generated when a user first opens the chat
2. **Message Persistence** - All chat messages are saved to localStorage
3. **Automatic Restoration** - When the user returns, their conversation history is loaded

### Session Storage Keys

- `chatbot_session_id` - Stores the unique session identifier
- `chatbot_messages_{sessionId}` - Stores the message history for each session

### Current Session Lifecycle

```
User opens chat
    ↓
Check localStorage for existing session ID
    ↓
If exists: Load that session's messages
If not: Create new session ID
    ↓
Save all messages as user chats
    ↓
Messages persist across page refreshes
```

---

## Session Management Options

### Option 1: Clear Session on Page Refresh (Current Default Alternative)

To start a fresh conversation each time the page loads:

**Location:** `src/chat/ChatApp.jsx`

**Change lines 17-24 to:**

```javascript
// Initialize session and config
useEffect(() => {
  // Always create a new session ID on page load
  const sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  setSessionId(sid);

  // Don't load any previous messages - start fresh
  // localStorage is not checked

  // Get config from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const theme = urlParams.get('theme') || 'light';
  const title = urlParams.get('title') || 'Chat Assistant';
  setConfig({ theme, title });
}, []);
```

### Option 2: Persist Session (Current Implementation)

This is already implemented. Sessions persist across:
- Page refreshes
- Browser restarts (until localStorage is cleared)
- Multiple visits to the same website

### Option 3: Session Expiry

To clear old sessions after a certain time:

**Add this to `src/chat/ChatApp.jsx` in the useEffect (line 17):**

```javascript
useEffect(() => {
  // Get or create session ID with expiry
  let sid = localStorage.getItem('chatbot_session_id');
  const sessionTimestamp = localStorage.getItem('chatbot_session_timestamp');
  const ONE_DAY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  // Check if session has expired
  if (sid && sessionTimestamp) {
    const elapsed = Date.now() - parseInt(sessionTimestamp);
    if (elapsed > ONE_DAY) {
      // Session expired - clear it
      localStorage.removeItem('chatbot_session_id');
      localStorage.removeItem(`chatbot_messages_${sid}`);
      sid = null;
    }
  }

  // Create new session if needed
  if (!sid) {
    sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatbot_session_id', sid);
    localStorage.setItem('chatbot_session_timestamp', Date.now().toString());
  }

  setSessionId(sid);

  // Load conversation history (rest of the code...)
  // ...
}, []);
```

### Option 4: Clear Session Button

Add a button to let users manually clear their chat history:

**Add this function to `ChatApp.jsx`:**

```javascript
const handleClearSession = () => {
  // Clear messages
  setMessages([]);

  // Remove from localStorage
  if (sessionId) {
    localStorage.removeItem(`chatbot_messages_${sessionId}`);
  }

  // Optionally create a new session ID
  const newSid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  setSessionId(newSid);
  localStorage.setItem('chatbot_session_id', newSid);
};
```

**Add the button to the header (line 96):**

```javascript
<div className="chat-header">
  <h1>{config.title}</h1>
  <div className="chat-header-info">
    <button
      onClick={handleClearSession}
      style={{
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.3)',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        marginRight: '12px'
      }}
    >
      Clear Chat
    </button>
    <div className="status-dot"></div>
    <span className="status-text">Online</span>
  </div>
</div>
```

### Option 5: Session Per Domain

To create different sessions for different websites:

**Change line 19:**

```javascript
// Create session ID based on current domain
const domain = window.location.hostname;
let sid = localStorage.getItem(`chatbot_session_id_${domain}`);
if (!sid) {
  sid = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  localStorage.setItem(`chatbot_session_id_${domain}`, sid);
}
```

### Option 6: Server-Side Session Management

For production systems with user authentication:

**Changes needed:**

1. **Backend** - Store sessions in database instead of localStorage
2. **Authentication** - Require user login
3. **API Changes** - Send user ID with each request

**Example API modification in `api/chat.js`:**

```javascript
const { messages, sessionId, userId } = req.body;

// Retrieve session from database
const session = await database.getSession(userId, sessionId);

// Save messages to database
await database.saveMessages(userId, sessionId, messages);
```

---

## Quick Implementation Guide

### To Start Fresh on Every Page Load:

1. Open [src/chat/ChatApp.jsx](src/chat/ChatApp.jsx)
2. Find lines 18-23 (the session creation code)
3. Remove the `localStorage.getItem` check
4. Always generate a new session ID
5. Don't load previous messages from localStorage

### To Add Session Expiry:

1. Open [src/chat/ChatApp.jsx](src/chat/ChatApp.jsx)
2. Add timestamp storage when creating sessions
3. Check timestamp on load
4. Clear if expired

### To Add Clear Button:

1. Open [src/chat/ChatApp.jsx](src/chat/ChatApp.jsx)
2. Add `handleClearSession` function
3. Add button to chat header
4. Style appropriately

---

## Session Data Structure

### Session ID Format
```
session_1234567890_abc123xyz
```

### Stored Messages Format
```javascript
[
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi! How can I help?' },
  { role: 'user', content: 'What is AI?' },
  { role: 'assistant', content: 'AI stands for...' }
]
```

---

## Testing Session Behavior

### View Current Session Data

Open browser console and run:

```javascript
// See session ID
console.log(localStorage.getItem('chatbot_session_id'));

// See all messages
const sid = localStorage.getItem('chatbot_session_id');
console.log(localStorage.getItem(`chatbot_messages_${sid}`));
```

### Clear Session Manually

```javascript
// Clear everything
localStorage.clear();

// Or clear just chatbot data
localStorage.removeItem('chatbot_session_id');
localStorage.removeItem('chatbot_messages_' + sessionId);
```

---

## Recommended Configurations

### For Marketing/Landing Pages
- **Use:** Fresh session on each visit
- **Why:** Each visit is a new opportunity

### For Support Chatbots
- **Use:** Persistent sessions with 7-day expiry
- **Why:** Users may return to continue conversation

### For Authenticated Apps
- **Use:** Server-side session management
- **Why:** Security, multi-device sync

### For Demo/Test Pages
- **Use:** Persistent sessions with clear button
- **Why:** Easy testing, user control

---

## Files Involved

- [src/chat/ChatApp.jsx](src/chat/ChatApp.jsx) - Main session logic (lines 17-48)
- [api/chat.js](api/chat.js) - Backend receives sessionId (line 72)

---

## Summary

**Current Behavior:** Sessions persist across page refreshes using localStorage

**To Change:** Modify the `useEffect` hook in `ChatApp.jsx` (lines 17-41)

**Options:**
1. Fresh session each time (remove localStorage check)
2. Session expiry (add timestamp validation)
3. Clear button (add user control)
4. Per-domain sessions (include hostname in key)
5. Server-side (requires backend changes)

Choose the option that best fits your use case!
