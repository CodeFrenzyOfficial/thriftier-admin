<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen && order"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="$emit('close')"
      >
        <div class="flex min-h-screen items-center justify-center p-4">
          <div class="fixed inset-0 bg-black/50" @click="$emit('close')"></div>
          <div
            class="relative bg-card rounded-lg shadow-xl max-w-md w-full p-6"
            @click.stop
          >
            <div class="flex items-center justify-between mb-6">
              <h2
                class="text-xl font-bold text-default-900 !dark:text-default-100"
              >
                Assign Driver
              </h2>
              <button
                @click="$emit('close')"
                class="text-default-400 hover:text-default-600 dark:hover:text-default-300 transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              <!-- Search Driver Input with Suggestions -->
              <div class="relative">
                <label
                  class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-2"
                >
                  Search and Select Driver *
                </label>
                <div class="relative">
                  <input
                    ref="searchInput"
                    v-model="searchQuery"
                    @input="onSearchInput"
                    @focus="showSuggestions = true"
                    type="text"
                    placeholder="Type to search drivers by name or email..."
                    class="form-input pr-10"
                    autocomplete="off"
                    :disabled="!!selectedDriver"
                  />
                  <div class="absolute right-3 top-1/2 -translate-y-1/2">
                    <div
                      v-if="loadingDrivers"
                      class="h-5 w-5 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"
                    ></div>
                    <Icon
                      v-else
                      icon="lucide:search"
                      class="w-5 h-5 text-default-400 dark:text-default-500"
                    />
                  </div>
                </div>

                <!-- Selected Driver Display -->
                <div
                  v-if="selectedDriver"
                  class="mt-2 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg flex items-center justify-between"
                >
                  <div class="flex items-center gap-2">
                    <Icon
                      icon="lucide:user-check"
                      class="w-5 h-5 text-primary-600 dark:text-primary-400"
                    />
                    <div>
                      <p
                        class="text-sm font-medium text-primary-900 dark:text-primary-100"
                      >
                        {{ selectedDriver.name }}
                      </p>
                      <p class="text-xs text-primary-700 dark:text-primary-300">
                        {{ selectedDriver.email }}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    @click="clearSelection"
                    class="text-primary-400 hover:text-primary-600 dark:hover:text-primary-300 transition-colors"
                  >
                    <Icon icon="lucide:x" class="w-5 h-5" />
                  </button>
                </div>

                <!-- Suggestions Dropdown -->
                <div
                  v-if="
                    showSuggestions && !selectedDriver && searchQuery.length > 0
                  "
                  class="absolute z-50 mt-1 w-full bg-card border border-default-300 dark:border-default-600 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                >
                  <div v-if="loadingDrivers" class="p-4 text-center">
                    <div
                      class="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent"
                    ></div>
                    <p
                      class="mt-2 text-sm text-default-600 dark:text-default-400"
                    >
                      Searching...
                    </p>
                  </div>
                  <div v-else-if="drivers.length === 0" class="p-4 text-center">
                    <Icon
                      icon="lucide:user-x"
                      class="w-8 h-8 mx-auto text-default-400 dark:text-default-500 mb-2"
                    />
                    <p class="text-sm text-default-700 dark:text-default-300">
                      No drivers found
                    </p>
                    <p
                      class="text-xs text-default-600 dark:text-default-400 mt-1"
                    >
                      Try a different search term
                    </p>
                  </div>
                  <div v-else>
                    <button
                      v-for="driver in drivers"
                      :key="driver.id"
                      type="button"
                      @click="selectDriver(driver)"
                      class="w-full px-4 py-3 text-left hover:bg-default-100 dark:hover:bg-default-800/50 transition-colors border-b border-default-200 dark:border-default-700 last:border-0"
                    >
                      <div class="flex items-center gap-3">
                        <div
                          class="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0"
                        >
                          <Icon
                            icon="lucide:user"
                            class="w-5 h-5 text-primary-600 dark:text-primary-400"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p
                            class="text-sm font-medium text-default-900 !dark:text-default-100 truncate"
                          >
                            {{ driver.name }}
                          </p>
                          <p
                            class="text-xs text-default-700 !dark:text-default-300 truncate"
                          >
                            {{ driver.email }}
                          </p>
                          <p
                            v-if="driver.phoneNumber"
                            class="text-xs text-default-600 !dark:text-default-400"
                          >
                            {{ driver.phoneNumber }}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>

                <p
                  v-if="!selectedDriver"
                  class="mt-1 text-xs text-default-600 dark:text-default-400"
                >
                  Start typing to search for drivers
                </p>
              </div>

              <div
                v-if="error"
                class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <p class="text-sm text-red-600 dark:text-red-400">
                  {{ error }}
                </p>
              </div>

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
                  :disabled="loading || !selectedDriver"
                  class="btn bg-primary text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";
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
const loadingDrivers = ref(false);
const error = ref("");
const searchQuery = ref("");
const drivers = ref<any[]>([]);
const selectedDriver = ref<any>(null);
const showSuggestions = ref(false);
const searchInput = ref<HTMLInputElement | null>(null);

let debounceTimer: number | null = null;

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      selectedDriver.value = null;
      searchQuery.value = "";
      drivers.value = [];
      error.value = "";
      showSuggestions.value = false;
    }
  }
);

function onSearchInput() {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  if (searchQuery.value.trim().length === 0) {
    drivers.value = [];
    showSuggestions.value = false;
    return;
  }

  debounceTimer = setTimeout(() => {
    searchDrivers();
  }, 300); // 300ms debounce
}

async function searchDrivers() {
  if (searchQuery.value.trim().length === 0) return;

  loadingDrivers.value = true;
  showSuggestions.value = true;

  try {
    // Fetch users with pagination
    await userStore.fetchUsers(1, 50);

    // Filter for drivers only
    const allDrivers = userStore.users.filter((u: any) => u.role === "DRIVER");

    // Apply search filter
    const query = searchQuery.value.toLowerCase();
    drivers.value = allDrivers.filter(
      (driver: any) =>
        driver.name.toLowerCase().includes(query) ||
        driver.email.toLowerCase().includes(query) ||
        (driver.phoneNumber && driver.phoneNumber.toLowerCase().includes(query))
    );
  } catch (err) {
    console.error("Failed to fetch drivers:", err);
    error.value = "Failed to load drivers";
  } finally {
    loadingDrivers.value = false;
  }
}

function selectDriver(driver: any) {
  selectedDriver.value = driver;
  searchQuery.value = driver.name;
  showSuggestions.value = false;
  drivers.value = [];
}

function clearSelection() {
  selectedDriver.value = null;
  searchQuery.value = "";
  drivers.value = [];
  showSuggestions.value = false;
  error.value = "";
  // Focus back on search input
  setTimeout(() => {
    searchInput.value?.focus();
  }, 100);
}

async function handleSubmit() {
  if (!props.order || !selectedDriver.value) return;
  loading.value = true;
  error.value = "";

  try {
    await orderStore.assignDriver(props.order.id, selectedDriver.value.id);
    emit("assigned");
    emit("close");
  } catch (err: any) {
    error.value = err.message || "Failed to assign driver";
  } finally {
    loading.value = false;
  }
}

// Close suggestions when clicking outside
if (typeof window !== "undefined") {
  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".relative")) {
      showSuggestions.value = false;
    }
  });
}
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
