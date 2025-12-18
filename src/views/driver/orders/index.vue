<template>
  <Vertical>
    <PageTitle title="My Orders" subtitle="View and manage your assigned deliveries" />
    
    <div class="space-y-6">
    <!-- Filters -->
    <div class="card">
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
              Status
            </label>
            <select
              v-model="filters.status"
              class="form-input w-full"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <!-- Search -->
          <div>
            <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
              Search
            </label>
            <input
              v-model="filters.search"
              type="text"
              placeholder="Search by order ID or customer..."
              class="form-input w-full"
            />
          </div>

          <!-- Date Filter -->
          <div>
            <label class="block text-sm font-medium text-default-700 dark:text-default-300 mb-2">
              Date Range
            </label>
            <select
              v-model="filters.dateRange"
              class="form-input w-full"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="card">
      <div class="card-header flex items-center justify-between">
        <h4 class="card-title">Orders List</h4>
        <div class="text-sm text-default-600 dark:text-default-400">
          Total: {{ filteredOrders.length }} orders
        </div>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p class="mt-2 text-default-600 dark:text-default-400">Loading orders...</p>
        </div>

        <div v-else-if="paginatedOrders.length === 0" class="text-center py-12">
          <Icon icon="lucide:package-x" class="w-16 h-16 mx-auto text-default-300 dark:text-default-600 mb-4" />
          <p class="text-default-600 dark:text-default-400">No orders found</p>
        </div>

        <div v-else>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-default-200 dark:divide-default-700">
              <thead class="bg-default-50 dark:bg-default-800/50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                    Pickup
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                    Delivery
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-card divide-y divide-default-200 dark:divide-default-700">
                <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-default-50 dark:hover:bg-default-800/30">
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-default-900 dark:text-default-100">
                    #{{ order.id.slice(0, 8) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-default-800 dark:text-default-200">
                    {{ order.user?.name || 'N/A' }}
                  </td>
                  <td class="px-4 py-4 text-sm text-default-800 dark:text-default-200">
                    {{ truncateText(order.pickupAddress || 'N/A', 30) }}
                  </td>
                  <td class="px-4 py-4 text-sm text-default-800 dark:text-default-200">
                    {{ truncateText(order.deliveryAddress || 'N/A', 30) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                      :class="getStatusClass(order.status)"
                    >
                      {{ order.status }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-default-800 dark:text-default-200">
                    {{ formatDate(order.createdAt) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <button
                      @click="viewOrder(order.id)"
                      class="text-primary hover:text-primary-600 dark:hover:text-primary-500 font-medium transition-colors"
                    >
                      View
                    </button>
                    <button
                      v-if="order.status === 'PENDING'"
                      @click="startDelivery(order.id)"
                      class="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 font-medium transition-colors"
                    >
                      Start
                    </button>
                    <button
                      v-if="order.status === 'IN_PROGRESS'"
                      @click="completeDelivery(order.id)"
                      class="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-between mt-4 pt-4 border-t border-default-200 dark:border-default-700">
            <div class="text-sm text-default-700 dark:text-default-300">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }} of {{ filteredOrders.length }} results
            </div>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-default-300 dark:border-default-600 rounded text-default-700 dark:text-default-300 hover:bg-default-100 dark:hover:bg-default-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                v-for="page in visiblePages"
                :key="page"
                @click="currentPage = page"
                class="px-3 py-1 text-sm border rounded transition-colors"
                :class="currentPage === page 
                  ? 'bg-primary text-white border-primary' 
                  : 'border-default-300 dark:border-default-600 text-default-700 dark:text-default-300 hover:bg-default-100 dark:hover:bg-default-800'"
              >
                {{ page }}
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-default-300 dark:border-default-600 rounded text-default-700 dark:text-default-300 hover:bg-default-100 dark:hover:bg-default-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter } from 'vue-router';
import Vertical from '@/layouts/vertical.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useAuthStore } from '@/stores/auth';
import { useOrderStore } from '@/stores/order';

const router = useRouter();
const authStore = useAuthStore();
const orderStore = useOrderStore();

const loading = ref(false);
const orders = ref<any[]>([]);

const filters = ref({
  status: '',
  search: '',
  dateRange: 'all',
});

const currentPage = ref(1);
const itemsPerPage = 10;

// Fetch driver's orders
const fetchDriverOrders = async () => {
  loading.value = true;
  try {
    await orderStore.fetchOrders();
    const driverId = authStore.user?.id;
    orders.value = orderStore.orders.filter((order: any) => order.driverId === driverId);
  } catch (error) {
    console.error('Failed to fetch driver orders:', error);
  } finally {
    loading.value = false;
  }
};

// Filter orders
const filteredOrders = computed(() => {
  let result = [...orders.value];

  // Status filter
  if (filters.value.status) {
    result = result.filter((o: any) => o.status === filters.value.status);
  }

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase();
    result = result.filter((o: any) =>
      o.id.toLowerCase().includes(search) ||
      (o.user?.name && o.user.name.toLowerCase().includes(search))
    );
  }

  // Date filter
  if (filters.value.dateRange !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    result = result.filter((o: any) => {
      const orderDate = new Date(o.createdAt);
      
      switch (filters.value.dateRange) {
        case 'today':
          return orderDate >= today;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });
  }

  return result;
});

// Pagination
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage));

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredOrders.value.slice(start, end);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages.value, start + maxVisible - 1);
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
});

// Reset page when filters change
watch(filters, () => {
  currentPage.value = 1;
}, { deep: true });

const getStatusClass = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-default-100 text-default-800 dark:bg-default-700 dark:text-default-300';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const viewOrder = (orderId: string) => {
  router.push(`/driver/orders/${orderId}`);
};

const startDelivery = async (orderId: string) => {
  try {
    await orderStore.updateStatus(orderId, 'IN_PROGRESS');
    await fetchDriverOrders(); // Refresh
  } catch (error) {
    console.error('Failed to start delivery:', error);
  }
};

const completeDelivery = async (orderId: string) => {
  try {
    await orderStore.updateStatus(orderId, 'COMPLETED');
    await fetchDriverOrders(); // Refresh
  } catch (error) {
    console.error('Failed to complete delivery:', error);
  }
};

onMounted(() => {
  fetchDriverOrders();
});
</script>
