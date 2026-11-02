import { getAccessToken, clearAuthSession } from "./auth";

// API Base URL - defaults to Render backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://nirbhor-backend-6yuf.onrender.com/api/v1";

const STAGING_KEY =
  process.env.NEXT_PUBLIC_STAGING_KEY ||
  "apikeytoidentifyiftherequestiscomingfromfrontendteam";

/**
 * Universal API Request handler for Nirbhor Admin
 * Injects required staging, language, authorization and no-cache headers.
 */
export async function apiRequest(
  endpoint,
  {
    method = "GET",
    body,
    accessToken,
    headers = {},
    params,
    signal,
  } = {}
) {
  // Use passed token or retrieve from storage
  const token = accessToken !== undefined ? accessToken : getAccessToken();

  // Normalize base and endpoint
  let cleanBase = API_BASE_URL.replace(/\/$/, "");
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Deduplicate /api/v1 if cleanBase already has it
  if (cleanBase.endsWith("/api/v1") && cleanEndpoint.startsWith("/api/v1")) {
    cleanEndpoint = cleanEndpoint.replace(/^\/api\/v1/, "");
  }

  // Build target URL:
  // In browser, use same-origin relative path /api/v1/... so Next.js proxies to backend without CORS issues.
  const computedUrl = (() => {
    if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
      return endpoint;
    }
    if (typeof window !== "undefined") {
      const relativePath = cleanEndpoint.startsWith("/api/v1")
        ? cleanEndpoint
        : `/api/v1${cleanEndpoint}`;
      return `${window.location.origin}${relativePath}`;
    }
    return `${cleanBase}${cleanEndpoint}`;
  })();

  // URL object for adding search params & cache busting
  const targetUrl = new URL(computedUrl);

  if (params && typeof params === "object") {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        targetUrl.searchParams.append(key, String(value));
      }
    });
  }

  // Add cache-busting timestamp to GET requests
  if (method.toUpperCase() === "GET") {
    targetUrl.searchParams.set("_t", Date.now().toString());
  }

  // Construct mandatory headers:
  const requestHeaders = {
    Accept: "application/json",
    "Accept-Language": "en",
    "User-Agent": "web",
    "X-Staging-Key": STAGING_KEY,
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    ...headers,
  };

  if (token) {
    requestHeaders["Authorization"] = `Bearer ${token}`;
  }

  // Format request body
  let requestBody;
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const isUrlEncoded = typeof URLSearchParams !== "undefined" && body instanceof URLSearchParams;

  if (isFormData) {
    // Browser automatically sets Content-Type: multipart/form-data with boundary
    requestBody = body;
  } else if (isUrlEncoded) {
    requestHeaders["Content-Type"] = "application/x-www-form-urlencoded";
    requestBody = body.toString();
  } else if (body !== undefined && body !== null) {
    requestHeaders["Content-Type"] = "application/json";
    requestBody = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(targetUrl.toString(), {
      method,
      headers: requestHeaders,
      body: requestBody,
      cache: "no-store",
      signal,
    });
  } catch (networkError) {
    const error = new Error(
      `Network connection failed: Unable to connect to backend at ${API_BASE_URL}. Ensure the backend server is running.`
    );
    error.isNetworkError = true;
    error.originalError = networkError;
    throw error;
  }

  // Parse response
  const responseText = await response.text();
  let responseData = null;

  if (responseText) {
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
  }

  // Handle errors
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;

    if (responseData) {
      if (typeof responseData.detail === "string") {
        errorMessage = responseData.detail;
      } else if (Array.isArray(responseData.detail)) {
        errorMessage = responseData.detail
          .map((d) => d.msg || JSON.stringify(d))
          .join(", ");
      } else if (responseData.message) {
        errorMessage = responseData.message;
      }
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.data = responseData;

    // Handle token expiration/revocation
    if (response.status === 401 && !endpoint.includes("/auth/login")) {
      clearAuthSession();
    }

    throw error;
  }

  return responseData;
}
