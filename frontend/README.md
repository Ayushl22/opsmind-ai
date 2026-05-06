# OpsMind AI - Frontend

Enterprise document assistant interface for OpsMind AI.

## Features

- **Portal Home** - Clean welcome screen with quick actions
- **Chat Workspace** - AI-powered Q&A with source citations
- **Chat History** - Browse and search previous conversations
- **Documents** - Upload and manage company PDFs
- **Settings** - Customize preferences and appearance
- **Profile** - View user information
- **Light/Dark Mode** - Toggle between themes
- **Auto-scroll** - Chat automatically scrolls to latest message
- **Copy Answers** - One-click copy functionality
- **Regenerate** - Re-run questions for better answers

## Tech Stack

- React 18
- React Router v6
- Vite (build tool)
- Lucide React (icons)
- Custom CSS (no heavy frameworks)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 3. Build for Production

```bash
npm run build
```

Production files will be in the `dist/` folder.

### 4. Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Layout.jsx     # Main layout wrapper
│   ├── Sidebar.jsx    # Navigation sidebar
│   ├── Navbar.jsx     # Top navigation bar
│   └── RightPanel.jsx # Contextual workspace panel
├── pages/             # Route pages
│   ├── Home.jsx       # Portal home screen
│   ├── Chat.jsx       # Chat workspace
│   ├── ChatHistory.jsx# Chat history browser
│   ├── Documents.jsx  # Document management
│   ├── Settings.jsx   # User settings
│   └── Profile.jsx    # User profile
├── context/           # React contexts
│   ├── ThemeContext.jsx   # Light/dark mode
│   └── UserContext.jsx    # User state
├── styles/            # Global styles
│   └── global.css     # CSS variables and utilities
├── App.jsx            # Main app router
└── main.jsx           # Entry point
```

## Connecting to Backend

The frontend is configured to proxy API requests to `http://localhost:5000`.

Update `vite.config.js` if your backend runs on a different port:

```javascript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:YOUR_PORT',
        changeOrigin: true
      }
    }
  }
})
```

## API Integration Points

Replace mock data with real API calls:

### Chat (src/pages/Chat.jsx)
- `POST /api/chat` - Send question, receive AI answer
- `GET /api/chat/:id` - Load chat history

### Documents (src/pages/Documents.jsx)
- `POST /api/documents/upload` - Upload PDF
- `GET /api/documents` - List all documents
- `DELETE /api/documents/:id` - Delete document

### Chat History (src/pages/ChatHistory.jsx)
- `GET /api/chats` - Get all chat history

## Design Principles

- **Clean & Professional** - No glow effects, heavy gradients, or decorative AI visuals
- **Familiar Workplace UI** - Looks like real enterprise software
- **Accessible** - Usable by all age groups and technical abilities
- **Functional** - Every element serves a purpose

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - OpsMind AI
