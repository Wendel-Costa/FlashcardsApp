import axios from 'axios';

const api = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'https://flashcardsapi.vercel.app',
});

api.interceptors.request.use(config => {
   const token = localStorage.getItem('@flashcards:token');
   if (token) {
      config.headers.Authorization = `Bearer ${token}`;
   }
   return config;
});

api.interceptors.response.use(
   response => response,
   error => {
      if (error.response?.status === 401) {
         localStorage.removeItem('@flashcards:token');
         localStorage.removeItem('@flashcards:username');
         window.location.href = '/login';
      }
      return Promise.reject(error);
   },
);

export default api;
