const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

// ─── Auth helpers ───────────────────────────────────────────────────

const TOKEN_KEY = 'opsmind-token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Safely parse a fetch response as JSON.
 * Throws a clear error if the response is HTML (e.g. Vite fallback) or not JSON.
 */
const safeJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      `Server returned ${response.status} with non-JSON response. Is the backend running?`
    );
  }
  return response.json();
};

// ─── Auth APIs ──────────────────────────────────────────────────────

export const authSignup = async ({ name, email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await safeJson(response);
  if (!response.ok) throw new Error(data.message || 'Signup failed');
  setToken(data.token);
  return data;
};

export const authLogin = async ({ email, password }) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await safeJson(response);
  if (!response.ok) throw new Error(data.message || 'Login failed');
  setToken(data.token);
  return data;
};

export const authGoogle = async (credential) => {
  const response = await fetch(`${API_BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  });
  const data = await safeJson(response);
  if (!response.ok) throw new Error(data.message || 'Google login failed');
  setToken(data.token);
  return data;
};

export const authGetMe = async () => {
  const token = getToken();
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      clearToken();
      return null;
    }
    const data = await safeJson(response);
    return data.user;
  } catch (err) {
    console.warn('Session restore failed:', err.message);
    clearToken();
    return null;
  }
};

// ─── Document helpers ───────────────────────────────────────────────

const normalizeDocument = (doc, fallbackFileName = 'Untitled document') => ({
  id: String(doc._id || doc.id || `${Date.now()}-${Math.random().toString(36).slice(2)}`),
  fileName: doc.fileName || doc.originalName || doc.name || doc.title || fallbackFileName,
  uploadedOn: doc.uploadedOn || doc.createdAt || doc.uploadedAt || 'Just now',
  status: doc.status || 'processing',
  pages: doc.pages,
  progress: doc.progress || 'Uploaded to Vault'
});

const normalizeSource = (source) => ({
  fileName: source.fileName || source.source || source.documentName || 'Document',
  section: source.section || source.page || source.chunk || 'Matched section',
  confidence: Math.round(source.confidence || source.score || 90),
  snippet: source.snippet || source.text || source.content || 'Relevant text found in this document.'
});

// ─── Document APIs ──────────────────────────────────────────────────

export const fetchDocuments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);
    if (!response.ok) throw new Error('Failed to fetch documents');

    const data = await response.json();
    const docs = Array.isArray(data) ? data : data.documents || [];
    return docs.map(doc => normalizeDocument(doc));
  } catch (error) {
    console.warn('Could not fetch documents:', error.message);
    return [];
  }
};

export const uploadDocuments = async (files = []) => {
  const fileList = Array.from(files);
  if (fileList.length === 0) return [];

  try {
    const uploadedDocuments = [];

    for (const file of fileList) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error(`Failed to upload ${file.name}`);

      const data = await response.json();
      const rawDocument = data.document || data.doc || data.file || data;
      uploadedDocuments.push(normalizeDocument(rawDocument, file.name));
    }

    return uploadedDocuments;
  } catch (error) {
    console.warn('Upload failed:', error.message);
    // Return an optimistic placeholder so the UI still shows the file
    return fileList.map(file => ({
      id: `${Date.now()}-${file.name}`,
      fileName: file.name,
      uploadedOn: 'Just now',
      status: 'processing',
      progress: 'Uploading…'
    }));
  }
};

export const deleteDocument = async (fileName) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/documents/${encodeURIComponent(fileName)}`,
      { method: 'DELETE' }
    );
    if (!response.ok) throw new Error('Delete failed');
    return true;
  } catch (error) {
    console.warn('Delete failed:', error.message);
    return false;
  }
};

// ─── Query API ──────────────────────────────────────────────────────

export const askQuestion = async ({ question, documentIds = [] }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, documentIds })
    });

    if (!response.ok) throw new Error('Failed to query documents');

    const data = await response.json();
    const rawSources = data.sources || data.chunks || data.results || [];

    return {
      answer: data.answer || data.response || data.message || 'No answer received.',
      sources: rawSources.map(normalizeSource),
      isOutOfContext: data.isOutOfContext || false
    };
  } catch (error) {
    console.error('Query failed:', error.message);
    throw error; // Let the caller handle the error UI
  }
};

// ─── Conversation APIs ──────────────────────────────────────────────

export const createConversation = async ({ title, documentIds } = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, documentIds })
    });

    if (!response.ok) throw new Error('Failed to create conversation');
    return await response.json();
  } catch (error) {
    console.error('Create conversation failed:', error.message);
    throw error;
  }
};

export const fetchConversations = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations`);
    if (!response.ok) throw new Error('Failed to fetch conversations');
    return await response.json();
  } catch (error) {
    console.warn('Could not fetch conversations:', error.message);
    return [];
  }
};

export const fetchConversation = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`);
    if (!response.ok) throw new Error('Failed to fetch conversation');
    return await response.json();
  } catch (error) {
    console.error('Fetch conversation failed:', error.message);
    throw error;
  }
};

export const addMessageToConversation = async (conversationId, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });

    if (!response.ok) throw new Error('Failed to add message');
    return await response.json();
  } catch (error) {
    console.error('Add message failed:', error.message);
    // Non-critical — message is still shown in UI
  }
};

export const deleteConversation = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/conversations/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete conversation');
    return true;
  } catch (error) {
    console.warn('Delete conversation failed:', error.message);
    return false;
  }
};
