import adminClient from './admin-client';

export const adminApi = {
  // Dashboard
  getDashboardStats: () => adminClient.get('/super-admin/dashboard/stats'),
  getDashboardRevenue: () => adminClient.get('/super-admin/dashboard/revenue'),
  getRecentRegistrations: (limit?: number) => adminClient.get('/super-admin/dashboard/recent-registrations', { params: { limit } }),
  getRecentActivity: (limit?: number) => adminClient.get('/super-admin/dashboard/recent-activity', { params: { limit } }),

  // Users
  listUsers: (params?: any) => adminClient.get('/super-admin/users', { params }),
  getUser: (id: string) => adminClient.get(`/super-admin/users/${id}`),
  updateUser: (id: string, data: any) => adminClient.patch(`/super-admin/users/${id}`, data),
  updateUserStatus: (id: string, status: string) => adminClient.patch(`/super-admin/users/${id}/status`, { status }),
  banUser: (id: string, reason?: string, durationMinutes?: number) => adminClient.post(`/super-admin/users/${id}/ban`, { reason, durationMinutes }),
  unbanUser: (id: string) => adminClient.post(`/super-admin/users/${id}/unban`),
  deleteUser: (id: string) => adminClient.delete(`/super-admin/users/${id}`),
  resetUserPassword: (id: string, newPassword: string) => adminClient.post(`/super-admin/users/${id}/reset-password`, { newPassword }),
  changeUserRole: (id: string, role: string) => adminClient.patch(`/super-admin/users/${id}/role`, { role }),
  getUserActivity: (id: string, params?: any) => adminClient.get(`/super-admin/users/${id}/activity`, { params }),

  // Projects
  listProjects: (params?: any) => adminClient.get('/super-admin/projects', { params }),
  getProject: (id: string) => adminClient.get(`/super-admin/projects/${id}`),
  updateProject: (id: string, data: any) => adminClient.patch(`/super-admin/projects/${id}`, data),
  deleteProject: (id: string) => adminClient.delete(`/super-admin/projects/${id}`),
  updateProjectStatus: (id: string, status: string) => adminClient.patch(`/super-admin/projects/${id}/status`, { status }),
  toggleFeatured: (id: string) => adminClient.post(`/super-admin/projects/${id}/feature`),

  // Proposals
  listProposals: (params?: any) => adminClient.get('/super-admin/proposals', { params }),
  getProposal: (id: string) => adminClient.get(`/super-admin/proposals/${id}`),
  deleteProposal: (id: string) => adminClient.delete(`/super-admin/proposals/${id}`),

  // Disputes
  listDisputes: (params?: any) => adminClient.get('/super-admin/disputes', { params }),
  getDispute: (id: string) => adminClient.get(`/super-admin/disputes/${id}`),
  resolveDispute: (id: string, data: any) => adminClient.post(`/super-admin/disputes/${id}/resolve`, data),
  closeDispute: (id: string) => adminClient.post(`/super-admin/disputes/${id}/close`),

  // Reports
  listReports: (params?: any) => adminClient.get('/super-admin/reports', { params }),
  reviewReport: (id: string, data: any) => adminClient.post(`/super-admin/reports/${id}/review`, data),

  // Subscriptions
  listPlans: () => adminClient.get('/super-admin/subscriptions/plans'),
  getPlan: (id: string) => adminClient.get(`/super-admin/subscriptions/plans/${id}`),
  createPlan: (data: any) => adminClient.post('/super-admin/subscriptions/plans', data),
  updatePlan: (id: string, data: any) => adminClient.patch(`/super-admin/subscriptions/plans/${id}`, data),
  deletePlan: (id: string) => adminClient.delete(`/super-admin/subscriptions/plans/${id}`),
  togglePlan: (id: string) => adminClient.post(`/super-admin/subscriptions/plans/${id}/toggle`),
  listSubscriptions: (params?: any) => adminClient.get('/super-admin/subscriptions', { params }),

  // Content
  listPages: () => adminClient.get('/super-admin/content/pages'),
  getPage: (id: string) => adminClient.get(`/super-admin/content/pages/${id}`),
  createPage: (data: any) => adminClient.post('/super-admin/content/pages', data),
  updatePage: (id: string, data: any) => adminClient.patch(`/super-admin/content/pages/${id}`, data),
  deletePage: (id: string) => adminClient.delete(`/super-admin/content/pages/${id}`),

  listBlogPosts: (params?: any) => adminClient.get('/super-admin/content/blog', { params }),
  getBlogPost: (id: string) => adminClient.get(`/super-admin/content/blog/${id}`),
  createBlogPost: (data: any) => adminClient.post('/super-admin/content/blog', data),
  updateBlogPost: (id: string, data: any) => adminClient.patch(`/super-admin/content/blog/${id}`, data),
  deleteBlogPost: (id: string) => adminClient.delete(`/super-admin/content/blog/${id}`),

  listFaqCategories: () => adminClient.get('/super-admin/content/faq-categories'),
  createFaqCategory: (data: any) => adminClient.post('/super-admin/content/faq-categories', data),
  listFaqs: () => adminClient.get('/super-admin/content/faqs'),
  createFaq: (data: any) => adminClient.post('/super-admin/content/faqs', data),
  updateFaq: (id: string, data: any) => adminClient.patch(`/super-admin/content/faqs/${id}`, data),
  deleteFaq: (id: string) => adminClient.delete(`/super-admin/content/faqs/${id}`),

  listBanners: () => adminClient.get('/super-admin/content/banners'),
  createBanner: (data: any) => adminClient.post('/super-admin/content/banners', data),
  updateBanner: (id: string, data: any) => adminClient.patch(`/super-admin/content/banners/${id}`, data),
  deleteBanner: (id: string) => adminClient.delete(`/super-admin/content/banners/${id}`),

  // Settings
  getPlatformSettings: () => adminClient.get('/super-admin/settings/platform'),
  updatePlatformSettings: (data: any) => adminClient.put('/super-admin/settings/platform', data),
  getEmailSettings: () => adminClient.get('/super-admin/settings/email'),
  updateEmailSettings: (data: any) => adminClient.put('/super-admin/settings/email', data),
  getStorageSettings: () => adminClient.get('/super-admin/settings/storage'),
  updateStorageSettings: (data: any) => adminClient.put('/super-admin/settings/storage', data),
  getAiSettings: () => adminClient.get('/super-admin/settings/ai'),
  updateAiSettings: (data: any) => adminClient.put('/super-admin/settings/ai', data),
  getNotificationSettings: () => adminClient.get('/super-admin/settings/notifications'),
  updateNotificationSettings: (data: any) => adminClient.put('/super-admin/settings/notifications', data),
  getSeoSettings: () => adminClient.get('/super-admin/settings/seo'),
  updateSeoSettings: (data: any) => adminClient.put('/super-admin/settings/seo', data),
  getSecuritySettings: () => adminClient.get('/super-admin/settings/security'),
  updateSecuritySettings: (data: any) => adminClient.put('/super-admin/settings/security', data),

  // Roles
  listRoles: () => adminClient.get('/super-admin/roles'),
  getRole: (id: string) => adminClient.get(`/super-admin/roles/${id}`),
  createRole: (data: any) => adminClient.post('/super-admin/roles', data),
  updateRole: (id: string, data: any) => adminClient.patch(`/super-admin/roles/${id}`, data),
  deleteRole: (id: string) => adminClient.delete(`/super-admin/roles/${id}`),
  updateRolePermissions: (id: string, permissionIds: string[]) => adminClient.put(`/super-admin/roles/${id}/permissions`, { permissionIds }),
  listPermissions: () => adminClient.get('/super-admin/roles/permissions/list'),

  // Logs
  getAuditLogs: (params?: any) => adminClient.get('/super-admin/logs/audit', { params }),
  getLoginLogs: (params?: any) => adminClient.get('/super-admin/logs/login', { params }),
  getErrorLogs: (params?: any) => adminClient.get('/super-admin/logs/errors', { params }),
  getSecurityLogs: (params?: any) => adminClient.get('/super-admin/logs/security', { params }),

  // Analytics
  getAnalyticsOverview: () => adminClient.get('/super-admin/analytics/overview'),
  getUserAnalytics: () => adminClient.get('/super-admin/analytics/users'),
  getRevenueAnalytics: () => adminClient.get('/super-admin/analytics/revenue'),
  getTopSkills: (limit?: number) => adminClient.get('/super-admin/analytics/skills', { params: { limit } }),
  getTopFreelancers: (limit?: number) => adminClient.get('/super-admin/analytics/top-freelancers', { params: { limit } }),
  getTopClients: (limit?: number) => adminClient.get('/super-admin/analytics/top-clients', { params: { limit } }),

  // Security
  getIpWhitelist: () => adminClient.get('/super-admin/security/ip-whitelist'),
  addIpWhitelist: (data: any) => adminClient.post('/super-admin/security/ip-whitelist', data),
  removeIpWhitelist: (id: string) => adminClient.delete(`/super-admin/security/ip-whitelist/${id}`),
  getIpBlacklist: () => adminClient.get('/super-admin/security/ip-blacklist'),
  addIpBlacklist: (data: any) => adminClient.post('/super-admin/security/ip-blacklist', data),
  removeIpBlacklist: (id: string) => adminClient.delete(`/super-admin/security/ip-blacklist/${id}`),
  getDevices: () => adminClient.get('/super-admin/security/devices'),
  revokeDevice: (id: string) => adminClient.post(`/super-admin/security/devices/${id}/revoke`),
  getSessions: () => adminClient.get('/super-admin/security/sessions'),
  terminateSession: (id: string) => adminClient.post(`/super-admin/security/sessions/${id}/terminate`),
};
