import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Image, FileCode2 } from 'lucide-react';
import Layout from '../components/Layout';
import ChatComposer from '../components/ChatComposer';
import DocumentScopeSelector from '../components/DocumentScopeSelector';
import { fetchDocuments, uploadDocuments, fetchConversations } from '../services/api';
import { useUser } from '../context/UserContext';
import './Home.css';

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

const Home = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState('');
  const [documents, setDocuments] = useState([]);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const [docs, convos] = await Promise.all([
        fetchDocuments(),
        fetchConversations(),
      ]);
      setDocuments(docs);
      // Take top 3 most recent conversations for the home page
      setRecentChats(
        convos.slice(0, 3).map((c) => ({
          id: c.id,
          title: c.title || c.question || 'Untitled chat',
          date: formatTime(c.updatedAt),
        }))
      );
    };

    loadData();
  }, []);

  const readyDocuments = documents.filter(doc => doc.status === 'ready');
  const recentDocuments = readyDocuments.slice(0, 3);

  const getDocumentIcon = (fileName = '') => {
    const ext = fileName.split('.').pop()?.toLowerCase();

    if (ext === 'pdf') return <FileText size={18} />;
    if (['svg', 'png', 'jpg', 'jpeg'].includes(ext)) return <Image size={18} />;
    return <FileCode2 size={18} />;
  };

  const toggleDocumentSelection = (documentId) => {
    setSelectedDocumentIds(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAllDocuments = () => {
    setSelectedDocumentIds(readyDocuments.map(doc => String(doc.id)));
  };

  const handleClearDocuments = () => {
    setSelectedDocumentIds([]);
  };

  const handleVoiceTranscript = (transcript) => {
    setQuestion(prev => `${prev ? `${prev} ` : ''}${transcript}`);
  };

  const handleUploadFiles = async (files) => {
    const uploadedDocs = await uploadDocuments(files);
    setDocuments(prev => [...uploadedDocs, ...prev]);
  };

  const { isLoggedIn, openLoginPopup } = useUser();

  const handleAsk = () => {
    if (!question.trim()) return;

    if (!isLoggedIn) {
      openLoginPopup();
      return;
    }

    const selectedDocuments = readyDocuments.filter(doc =>
      selectedDocumentIds.includes(String(doc.id))
    );

    navigate('/chat/new', {
      state: {
        initialQuestion: question,
        selectedDocumentIds,
        selectedDocuments
      }
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const rightPanelContent = (
    <div className="workspace-panel">
      <DocumentScopeSelector
        documents={documents}
        selectedDocumentIds={selectedDocumentIds}
        onToggle={toggleDocumentSelection}
        onSelectAll={handleSelectAllDocuments}
        onClear={handleClearDocuments}
      />

      <div className="workspace-section">
        <h4 className="workspace-section-title">Recently Used Documents</h4>
        <div className="recent-documents-list">
          {recentDocuments.length > 0 ? (
            recentDocuments.map(doc => (
              <button
                type="button"
                key={doc.id}
                className="recent-document-item"
                onClick={() => toggleDocumentSelection(String(doc.id))}
              >
                <div className="recent-document-icon">
                  {getDocumentIcon(doc.fileName)}
                </div>

                <div className="recent-document-info">
                  <div className="document-name text-sm">{doc.fileName}</div>
                  <div className="document-date text-xs text-muted">{doc.uploadedOn}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-sm text-muted">No documents uploaded yet.</div>
          )}
        </div>
      </div>

      {recentChats.length > 0 && (
        <div className="workspace-section">
          <h4 className="workspace-section-title">Last Opened Chat</h4>
          <div
            className="last-chat-preview"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/chat/${recentChats[0].id}`)}
          >
            <div className="chat-preview-title text-sm">{recentChats[0].title}</div>
            <div className="chat-preview-date text-xs text-muted">{recentChats[0].date}</div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout 
      title="Home" 
      rightPanelTitle="Document Vault"
      rightPanelContent={rightPanelContent}
    >
      <div className="home-container">
        <div className="home-content">
          <div className="home-header">
            <h1 className="home-title">Welcome to OpsMind AI</h1>
            <p className="home-subtitle">
              Ask questions from your company documents and review previous conversations.
            </p>
          </div>

          <div className="ask-section">
            <ChatComposer
              variant="home"
              value={question}
              onChange={setQuestion}
              onSend={handleAsk}
              onUploadClick={handleUploadFiles}
              onVoiceTranscript={handleVoiceTranscript}
              documents={documents}
              selectedDocumentIds={selectedDocumentIds}
              onToggleDocument={toggleDocumentSelection}
              onSelectAllDocuments={handleSelectAllDocuments}
              onClearDocuments={handleClearDocuments}
              placeholder="Ask a question from company documents…"
              rows={3}
            />
          </div>

          <div className="recent-chats-section">
            <div className="section-header">
              <h2 className="section-title">Recent Chats</h2>
              <button 
                className="link-button"
                onClick={() => navigate('/history')}
              >
                View all chat history <ArrowRight size={16} />
              </button>
            </div>

            <div className="recent-chats-list">
              {recentChats.length > 0 ? (
                recentChats.map(chat => (
                  <div 
                    key={chat.id} 
                    className="recent-chat-item"
                    onClick={() => navigate(`/chat/${chat.id}`)}
                  >
                    <div className="chat-title">{chat.title}</div>
                    <div className="chat-meta">
                      <span className="chat-date text-muted text-sm">{chat.date}</span>
                      <ArrowRight size={16} className="chat-arrow" />
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-muted text-sm" style={{ padding: '1rem' }}>
                  No conversations yet. Ask a question to get started!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
