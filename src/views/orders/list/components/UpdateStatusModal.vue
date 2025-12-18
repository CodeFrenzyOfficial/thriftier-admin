<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && order" class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50"></div>
          <div class="relative bg-white dark:bg-[#18181B] rounded-lg shadow-xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-default-900 dark:text-default-100">
                Update Order Status
              </h2>
              <button @click="$emit('close')" class="text-default-400 hover:text-default-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                  Current Status
                </label>
                <div class="px-4 py-2 bg-gray-100 dark:bg-[#27272A] rounded-lg">
                  <span :class="getStatusClass(order.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                  New Status *
                </label>
                <select
                  v-model="newStatus"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#27272A] text-default-900 dark:text-default-100 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
              </div>

              <div v-if="success" class="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p class="text-sm text-green-600 dark:text-green-400">Status updated successfully!</p>
              </div>

              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-default-700 dark:text-default-300 hover:bg-gray-50 dark:hover:bg-[#27272A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50"
                >
                  {{ loading ? "Updating..." : "Update Status" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useOrderStore } from "../../../../stores/order";
import type { Order } from "../../../../services/order.service";

const props = defineProps<{
  isOpen: boolean;
  order: Order | null;
}>();

const emit = defineEmits<{
  close: [];
  updated: [];
}>();

const orderStore = useOrderStore();
const loading = ref(false);
const error = ref("");
const success = ref(false);
const newStatus = ref<"PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED">("PENDING");

watch(() => props.isOpen, (isOpen) => {
  if (isOpen && props.order) {
    newStatus.value = props.order.status;
    error.value = "";
    success.value = false;
  }
});

async function handleSubmit() {
  if (!props.order) return;
  loading.value = true;
  error.value = "";
  success.value = false;

  try {
    await orderStore.updateStatus(props.order.id, newStatus.value);
    success.value = true;
    setTimeout(() => {
      emit("updated");
    }, 1000);
  } catch (err: any) {
    error.value = err.message || "Failed to update status";
  } finally {
    loading.value = false;
  }
}

function getStatusClass(status: string): string {
  const classes = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return classes[status as keyof typeof classes] || classes.PENDING;
}

function getStatusLabel(status: string): string {
  const labels = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };
  return labels[status as keyof typeof labels] || status;
}
</script>

