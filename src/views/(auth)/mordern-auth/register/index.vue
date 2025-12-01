<template>
  <div
    class="relative flex flex-row w-full overflow-hidden bg-gradient-to-r from-blue-900 h-screen to-blue-800 dark:to-blue-900 dark:from-blue-950"
  >
    <div class="absolute inset-0 opacity-20">
      <img :src="morden" alt="" />
    </div>
    <div
      class="mx-4 m-4 w-160 py-14 px-10 bg-card flex justify-center rounded-md text-center relative z-10"
    >
      <div class="flex flex-col h-full w-full">
        <div class="flex justify-end">
          <LanguageDropdown />
        </div>
        <div class="my-21">
          <div class="mt-10">
            <div
              class="flex justify-center gap-x-3"
              aria-label="Tabs"
              role="tablist"
              aria-orientation="horizontal"
            >
              <button
                type="button"
                class="hs-tab-active:bg-primary hs-tab-active:text-white text-sm py-2.5 px-12 text-default-500 rounded-md bg-default-100 font-medium gap-2 flex items-center transition-all duration-300 active"
                id="tabs-with-underline-item-1"
                aria-selected="true"
                data-hs-tab="#tabsForEmail"
                aria-controls="tabsForEmail"
                role="tab"
              >
                <Icon icon="lucide:main" class="size-4"></Icon>
                Email
              </button>
              <button
                type="button"
                class="hs-tab-active:bg-primary hs-tab-active:text-white text-sm py-2.5 px-12 text-default-500 rounded-md bg-default-100 font-medium gap-2 flex items-center transition-all duration-300"
                id="tabs-with-underline-item-2"
                aria-selected="false"
                data-hs-tab="#tabsForPhone"
                aria-controls="tabsForPhone"
                role="tab"
              >
                <Icon icon="lucide:smartphone" class="size-4"></Icon>
                Phone
              </button>
            </div>
            <div class="mt-10 w-100 mx-auto">
              <div
                id="tabsForEmail"
                role="tabpanel"
                aria-labelledby="tabs-with-underline-item-1"
              >
                <form
                  @submit.prevent="handleEmailRegister"
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

                  <!-- Success Message -->
                  <div
                    v-if="successMessage"
                    class="mb-4 p-3 bg-green-100 dark:bg-green-900/20 border border-green-400 text-green-700 dark:text-green-400 rounded-md text-sm"
                  >
                    <Icon
                      icon="lucide:check-circle"
                      class="inline-block mr-2"
                    ></Icon>
                    {{ successMessage }}
                  </div>

                  <div class="mb-4">
                    <label
                      for="registerEmail"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Email ID</label
                    >
                    <input
                      v-model="emailForm.email"
                      type="email"
                      id="registerEmail"
                      class="form-input"
                      placeholder="Enter your email"
                      required
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="mb-4">
                    <label
                      for="registerName"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Full Name</label
                    >
                    <input
                      v-model="emailForm.name"
                      type="text"
                      id="registerName"
                      class="form-input"
                      placeholder="Enter your full name"
                      required
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="mb-4">
                    <label
                      for="registerLocation"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Location</label
                    >
                    <input
                      v-model="emailForm.location"
                      type="text"
                      id="registerLocation"
                      class="form-input"
                      placeholder="Enter your location"
                      required
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="mb-4">
                    <label
                      for="registerRole"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Role</label
                    >
                    <select
                      v-model="emailForm.role"
                      id="registerRole"
                      class="form-input"
                      required
                      :disabled="isLoading"
                    >
                      <option value="">Select Role</option>
                      <option value="USER">User</option>
                      <option value="DRIVER">Driver</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                  <div class="mb-4">
                    <label
                      for="registerPassword"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Password</label
                    >
                    <input
                      v-model="emailForm.password"
                      type="password"
                      id="registerPassword"
                      class="form-input"
                      placeholder="Enter Password (min 8 characters)"
                      required
                      minlength="8"
                      :disabled="isLoading"
                    />
                  </div>
                  <div class="flex items-center gap-2 mb-4">
                    <input
                      v-model="emailForm.acceptTerms"
                      id="acceptTerms"
                      type="checkbox"
                      class="form-checkbox"
                      required
                    />
                    <label
                      class="text-default-900 text-sm font-medium"
                      for="acceptTerms"
                      >I accept the Terms and Conditions</label
                    >
                  </div>
                  <div class="mt-10 text-center">
                    <button
                      type="submit"
                      class="btn bg-primary text-white w-full"
                      :disabled="isLoading"
                    >
                      <span v-if="!isLoading">Sign Up</span>
                      <span v-else class="flex items-center justify-center">
                        <Icon
                          icon="lucide:loader-2"
                          class="animate-spin mr-2"
                        ></Icon>
                        Creating Account...
                      </span>
                    </button>
                  </div>
                  <div
                    class="my-9 relative text-center before:absolute before:top-2.5 before:left-0 before:border-t before:border-t-default-200 before:w-full before:h-0.5 before:right-0 before:-z-0"
                  >
                    <h4
                      class="relative z-1 py-0.5 px-2 inline-block font-medium bg-card text-default-500 rounded-md"
                    >
                      Or sign up with
                    </h4>
                  </div>
                  <div class="flex w-full justify-center items-center gap-2">
                    <button
                      type="button"
                      class="btn border border-default-200 flex-grow hover:bg-default-150 shadow-sm hover:text-default-800"
                      disabled
                    >
                      <Icon
                        icon="logos:google-icon"
                        class="iconify-color"
                      ></Icon>
                      Use Google
                    </button>
                    <button
                      type="button"
                      class="btn border border-default-200 flex-grow hover:bg-default-150 shadow-sm hover:text-default-800"
                      disabled
                    >
                      <Icon icon="logos:apple" class="iconify text-mono"></Icon>
                      Use Apple
                    </button>
                  </div>
                  <div class="mt-10 text-center">
                    <p class="text-base text-default-500">
                      Already have an account ?
                      <RouterLink
                        to="/login"
                        class="font-semibold underline hover:text-primary transition duration-200"
                        >Login</RouterLink
                      >
                    </p>
                  </div>
                </form>
              </div>
              <div
                id="tabsForPhone"
                class="hidden"
                role="tabpanel"
                aria-labelledby="tabs-with-underline-item-2"
              >
                <form action="/" class="text-left w-full mt-10">
                  <div class="mb-4">
                    <label
                      for="Phone Number"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Phone Number</label
                    >
                    <input
                      type="text"
                      id="Phone Number"
                      class="form-input"
                      placeholder="Enter Phone"
                    />
                  </div>
                  <div class="mb-4">
                    <label
                      for="Username"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Username</label
                    >
                    <input
                      type="text"
                      id="Username"
                      class="form-input"
                      placeholder="Enter Username"
                    />
                  </div>
                  <div class="mb-4">
                    <label
                      for="Password"
                      class="block font-medium text-default-900 text-sm mb-2"
                      >Password</label
                    >
                    <input
                      type="text"
                      id="Password"
                      class="form-input"
                      placeholder="Enter Password"
                    />
                  </div>
                  <div class="flex items-center gap-2 mb-4">
                    <input
                      id="checkbox-1"
                      type="checkbox"
                      class="form-checkbox"
                    />
                    <label
                      class="text-default-900 text-sm font-medium"
                      for="checkbox-1"
                      >Remember Me</label
                    >
                  </div>
                  <div class="mt-10 text-center">
                    <button
                      type="button"
                      class="btn bg-primary text-white w-full"
                    >
                      Sign Up
                    </button>
                  </div>
                  <div
                    class="my-9 relative text-center before:absolute before:top-2.5 before:left-0 before:border-t before:border-t-default-200 before:w-full before:h-0.5 before:right-0 before:-z-0"
                  >
                    <h4
                      class="relative z-1 py-0.5 px-2 inline-block font-medium bg-card text-default-500 rounded-md"
                    >
                      Already have an account ?
                    </h4>
                  </div>
                  <div class="flex w-full justify-center items-center gap-2">
                    <RouterLink
                      to=""
                      class="btn border border-default-200 flex-grow hover:bg-default-150 shadow-sm hover:text-default-800"
                    >
                      <Icon
                        icon="logos:google-icon"
                        class="iconify-color"
                      ></Icon>
                      Use Google
                    </RouterLink>
                    <RouterLink
                      to=""
                      class="btn border border-default-200 flex-grow hover:bg-default-150 shadow-sm hover:text-default-800"
                    >
                      <Icon icon="logos:apple" class="iconify text-mono"></Icon>
                      Use Apple
                    </RouterLink>
                  </div>
                  <div class="mt-10 text-center">
                    <p class="text-base text-default-500">
                      Already have an account ?
                      <RouterLink
                        to="/login"
                        class="font-semibold underline hover:text-primary transition duration-200"
                      >
                        Login</RouterLink
                      >
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <span class="text-sm text-default-500">
            <Icon icon="lucide:copywright" class="iconify align-middle"></Icon>
            2025 Tailwick. Crafted with
            <Icon
              icon="tabler:heart-filled"
              class="iconify align-middle text-danger"
            ></Icon>
            by
            <RouterLink
              to="https://themesdesign.in/"
              target="_blank"
              class="text-default-800 hover:text-primary transition duration-200 underline"
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
        <RouterLink to="/">
          <img :src="logolight" alt="" class="h-7 mb-14 mx-auto block" />
        </RouterLink>
        <img
          :src="logomodern"
          alt=""
          class="mx-auto rounded-xl block object-cover w-md"
        />
        <div class="mt-10 text-center">
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import logolight from "@/assets/images/logo-light.png";
import logomodern from "@/assets/images/auth-modern.png";
import LanguageDropdown from "@/components/LanguageDropdown.vue";
import morden from "@/assets/images/modern.svg";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

// Form state
const emailForm = ref({
  email: "",
  name: "",
  location: "",
  role: "",
  password: "",
  acceptTerms: false,
});

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Handle email registration
const handleEmailRegister = async () => {
  if (
    !emailForm.value.email ||
    !emailForm.value.name ||
    !emailForm.value.location ||
    !emailForm.value.role ||
    !emailForm.value.password
  ) {
    errorMessage.value = "Please fill in all fields";
    return;
  }

  if (emailForm.value.password.length < 8) {
    errorMessage.value = "Password must be at least 8 characters long";
    return;
  }
  if (!emailForm.value.location) {
    errorMessage.value = "Location is required";
    return;
  }
  if (!emailForm.value.role) {
    errorMessage.value = "Role is required";
    return;
  }
  if (!emailForm.value.acceptTerms) {
    errorMessage.value = "Please accept the Terms and Conditions";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    await authStore.register({
      name: emailForm.value.name,
      email: emailForm.value.email,
      location: emailForm.value.location,
      role: emailForm.value.role,
      password: emailForm.value.password,
      acceptTerms: emailForm.value.acceptTerms,
    });

    // Success! Show message and redirect
    successMessage.value = "Account created successfully! Redirecting...";

    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  } catch (error: any) {
    console.error("Registration error:", error);
    errorMessage.value =
      error.message || "Registration failed. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
