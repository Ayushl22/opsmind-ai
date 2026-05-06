# Week 4 — UI & Optimization

## Objective
Build React chat interface. Show AI answers + sources. Add history. Polish UX.

## New Files
```
frontend/src/App.jsx
frontend/src/components/ChatInterface.jsx
frontend/src/components/MessageList.jsx
frontend/src/components/SourceCard.jsx
frontend/src/hooks/useChatHistory.js
frontend/src/api/client.js
```

---

## How It Works

### Frontend Flow

```
User types question
   │
   ▼
[ChatInterface.jsx]  →  POST /api/query → backend
   │
   ▼
[MessageList.jsx]    →  Display { question, answer, sources, timestamp }
   │
   ▼
[SourceCard.jsx]     →  Render clickable source badges
   │
   ▼
[useChatHistory.js]  →  Save to localStorage
```

---

## Key Features

### 1. Chat UI
Clean React interface. Message bubbles. User questions left. AI answers right.

### 2. Source display
Each answer shows source filenames as badges. User see which docs AI used.

### 3. Chat history
Auto-save to localStorage. Persists across page refresh. Clear history button.

### 4. Out-of-context handling
When `isOutOfContext: true`, show special message: "Can't answer from available docs."

### 5. Loading states
Skeleton loader while waiting for AI response. No blank screen.

---

## API Integration

### Request
```js
const response = await fetch('http://localhost:5000/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question })
});
const data = await response.json();
```

### Response shape
```json
{
  "question": "What topics are covered on Day 1?",
  "answer": "Day 1 covers Design Thinking Basics, Building a Startup Journey...",
  "sources": ["test.pdf"],
  "isOutOfContext": false
}
```

---

## Performance Optimizations

### 1. Debounce user input
Wait 300ms after typing stops before sending query. Reduce API spam.

### 2. Cache responses
If user asks same question twice, return cached answer. No duplicate API calls.

### 3. Lazy load message list
Virtualize long chat history. Only render visible messages.

### 4. Compress context chunks
Backend trim chunks to 300 chars already. No bloat in network payload.

---

## UX Improvements

### 1. Auto-scroll to bottom
New messages appear. Chat auto-scroll to latest. No manual scroll needed.

### 2. Copy answer button
One-click copy AI answer to clipboard. Share easily.

### 3. Regenerate answer
Re-run same query if answer unsatisfactory. Hit refresh icon.

### 4. Error states
Network fail → show retry button. Invalid input → show inline error.

---

## Dependencies

```json
"react": "^18.2.0",
"react-dom": "^18.2.0",
"vite": "^5.0.0"
```

No external UI lib. Pure CSS + React hooks.