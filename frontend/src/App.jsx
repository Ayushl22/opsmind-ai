import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import Home from './pages/Home';
import Chat from './pages/Chat';
import ChatHistory from './pages/ChatHistory';
import Documents from './pages/Documents';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat/new" element={<Chat />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/history" element={<ChatHistory />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
