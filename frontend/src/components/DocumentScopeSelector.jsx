import React from 'react';
import { FileText, Image, FileCode2, Check } from 'lucide-react';
import './DocumentScopeSelector.css';

const getFileIcon = (fileName = '') => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  if (ext === 'pdf') return <FileText size={17} />;
  if (['svg', 'png', 'jpg', 'jpeg', 'webp'].includes(ext)) return <Image size={17} />;
  return <FileCode2 size={17} />;
};

const DocumentScopeSelector = ({ documents = [], selectedDocumentIds = [], onToggle, onSelectAll, onClear }) => {
  const readyDocuments = documents.filter(doc => doc.status === 'ready');
  const selectedCount = selectedDocumentIds.length;

  return (
    <div className="document-scope-selector">
      <div className="document-scope-header">
        <div>
          <h4 className="document-scope-title">Document Vault</h4>
          <p className="document-scope-subtitle">
            {selectedCount > 0
              ? `${selectedCount} selected`
              : 'No selection means search all ready documents'}
          </p>
        </div>

        <button
          type="button"
          className="scope-link-button"
          onClick={selectedCount > 0 ? onClear : onSelectAll}
        >
          {selectedCount > 0 ? 'Clear' : 'Select all'}
        </button>
      </div>

      <div className="document-scope-list">
        {readyDocuments.map(doc => {
          const checked = selectedDocumentIds.includes(String(doc.id));

          return (
            <button
              key={doc.id}
              type="button"
              className={`document-scope-item ${checked ? 'selected' : ''}`}
              onClick={() => onToggle(String(doc.id))}
            >
              <div className="document-scope-icon">
                {getFileIcon(doc.fileName)}
              </div>

              <div className="document-scope-info">
                <div className="document-scope-name">{doc.fileName}</div>
                <div className="document-scope-date">{doc.uploadedOn}</div>
              </div>

              <div className="document-scope-check">
                {checked && <Check size={14} />}
              </div>
            </button>
          );
        })}

        {readyDocuments.length === 0 && (
          <div className="document-scope-empty">
            No ready documents found in Vault. Upload and process a document first.
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentScopeSelector;
