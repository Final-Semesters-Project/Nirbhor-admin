import { apiRequest } from "./api";
import { API_ENDPOINTS } from "./endpoints";
import {
  saveAuthSession,
  clearAuthSession,
  saveCurrentUserData,
  getRefreshToken,
} from "./auth";

export const adminService = {
  // ==========================================
  // AUTHENTICATION
  // ==========================================

  /**
   * Login with phone number/username and password.
   * Sends application/x-www-form-urlencoded matching OAuth2PasswordRequestForm.
   */
  async login(username, password) {
    const formParams = new URLSearchParams();
    formParams.append("username", username.trim());
    formParams.append("password", password);

    const data = await apiRequest(API_ENDPOINTS.auth.login, {
      method: "POST",
      body: formParams,
    });

    saveAuthSession(data);

    // Fetch user profile
    try {
      const profile = await this.getCurrentUser();
      saveCurrentUserData(profile);
      return { ...data, user: profile };
    } catch {
      const fallbackUser = {
        user_id: data.user_id,
        role: data.role,
        name: username,
      };
      saveCurrentUserData(fallbackUser);
      return { ...data, user: fallbackUser };
    }
  },

  /**
   * Logout current administrator and invalidate refresh token.
   */
  async logout() {
    const refreshToken = getRefreshToken();
    try {
      if (refreshToken) {
        await apiRequest(API_ENDPOINTS.auth.logout, {
          method: "POST",
          body: { refresh_token: refreshToken },
        });
      }
    } catch (e) {
      console.warn("Logout notification failed:", e);
    } finally {
      clearAuthSession();
    }
  },

  /**
   * Fetch current authenticated user's profile.
   */
  async getCurrentUser() {
    return await apiRequest(API_ENDPOINTS.users.me);
  },

  // ==========================================
  // DASHBOARD
  // ==========================================

  /**
   * Get admin dashboard counts: total users, bookings, pending verifications, etc.
   */
  async getDashboard() {
    return await apiRequest(API_ENDPOINTS.admin.dashboard);
  },

  // ==========================================
  // VERIFICATIONS
  // ==========================================

  /**
   * List pending provider verifications (oldest first).
   */
  async getPendingVerifications(page = 1, pageSize = 20) {
    return await apiRequest(API_ENDPOINTS.admin.pendingVerifications, {
      params: { page, page_size: pageSize },
    });
  },

  /**
   * Approve or reject a provider verification.
   * @param {string} providerId
   * @param {"approved"|"rejected"} action
   * @param {string} [rejectionReason]
   */
  async handleVerification(providerId, action, rejectionReason = null) {
    return await apiRequest(API_ENDPOINTS.admin.verificationAction(providerId), {
      method: "PATCH",
      body: {
        verification_status: action,
        rejection_reason: rejectionReason,
      },
    });
  },

  // ==========================================
  // REPORTS & MODERATION
  // ==========================================

  /**
   * List reports with optional status filter (pending, under_investigation, reviewed, action_taken).
   */
  async getReports(status = null, page = 1, pageSize = 20) {
    const params = { page, page_size: pageSize };
    if (status && status !== "ALL") {
      params.status = status.toLowerCase();
    }
    return await apiRequest(API_ENDPOINTS.admin.reports, { params });
  },

  /**
   * Update report status and add internal moderation notes.
   * @param {string} reportId
   * @param {"pending"|"under_investigation"|"reviewed"|"action_taken"} status
   * @param {string} [adminInternalNotes]
   */
  async handleReport(reportId, status, adminInternalNotes = null) {
    return await apiRequest(API_ENDPOINTS.admin.reportAction(reportId), {
      method: "PATCH",
      body: {
        status,
        admin_internal_notes: adminInternalNotes,
      },
    });
  },

  // ==========================================
  // USER MANAGEMENT
  // ==========================================

  /**
   * List users with optional role & active status filters.
   */
  async getUsers(role = null, isActive = null, page = 1, pageSize = 20) {
    const params = { page, page_size: pageSize };
    if (role && role !== "All") {
      params.role = role.toLowerCase();
    }
    if (isActive !== null && isActive !== "All Status") {
      params.is_active = typeof isActive === "boolean" ? isActive : isActive === "Active";
    }
    return await apiRequest(API_ENDPOINTS.admin.users, { params });
  },

  /**
   * Get detailed profile for a single user.
   */
  async getUserDetail(userId) {
    return await apiRequest(API_ENDPOINTS.admin.userDetail(userId));
  },

  /**
   * Toggle user active/suspended state.
   */
  async toggleUserActive(userId) {
    return await apiRequest(API_ENDPOINTS.admin.toggleUser(userId), {
      method: "PATCH",
    });
  },

  // ==========================================
  // ANALYTICS
  // ==========================================

  /**
   * Get platform analytics: totals, weekly bookings, ratios.
   */
  async getAnalytics() {
    return await apiRequest(API_ENDPOINTS.admin.analytics);
  },

  // ==========================================
  // SUPER ADMIN MODULES
  // ==========================================

  /**
   * List all regular admin accounts.
   */
  async getAdmins() {
    return await apiRequest(API_ENDPOINTS.superAdmin.admins);
  },

  /**
   * Create a new regular admin account.
   */
  async createAdmin({ phone, password, name_en, name_bn }) {
    return await apiRequest(API_ENDPOINTS.superAdmin.createAdmin, {
      method: "POST",
      body: {
        phone: phone.trim(),
        password,
        name_en: name_en.trim(),
        name_bn: name_bn.trim() || name_en.trim(),
      },
    });
  },

  /**
   * Enable/disable a regular admin account.
   */
  async toggleAdminActive(adminId) {
    return await apiRequest(API_ENDPOINTS.superAdmin.toggleAdmin(adminId), {
      method: "PATCH",
    });
  },

  /**
   * View paginated audit logs.
   */
  async getAuditLogs(adminId = null, page = 1, pageSize = 50) {
    const params = { page, page_size: pageSize };
    if (adminId && adminId !== "All Admins") {
      params.admin_id = adminId;
    }
    return await apiRequest(API_ENDPOINTS.superAdmin.auditLogs, { params });
  },

  // ==========================================
  // CATEGORIES & SKILLS MANAGEMENT
  // ==========================================

  /**
   * List all categories (GET /api/v1/category/list).
   */
  async getCategories() {
    return await apiRequest(API_ENDPOINTS.category.list);
  },

  /**
   * Create a new category (POST /api/v1/category/create).
   */
  async createCategory({ name_en, name_bn }) {
    return await apiRequest(API_ENDPOINTS.category.create, {
      method: "POST",
      body: {
        name_en: name_en.trim(),
        name_bn: name_bn.trim(),
      },
    });
  },

  /**
   * List skills under a category (GET /api/v1/skill/{category_id}/skills).
   */
  async getSkillsByCategory(categoryId) {
    return await apiRequest(API_ENDPOINTS.skill.byCategory(categoryId));
  },

  /**
   * Create a new skill (POST /api/v1/skill/create).
   */
  async createSkill({ name_en, name_bn, category_id }) {
    return await apiRequest(API_ENDPOINTS.skill.create, {
      method: "POST",
      body: {
        name_en: name_en.trim(),
        name_bn: name_bn.trim(),
        category_id: Number(category_id),
      },
    });
  },
};

