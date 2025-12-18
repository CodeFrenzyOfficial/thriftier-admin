<template>
  <Vertical>
    <PageTitle title="Dashboard" subtitle="Overview" />

    <!-- Welcome Card -->
    <WelcomeCard class="mb-5" />

    <!-- User Statistics -->
    <UserStats class="mb-5" />

    <!-- Recent Users Table -->
    <RecentUsers />
  </Vertical>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PageTitle from "@/components/PageTitle.vue";
import Vertical from "@/layouts/vertical.vue";
import WelcomeCard from "./components/WelcomeCard.vue";
import UserStats from "./components/UserStats.vue";
import RecentUsers from "./components/RecentUsers.vue";
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Redirect drivers to their specific dashboard
onMounted(() => {
  if (authStore.userRole?.toLowerCase() === 'driver') {
    router.replace('/driver/dashboard');
  }
});
</script>
