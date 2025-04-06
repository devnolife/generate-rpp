import axios from 'axios';

/**
 * Base URL for the API
 * Can be overridden by environment variables
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

/**
 * API request timeout
 */
export const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000', 10);

/**
 * Debug mode flag
 */
export const DEBUG_MODE = process.env.NEXT_PUBLIC_DEBUG_MODE === 'true';

/**
 * Configure axios defaults
 */
export const configureAxios = () => {
  // Set base URL
  axios.defaults.baseURL = API_BASE_URL;

  // Set timeout
  axios.defaults.timeout = API_TIMEOUT;

  // Add request interceptor for authentication if needed
  axios.interceptors.request.use(
    (config) => {
      // Add any auth headers or other common headers here
      if (DEBUG_MODE) {
        console.log('API Request:', config);
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add response interceptor for error handling
  axios.interceptors.response.use(
    (response) => {
      if (DEBUG_MODE) {
        console.log('API Response:', response.status, response.data);
      }
      return response;
    },
    (error) => {
      // Handle common error scenarios
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Network Error:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request Error:', error.message);
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Create a configured axios instance
 */
export const createApiClient = () => {
  const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return client;
};

// Export a pre-configured axios instance
export const apiClient = createApiClient(); 
