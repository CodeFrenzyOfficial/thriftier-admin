<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && contact"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="$emit('close')"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="$emit('close')"></div>
          <div
            class="relative bg-card rounded-lg shadow-xl max-w-2xl w-full p-6"
            @click.stop
          >
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-xl font-bold text-default-900 !dark:text-default-100"
              >
                Contact Submission Details
              </h2>
              <button
                @click="$emit('close')"
                class="text-default-400 hover:text-default-600 !dark:hover:text-default-300 transition-colors"
              >
                <Icon icon="lucide:x" class="w-6 h-6" />
              </button>
            </div>

            <!-- Contact Details -->
            <div class="space-y-6">
              <!-- Personal Information -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-1"
                  >
                    First Name
                  </label>
                  <p
                    class="text-default-900 !dark:text-default-100 font-medium"
                  >
                    {{ contact.firstname }}
                  </p>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-1"
                  >
                    Last Name
                  </label>
                  <p
                    class="text-default-900 !dark:text-default-100 font-medium"
                  >
                    {{ contact.lastname }}
                  </p>
                </div>
              </div>

              <!-- Contact Information -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label
                    class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-1"
                  >
                    Email
                  </label>
                  <p
                    class="text-default-900 !dark:text-default-100 font-medium"
                  >
                    <a
                      :href="`mailto:${contact.email}`"
                      class="text-primary dark:text-primary-400 hover:underline"
                    >
                      {{ contact.email }}
                    </a>
                  </p>
                </div>
                <div>
                  <label
                    class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-1"
                  >
                    Phone Number
                  </label>
                  <p
                    class="text-default-900 !dark:text-default-100 font-medium"
                  >
                    <a
                      :href="`tel:${contact.phoneNumber}`"
                      class="text-primary dark:text-primary-400 hover:underline"
                    >
                      {{ contact.phoneNumber }}
                    </a>
                  </p>
                </div>
              </div>

              <!-- Message -->
              <div>
                <label
                  class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-2"
                >
                  Message
                </label>
                <div
                  class="p-4 bg-default-50 !dark:bg-default-800/50 rounded-lg border border-default-200 !dark:border-default-700"
                >
                  <p
                    class="text-default-900 !dark:text-default-100 whitespace-pre-wrap leading-relaxed"
                  >
                    {{ contact.message }}
                  </p>
                </div>
              </div>

              <!-- Submission Date -->
              <div>
                <label
                  class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-1"
                >
                  Submitted On
                </label>
                <p class="text-default-900 !dark:text-default-100 font-medium">
                  {{ formatDate(contact.createdAt) }}
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div
              class="flex justify-end space-x-3 mt-6 pt-6 border-t border-default-200 !dark:border-default-700"
            >
              <button
                @click="$emit('close')"
                class="btn bg-default-200 !dark:bg-default-700 text-default-700 !dark:text-default-300 hover:bg-default-300 !dark:hover:bg-default-600 transition-colors"
              >
                Close
              </button>
              <a
                :href="`mailto:${contact.email}`"
                class="btn bg-primary text-white hover:bg-primary-600 !dark:hover:bg-primary-500 transition-colors inline-flex items-center"
              >
                <Icon icon="lucide:mail" class="w-4 h-4 mr-2" />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Contact } from "@/services/contact.service";

defineProps<{
  isOpen: boolean;
  contact: Contact | null;
}>();

defineEmits<{
  close: [];
}>();

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
