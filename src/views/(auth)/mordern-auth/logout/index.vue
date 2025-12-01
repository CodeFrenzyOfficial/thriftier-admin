<template>
  <div
    class="relative flex flex-row-reverse w-full overflow-hidden bg-gradient-to-r from-blue-900 h-screen to-blue-800 dark:to-blue-900 dark:from-blue-950"
  >
    <div class="absolute inset-0 opacity-20">
      <img :src="modern" alt="" />
    </div>
    <div
      class="w-1/2 py-14 px-10 bg-card flex justify-center rounded-md text-center relative z-10"
    >
      <div
        class="flex flex-col h-full w-full max-w-lg mx-auto bg-card p-10 rounded-md"
      >
        <div class="my-auto">
          <div class="mt-8 text-center">
            <div class="mb-4">
              <Icon
                icon="lucide:log-out"
                class="size-6 text-purple-500 fill-purple-100 mx-auto"
              ></Icon>
            </div>
            <h4 class="mb-2 text-primary text-xl font-semibold">
              You are Logged Out
            </h4>
            <p class="mb-8 text-base text-default-500">
              Thank you for using tailwick admin template
            </p>
          </div>
          <RouterLink to="/login">
            <button class="btn bg-primary text-white w-full">Sign In</button>
          </RouterLink>
        </div>
        <div class="mt-5">
          <span class="font-base">
            <Icon
              icon="lucide:copyright"
              class="iconify align-middle text-default-500"
            ></Icon>
            2025 Tailwick. Crafted with
            <Icon
              icon="tabler:heart-filled"
              class="iconify align-middle text-danger"
            ></Icon>
            by
            <RouterLink
              to=""
              class="text-mono hover:text-primary transition duration-200 underline"
              >Themesdesign</RouterLink
            >
          </span>
        </div>
      </div>
    </div>
    <div
      class="relative z-10 flex items-center justify-center min-h-screen px-10 py-14 grow"
    >
      <div>
        <RouterLink to="/" class="">
          <img :src="logolight" alt="" class="h-7 mb-14 mx-auto block" />
        </RouterLink>
        <img
          :src="logomodern"
          alt=""
          class="mx-auto rounded-xl block object-cover w-md"
        />
        <div class="mt-10 tetx-center">
          <h3 class="mb-3 text-blue-50 text-2xl font-semibold text-center">
            Tools For Crafting Your Business's Brand Identity
          </h3>
          <p class="text-blue-300 text-base w-2xl text-center">
            Unlock the potential of our versatile branding tools, designed to
            empower your business in shaping a distinctive and impactful brand.
            Elevate your business's image and leave a lasting impression with
            our comprehensive branding solutions.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import modern from "@/assets/images/modern.svg";
import logolight from "@/assets/images/logo-light.png";
import logomodern from "@/assets/images/auth-modern.png";
import { Icon } from "@iconify/vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

// Logout when component is mounted
onMounted(async () => {
  await authStore.logout();
});
</script>
