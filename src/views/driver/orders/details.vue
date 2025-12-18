<template>
  <Vertical>
    <PageTitle title="Order Details" subtitle="View complete order information" />
    
    <div class="space-y-6">
    <!-- Back Button -->
    <button
      @click="router.back()"
      class="flex items-center gap-2 text-default-600 dark:text-default-400 hover:text-default-900 dark:hover:text-default-100"
    >
      <Icon icon="lucide:arrow-left" class="w-5 h-5" />
      <span>Back to Orders</span>
    </button>

    <div v-if="loading" class="text-center py-12">
      <div class="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
      <p class="mt-4 text-default-600 dark:text-default-400">Loading order details...</p>
    </div>

    <div v-else-if="!order" class="text-center py-12">
      <Icon icon="lucide:package-x" class="w-20 h-20 mx-auto text-default-300 dark:text-default-600 mb-4" />
      <p class="text-xl text-default-700 dark:text-default-300">Order not found</p>
    </div>

    <template v-else>
      <!-- Order Header -->
      <div class="card">
        <div class="p-6">
          <div class="flex items-start justify-between flex-wrap gap-4">
            <div>
              <h1 class="text-2xl font-bold text-default-900 dark:text-default-100">
                Order #{{ order.id.slice(0, 8) }}
              </h1>
              <p class="text-default-600 dark:text-default-400 mt-1">
                Created {{ formatDate(order.createdAt) }}
              </p>
            </div>
            <div class="flex items-center gap-3">
              <span
                class="inline-flex px-3 py-1.5 text-sm font-semibold rounded-full"
                :class="getStatusClass(order.status)"
              >
                {{ order.status }}
              </span>
              <button
                v-if="order.status === 'PENDING'"
                @click="startDelivery"
                class="btn bg-green-600 text-white hover:bg-green-700"
              >
                <Icon icon="lucide:play" class="w-4 h-4 mr-2" />
                Start Delivery
              </button>
              <button
                v-if="order.status === 'IN_PROGRESS'"
                @click="completeDelivery"
                class="btn bg-blue-600 text-white hover:bg-blue-700"
              >
                <Icon icon="lucide:check" class="w-4 h-4 mr-2" />
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Order Details Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Customer Information -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title flex items-center gap-2">
              <Icon icon="lucide:user" class="w-5 h-5" />
              Customer Information
            </h4>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Name
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.customerName || 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Phone
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.customerPhone || 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Email
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.customerEmail || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Pickup Information -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title flex items-center gap-2">
              <Icon icon="lucide:map-pin" class="w-5 h-5" />
              Pickup Location
            </h4>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Address
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.pickupLocation || 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Contact
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.pickupContact || 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Phone
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.pickupPhone || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Delivery Information -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title flex items-center gap-2">
              <Icon icon="lucide:home" class="w-5 h-5" />
              Delivery Location
            </h4>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Address
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.deliveryLocation || 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Contact
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.deliveryContact || 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Phone
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.deliveryPhone || 'N/A' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Package Details -->
        <div class="card">
          <div class="card-header">
            <h4 class="card-title flex items-center gap-2">
              <Icon icon="lucide:package" class="w-5 h-5" />
              Package Details
            </h4>
          </div>
          <div class="p-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Description
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.packageDescription || 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Weight
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.packageWeight ? order.packageWeight + ' kg' : 'N/A' }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-default-700 dark:text-default-400 mb-1">
                Dimensions
              </label>
              <p class="text-default-900 dark:text-default-100 font-medium">
                {{ order.packageDimensions || 'N/A' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Package Images (if uploaded) -->
      <div v-if="order.packageImages && order.packageImages.length > 0" class="card">
        <div class="card-header">
          <h4 class="card-title flex items-center gap-2">
            <Icon icon="lucide:image" class="w-5 h-5" />
            Package Images
          </h4>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="(image, index) in order.packageImages" :key="index" class="relative aspect-square rounded-lg overflow-hidden bg-default-100 dark:bg-default-800">
              <img :src="image" :alt="`Package ${index + 1}`" class="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      <!-- Notes / Special Instructions -->
      <div v-if="order.notes" class="card">
        <div class="card-header">
          <h4 class="card-title flex items-center gap-2">
            <Icon icon="lucide:sticky-note" class="w-5 h-5" />
            Notes & Special Instructions
          </h4>
        </div>
        <div class="p-6">
          <p class="text-default-800 dark:text-default-200 whitespace-pre-wrap leading-relaxed">
            {{ order.notes }}
          </p>
        </div>
      </div>
    </template>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useRouter, useRoute } from 'vue-router';
import Vertical from '@/layouts/vertical.vue';
import PageTitle from '@/components/PageTitle.vue';
import { useOrderStore } from '@/stores/order';

const router = useRouter();
const route = useRoute();
const orderStore = useOrderStore();

const loading = ref(false);
const order = ref<any>(null);

const orderId = route.params.id as string;

const fetchOrderDetails = async () => {
  loading.value = true;
  try {
    order.value = await orderStore.fetchOrderById(orderId);
  } catch (error) {
    console.error('Failed to fetch order details:', error);
  } finally {
    loading.value = false;
  }
};

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
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const startDelivery = async () => {
  try {
    await orderStore.updateStatus(orderId, 'IN_PROGRESS');
    await fetchOrderDetails(); // Refresh
  } catch (error) {
    console.error('Failed to start delivery:', error);
  }
};

const completeDelivery = async () => {
  try {
    await orderStore.updateStatus(orderId, 'COMPLETED');
    await fetchOrderDetails(); // Refresh
  } catch (error) {
    console.error('Failed to complete delivery:', error);
  }
};

onMounted(() => {
  fetchOrderDetails();
});
</script>
