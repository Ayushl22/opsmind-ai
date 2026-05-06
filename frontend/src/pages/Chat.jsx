import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Copy, RotateCw, CheckCircle, FileText } from 'lucide-react';
import Layout from '../components/Layout';
import ChatComposer from '../components/ChatComposer';
import DocumentScopeSelector from '../components/DocumentScopeSelector';
import { askQuestion, fetchDocuments, uploadDocuments } from '../services/api';
import './Chat.css';

const Chat = () => {
  const location = useLocation();
  const { chatId } = useParams();
  const initialDocumentIds = location.state?.selectedDocumentIds || [];
  const initialDocuments = location.state?.selectedDocuments || [];

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [documents, setDocuments] = useState(initialDocuments);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState(initialDocumentIds.map(String));

  const messagesEndRef = useRef(null);
  const initialQuestionSentRef = useRef(false);

  const readyDocuments = documents.filter(doc => doc.status === 'ready');
  const lastAiMessage = messages.filter(message => message.type === 'ai').slice(-1)[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await fetchDocuments();
      setDocuments(docs);
    };

    loadDocuments();
  }, []);

  useEffect(() => {
    if (location.state?.initialQuestion && !initialQuestionSentRef.current) {
      initialQuestionSentRef.current = true;
      handleSend(location.state.initialQuestion);
    }
  }, [location.state]);

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

  const getScopeText = () => {
    if (selectedDocumentIds.length === 0) return 'All ready documents';
    return `${selectedDocumentIds.length} selected document${selectedDocumentIds.length > 1 ? 's' : ''}`;
  };

  const handleSend = async (question = input) => {
    if (!question.trim() || loading) return;

    const userMessage = {
      type: 'user',
      content: question,
      documentIds: selectedDocumentIds,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const result = await askQuestion({
        question,
        documentIds: selectedDocumentIds
      });

      const aiMessage = {
        type: 'ai',
        content: result.answer,
        sources: result.sources,
        scope: getScopeText(),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = {
        type: 'ai',
        content: 'Something went wrong while searching the documents. Please try again.',
        sources: [],
        scope: getScopeText(),
        timestamp: new Date(),
        error: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(prev => `${prev ? `${prev} ` : ''}${transcript}`);
  };

  const handleUploadFiles = async (files) => {
    const uploadedDocs = await uploadDocuments(files);
    setDocuments(prev => [...uploadedDocs, ...prev]);
  };


  const handleCopy = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleRegenerate = (index) => {
    const userQuestion = messages[index - 1]?.content;
    if (userQuestion) {
      setMessages(prev => prev.slice(0, index));
      handleSend(userQuestion);
    }
  };

  const rightPanelContent = (
    <div className="sources-panel">
      <DocumentScopeSelector
        documents={documents}
        selectedDocumentIds={selectedDocumentIds}
        onToggle={toggleDocumentSelection}
        onSelectAll={handleSelectAllDocuments}
        onClear={handleClearDocuments}
      />

      <div className="sources-divider" />

      <h4 className="sources-title">Sources</h4>
      {lastAiMessage?.sources?.length > 0 ? (
        <div className="sources-list">
          {lastAiMessage.sources.map((source, idx) => (
            <div key={idx} className="source-item">
              <div className="source-header">
                <FileText size={16} className="source-icon" />
                <div className="source-file">{source.fileName}</div>
              </div>
              <div className="source-section text-sm text-muted">{source.section}</div>
              <div className="source-confidence">
                <div className="confidence-label text-xs">Confidence</div>
                <div className="confidence-value">{source.confidence}%</div>
              </div>
              <div className="source-snippet text-sm">{source.snippet}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-sources text-muted text-sm">
          Sources will appear here after you ask a question.
        </div>
      )}
    </div>
  );

  return (
    <Layout
      title="Chat"
      rightPanelTitle="Document Vault"
      rightPanelContent={rightPanelContent}
    >
      <div className="chat-container">
        <div className="chat-messages">
          {messages.length === 0 && (
            <div className="chat-empty">
              <div className="empty-icon">💬</div>
              <div className="empty-title">Start a conversation</div>
              <div className="empty-subtitle text-muted">
                Ask from {getScopeText().toLowerCase()}. Use the Vault button to choose documents.
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'user' ? (
                <div className="message-content user-message">
                  <div className="message-scope-label">{getScopeText()}</div>
                  <div className="message-text">{message.content}</div>
                </div>
              ) : (
                <div className="message-content ai-message">
                  <div className="ai-label">Answer from {message.scope || 'company documents'}</div>
                  <div className="message-text">{message.content}</div>

                  {message.sources && message.sources.length > 0 && (
                    <div className="inline-sources">
                      <div className="inline-sources-title text-sm font-medium">Sources:</div>
                      <div className="inline-sources-list">
                        {message.sources.map((source, idx) => (
                          <div key={idx} className="inline-source text-sm">
                            <span className="font-medium">{source.fileName}</span> - {source.section} ({source.confidence}%)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="message-actions">
                    <button
                      className="action-button"
                      onClick={() => handleCopy(message.content, index)}
                      title="Copy answer"
                    >
                      {copiedIndex === index ? (
                        <>
                          <CheckCircle size={16} />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                    <button
                      className="action-button"
                      onClick={() => handleRegenerate(index)}
                      title="Regenerate answer"
                    >
                      <RotateCw size={16} />
                      <span>Regenerate</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message ai">
              <div className="message-content ai-message">
                <div className="ai-label">Searching {getScopeText().toLowerCase()}</div>
                <div className="loading-indicator">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-container">
          <ChatComposer
            variant="chat"
            value={input}
            onChange={setInput}
            onSend={() => handleSend()}
            onUploadClick={handleUploadFiles}
            onVoiceTranscript={handleVoiceTranscript}
            documents={documents}
            selectedDocumentIds={selectedDocumentIds}
            onToggleDocument={toggleDocumentSelection}
            onSelectAllDocuments={handleSelectAllDocuments}
            onClearDocuments={handleClearDocuments}
            placeholder="Ask another question…"
            disabled={loading}
            rows={1}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Chat;
