'use client';

import axios from 'axios';

const adminClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

adminClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    try {
      const token = localStorage.getItem('adminAccessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {}
    config.headers['Accept-Language'] = 'ar';
  }
  return config;
});

adminClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        let refreshToken;
        try { refreshToken = localStorage.getItem('adminRefreshToken'); } catch {}
        const { data } = await axios.post(
          `${adminClient.defaults.baseURL}/super-admin/auth/refresh`,
          { refreshToken },
        );
        try { localStorage.setItem('adminAccessToken', data.accessToken); } catch {}
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return adminClient(originalRequest);
      } catch {
        try { localStorage.removeItem('adminAccessToken'); } catch {}
        try { localStorage.removeItem('adminRefreshToken'); } catch {}
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  },
);

export default adminClient;
