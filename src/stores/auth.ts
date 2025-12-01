/**
 * Auth Store
 * Manages authentication state with Pinia
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import Cookies from "js-cookie";
import authService, {
  type LoginCredentials,
  type RegisterData,
} from "@/services/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  emailVerified: boolean;
}

export const useAuthStore = defineStore(
  "auth",
  () => {
    // State
    const user = ref<User | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const initialized = ref(false);

    // Getters
    const isAuthenticated = computed(
      () => !!user.value && authService.isAuthenticated()
    );
    const userRole = computed(() => user.value?.role || "");
    const userName = computed(() => user.value?.name || "");
    const userEmail = computed(() => user.value?.email || "");

    // Actions
    async function login(credentials: LoginCredentials) {
      loading.value = true;
      error.value = null;

      try {
        const response = await authService.login(credentials);
        console.log("Auth Store - Login response:", response);
        console.log("Auth Store - Setting user to:", response.user);

        user.value = response.user;

        console.log("Auth Store - User set to:", user.value);
        console.log("Auth Store - isAuthenticated:", isAuthenticated.value);

        return response;
      } catch (err: any) {
        error.value = err.message || "Login failed";
        console.error("Auth Store - Login error:", err);
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function register(data: RegisterData) {
      loading.value = true;
      error.value = null;

      try {
        const response = await authService.register(data);
        user.value = response.user;
        return response;
      } catch (err: any) {
        error.value = err.message || "Registration failed";
        throw err;
      } finally {
        loading.value = false;
      }
    }

    async function logout() {
      loading.value = true;
      error.value = null;

      try {
        await authService.logout();
        user.value = null;
      } catch (err: any) {
        error.value = err.message || "Logout failed";
        console.error("Logout error:", err);
      } finally {
        loading.value = false;
      }
    }

    async function fetchUser() {
      if (!authService.isAuthenticated()) {
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const profile = await authService.getMe();
        user.value = {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          emailVerified: profile.emailVerified,
        };
      } catch (err: any) {
        error.value = err.message || "Failed to fetch user";
        // If token is invalid, clear user data
        if (
          err.message.includes("401") ||
          err.message.includes("Unauthorized")
        ) {
          user.value = null;
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
        }
      } finally {
        loading.value = false;
      }
    }

    async function refreshToken() {
      try {
        await authService.refreshToken();
      } catch (err: any) {
        error.value = err.message || "Failed to refresh token";
        user.value = null;
        throw err;
      }
    }

    function clearError() {
      error.value = null;
    }

    // Initialize user from token if available
    async function initialize() {
      if (initialized.value) {
        return;
      }

      if (authService.isAuthenticated()) {
        await fetchUser();
      }

      initialized.value = true;
    }

    return {
      // State
      user,
      loading,
      error,
      initialized,

      // Getters
      isAuthenticated,
      userRole,
      userName,
      userEmail,

      // Actions
      login,
      register,
      logout,
      fetchUser,
      refreshToken,
      clearError,
      initialize,
    };
  },
  {
    persist: true,
  }
);
