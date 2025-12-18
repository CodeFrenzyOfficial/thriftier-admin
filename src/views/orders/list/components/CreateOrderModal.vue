<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="$emit('close')"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <!-- Overlay -->
          <div class="fixed inset-0 bg-black/50 transition-opacity" @click="$emit('close')"></div>

          <!-- Modal -->
          <div class="relative bg-card rounded-lg shadow-xl max-w-2xl w-full p-6" @click.stop>
            <!-- Header -->
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-bold text-default-900 dark:text-default-100">
                Create New Order
              </h2>
              <button
                @click="$emit('close')"
                class="text-default-400 hover:text-default-600 dark:hover:text-default-300 transition-colors"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- User Selection -->
              <div>
                <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                  Customer *
                </label>
                <select
                  v-model="form.userId"
                  required
                  class="form-input"
                >
                  <option value="">Select Customer</option>
                  <option v-for="user in users" :key="user.id" :value="user.id">
                    {{ user.name }} ({{ user.email }})
                  </option>
                </select>
              </div>

              <!-- Pickup Address -->
              <div>
                <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                  Pickup Address *
                </label>
                <textarea
                  v-model="form.pickupAddress"
                  required
                  rows="2"
                  class="form-input"
                  placeholder="Enter pickup address"
                ></textarea>
              </div>

              <!-- Delivery Address -->
              <div>
                <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                  Delivery Address *
                </label>
                <textarea
                  v-model="form.deliveryAddress"
                  required
                  rows="2"
                  class="form-input"
                  placeholder="Enter delivery address"
                ></textarea>
              </div>

              <!-- Package Description -->
              <div>
                <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                  Package Description *
                </label>
                <textarea
                  v-model="form.packageDescription"
                  required
                  rows="3"
                  class="form-input"
                  placeholder="Describe the package"
                ></textarea>
              </div>

              <!-- Package Weight & Price -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    v-model.number="form.packageWeight"
                    type="number"
                    step="0.1"
                    class="form-input"
                    placeholder="0.0"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
                    Estimated Price * ($)
                  </label>
                  <input
                    v-model.number="form.estimatedPrice"
                    type="number"
                    step="0.01"
                    required
                    class="form-input"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="error" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p class="text-sm text-red-600 dark:text-red-400">{{ error }}</p>
              </div>

              <!-- Actions -->
              <div class="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  @click="$emit('close')"
                  class="btn bg-default-200 dark:bg-default-700 text-default-700 dark:text-default-300 hover:bg-default-300 dark:hover:bg-default-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  :disabled="loading"
                  class="btn bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {{ loading ? "Creating..." : "Create Order" }}
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

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const orderStore = useOrderStore();
const userStore = useUserStore();

const loading = ref(false);
const error = ref("");
const users = ref<any[]>([]);

const form = ref({
  userId: "",
  pickupAddress: "",
  deliveryAddress: "",
  packageDescription: "",
  packageWeight: undefined as number | undefined,
  estimatedPrice: 0,
});

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    resetForm();
    fetchUsers();
  }
});

async function fetchUsers() {
  try {
    await userStore.fetchUsers(1, 100);
    users.value = userStore.users.filter((u: any) => u.role === "USER");
  } catch (err) {
    console.error("Failed to fetch users:", err);
  }
}

async function handleSubmit() {
  loading.value = true;
  error.value = "";

  try {
    await orderStore.createOrder(form.value);
    emit("created");
    resetForm();
  } catch (err: any) {
    error.value = err.message || "Failed to create order";
  } finally {
    loading.value = false;
  }
}

function resetForm() {
  form.value = {
    userId: "",
    pickupAddress: "",
    deliveryAddress: "",
    packageDescription: "",
    packageWeight: undefined,
    estimatedPrice: 0,
  };
  error.value = "";
}

onMounted(() => {
  if (props.isOpen) {
    fetchUsers();
  }
});
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

