<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          leave-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="isOpen"
            class="bg-card rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <!-- Modal Header -->
            <div
              class="flex items-center justify-between p-6 border-b border-default-200"
            >
              <h3 class="text-xl font-semibold text-default-900">
                {{ props.title || "Add New User" }}
              </h3>
              <button
                @click="closeModal"
                class="text-default-500 hover:text-default-700 transition-colors"
                :disabled="isLoading"
              >
                <Icon icon="lucide:x" class="size-5"></Icon>
              </button>
            </div>

            <!-- Modal Body -->
            <form @submit.prevent="handleSubmit" class="p-6">
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

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Email -->
                <div class="md:col-span-2">
                  <label
                    for="email"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.email"
                    type="email"
                    id="email"
                    class="form-input"
                    placeholder="user@example.com"
                    required
                    :disabled="isLoading"
                  />
                </div>

                <!-- Phone Number -->
                <div class="md:col-span-2">
                  <label
                    for="phoneNumber"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Phone Number <span class="text-red-500">*</span>
                  </label>
                  <MazInputPhoneNumber
                    v-model="phoneNumber"
                    v-model:country-code="countryCode as any"
                    @data="results = $event"
                    class="maz-phone-input-dark"
                    :disabled="isLoading"
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
                    v-model="formData.name"
                    type="text"
                    id="name"
                    class="form-input"
                    placeholder="John Doe"
                    required
                    :disabled="isLoading"
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
                    v-model="formData.location"
                    type="text"
                    id="location"
                    class="form-input"
                    placeholder="New York, USA"
                    required
                    :disabled="isLoading"
                  />
                </div>

                <!-- Role -->
                <div>
                  <label
                    for="role"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Role <span class="text-red-500">*</span>
                  </label>
                  <select
                    v-model="formData.role"
                    id="role"
                    class="form-input"
                    required
                    :disabled="isLoading"
                  >
                    <option value="">Select Role</option>
                    <option value="DRIVER">Driver</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>

                <!-- Password -->
                <div>
                  <label
                    for="password"
                    class="block font-medium !text-default-900 dark:text-default-100 text-sm mb-2"
                  >
                    Password <span class="text-red-500">*</span>
                  </label>
                  <input
                    v-model="formData.password"
                    type="password"
                    id="password"
                    class="form-input"
                    placeholder="Min 8 characters"
                    required
                    minlength="8"
                    :disabled="isLoading"
                  />
                  <p
                    class="text-xs text-default-500 dark:text-default-400 mt-1"
                  >
                    Minimum 8 characters required
                  </p>
                </div>
              </div>

              <!-- Modal Footer -->
              <div
                class="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-default-200"
              >
                <button
                  type="button"
                  @click="closeModal"
                  class="btn border border-default-200 text-default-600 hover:bg-default-50"
                  :disabled="isLoading"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn bg-primary text-white hover:bg-primary/90"
                  :disabled="isLoading"
                >
                  <span v-if="!isLoading">Create User</span>
                  <span v-else class="flex items-center">
                    <Icon
                      icon="lucide:loader-2"
                      class="animate-spin mr-2 size-4"
                    ></Icon>
                    Creating...
                  </span>
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import { useUserStore } from "@/stores/user";
import type { CreateUserData } from "@/services/user.service";
import type { MazInputPhoneNumberData } from "maz-ui/components/MazInputPhoneNumber";
import MazInputPhoneNumber from "maz-ui/components/MazInputPhoneNumber";

const phoneNumber = ref<string>("");
const countryCode = ref("US");
const results = ref<MazInputPhoneNumberData>();

interface Props {
  isOpen: boolean;
  title?: string;
}

interface Emits {
  (e: "close"): void;
  (e: "userCreated"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const userStore = useUserStore();

const formData = ref<CreateUserData>({
  email: "",
  name: "",
  password: "",
  location: "",
  role: "",
  phoneNumber: "",
});

const isLoading = ref(false);
const errorMessage = ref("");
const successMessage = ref("");

// Sync phoneNumber with formData
watch(phoneNumber, (newPhone) => {
  formData.value.phoneNumber = newPhone || "";
});

// Reset form when modal closes
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      resetForm();
    }
  }
);

const resetForm = () => {
  formData.value = {
    email: "",
    name: "",
    password: "",
    location: "",
    role: "",
    phoneNumber: "",
  };
  phoneNumber.value = "";
  countryCode.value = "US";
  errorMessage.value = "";
  successMessage.value = "";
  isLoading.value = false;
};

const closeModal = () => {
  if (!isLoading.value) {
    emit("close");
  }
};

const handleSubmit = async () => {
  if (isLoading.value) return;

  // Validate form
  if (
    !formData.value.email ||
    !formData.value.name ||
    !formData.value.password ||
    !formData.value.location ||
    !formData.value.role
  ) {
    errorMessage.value = "Please fill in all required fields";
    return;
  }

  if (formData.value.password.length < 8) {
    errorMessage.value = "Password must be at least 8 characters long";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Use user store to create user and automatically refresh the list
    await userStore.createUser(formData.value);

    successMessage.value = "User created successfully!";

    // Wait a moment to show success message
    setTimeout(() => {
      emit("userCreated");
      emit("close");
    }, 1500);
  } catch (error: any) {
    console.error("Create user error:", error);
    errorMessage.value =
      error.message || "Failed to create user. Please try again.";
  } finally {
    isLoading.value = false;
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
