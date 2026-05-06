import React, { useEffect, useRef, useState } from 'react';
import { Archive, Plus, Send, X, Library } from 'lucide-react';
import DocumentScopeSelector from './DocumentScopeSelector';
import VoiceButton from './VoiceButton';
import './ChatComposer.css';

const ChatComposer = ({
  value,
  onChange,
  onSend,
  onUploadClick,
  onVoiceTranscript,
  documents = [],
  selectedDocumentIds = [],
  onToggleDocument,
  onSelectAllDocuments,
  onClearDocuments,
  placeholder = 'Ask a question...',
  disabled = false,
  rows = 1,
  variant = 'chat'
}) => {
  const [vaultOpen, setVaultOpen] = useState(false);
  const vaultRef = useRef(null);
  const fileInputRef = useRef(null);

  const selectedCount = selectedDocumentIds.length;
  const vaultLabel = selectedCount > 0 ? `${selectedCount} doc${selectedCount > 1 ? 's' : ''}` : '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (vaultRef.current && !vaultRef.current.contains(event.target)) {
        setVaultOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onSend?.();
    }
  };

  const handleBrowseFiles = () => {
    if (disabled) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);

    if (selectedFiles.length > 0) {
      onUploadClick?.(selectedFiles);
    }

    event.target.value = '';
  };

  return (
    <div className={`chat-composer ${variant}`}>
      <textarea
        className="chat-composer-input"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={rows}
        disabled={disabled}
      />

      <div className="chat-composer-toolbar">
        <div className="composer-left-actions">
          <div className="vault-action-wrapper" ref={vaultRef}>
            <button
              type="button"
              className={`composer-vault-button ${selectedCount > 0 ? 'has-selection' : ''}`}
              onClick={() => setVaultOpen(prev => !prev)}
              title="Choose documents from Vault"
              disabled={disabled}
            >
              <Library size={17} />
              <span>{vaultLabel}</span>
            </button>

            {vaultOpen && (
              <div className="vault-popover">
                <div className="vault-popover-header">
                  <div>
                    <div className="vault-popover-title">Document Vault</div>
                    <div className="vault-popover-subtitle">Choose which uploaded documents OpsMind should search.</div>
                  </div>
                  <button
                    type="button"
                    className="vault-popover-close"
                    onClick={() => setVaultOpen(false)}
                    title="Close Vault"
                  >
                    <X size={16} />
                  </button>
                </div>

                <DocumentScopeSelector
                  documents={documents}
                  selectedDocumentIds={selectedDocumentIds}
                  onToggle={onToggleDocument}
                  onSelectAll={onSelectAllDocuments}
                  onClear={onClearDocuments}
                />
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.doc,.docx,.md,.csv,.json,.svg,.png,.jpg,.jpeg"
            className="composer-file-input"
            onChange={handleFileChange}
          />

          <button
            type="button"
            className="composer-icon-button"
            onClick={handleBrowseFiles}
            title="Browse files from device and upload to Vault"
            disabled={disabled}
          >
            <Plus size={18} />
          </button>
        </div>

        <div className="composer-right-actions">
          <VoiceButton
            onTranscript={onVoiceTranscript}
            disabled={disabled}
            className="composer-voice-button"
          />

          <button
            type="button"
            className="composer-send-button"
            onClick={onSend}
            disabled={!value.trim() || disabled}
            title="Send question"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComposer;
