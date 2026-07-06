'use client';

import { create } from 'zustand';
import adminClient from '../api/admin-client';

interface AdminUser {
  id: string;
  email: string;
  role: string;
  roles: string[];
  permissions: string[];
  profile: { firstName: string; lastName: string };
}

interface AdminAuthState {
  admin: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  hasPermission: (module: string, action: string) => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  admin: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    const { data } = await adminClient.post('/super-admin/auth/login', { email, password });
    try { localStorage.setItem('adminAccessToken', data.accessToken); } catch {}
    try { localStorage.setItem('adminRefreshToken', data.refreshToken); } catch {}
    set({ admin: data.admin, isAuthenticated: true });
  },

  logout: async () => {
    try {
      await adminClient.post('/super-admin/auth/logout');
    } catch (e) { console.error('Logout error:', e); }
    try { localStorage.removeItem('adminAccessToken'); } catch {}
    try { localStorage.removeItem('adminRefreshToken'); } catch {}
    set({ admin: null, isAuthenticated: false });
  },

  checkAuth: async () => {
    try {
      var token = localStorage.getItem('adminAccessToken');
    } catch { var token = null; }
    if (!token) {
      set({ admin: null, isAuthenticated: false, isLoading: false });
      return;
    }
    try {
      const { data } = await adminClient.get('/super-admin/dashboard/stats');
      try { var stored = localStorage.getItem('adminUserData'); } catch { var stored = null; }
      if (stored) {
        set({ admin: JSON.parse(stored), isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      try { localStorage.removeItem('adminAccessToken'); } catch {}
      try { localStorage.removeItem('adminRefreshToken'); } catch {}
      set({ admin: null, isAuthenticated: false, isLoading: false });
    }
  },

  hasPermission: (module: string, action: string) => {
    const { admin } = get();
    if (!admin) return false;
    if (admin.role === 'SUPER_ADMIN') return true;
    return admin.permissions.includes(`${module}_${action}`);
  },
}));
