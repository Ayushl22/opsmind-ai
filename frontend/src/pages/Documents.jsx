import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader, Trash2 } from 'lucide-react';
import Layout from '../components/Layout';
import { fetchDocuments, uploadDocuments } from '../services/api';
import './Documents.css';

const Documents = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Load documents from backend on mount
  useEffect(() => {
    const loadDocuments = async () => {
      const docs = await fetchDocuments();
      setDocuments(docs);
    };

    loadDocuments();
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (files) => {
    setUploading(true);
    try {
      const uploadedDocs = await uploadDocuments(files);
      setDocuments(prev => [...uploadedDocs, ...prev]);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (doc) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
      const response = await fetch(
        `${API_BASE_URL}/documents/${encodeURIComponent(doc.fileName)}`,
        { method: 'DELETE' }
      );

      if (response.ok) {
        setDocuments(prev => prev.filter(d => d.id !== doc.id));
        if (selectedDoc?.id === doc.id) setSelectedDoc(null);
        console.log('Deleted:', doc.fileName);
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircle size={18} className="status-icon ready" />;
      case 'processing':
        return <Loader size={18} className="status-icon processing" />;
      case 'failed':
        return <AlertCircle size={18} className="status-icon failed" />;
      default:
        return null;
    }
  };

  const getStatusText = (doc) => {
    switch (doc.status) {
      case 'ready':
        return 'Ready to search';
      case 'processing':
        return doc.progress || 'Processing';
      case 'failed':
        return 'Failed';
      default:
        return '';
    }
  };

  const rightPanelContent = selectedDoc && (
    <div className="document-preview-panel">
      <div className="preview-header">
        <FileText size={24} className="preview-file-icon" />
        <h4 className="preview-file-name">{selectedDoc.fileName}</h4>
      </div>

      <div className="preview-details">
        <div className="detail-row">
          <span className="detail-label">Status</span>
          <span className={`detail-value status-${selectedDoc.status}`}>
            {getStatusText(selectedDoc)}
          </span>
        </div>
        <div className="detail-row">
          <span className="detail-label">Uploaded</span>
          <span className="detail-value">{selectedDoc.uploadedOn}</span>
        </div>
        {selectedDoc.pages && (
          <div className="detail-row">
            <span className="detail-label">Chunks</span>
            <span className="detail-value">{selectedDoc.pages}</span>
          </div>
        )}
      </div>

      {selectedDoc.status === 'processing' && (
        <div className="processing-tracker">
          <h5 className="tracker-title">Processing Status</h5>
          <div className="tracker-steps">
            <div className="tracker-step completed">
              <div className="step-indicator"></div>
              <span className="step-label">PDF uploaded</span>
            </div>
            <div className="tracker-step completed">
              <div className="step-indicator"></div>
              <span className="step-label">Text extracted</span>
            </div>
            <div className="tracker-step active">
              <div className="step-indicator"></div>
              <span className="step-label">Chunks created</span>
            </div>
            <div className="tracker-step">
              <div className="step-indicator"></div>
              <span className="step-label">Ready to search</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout 
      title="Documents" 
      rightPanelTitle="Document Details"
      rightPanelContent={rightPanelContent}
    >
      <div className="documents-container">
        <div className="documents-header">
          <div>
            <h1 className="documents-title">Documents</h1>
            <p className="documents-subtitle text-muted">
              Upload SOPs, policies, and internal documents.
            </p>
          </div>
        </div>

        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''} ${uploading ? 'uploading' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {uploading ? (
            <>
              <Loader size={32} className="upload-icon spinning" />
              <div className="upload-text">Uploading and processing...</div>
            </>
          ) : (
            <>
              <Upload size={32} className="upload-icon" />
              <div className="upload-text">
                <span className="font-medium">Choose PDF files</span> or drag and drop here
              </div>
              <input
                type="file"
                id="file-upload"
                multiple
                accept=".pdf"
                onChange={handleChange}
                style={{ display: 'none' }}
              />
              <button 
                className="btn-primary"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <Upload size={18} />
                <span>Choose Files</span>
              </button>
            </>
          )}
        </div>

        <div className="documents-list">
          {documents.length === 0 ? (
            <div className="no-documents text-muted">
              No documents uploaded yet. Upload a PDF to get started.
            </div>
          ) : (
            <div className="documents-table">
              <div className="table-header">
                <div className="table-cell file-name-cell">File Name</div>
                <div className="table-cell date-cell">Uploaded On</div>
                <div className="table-cell status-cell">Status</div>
                <div className="table-cell actions-cell">Actions</div>
              </div>

              {documents.map(doc => (
                <div
                  key={doc.id}
                  className={`table-row ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="table-cell file-name-cell">
                    <FileText size={18} className="file-icon" />
                    <span className="file-name">{doc.fileName}</span>
                  </div>
                  <div className="table-cell date-cell">
                    <span className="text-muted text-sm">{doc.uploadedOn}</span>
                  </div>
                  <div className="table-cell status-cell">
                    <div className={`status-badge status-${doc.status}`}>
                      {getStatusIcon(doc.status)}
                      <span>{getStatusText(doc)}</span>
                    </div>
                  </div>
                  <div className="table-cell actions-cell">
                    <button
                      className="action-icon-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc);
                      }}
                      title="Delete document"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Documents;
