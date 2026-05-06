const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const fallbackDocuments = [
  {
    id: '1',
    fileName: 'HR_Policy_2024.pdf',
    uploadedOn: '2024-01-15',
    status: 'ready',
    pages: 45
  },
  {
    id: '2',
    fileName: 'Safety_Manual.pdf',
    uploadedOn: '2024-01-14',
    status: 'ready',
    pages: 32
  },
  {
    id: '3',
    fileName: 'Operations_SOP.pdf',
    uploadedOn: '2024-01-14',
    status: 'processing',
    progress: 'Chunks created'
  },
  {
    id: '4',
    fileName: 'Finance_Guidelines.pdf',
    uploadedOn: '2024-01-13',
    status: 'failed'
  },
  {
    id: '5',
    fileName: 'Remote_Work_Policy.pdf',
    uploadedOn: '2024-01-12',
    status: 'ready',
    pages: 12
  }
];

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

export const fetchDocuments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/documents`);

    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }

    const data = await response.json();
    const docs = Array.isArray(data) ? data : data.documents || [];

    return docs.map(doc => normalizeDocument(doc));
  } catch (error) {
    console.warn('Using fallback documents because API is unavailable:', error.message);
    return fallbackDocuments;
  }
};

export const uploadDocuments = async (files = []) => {
  const fileList = Array.from(files);

  if (fileList.length === 0) {
    return [];
  }

  try {
    const uploadedDocuments = [];

    for (const file of fileList) {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to upload ${file.name}`);
      }

      const data = await response.json();
      const rawDocument = data.document || data.doc || data.file || data;

      uploadedDocuments.push(normalizeDocument(rawDocument, file.name));
    }

    return uploadedDocuments;
  } catch (error) {
    console.warn('Using local upload placeholder because API upload is unavailable:', error.message);

    return fileList.map(file => ({
      id: `${Date.now()}-${file.name}`,
      fileName: file.name,
      uploadedOn: 'Just now',
      status: 'processing',
      progress: 'Upload selected from browser'
    }));
  }
};

export const askQuestion = async ({ question, documentIds = [] }) => {
  try {
    const response = await fetch(`${API_BASE_URL}/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        question,
        documentIds
      })
    });

    if (!response.ok) {
      throw new Error('Failed to query documents');
    }

    const data = await response.json();
    const rawSources = data.sources || data.chunks || data.results || [];

    return {
      answer:
        data.answer ||
        data.response ||
        data.message ||
        'I found relevant information from the selected company documents.',
      sources: rawSources.map(normalizeSource)
    };
  } catch (error) {
    console.warn('Using simulated answer because API is unavailable:', error.message);

    const selectedText =
      documentIds.length > 0
        ? `the ${documentIds.length} selected document${documentIds.length > 1 ? 's' : ''}`
        : 'all ready company documents';

    return {
      answer: `Based on ${selectedText}, here is a simulated answer for: "${question}". Once the backend is connected, this will come from the RAG pipeline using only the selected document scope.`,
      sources: [
        {
          fileName: 'HR_Policy_2024.pdf',
          section: 'Section 3.2',
          confidence: 92,
          snippet: 'Employees may request vacation days by submitting Form HR-12...'
        },
        {
          fileName: 'Operations_Manual.pdf',
          section: 'Chapter 5',
          confidence: 87,
          snippet: 'All leave requests must be approved by the department manager...'
        }
      ]
    };
  }
};
