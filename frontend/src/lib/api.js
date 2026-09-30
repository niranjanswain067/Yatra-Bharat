import axios from 'axios';

// Use VITE_API_URL if defined (e.g. separate backend deployment or custom domain)
// Otherwise fallback to /api for unified Vercel deployment or Vite dev proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;
