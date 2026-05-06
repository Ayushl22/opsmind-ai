const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const fetchDocuments = async () => {
  const response = await fetch(`${API_BASE_URL}/documents`);
  const data = await response.json();
  return data;
};