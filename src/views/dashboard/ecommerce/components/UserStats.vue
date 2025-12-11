<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    <!-- Total Users -->
    <div class="card">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-default-600 mb-1">Total Users</p>
            <h3 class="text-2xl font-bold text-default-900">
              {{ stats.totalUsers }}
            </h3>
          </div>
          <div
            class="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"
          >
            <Icon icon="lucide:users" class="w-6 h-6 text-primary" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-success flex items-center font-medium">
            <Icon icon="lucide:trending-up" class="w-4 h-4 mr-1" />
            +{{ stats.newUsersThisMonth }}
          </span>
          <span class="text-default-500 ml-2">this month</span>
        </div>
      </div>
    </div>

    <!-- Active Users -->
    <div class="card">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-default-600 mb-1">
              Active Users
            </p>
            <h3 class="text-2xl font-bold text-default-900">
              {{ stats.activeUsers }}
            </h3>
          </div>
          <div
            class="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center"
          >
            <Icon icon="lucide:user-check" class="w-6 h-6 text-success" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-default-700 font-medium">
            {{
              stats.totalUsers > 0
                ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)
                : 0
            }}%
          </span>
          <span class="text-default-500 ml-2">of total</span>
        </div>
      </div>
    </div>

    <!-- Admins -->
    <div class="card">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-default-600 mb-1">Admins</p>
            <h3 class="text-2xl font-bold text-default-900">
              {{ stats.adminCount }}
            </h3>
          </div>
          <div
            class="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center"
          >
            <Icon icon="lucide:shield-check" class="w-6 h-6 text-purple-500" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-default-500">System admins</span>
        </div>
      </div>
    </div>

    <!-- Drivers -->
    <div class="card">
      <div class="p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-default-600 mb-1">Drivers</p>
            <h3 class="text-2xl font-bold text-default-900">
              {{ stats.driverCount }}
            </h3>
          </div>
          <div
            class="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center"
          >
            <Icon icon="lucide:truck" class="w-6 h-6 text-warning" />
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-default-500">Delivery staff</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import api from "@/services/api";

interface UserStats {
  totalUsers: number;
  activeUsers: number;
  adminCount: number;
  driverCount: number;
  newUsersThisMonth: number;
}

const stats = ref<UserStats>({
  totalUsers: 0,
  activeUsers: 0,
  adminCount: 0,
  driverCount: 0,
  newUsersThisMonth: 0,
});

const loading = ref(false);

const fetchUserStats = async () => {
  loading.value = true;
  try {
    const response = await api.get<UserStats>("/users/stats");
    stats.value = response;
  } catch (error) {
    console.error("Failed to fetch user stats:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchUserStats();
});
</script>
