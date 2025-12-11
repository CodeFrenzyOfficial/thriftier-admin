<template>
  <div class="topbar-item hs-dropdown relative inline-flex">
    <button
      class="cursor-pointer bg-pink-100 rounded-full"
      aria-haspopup="menu"
      aria-expanded="false"
      aria-label="Dropdown"
    >
      <img
        :src="avatar1"
        alt="user-image"
        class="hs-dropdown-toggle rounded-full size-9.5"
      />
    </button>
    <div
      class="hs-dropdown-menu min-w-48"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="hs-dropdown-with-icons"
    >
      <div class="p-2">
        <h6 class="mb-2 text-default-500">Welcome to Thriftier Store</h6>
        <div class="flex gap-3">
          <div class="relative inline-block">
            <div class="rounded bg-default-200">
              <img :src="avatar1" alt="" class="size-12 rounded" />
            </div>
            <span
              class="-top-1 -end-1 absolute w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"
            ></span>
          </div>
          <div>
            <h6 class="mb-1 text-sm font-semibold text-default-800">
              {{ authStore.userName || "User" }}
            </h6>
            <p class="text-default-500 text-xs">{{ authStore.userEmail }}</p>
            <p class="text-default-400 text-xs capitalize">
              {{ authStore.userRole }}
            </p>
          </div>
        </div>
      </div>
      <div class="border-t border-t-default-200 -mx-2 my-2"></div>
      <div class="flex flex-col gap-y-1">
        <button
          @click="handleLogout"
          class="flex items-center gap-x-3.5 py-1.5 font-medium px-3 text-default-600 hover:bg-default-150 rounded w-full text-left"
          :disabled="isLoggingOut"
        >
          <Icon
            :icon="isLoggingOut ? 'lucide:loader-2' : 'lucide:log-out'"
            class="size-4"
            :class="{ 'animate-spin': isLoggingOut }"
          ></Icon>
          {{ isLoggingOut ? "Signing Out..." : "Sign Out" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import avatar1 from "@/assets/images/user/avatar-1.png";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const isLoggingOut = ref(false);

const handleLogout = async () => {
  isLoggingOut.value = true;

  try {
    await authStore.logout();
    console.log("Logout successful, redirecting to login...");

    // Redirect to modern-auth logout page
    await router.push("/logout");
  } catch (error) {
    console.error("Logout error:", error);
    // Still redirect even if there's an error
    await router.push("/logout");
  } finally {
    isLoggingOut.value = false;
  }
};
</script>
