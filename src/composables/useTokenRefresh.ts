/**
 * Token Refresh Composable
 * Automatically refreshes tokens in the background
 */

import { onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import Cookies from "js-cookie";

export function useTokenRefresh() {
  let intervalId: number | null = null;
  const authStore = useAuthStore();

  /**
   * Decode JWT token to get expiration
   */
  const decodeToken = (token: string): any => {
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
  };

  /**
   * Check if token needs refresh (expires in less than 5 minutes)
   */
  const shouldRefreshToken = (token: string): boolean => {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return false;

    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilExpiry = decoded.exp - currentTime;

    // Refresh if token expires in less than 5 minutes (300 seconds)
    return timeUntilExpiry < 300 && timeUntilExpiry > 0;
  };

  /**
   * Check and refresh token if needed
   */
  const checkAndRefreshToken = async () => {
    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      return;
    }

    if (shouldRefreshToken(accessToken)) {
      console.log("Token expiring soon, refreshing...");
      try {
        await authStore.refreshToken();
        console.log("Token refreshed successfully");
      } catch (error) {
        console.error("Failed to refresh token:", error);
      }
    }
  };

  /**
   * Start periodic token refresh check
   */
  const startTokenRefresh = () => {
    // Check every minute
    intervalId = window.setInterval(() => {
      checkAndRefreshToken();
    }, 60000); // 60 seconds

    // Also check immediately
    checkAndRefreshToken();
  };

  /**
   * Stop periodic token refresh
   */
  const stopTokenRefresh = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  onMounted(() => {
    if (authStore.isAuthenticated) {
      startTokenRefresh();
    }
  });

  onUnmounted(() => {
    stopTokenRefresh();
  });

  return {
    startTokenRefresh,
    stopTokenRefresh,
    checkAndRefreshToken,
  };
}
