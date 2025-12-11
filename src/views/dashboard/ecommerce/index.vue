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
import PageTitle from "@/components/PageTitle.vue";
import Vertical from "@/layouts/vertical.vue";
import WelcomeCard from "./components/WelcomeCard.vue";
import UserStats from "./components/UserStats.vue";
import RecentUsers from "./components/RecentUsers.vue";
</script>
