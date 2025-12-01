<template>
  <div
    class="relative flex w-full flex-row-reverse overflow-hidden bg-gradient-to-r from-blue-900 h-screen to-blue-800 dark:to-blue-900 dark:from-blue-950 justify-center items-center"
  >
    <div class="absolute inset-0 opacity-20">
      <img :src="modern" alt="" />
    </div>
    <div
      class="w-1/2 py-14 px-10 flex rounded-md text-center relative z-10 items-center justify-center"
    >
      <div
        class="flex flex-col w-full max-w-lg mx-auto bg-card p-10 rounded-md"
      >
        <h1 class="text-2xl font-bold text-center">Login</h1>
        <p class="text-sm text-default-500 text-center mt-4">
          Welcome back to Thrifter. Please enter your email and password to
          login.
        </p>
        <div class="">
          <div class="">
            <div class="w-100 mx-auto">
              <div
                id="tabsForEmail"
                role="tabpanel"
                aria-labelledby="tabs-with-underline-item-1"
              >
                <form
                  @submit.prevent="handleEmailLogin"
                  class="text-left w-full mt-10"
                >
                  <!-- Error Message -->
                  <div
                    v-if="errorMessage"
                    class="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded-md text-sm"
                  >
                    <Icon
                      icon="lucide:alert-circle"
                      class="inline-block mr-2"
                    ></Icon>
                    {{ errorMessage }}
                  </div>

                  <div class="mb-4">
                    <label
                      for="emailInput"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Email ID</label
                    >
                    <input
                      v-model="emailForm.email"
                      type="email"
                      id="emailInput"
                      class="form-input"
                      placeholder="Enter your email"
                      required
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="mb-4">
                    <RouterLink
                      to="/mordern-auth/reset-pass"
                      class="text-primary font-medium text-sm mb-2 float-end"
                      >Forgot Password ?</RouterLink
                    >
                    <label
                      for="emailPassword"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Password</label
                    >
                    <input
                      v-model="emailForm.password"
                      type="password"
                      id="emailPassword"
                      class="form-input"
                      placeholder="Enter Password"
                      required
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="flex items-center gap-2 mb-4">
                    <input
                      v-model="emailForm.rememberMe"
                      id="remember-email"
                      type="checkbox"
                      class="form-checkbox"
                    />
                    <label
                      class="text-default-900 text-sm font-medium"
                      for="remember-email"
                      >Remember Me</label
                    >
                  </div>
                  <div class="mt-10 text-center">
                    <button
                      type="submit"
                      class="btn bg-primary text-white w-full"
                      :disabled="isLoading"
                    >
                      <span v-if="!isLoading">Sign In</span>
                      <span v-else class="flex items-center justify-center">
                        <Icon
                          icon="lucide:loader-2"
                          class="animate-spin mr-2"
                        ></Icon>
                        Signing In...
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <span class="text-sm text-default-500">
            <Icon icon="lucide:copyright" class="iconify align-middle"></Icon>
            {{ new Date().getFullYear() }} Thrifter. Crafted with
            <Icon
              icon="tabler:heart-filled"
              class="iconify align-middle text-danger"
            ></Icon>
            by
            <RouterLink
              to="#"
              target="_blank"
              class="text-default-800 hover:text-primary transition duration-200 underline"
              >Thrifter</RouterLink
            >
          </span>
        </div>
      </div>
    </div>
    <div
      class="relative z-10 flex items-center justify-center min-h-screen px-8 py-14 w-1/2"
    >
      <div class="max-w-xl mx-auto">
        <RouterLink to="/">
          <img :src="logolight" alt="" class="h-7 mb-14 mx-auto block" />
        </RouterLink>
        <img
          :src="logomodern"
          alt=""
          class="mx-auto rounded-xl block object-cover w-full max-w-md"
        />
        <div class="mt-10 text-center">
          <h3 class="mb-3 text-blue-50 text-2xl font-semibold text-center">
            Tools For Crafting Your Business's Brand Identity
          </h3>
          <p class="text-blue-300 text-base max-w-2xl mx-auto text-center">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import logomodern from "@/assets/images/auth-modern.png";
import logolight from "@/assets/images/logo-light.png";
import modern from "@/assets/images/modern.svg";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Form state
const emailForm = ref({
  email: "",
  password: "",
  rememberMe: false,
});

const isLoading = ref(false);
const errorMessage = ref("");

// Handle email login
const handleEmailLogin = async () => {
  if (!emailForm.value.email || !emailForm.value.password) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const response = await authStore.login({
      email: emailForm.value.email,
      password: emailForm.value.password,
    });

    console.log("Login successful", {
      user: authStore.user,
      isAuthenticated: authStore.isAuthenticated,
      response,
    });

    // Wait a tick for the store to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    console.log("After wait:", {
      user: authStore.user,
      isAuthenticated: authStore.isAuthenticated,
    });

    // Success! Redirect to dashboard
    console.log("Attempting redirect to dashboard...");
    await router.push("/dashboard");
    console.log("Redirect completed");
  } catch (error: any) {
    console.error("Login error:", error);
    errorMessage.value =
      error.message || "Login failed. Please check your credentials.";
  } finally {
    isLoading.value = false;
  }
};
</script>
