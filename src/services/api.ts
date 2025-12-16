/**
 * API Service
 * Handles all HTTP requests to the backend API
 */

import Cookies from "js-cookie";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  skipAuth?: boolean;
}

class ApiService {
  private baseURL: string;
  private isRefreshing: boolean = false;
  private refreshPromise: Promise<string> | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  /**
   * Decode JWT token to get expiration
   */
  private decodeToken(token: string): any {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired or about to expire (within 2 minutes)
   */
  private isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;

    // Refresh if token expires in less than 2 minutes (120 seconds)
    return timeUntilExpiry < 120;
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<string> {
    // If already refreshing, return the existing promise
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;

    this.refreshPromise = (async () => {
      try {
        const refreshToken = Cookies.get("refreshToken");

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        const newAccessToken = data.data?.accessToken || data.accessToken;

        if (newAccessToken) {
          Cookies.set("accessToken", newAccessToken, {
            expires: 7,
            secure: import.meta.env.PROD,
            sameSite: "strict",
          });
          return newAccessToken;
        }

        throw new Error("No access token in refresh response");
      } catch (error) {
        // Clear tokens and redirect to login
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        throw error;
      } finally {
        this.isRefreshing = false;
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  /**
   * Get authorization header (with automatic token refresh)
   */
  private async getAuthHeader(): Promise<HeadersInit> {
    const token = Cookies.get("accessToken");

    if (!token) {
      return {};
    }

    // Check if token is expired or about to expire
    if (this.isTokenExpired(token)) {
      try {
        const newToken = await this.refreshAccessToken();
        return { Authorization: `Bearer ${newToken}` };
      } catch (error) {
        console.error("Failed to refresh token:", error);
        return {};
      }
    }

    return { Authorization: `Bearer ${token}` };
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(
    response: Response,
    isRetry: boolean = false
  ): Promise<T> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    if (!response.ok) {
      // Handle 401 Unauthorized - try to refresh token and retry
      if (response.status === 401 && !isRetry) {
        try {
          await this.refreshAccessToken();
          // Token refreshed, retry will happen in the request method
          throw new Error("TOKEN_REFRESH_NEEDED");
        } catch {
          // Token refresh failed, user will be redirected to login
          throw new Error("Session expired. Please login again.");
        }
      }

      let errorMessage = `HTTP error! status: ${response.status}`;

      if (isJson) {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      }

      throw new Error(errorMessage);
    }

    if (isJson) {
      const jsonResponse = await response.json();

      // If response has pagination, return both data and pagination
      if (
        jsonResponse.pagination !== undefined &&
        jsonResponse.data !== undefined
      ) {
        return {
          data: jsonResponse.data,
          pagination: jsonResponse.pagination,
        } as T;
      }

      // Backend wraps responses in { success, message, data }
      // Unwrap the data property if it exists
      if (jsonResponse.data !== undefined) {
        return jsonResponse.data as T;
      }

      return jsonResponse as T;
    }

    return {} as T;
  }

  /**
   * Make a request
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {},
    isRetry: boolean = false
  ): Promise<T> {
    const { params, headers, skipAuth, ...restOptions } = options;

    const url = this.buildURL(endpoint, params);

    // Get auth header (will auto-refresh if needed)
    const authHeader = skipAuth ? {} : await this.getAuthHeader();

    const config: RequestInit = {
      ...restOptions,
      headers: {
        "Content-Type": "application/json",
        ...authHeader,
        ...headers,
      },
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response, isRetry);
    } catch (err) {
      // If token refresh was needed and this wasn't a retry, retry once
      if (
        err instanceof Error &&
        err.message === "TOKEN_REFRESH_NEEDED" &&
        !isRetry
      ) {
        return this.request<T>(endpoint, options, true);
      }
      throw err;
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

// Export singleton instance
export const api = new ApiService(API_BASE_URL);
export default api;
