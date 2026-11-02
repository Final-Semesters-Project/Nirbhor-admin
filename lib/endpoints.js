// Central API Endpoints definition for Nirbhor Admin Portal
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: "/api/v1/auth/login",
    refresh: "/api/v1/auth/refresh",
    logout: "/api/v1/auth/logout",
    fcmToken: "/api/v1/auth/fcm/token",
  },

  // Current User
  users: {
    me: "/api/v1/users/me",
  },

  // Admin Management
  admin: {
    dashboard: "/api/v1/admin/dashboard",
    pendingVerifications: "/api/v1/admin/pendingVerifications",
    verificationAction: (providerId) => `/api/v1/admin/verifications/${encodeURIComponent(providerId)}`,
    reports: "/api/v1/admin/reports",
    reportAction: (reportId) => `/api/v1/admin/reports/${encodeURIComponent(reportId)}`,
    users: "/api/v1/admin/users",
    userDetail: (userId) => `/api/v1/admin/users/${encodeURIComponent(userId)}`,
    toggleUser: (userId) => `/api/v1/admin/users/${encodeURIComponent(userId)}/toggle`,
    analytics: "/api/v1/admin/analytics",
  },

  // Super Admin Access
  superAdmin: {
    admins: "/api/v1/super-admin/admins",
    createAdmin: "/api/v1/super-admin/admins",
    toggleAdmin: (adminId) => `/api/v1/super-admin/admins/${encodeURIComponent(adminId)}/toggle`,
    auditLogs: "/api/v1/super-admin/audit-logs",
  },

  // Category Management
  category: {
    list: "/api/v1/category/list",
    create: "/api/v1/category/create",
  },

  // Skill Management
  skill: {
    byCategory: (categoryId) => `/api/v1/skill/${encodeURIComponent(categoryId)}/skills`,
    create: "/api/v1/skill/create",
  },
};
