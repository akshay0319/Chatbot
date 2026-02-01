# 🎯 Configure Starter Prompts in OpenAI Agent Builder

Starter prompts (the 4 default questions) need to be configured in your **OpenAI Agent Builder workflow**, not in the code.

---

## 📋 Steps to Add Starter Prompts

### 1. Go to OpenAI Agent Builder

Visit: https://platform.openai.com/playground/agents

### 2. Open Your Workflow

Find and open your workflow:
- **Workflow ID**: `wf_696bcc7f84e881909b01275d5295ffef01bff0bf888519f7`

### 3. Configure Start Screen / New Thread View

Look for the **Start Screen** or **New Thread View** settings in your workflow configuration.

### 4. Add Starter Prompts

Add these 4 prompts:

```json
{
  "prompts": [
    {
      "name": "What products do you sell?",
      "prompt": "What products do you sell?",
      "icon": "shopping-bag"
    },
    {
      "name": "How can I place an order?",
      "prompt": "How can I place an order?",
      "icon": "shopping-cart"
    },
    {
      "name": "Where is my order?",
      "prompt": "Where is my order?",
      "icon": "package"
    },
    {
      "name": "How can I contact support?",
      "prompt": "How can I contact support?",
      "icon": "headphones"
    }
  ]
}
```

### 5. Save Workflow

Click **Save** or **Update** to save your workflow configuration.

---

## 🎨 Available Icons (Lucide Icons)

You can use these icons for your prompts:

**Shopping & E-commerce:**
- `shopping-bag`
- `shopping-cart`
- `package`
- `truck`
- `credit-card`

**Support & Help:**
- `headphones`
- `message-circle`
- `help-circle`
- `phone`
- `mail`

**General:**
- `star`
- `heart`
- `search`
- `info`
- `settings`

Full list: https://lucide.dev/icons/

---

## ✅ How It Works

Once you configure the starter prompts in your workflow:

1. **User opens chatbot** → ChatKit loads your workflow
2. **Workflow includes starter prompts** → They appear automatically
3. **User clicks a prompt** → Message is sent to your AI agent
4. **Agent responds** → Based on your workflow configuration

---

## 🔧 Alternative: Use Instructions

If starter prompts aren't available in your workflow editor, you can add them to your **Agent Instructions**:

```
When a user starts a new conversation, offer these options:
1. What products do you sell?
2. How can I place an order?
3. Where is my order?
4. How can I contact support?

Format them as clickable suggestions if possible.
```

---

## 📖 More Information

- **OpenAI Agent Builder Docs**: https://platform.openai.com/docs/agents
- **ChatKit Documentation**: https://platform.openai.com/docs/chatkit

---

## ❓ Need Help?

If you can't find the starter prompts settings:

1. Check if your OpenAI account has access to the latest ChatKit features
2. Contact OpenAI support for guidance on configuring starter prompts
3. Check the OpenAI Platform changelog for updates

---

## 🎉 After Configuration

Once you've added the starter prompts in your workflow:

- **No code changes needed** - Your widget will automatically show them!
- **They appear on new conversations** - When users first open the chat
- **Consistent across all deployments** - Same prompts everywhere

Just refresh your browser and the prompts should appear! 🚀
