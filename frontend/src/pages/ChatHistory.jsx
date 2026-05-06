import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, ArrowRight, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchConversations, deleteConversation } from '../services/api';
import './ChatHistory.css';

/**
 * Group conversations by relative time buckets.
 */
const groupByTime = (conversations) => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);

  const groups = { today: [], thisWeek: [], older: [] };

  conversations.forEach((conv) => {
    const updated = new Date(conv.updatedAt);
    if (updated >= todayStart) {
      groups.today.push(conv);
    } else if (updated >= weekStart) {
      groups.thisWeek.push(conv);
    } else {
      groups.older.push(conv);
    }
  });

  return groups;
};

/**
 * Format a timestamp into a human-friendly relative string.
 */
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const ChatHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchConversations();
      setConversations(data);
      setLoading(false);
    };
    load();
  }, []);

  const handleDelete = async (e, convId) => {
    e.stopPropagation();
    const success = await deleteConversation(convId);
    if (success) {
      setConversations((prev) => prev.filter((c) => c.id !== convId));
      if (selectedChat?.id === convId) setSelectedChat(null);
    }
  };

  // Filter by search query
  const filtered = searchQuery.trim()
    ? conversations.filter(
        (c) =>
          c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.preview?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  const groups = groupByTime(filtered);

  const renderGroup = (title, chats) => {
    if (chats.length === 0) return null;

    return (
      <div className="history-group" key={title}>
        <h3 className="group-title">{title}</h3>
        <div className="chat-list">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-row ${selectedChat?.id === chat.id ? 'selected' : ''}`}
              onClick={() => setSelectedChat(chat)}
            >
              <div className="chat-row-content">
                <div className="chat-row-title">{chat.title || chat.question || 'Untitled chat'}</div>
                <div className="chat-row-preview text-sm text-muted">
                  {chat.preview || 'No messages yet'}
                </div>
                <div className="chat-row-time text-xs text-muted">
                  {formatTime(chat.updatedAt)}
                </div>
              </div>
              <div className="chat-row-actions">
                <button
                  className="action-icon-button"
                  onClick={(e) => handleDelete(e, chat.id)}
                  title="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
                <ArrowRight size={18} className="chat-row-arrow" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const rightPanelContent = selectedChat && (
    <div className="chat-preview-panel">
      <div className="preview-question">
        <MessageSquare size={20} className="preview-icon" />
        <h4 className="preview-title">Question</h4>
      </div>
      <p className="preview-question-text">{selectedChat.question || selectedChat.title}</p>
      
      <div className="preview-answer">
        <h4 className="preview-title">Answer Preview</h4>
        <p className="preview-answer-text text-sm text-secondary">
          {selectedChat.preview || 'No answer preview available.'}
        </p>
      </div>

      {selectedChat.sources?.length > 0 && (
        <div className="preview-sources">
          <h4 className="preview-title">Sources Used</h4>
          <div className="preview-sources-list">
            {selectedChat.sources.map((source, idx) => (
              <div key={idx} className="preview-source text-sm">
                {source}
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        className="btn-primary full-width"
        onClick={() => navigate(`/chat/${selectedChat.id}`)}
      >
        <span>Open Full Chat</span>
        <ArrowRight size={18} />
      </button>
    </div>
  );

  return (
    <Layout 
      title="Chat History" 
      rightPanelTitle="Preview"
      rightPanelContent={rightPanelContent}
    >
      <div className="history-container">
        <div className="history-header">
          <h1 className="history-title">Chat History</h1>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search previous chats…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="history-content">
          {loading ? (
            <div className="history-loading text-muted">Loading conversations…</div>
          ) : filtered.length === 0 ? (
            <div className="history-empty text-muted">
              {searchQuery ? 'No chats match your search.' : 'No conversations yet. Start a chat to see history here.'}
            </div>
          ) : (
            <>
              {renderGroup('Today', groups.today)}
              {renderGroup('This Week', groups.thisWeek)}
              {renderGroup('Older', groups.older)}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ChatHistory;
