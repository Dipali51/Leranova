import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { useAuthStore } from '../stores/authStore';
import { showToast } from '../components/Toast';
import { TOAST_TYPES } from '../utils/constants';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuthStore();

  const request = useCallback(
    async (method, endpoint, data = null, options = {}) => {
      setLoading(true);
      setError(null);

      try {
        const config = {
          method,
          url: `${API_BASE_URL}${endpoint}`,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
          },
          ...options,
        };

        if (data) {
          if (config.headers['Content-Type'] === 'multipart/form-data') {
            config.data = data;
          } else {
            config.data = data;
          }
        }

        const response = await axios(config);
        setLoading(false);
        return response.data;
      } catch (err) {
        setLoading(false);
        const errorMessage =
          err.response?.data?.error ||
          err.message ||
          'An error occurred. Please try again.';

        setError(errorMessage);

        // Auto-show error toast unless disabled
        if (options.showErrorToast !== false) {
          showToast(TOAST_TYPES.ERROR, errorMessage);
        }

        // Handle 401 unauthorized
        if (err.response?.status === 401) {
          useAuthStore.getState().logout();
          if (options.redirectOn401 !== false) {
            window.location.href = '/login';
          }
        }

        throw err;
      }
    },
    [token]
  );

  const get = useCallback(
    (endpoint, options) => request('GET', endpoint, null, options),
    [request]
  );

  const post = useCallback(
    (endpoint, data, options) => request('POST', endpoint, data, options),
    [request]
  );

  const put = useCallback(
    (endpoint, data, options) => request('PUT', endpoint, data, options),
    [request]
  );

  const del = useCallback(
    (endpoint, options) => request('DELETE', endpoint, null, options),
    [request]
  );

  return {
    loading,
    error,
    get,
    post,
    put,
    delete: del,
    request,
  };
};

