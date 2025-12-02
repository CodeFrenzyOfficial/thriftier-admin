<template>
  <Vertical>
    <PageTitle subtitle="Users" title="Settings" />
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1
            class="text-2xl font-semibold !text-default-900 dark:text-default-100"
          >
            Account Settings
          </h1>
          <p class="text-sm text-default-600 dark:text-default-400 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <!-- Settings Card -->
      <div class="card">
        <div class="p-6">
          <!-- Tabs Navigation -->
          <div class="border-b border-default-200 dark:border-default-700 mb-6">
            <nav class="flex space-x-8">
              <button
                @click="activeTab = 'profile'"
                :class="[
                  'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'profile'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-100 hover:border-default-300',
                ]"
              >
                <Icon
                  icon="solar:user-bold"
                  class="inline-block w-5 h-5 mr-2"
                />
                Profile Information
              </button>
              <button
                @click="activeTab = 'password'"
                :class="[
                  'pb-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'password'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-100 hover:border-default-300',
                ]"
              >
                <Icon
                  icon="solar:lock-password-bold"
                  class="inline-block w-5 h-5 mr-2"
                />
                Change Password
              </button>
            </nav>
          </div>

          <!-- Profile Information Tab -->
          <div v-show="activeTab === 'profile'" class="space-y-6">
            <!-- Success/Error Messages -->
            <div
              v-if="profileSuccess"
              class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center"
            >
              <Icon icon="solar:check-circle-bold" class="w-5 h-5 mr-2" />
              {{ profileSuccess }}
            </div>
            <div
              v-if="profileError"
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center"
            >
              <Icon icon="solar:danger-circle-bold" class="w-5 h-5 mr-2" />
              {{ profileError }}
            </div>

            <form @submit.prevent="handleProfileUpdate">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email -->
                <div>
                  <label
                    for="email"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="profileForm.email"
                    type="email"
                    id="email"
                    class="form-input"
                    placeholder="user@example.com"
                    required
                    :disabled="profileLoading"
                  />
                </div>

                <!-- Phone Number -->
                <div>
                  <label
                    for="phoneNumber"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Phone Number
                  </label>
                  <MazInputPhoneNumber
                    v-model="phoneNumber"
                    v-model:country-code="countryCode as any"
                    @data="results = $event"
                    class="maz-phone-input-dark"
                    :disabled="profileLoading"
                  />
                </div>

                <!-- Full Name -->
                <div>
                  <label
                    for="name"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Full Name <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="profileForm.name"
                    type="text"
                    id="name"
                    class="form-input"
                    placeholder="John Doe"
                    required
                    :disabled="profileLoading"
                  />
                </div>

                <!-- Location -->
                <div>
                  <label
                    for="location"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Location <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="profileForm.location"
                    type="text"
                    id="location"
                    class="form-input"
                    placeholder="New York, USA"
                    required
                    :disabled="profileLoading"
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <div class="mt-6 flex justify-end">
                <button
                  type="submit"
                  class="btn bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="profileLoading"
                >
                  <Icon
                    v-if="profileLoading"
                    icon="svg-spinners:3-dots-fade"
                    class="inline-block w-5 h-5 mr-2"
                  />
                  <Icon
                    v-else
                    icon="solar:diskette-bold"
                    class="inline-block w-5 h-5 mr-2"
                  />
                  {{ profileLoading ? "Saving..." : "Save Changes" }}
                </button>
              </div>
            </form>
          </div>

          <!-- Change Password Tab -->
          <div v-show="activeTab === 'password'" class="space-y-6">
            <!-- Success/Error Messages -->
            <div
              v-if="passwordSuccess"
              class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center"
            >
              <Icon icon="solar:check-circle-bold" class="w-5 h-5 mr-2" />
              {{ passwordSuccess }}
            </div>
            <div
              v-if="passwordError"
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg flex items-center"
            >
              <Icon icon="solar:danger-circle-bold" class="w-5 h-5 mr-2" />
              {{ passwordError }}
            </div>

            <form @submit.prevent="handlePasswordChange" class="max-w-2xl">
              <div class="space-y-4">
                <!-- Current Password -->
                <div>
                  <label
                    for="currentPassword"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Current Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.currentPassword"
                    type="password"
                    id="currentPassword"
                    class="form-input"
                    placeholder="Enter current password"
                    required
                    :disabled="passwordLoading"
                  />
                </div>

                <!-- New Password -->
                <div>
                  <label
                    for="newPassword"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    New Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.newPassword"
                    type="password"
                    id="newPassword"
                    class="form-input"
                    placeholder="Min 8 characters"
                    required
                    minlength="8"
                    :disabled="passwordLoading"
                  />
                  <p
                    class="text-xs text-default-500 dark:text-default-400 mt-1"
                  >
                    Minimum 8 characters required
                  </p>
                </div>

                <!-- Confirm New Password -->
                <div>
                  <label
                    for="confirmPassword"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Confirm New Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="passwordForm.confirmPassword"
                    type="password"
                    id="confirmPassword"
                    class="form-input"
                    placeholder="Re-enter new password"
                    required
                    minlength="8"
                    :disabled="passwordLoading"
                  />
                </div>
              </div>

              <!-- Submit Button -->
              <div class="mt-6 flex justify-end">
                <button
                  type="submit"
                  class="btn bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="passwordLoading"
                >
                  <Icon
                    v-if="passwordLoading"
                    icon="svg-spinners:3-dots-fade"
                    class="inline-block w-5 h-5 mr-2"
                  />
                  <Icon
                    v-else
                    icon="solar:shield-check-bold"
                    class="inline-block w-5 h-5 mr-2"
                  />
                  {{ passwordLoading ? "Updating..." : "Update Password" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useAuthStore } from "@/stores/auth";
import { userService } from "@/services/user.service";
import type { MazInputPhoneNumberData } from "maz-ui/components/MazInputPhoneNumber";
import MazInputPhoneNumber from "maz-ui/components/MazInputPhoneNumber";
import api from "@/services/api";
import Vertical from "@/layouts/vertical.vue";

const authStore = useAuthStore();
const activeTab = ref<"profile" | "password">("profile");

// Phone number state
const phoneNumber = ref<string>("");
const countryCode = ref("US");
const results = ref<MazInputPhoneNumberData>();

// Profile form
const profileForm = ref({
  email: "",
  name: "",
  location: "",
  phoneNumber: "",
});

const profileLoading = ref(false);
const profileSuccess = ref("");
const profileError = ref("");

// Sync phoneNumber with form
watch(phoneNumber, (newPhone) => {
  profileForm.value.phoneNumber = newPhone || "";
});

// Password form
const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordLoading = ref(false);
const passwordSuccess = ref("");
const passwordError = ref("");

// Load user data
onMounted(async () => {
  if (authStore.user) {
    profileForm.value = {
      email: authStore.user.email || "",
      name: authStore.user.name || "",
      location: authStore.user.location || "",
      phoneNumber: authStore.user.phoneNumber || "",
    };
    phoneNumber.value = authStore.user.phoneNumber || "";
  }
});

// Handle profile update
const handleProfileUpdate = async () => {
  if (profileLoading.value) return;

  profileLoading.value = true;
  profileSuccess.value = "";
  profileError.value = "";

  try {
    if (!authStore.user?.id) {
      throw new Error("User not found");
    }

    await userService.updateUser(authStore.user.id, {
      email: profileForm.value.email,
      name: profileForm.value.name,
      location: profileForm.value.location,
      phoneNumber: profileForm.value.phoneNumber,
    });

    // Refresh user data
    await authStore.fetchUser();

    profileSuccess.value = "Profile updated successfully!";

    // Clear success message after 3 seconds
    setTimeout(() => {
      profileSuccess.value = "";
    }, 3000);
  } catch (error: any) {
    console.error("Profile update error:", error);
    profileError.value =
      error.message || "Failed to update profile. Please try again.";
  } finally {
    profileLoading.value = false;
  }
};

// Handle password change
const handlePasswordChange = async () => {
  if (passwordLoading.value) return;

  passwordLoading.value = true;
  passwordSuccess.value = "";
  passwordError.value = "";

  // Validate passwords match
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = "New passwords do not match";
    passwordLoading.value = false;
    return;
  }

  // Validate password length
  if (passwordForm.value.newPassword.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
    passwordLoading.value = false;
    return;
  }

  try {
    await api.put("/auth/change-password", {
      currentPassword: passwordForm.value.currentPassword,
      newPassword: passwordForm.value.newPassword,
    });

    passwordSuccess.value = "Password updated successfully!";

    // Clear form
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    // Clear success message after 3 seconds
    setTimeout(() => {
      passwordSuccess.value = "";
    }, 3000);
  } catch (error: any) {
    console.error("Password change error:", error);
    passwordError.value =
      error.message || "Failed to change password. Please try again.";
  } finally {
    passwordLoading.value = false;
  }
};
</script>

<style scoped>
/* Dark mode support for MazInputPhoneNumber */
:deep(.m-phone-number-input) {
  background-color: rgb(250 250 250);
  border-color: rgb(229 231 235);
}

:deep(.m-phone-number-input input) {
  background-color: transparent;
  color: rgb(17 24 39);
}

:deep(.m-phone-number-input .m-select-list) {
  background-color: white;
  border-color: rgb(229 231 235);
}

:deep(.m-phone-number-input .m-select-list-item) {
  color: rgb(17 24 39);
}

:deep(.m-phone-number-input .m-select-list-item:hover) {
  background-color: rgb(243 244 246);
}

:deep(.m-phone-number-input button) {
  background-color: transparent;
  color: rgb(17 24 39);
}

/* Dark mode */
:global(.dark) :deep(.m-phone-number-input) {
  background-color: rgb(17 24 39);
  border-color: rgb(55 65 81);
}

:global(.dark) :deep(.m-phone-number-input input) {
  color: rgb(243 244 246);
}

:global(.dark) :deep(.m-phone-number-input .m-select-list) {
  background-color: rgb(17 24 39);
  border-color: rgb(55 65 81);
}

:global(.dark) :deep(.m-phone-number-input .m-select-list-item) {
  color: rgb(243 244 246);
}

:global(.dark) :deep(.m-phone-number-input .m-select-list-item:hover) {
  background-color: rgb(31 41 55);
}

:global(.dark) :deep(.m-phone-number-input button) {
  color: rgb(243 244 246);
}
</style>
