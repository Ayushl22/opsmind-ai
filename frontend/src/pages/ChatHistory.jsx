import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageSquare, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import './ChatHistory.css';

const ChatHistory = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);

  // Mock chat history data
  const chatHistory = {
    today: [
      {
        id: 1,
        question: 'What is the process for requesting vacation days?',
        preview: 'Based on the HR policy, employees must submit Form HR-12 at least two weeks in advance...',
        time: '2 hours ago',
        sources: ['HR_Policy_2024.pdf', 'Leave_Guidelines.pdf']
      },
      {
        id: 2,
        question: 'How do I submit an expense report?',
        preview: 'Expense reports should be submitted through the Finance portal using Form FIN-05...',
        time: '4 hours ago',
        sources: ['Finance_Manual.pdf']
      }
    ],
    thisWeek: [
      {
        id: 3,
        question: 'What are the safety protocols for the warehouse?',
        preview: 'All warehouse personnel must wear appropriate PPE including hard hats, safety shoes...',
        time: 'Yesterday',
        sources: ['Safety_Manual.pdf', 'Warehouse_SOP.pdf']
      },
      {
        id: 4,
        question: 'How do I request equipment maintenance?',
        preview: 'Equipment maintenance requests should be submitted via the Maintenance Portal...',
        time: '2 days ago',
        sources: ['Maintenance_Guide.pdf']
      }
    ],
    older: [
      {
        id: 5,
        question: 'What is the company policy on remote work?',
        preview: 'Remote work is available to eligible employees subject to manager approval...',
        time: 'Last week',
        sources: ['Remote_Work_Policy.pdf', 'HR_Guidelines.pdf']
      }
    ]
  };

  const rightPanelContent = selectedChat && (
    <div className="chat-preview-panel">
      <div className="preview-question">
        <MessageSquare size={20} className="preview-icon" />
        <h4 className="preview-title">Question</h4>
      </div>
      <p className="preview-question-text">{selectedChat.question}</p>
      
      <div className="preview-answer">
        <h4 className="preview-title">Answer Preview</h4>
        <p className="preview-answer-text text-sm text-secondary">{selectedChat.preview}</p>
      </div>

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
          <div className="history-group">
            <h3 className="group-title">Today</h3>
            <div className="chat-list">
              {chatHistory.today.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-row ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="chat-row-content">
                    <div className="chat-row-title">{chat.question}</div>
                    <div className="chat-row-preview text-sm text-muted">{chat.preview}</div>
                    <div className="chat-row-time text-xs text-muted">{chat.time}</div>
                  </div>
                  <ArrowRight size={18} className="chat-row-arrow" />
                </div>
              ))}
            </div>
          </div>

          <div className="history-group">
            <h3 className="group-title">This Week</h3>
            <div className="chat-list">
              {chatHistory.thisWeek.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-row ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="chat-row-content">
                    <div className="chat-row-title">{chat.question}</div>
                    <div className="chat-row-preview text-sm text-muted">{chat.preview}</div>
                    <div className="chat-row-time text-xs text-muted">{chat.time}</div>
                  </div>
                  <ArrowRight size={18} className="chat-row-arrow" />
                </div>
              ))}
            </div>
          </div>

          <div className="history-group">
            <h3 className="group-title">Older</h3>
            <div className="chat-list">
              {chatHistory.older.map(chat => (
                <div
                  key={chat.id}
                  className={`chat-row ${selectedChat?.id === chat.id ? 'selected' : ''}`}
                  onClick={() => setSelectedChat(chat)}
                >
                  <div className="chat-row-content">
                    <div className="chat-row-title">{chat.question}</div>
                    <div className="chat-row-preview text-sm text-muted">{chat.preview}</div>
                    <div className="chat-row-time text-xs text-muted">{chat.time}</div>
                  </div>
                  <ArrowRight size={18} className="chat-row-arrow" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatHistory;
