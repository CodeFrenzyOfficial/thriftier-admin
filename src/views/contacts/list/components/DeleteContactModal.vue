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
          <div class="relative bg-card rounded-lg shadow-xl max-w-md w-full p-6" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                  <Icon icon="lucide:trash-2" class="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <h2 class="text-xl font-bold text-default-900 dark:text-default-100">
                  Delete Contact
                </h2>
              </div>
              <button
                @click="$emit('close')"
                class="text-default-400 hover:text-default-600 dark:hover:text-default-300 transition-colors"
              >
                <Icon icon="lucide:x" class="w-6 h-6" />
              </button>
            </div>

            <!-- Confirmation Message -->
            <div class="mb-6">
              <p class="text-default-700 dark:text-default-300 mb-4">
                Are you sure you want to delete this contact submission?
              </p>
              <div class="p-4 bg-default-50 dark:bg-default-800 rounded-lg border border-default-200 dark:border-default-700">
                <p class="text-sm font-medium text-default-900 dark:text-default-100">
                  {{ contact.firstname }} {{ contact.lastname }}
                </p>
                <p class="text-sm text-default-700 dark:text-default-300 mt-1">
                  {{ contact.email }}
                </p>
              </div>
              <p class="text-sm text-red-600 dark:text-red-400 mt-4">
                This action cannot be undone.
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
            </div>

            <!-- Actions -->
            <div class="flex justify-end space-x-3">
              <button
                type="button"
                @click="$emit('close')"
                :disabled="loading"
                class="btn bg-default-200 dark:bg-default-700 text-default-700 dark:text-default-300 hover:bg-default-300 dark:hover:bg-default-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="handleDelete"
                :disabled="loading"
                class="btn bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {{ loading ? 'Deleting...' : 'Delete Contact' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { useContactStore } from '@/stores/contact';
import type { Contact } from '@/services/contact.service';

const props = defineProps<{
  isOpen: boolean;
  contact: Contact | null;
}>();

const emit = defineEmits<{
  close: [];
  deleted: [];
}>();

const contactStore = useContactStore();
const loading = ref(false);
const error = ref('');

const handleDelete = async () => {
  if (!props.contact) return;

  loading.value = true;
  error.value = '';

  try {
    await contactStore.deleteContact(props.contact.id);
    emit('deleted');
    emit('close');
  } catch (err: any) {
    error.value = err.message || 'Failed to delete contact';
  } finally {
    loading.value = false;
  }
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

