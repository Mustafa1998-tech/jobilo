'use client';

import { create } from 'zustand';
import { authApi } from '../api/endpoints';
import apiClient from '../api/client';

interface User {
  id: string;
  email: string;
  role: string;
  status: string;
  locale: string;
  profile?: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password, rememberMe) => {
    const { data } = await authApi.login({ email, password, rememberMe });
    try { localStorage.setItem('accessToken', data.accessToken); } catch {}
    if (data.refreshToken) {
      try { localStorage.setItem('refreshToken', data.refreshToken); } catch {}
    }
    set({ user: data.user, isAuthenticated: true });
  },

  register: async (userData) => {
    const { data } = await authApi.register(userData);
    try { localStorage.setItem('accessToken', data.accessToken); } catch {}
    set({ user: data.user, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await authApi.logout();
    } catch (e) { console.error('Logout error:', e); }
    try { localStorage.removeItem('accessToken'); } catch {}
    try { localStorage.removeItem('refreshToken'); } catch {}
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user) => set({ user, isAuthenticated: true }),

  checkAuth: async () => {
    try {
      var token = localStorage.getItem('accessToken');
    } catch { var token = null; }
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      const { data: userData } = await apiClient.get('/users/me');
      set({ user: userData, isAuthenticated: true, isLoading: false });
    } catch {
      try { localStorage.removeItem('accessToken'); } catch {}
      try { localStorage.removeItem('refreshToken'); } catch {}
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
