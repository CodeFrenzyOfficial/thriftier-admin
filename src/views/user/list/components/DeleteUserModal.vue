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
            class="bg-card rounded-lg shadow-xl max-w-md w-full mx-4"
          >
            <!-- Modal Header -->
            <div class="p-6">
              <div class="flex items-center gap-4">
                <div
                  class="flex items-center justify-center size-12 rounded-full bg-red-100 dark:bg-red-900/20"
                >
                  <Icon
                    icon="lucide:trash-2"
                    class="size-6 text-red-600 dark:text-red-400"
                  ></Icon>
                </div>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-default-900">
                    Delete User
                  </h3>
                  <p class="text-sm text-default-500 mt-1">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <!-- User Info -->
              <div
                v-if="user"
                class="mt-4 p-4 bg-default-50 dark:bg-default-800/50 rounded-lg"
              >
                <p class="text-sm text-default-900 font-medium">
                  {{ user.name }}
                </p>
                <p class="text-xs text-default-500 mt-1">{{ user.email }}</p>
              </div>

              <!-- Error Message -->
              <div
                v-if="errorMessage"
                class="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 rounded-md text-sm"
              >
                <Icon
                  icon="lucide:alert-circle"
                  class="inline-block mr-2"
                ></Icon>
                {{ errorMessage }}
              </div>

              <p class="text-sm text-default-600 mt-4">
                Are you sure you want to delete this user? All associated data
                will be permanently removed.
              </p>
            </div>

            <!-- Modal Footer -->
            <div
              class="flex items-center justify-end gap-3 p-6 border-t border-default-200"
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
                type="button"
                @click="handleDelete"
                class="btn bg-red-600 text-white hover:bg-red-700"
                :disabled="isLoading"
              >
                <span v-if="!isLoading">Delete User</span>
                <span v-else class="flex items-center">
                  <Icon
                    icon="lucide:loader-2"
                    class="animate-spin mr-2 size-4"
                  ></Icon>
                  Deleting...
                </span>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Icon } from "@iconify/vue";
import { useUserStore } from "@/stores/user";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Props {
  isOpen: boolean;
  user: User | null;
}

interface Emits {
  (e: "close"): void;
  (e: "userDeleted"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const userStore = useUserStore();

const isLoading = ref(false);
const errorMessage = ref("");

const closeModal = () => {
  if (!isLoading.value) {
    errorMessage.value = "";
    emit("close");
  }
};

const handleDelete = async () => {
  if (!props.user || isLoading.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    await userStore.deleteUser(props.user.id);
    emit("userDeleted");
    emit("close");
  } catch (error: any) {
    console.error("Delete user error:", error);
    errorMessage.value =
      error.message || "Failed to delete user. Please try again.";
  } finally {
    isLoading.value = false;
  }
};
</script>
