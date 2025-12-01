<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import { useLayout } from "./stores/layout";
import { useTokenRefresh } from "./composables/useTokenRefresh";

const { init } = useLayout();
const { startTokenRefresh } = useTokenRefresh();

onMounted(() => {
  init();
  startTokenRefresh();
});
</script>
