import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // Match the FastAPI backend
});

export const fetchGithubData = async (username) => {
  const response = await api.post('/github/fetch', { username });
  return response.data;
};

export const getAiSuggestions = async (portfolioData) => {
  const response = await api.post('/ai/suggestions', portfolioData);
  return response.data;
};

export const generatePortfolio = async (portfolioData) => {
  const response = await api.post('/portfolio/generate', portfolioData);
  return response.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/resume/parse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data.text;
};

export default api;
