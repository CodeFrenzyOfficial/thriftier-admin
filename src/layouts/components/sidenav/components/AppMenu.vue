<template>
  <ul class="side-nav p-3 hs-accordion-group">
    <template v-for="(item, idx) in currentMenuItems" :key="item.key || idx">
      <li v-if="item.isTitle" class="menu-title">
        <span>{{ item.label }}</span>
      </li>
      <template v-else>
        <MenuItemWithChildren
          v-if="item.children"
          :item="item"
          :open-menu-key="openMenuKey"
          :set-open-menu-key="setOpenMenuKey"
        />
        <MenuItem v-else :item="item" :key="idx" />
      </template>
    </template>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { adminMenuItems, userMenuItems, driverMenuItems } from "./data";
import MenuItem from "./MenuItem.vue";
import MenuItemWithChildren from "./MenuItemWithChildren.vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const openMenuKey = ref<string | null>(null);

const setOpenMenuKey = (key: string | null) => {
  openMenuKey.value = key;
};

/**
 * Get menu items based on user role
 * Returns appropriate sidebar menu for admin, user, or driver
 */
const currentMenuItems = computed(() => {
  const userRole = authStore.userRole?.toLowerCase();

  console.log("Current user role:", userRole);

  switch (userRole) {
    case "admin":
      return adminMenuItems;
    case "user":
      return userMenuItems;
    case "driver":
      return driverMenuItems;
    default:
      // Default to user menu if role is not recognized
      console.warn(`Unknown role: ${userRole}, defaulting to user menu`);
      return userMenuItems;
  }
});
</script>
