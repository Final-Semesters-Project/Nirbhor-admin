// =====================================
// AUTHENTICATION SESSION STORAGE
// =====================================

const ACCESS_TOKEN_KEY = "nirbhor_admin_access_token";
const REFRESH_TOKEN_KEY = "nirbhor_admin_refresh_token";
const TOKEN_TYPE_KEY = "nirbhor_admin_token_type";
const ROLE_KEY = "nirbhor_admin_role";
const USER_ID_KEY = "nirbhor_admin_user_id";
const USER_DATA_KEY = "nirbhor_admin_user_data";

export function saveAuthSession(data) {
  if (typeof window === "undefined") return;

  if (!data?.access_token) {
    throw new Error("Access token was not returned by the backend.");
  }

  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);

  if (data.refresh_token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  }
  if (data.token_type) {
    localStorage.setItem(TOKEN_TYPE_KEY, data.token_type);
  }
  if (data.role) {
    localStorage.setItem(ROLE_KEY, data.role);
  }
  if (data.user_id) {
    localStorage.setItem(USER_ID_KEY, String(data.user_id));
  }
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getUserRole() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY);
}

export function getUserId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

export function saveCurrentUserData(user) {
  if (typeof window === "undefined") return;
  if (!user) {
    localStorage.removeItem(USER_DATA_KEY);
    return;
  }
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));
}

export function getCurrentUserData() {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_TYPE_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_DATA_KEY);
}

export function isAuthenticated() {
  return Boolean(getAccessToken());
}

