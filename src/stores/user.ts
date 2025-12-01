/**
 * User Store
 * Manages user list state with Pinia
 */

import { defineStore } from "pinia";
import { ref } from "vue";
import { userService, type User } from "@/services/user.service";

export const useUserStore = defineStore("user", () => {
  // State
  const users = ref<User[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalPages = ref(0);
  const totalItems = ref(0);
  const hasNext = ref(false);
  const hasPrev = ref(false);

  // Actions
  async function fetchUsers(page: number = 1, limit: number = 10) {
    loading.value = true;
    error.value = null;

    try {
      const response = await userService.getUsers({ page, limit });
      users.value = response.data;
      currentPage.value = response.pagination.page;
      itemsPerPage.value = response.pagination.limit;
      totalPages.value = response.pagination.totalPages;
      totalItems.value = response.pagination.totalItems;
      hasNext.value = response.pagination.hasNext;
      hasPrev.value = response.pagination.hasPrev;
      return response;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch users";
      console.error("Error fetching users:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createUser(userData: any) {
    try {
      await userService.createUser(userData);
      // Refresh the user list after creating (stay on current page)
      await fetchUsers(currentPage.value, itemsPerPage.value);
    } catch (err: any) {
      error.value = err.message || "Failed to create user";
      throw err;
    }
  }

  async function deleteUser(userId: string) {
    try {
      await userService.deleteUser(userId);
      // Refresh the user list after deleting (stay on current page)
      await fetchUsers(currentPage.value, itemsPerPage.value);
    } catch (err: any) {
      error.value = err.message || "Failed to delete user";
      throw err;
    }
  }

  function clearUsers() {
    users.value = [];
    error.value = null;
    currentPage.value = 1;
    totalPages.value = 0;
    totalItems.value = 0;
  }

  return {
    // State
    users,
    loading,
    error,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    // Actions
    fetchUsers,
    createUser,
    deleteUser,
    clearUsers,
  };
});
