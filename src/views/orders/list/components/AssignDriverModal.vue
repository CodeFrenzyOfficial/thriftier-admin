<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen && order" class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50"></div>
          <div class="relative bg-white dark:bg-[#18181B] rounded-lg shadow-xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-default-900 dark:text-default-100">
                Assign Driver
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
                  Select Driver *
                </label>
                <select
                  v-model="selectedDriverId"
                  required
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-[#27272A] text-default-900 dark:text-default-100 focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a driver</option>
                  <option v-for="driver in drivers" :key="driver.id" :value="driver.id">
                    {{ driver.name }} - {{ driver.email }}
                  </option>
                </select>
              </div>

              <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
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
                  {{ loading ? "Assigning..." : "Assign Driver" }}
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
import { ref, watch, onMounted } from "vue";
import { useOrderStore } from "../../../../stores/order";
import { useUserStore } from "../../../../stores/user";
import type { Order } from "../../../../services/order.service";

const props = defineProps<{
  isOpen: boolean;
  order: Order | null;
}>();

const emit = defineEmits<{
  close: [];
  assigned: [];
}>();

const orderStore = useOrderStore();
const userStore = useUserStore();
const loading = ref(false);
const error = ref("");
const selectedDriverId = ref("");
const drivers = ref<any[]>([]);

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    selectedDriverId.value = props.order?.driverId || "";
    fetchDrivers();
  }
});

async function fetchDrivers() {
  try {
    await userStore.fetchUsers({ limit: 100 });
    drivers.value = userStore.users.filter((u: any) => u.role === "DRIVER");
  } catch (err) {
    console.error("Failed to fetch drivers:", err);
  }
}

async function handleSubmit() {
  if (!props.order) return;
  loading.value = true;
  error.value = "";

  try {
    await orderStore.assignDriver(props.order.id, selectedDriverId.value);
    emit("assigned");
  } catch (err: any) {
    error.value = err.message || "Failed to assign driver";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (props.isOpen) {
    fetchDrivers();
  }
});
</script>

