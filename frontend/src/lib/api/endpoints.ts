import apiClient from './client';

export const authApi = {
  register: (data: any) => apiClient.post('/auth/register', data),
  login: (data: any) => apiClient.post('/auth/login', data),
  logout: () => apiClient.post('/auth/logout'),
  refresh: (refreshToken: string) => apiClient.post('/auth/refresh', { refreshToken }),
  verifyEmail: (data: any) => apiClient.post('/auth/verify-email', data),
  forgotPassword: (email: string) => apiClient.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => apiClient.post('/auth/reset-password', data),
  changePassword: (data: any) => apiClient.post('/auth/change-password', data),
  getSessions: () => apiClient.get('/auth/sessions'),
  terminateSession: (id: string) => apiClient.delete(`/auth/sessions/${id}`),
};

export const usersApi = {
  getProfile: () => apiClient.get('/users/me'),
  updateProfile: (data: any) => apiClient.patch('/users/me', data),
  deleteAccount: () => apiClient.delete('/users/me'),
  getPublicProfile: (id: string) => apiClient.get(`/users/${id}`),
  getUserPortfolio: (id: string) => apiClient.get(`/users/${id}/portfolio`),
  getUserReviews: (id: string) => apiClient.get(`/users/${id}/reviews`),
  list: (params?: any) => apiClient.get('/users', { params }),
  changeRole: (id: string, role: string) => apiClient.patch(`/users/${id}/role`, { role }),
  changeStatus: (id: string, status: string) => apiClient.patch(`/users/${id}/status`, { status }),
  verifyUser: (id: string) => apiClient.post(`/users/${id}/verify`),
};

export const projectsApi = {
  list: (params?: any) => apiClient.get('/projects', { params }),
  getFeatured: () => apiClient.get('/projects/featured'),
  getById: (id: string) => apiClient.get(`/projects/${id}`),
  create: (data: any) => apiClient.post('/projects', data),
  update: (id: string, data: any) => apiClient.patch(`/projects/${id}`, data),
  delete: (id: string) => apiClient.delete(`/projects/${id}`),
  updateStatus: (id: string, status: string) => apiClient.patch(`/projects/${id}/status`, { status }),
  getSimilar: (id: string) => apiClient.get(`/projects/${id}/similar`),
  bookmark: (id: string) => apiClient.post(`/projects/${id}/bookmark`),
  removeBookmark: (id: string) => apiClient.delete(`/projects/${id}/bookmark`),
  report: (id: string, reason: string) => apiClient.post(`/projects/${id}/report`, { reason }),
};

export const proposalsApi = {
  create: (projectId: string, data: any) => apiClient.post(`/proposals/projects/${projectId}`, data),
  list: (params?: any) => apiClient.get('/proposals', { params }),
  getById: (id: string) => apiClient.get(`/proposals/${id}`),
  update: (id: string, data: any) => apiClient.patch(`/proposals/${id}`, data),
  withdraw: (id: string) => apiClient.delete(`/proposals/${id}`),
  accept: (id: string) => apiClient.patch(`/proposals/${id}/accept`),
  reject: (id: string) => apiClient.patch(`/proposals/${id}/reject`),
  shortlist: (id: string) => apiClient.patch(`/proposals/${id}/shortlist`),
};

export const messagesApi = {
  getConversations: () => apiClient.get('/messages/conversations'),
  getConversation: (userId: string) => apiClient.get(`/messages/conversations/${userId}`),
  getProjectMessages: (projectId: string) => apiClient.get(`/messages/projects/${projectId}`),
  send: (data: any) => apiClient.post('/messages', data),
  markAsRead: (id: string) => apiClient.patch(`/messages/${id}/read`),
};

export const categoriesApi = {
  list: () => apiClient.get('/categories'),
  getById: (id: string) => apiClient.get(`/categories/${id}`),
};

export const skillsApi = {
  list: () => apiClient.get('/skills'),
};

export const adminApi = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getUsers: (params?: any) => apiClient.get('/admin/users', { params }),
  getUser: (id: string) => apiClient.get(`/admin/users/${id}`),
  getProjects: (params?: any) => apiClient.get('/admin/projects', { params }),
  getDisputes: () => apiClient.get('/admin/disputes'),
  resolveDispute: (id: string, data: any) => apiClient.post(`/admin/disputes/${id}/resolve`, data),
  getAuditLogs: (params?: any) => apiClient.get('/admin/audit-logs', { params }),
  featureProject: (id: string) => apiClient.post(`/projects/${id}/feature`),
  getReports: () => apiClient.get('/admin/reports'),
};
