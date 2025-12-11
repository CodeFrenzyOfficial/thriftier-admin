<template>
  <div class="card">
    <div class="p-6">
      <div class="flex items-center justify-between mb-4">
        <h4 class="text-lg font-semibold text-default-900">Recent Users</h4>
        <RouterLink
          to="/user"
          class="text-sm text-primary hover:underline flex items-center font-medium"
        >
          View All
          <Icon icon="lucide:arrow-right" class="w-4 h-4 ml-1" />
        </RouterLink>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-8">
        <Icon
          icon="lucide:loader-2"
          class="w-8 h-8 animate-spin text-primary"
        />
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && users.length === 0" class="text-center py-8">
        <Icon
          icon="lucide:users"
          class="w-12 h-12 mx-auto text-default-300 mb-2"
        />
        <p class="text-default-500">No users found</p>
      </div>

      <!-- Users Table -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-default-200">
          <thead class="bg-default-150">
            <tr class="text-sm font-normal text-default-700 whitespace-nowrap">
              <th scope="col" class="px-4 py-3 text-start font-semibold">
                User
              </th>
              <th scope="col" class="px-4 py-3 text-start font-semibold">
                Role
              </th>
              <th scope="col" class="px-4 py-3 text-start font-semibold">
                Location
              </th>
              <th scope="col" class="px-4 py-3 text-start font-semibold">
                Status
              </th>
              <th scope="col" class="px-4 py-3 text-start font-semibold">
                Joined
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-default-200">
            <tr
              v-for="user in users"
              :key="user.id"
              class="hover:bg-default-100 transition-colors"
            >
              <td class="px-4 py-3">
                <div class="flex items-center">
                  <div
                    class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold mr-3"
                  >
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <p class="text-sm font-medium text-default-900">
                      {{ user.name }}
                    </p>
                    <p class="text-xs text-default-500">{{ user.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="getRoleBadgeClass(user.role)"
                  class="px-2 py-1 rounded text-xs font-medium"
                >
                  {{ user.role }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-default-700">
                  {{ user.location || "N/A" }}
                </p>
              </td>
              <td class="px-4 py-3">
                <span
                  :class="
                    user.isActive
                      ? 'bg-success/10 text-success'
                      : 'bg-danger/10 text-danger'
                  "
                  class="px-2 py-1 rounded text-xs font-medium"
                >
                  {{ user.isActive ? "Active" : "Inactive" }}
                </span>
              </td>
              <td class="px-4 py-3">
                <p class="text-sm text-default-600">
                  {{ formatDate(user.createdAt) }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";
import { userService } from "@/services/user.service";
import type { User } from "@/services/user.service";

const users = ref<User[]>([]);
const loading = ref(false);

const fetchRecentUsers = async () => {
  loading.value = true;
  try {
    const response = await userService.getUsers({ page: 1, limit: 5 });
    users.value = response.data;
  } catch (error) {
    console.error("Failed to fetch recent users:", error);
  } finally {
    loading.value = false;
  }
};

const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const getRoleBadgeClass = (role: string): string => {
  const roleClasses: Record<string, string> = {
    ADMIN: "bg-purple-500/10 text-purple-600",
    DRIVER: "bg-info/10 text-info",
    USER: "bg-default-200 text-default-700",
  };
  return roleClasses[role] || roleClasses.USER;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

onMounted(() => {
  fetchRecentUsers();
});
</script>
