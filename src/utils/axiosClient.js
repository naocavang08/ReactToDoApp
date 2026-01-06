import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7227/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    console.log(`[API Call] ${config.method.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response.data; 
  },
  (error) => {
    if (error.response) {
      console.error('[API Error]', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('[API Error] No response received');
    } else {
      console.error('[API Error]', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;