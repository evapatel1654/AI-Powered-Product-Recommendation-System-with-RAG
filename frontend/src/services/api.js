// File: frontend/src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getRecommendations = async (count = 4) => {
  const response = await api.get('/recommendations', { params: { count } });
  return response.data;
};

export const getPersonalizedRecommendations = async (preferences, userQuery, count = 4) => {
  const response = await api.post('/recommendations/personalized', {
    preferences,
    userQuery,
    count,
  });
  return response.data;
};

export default api;
