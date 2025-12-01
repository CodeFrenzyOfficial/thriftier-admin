/**
 * Authentication Service
 * Handles all authentication related API calls
 */

import api from "./api";
import Cookies from "js-cookie";

// Cookie configuration
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: import.meta.env.PROD, // Only use secure in production
  sameSite: "strict" as const,
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  location: string;
  role: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    emailVerified: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/login", credentials);

    console.log("Auth Service - Login response:", response);
    console.log("Auth Service - User:", response.user);
    console.log("Auth Service - Tokens:", response.tokens);

    // Store tokens in cookies
    if (response.tokens) {
      Cookies.set("accessToken", response.tokens.accessToken, COOKIE_OPTIONS);
      Cookies.set("refreshToken", response.tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        expires: 30, // Refresh token lasts longer (30 days)
      });
      console.log("Auth Service - Tokens stored in cookies");
    } else {
      console.error("Auth Service - No tokens in response!");
    }

    return response;
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);

    // Store tokens in cookies
    if (response.tokens) {
      Cookies.set("accessToken", response.tokens.accessToken, COOKIE_OPTIONS);
      Cookies.set("refreshToken", response.tokens.refreshToken, {
        ...COOKIE_OPTIONS,
        expires: 30, // Refresh token lasts longer (30 days)
      });
    }

    return response;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    const refreshToken = Cookies.get("refreshToken");

    if (refreshToken) {
      try {
        await api.post("/auth/logout", { refreshToken });
      } catch (error) {
        console.error("Logout error:", error);
      }
    }

    // Clear tokens from cookies
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<RefreshTokenResponse> {
    const refreshToken = Cookies.get("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await api.post<RefreshTokenResponse>("/auth/refresh", {
      refreshToken,
    });

    // Update access token in cookies
    if (response.accessToken) {
      Cookies.set("accessToken", response.accessToken, COOKIE_OPTIONS);
    }

    return response;
  }

  /**
   * Get current user profile
   */
  async getMe(): Promise<UserProfile> {
    return await api.get<UserProfile>("/auth/me");
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<{ message: string }> {
    return await api.post("/auth/verify-email", { token });
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!Cookies.get("accessToken");
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return Cookies.get("accessToken") || null;
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return Cookies.get("refreshToken") || null;
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
