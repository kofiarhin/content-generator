import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

const get = (url) => apiClient.get(url).then((response) => response.data);
const post = (url, data) => apiClient.post(url, data).then((response) => response.data);
const patch = (url, data) => apiClient.patch(url, data).then((response) => response.data);

export { get, post, patch };
