<template>
  <Vertical>
    <PageTitle title="Driver Dashboard" subtitle="Welcome back! Here's your delivery overview" />
    
    <div class="space-y-6">
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Total Assigned Orders -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-default-600 dark:text-default-400">
                Total Assigned
              </p>
              <h3 class="text-2xl font-bold text-default-900 dark:text-default-100 mt-2">
                {{ stats.totalAssigned }}
              </h3>
            </div>
            <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon icon="lucide:package" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Deliveries -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-default-600 dark:text-default-400">
                Pending
              </p>
              <h3 class="text-2xl font-bold text-default-900 dark:text-default-100 mt-2">
                {{ stats.pending }}
              </h3>
            </div>
            <div class="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Icon icon="lucide:clock" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- In Progress -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-default-600 dark:text-default-400">
                In Progress
              </p>
              <h3 class="text-2xl font-bold text-default-900 dark:text-default-100 mt-2">
                {{ stats.inProgress }}
              </h3>
            </div>
            <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Icon icon="lucide:truck" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      <!-- Completed Today -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-default-600 dark:text-default-400">
                Completed Today
              </p>
              <h3 class="text-2xl font-bold text-default-900 dark:text-default-100 mt-2">
                {{ stats.completedToday }}
              </h3>
            </div>
            <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Icon icon="lucide:check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Orders Table -->
    <div class="card">
      <div class="card-header">
        <h4 class="card-title">Current Deliveries</h4>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-8">
          <div class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p class="mt-2 text-default-600 dark:text-default-400">Loading orders...</p>
        </div>

        <div v-else-if="currentOrders.length === 0" class="text-center py-12">
          <Icon icon="lucide:package-x" class="w-16 h-16 mx-auto text-default-300 dark:text-default-600 mb-4" />
          <p class="text-default-600 dark:text-default-400">No current deliveries</p>
        </div>

        <div v-else class="overflow-x-auto">
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
                  Pickup Location
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                  Delivery Location
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-4 py-3 text-right text-xs font-medium text-default-700 dark:text-default-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-card divide-y divide-default-200 dark:divide-default-700">
              <tr v-for="order in currentOrders" :key="order.id" class="hover:bg-default-50 dark:hover:bg-default-800/30">
                <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-default-900 dark:text-default-100">
                  #{{ order.id.slice(0, 8) }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-sm text-default-800 dark:text-default-200">
                  {{ order.customerName || 'N/A' }}
                </td>
                <td class="px-4 py-4 text-sm text-default-800 dark:text-default-200">
                  {{ order.pickupLocation || 'N/A' }}
                </td>
                <td class="px-4 py-4 text-sm text-default-800 dark:text-default-200">
                  {{ order.deliveryLocation || 'N/A' }}
                </td>
                <td class="px-4 py-4 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="getStatusClass(order.status)"
                  >
                    {{ order.status }}
                  </span>
                </td>
                <td class="px-4 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    @click="viewOrder(order.id)"
                    class="text-primary hover:text-primary-600 dark:hover:text-primary-500 font-medium transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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

// Fetch driver's assigned orders
const fetchDriverOrders = async () => {
  loading.value = true;
  try {
    // Fetch all orders (backend should filter by driver ID if needed)
    await orderStore.fetchOrders();
    
    // Filter orders assigned to current driver
    const driverId = authStore.user?.id;
    orders.value = orderStore.orders.filter((order: any) => order.driverId === driverId);
  } catch (error) {
    console.error('Failed to fetch driver orders:', error);
  } finally {
    loading.value = false;
  }
};

// Stats computed from orders
const stats = computed(() => {
  const totalAssigned = orders.value.length;
  const pending = orders.value.filter((o: any) => o.status === 'PENDING').length;
  const inProgress = orders.value.filter((o: any) => o.status === 'IN_PROGRESS').length;
  
  // Completed today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = orders.value.filter((o: any) => {
    if (o.status !== 'COMPLETED') return false;
    const orderDate = new Date(o.updatedAt);
    return orderDate >= today;
  }).length;

  return {
    totalAssigned,
    pending,
    inProgress,
    completedToday,
  };
});

// Current orders (pending + in progress)
const currentOrders = computed(() => {
  return orders.value.filter((o: any) => 
    o.status === 'PENDING' || o.status === 'IN_PROGRESS'
  );
});

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

const viewOrder = (orderId: string) => {
  router.push(`/driver/orders/${orderId}`);
};

onMounted(() => {
  fetchDriverOrders();
});
</script>

