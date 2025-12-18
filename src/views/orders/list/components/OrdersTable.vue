<template>
  <div class="overflow-hidden">
    <!-- Loading State -->
    <div v-if="orderStore.loading" class="py-10 text-center">
      <div class="flex items-center justify-center gap-2">
        <div
          class="inline-block animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"
        ></div>
        <span class="text-default-500">Loading orders...</span>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!orderStore.loading && orderStore.orders.length === 0"
      class="py-10 text-center"
    >
      <svg
        class="mx-auto h-12 w-12 text-default-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <h3 class="mt-2 text-sm font-medium text-default-800">
        No orders found
      </h3>
      <p class="mt-1 text-sm text-default-500">
        Get started by creating a new order.
      </p>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-default-200">
        <thead class="bg-default-150">
          <tr>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Order #
            </th>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Customer
            </th>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Pickup Address
            </th>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Delivery Address
            </th>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Driver
            </th>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Price
            </th>
            <th
              class="px-3.5 py-3 text-left text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Created
            </th>
            <th
              class="px-3.5 py-3 text-right text-xs font-medium text-default-700 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default-200">
          <tr
            v-for="order in orderStore.orders"
            :key="order.id"
            class="text-default-800 font-normal text-sm whitespace-nowrap hover:bg-default-150 transition-colors"
          >
            <td class="px-3.5 py-3">
              <div class="text-sm font-medium text-primary">
                {{ order.orderNumber }}
              </div>
            </td>
            <td class="px-3.5 py-3">
              <div class="text-sm text-default-800">
                {{ order.user?.name || 'N/A' }}
              </div>
              <div class="text-xs text-default-500">
                {{ order.user?.email }}
              </div>
            </td>
            <td class="px-3.5 py-3">
              <div class="text-sm text-default-600 max-w-xs truncate">
                {{ order.pickupAddress }}
              </div>
            </td>
            <td class="px-3.5 py-3">
              <div class="text-sm text-default-600 max-w-xs truncate">
                {{ order.deliveryAddress }}
              </div>
            </td>
            <td class="px-3.5 py-3">
              <div v-if="order.driver" class="text-sm text-default-800">
                {{ order.driver.name }}
              </div>
              <button
                v-else
                @click="$emit('assignDriver', order)"
                class="text-sm text-primary hover:text-primary/80"
              >
                Assign Driver
              </button>
            </td>
            <td class="px-3.5 py-3">
              <span
                :class="getStatusClass(order.status)"
                class="px-2 py-1 text-xs font-medium rounded-full"
              >
                {{ getStatusLabel(order.status) }}
              </span>
            </td>
            <td class="px-3.5 py-3">
              <div class="text-sm text-default-800">
                ${{ (order.finalPrice || order.estimatedPrice).toFixed(2) }}
              </div>
            </td>
            <td class="px-3.5 py-3">
              <div class="text-sm text-default-600">
                {{ formatDate(order.createdAt) }}
              </div>
            </td>
            <td class="px-3.5 py-3 text-right text-sm font-medium">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="$emit('view', order)"
                  class="text-primary hover:text-primary/80"
                  title="View Details"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>

                <button
                  @click="$emit('updateStatus', order)"
                  class="text-info hover:text-info/80"
                  title="Update Status"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>

                <button
                  v-if="!order.driver"
                  @click="$emit('assignDriver', order)"
                  class="text-success hover:text-success/80"
                  title="Assign Driver"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </button>

                <button
                  @click="$emit('delete', order)"
                  class="text-danger hover:text-danger/80"
                  title="Delete"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      v-if="orderStore.orders.length > 0"
      class="px-4 py-3 border-t border-default-200 sm:px-6"
    >
      <div class="flex items-center justify-between">
        <div class="text-sm text-default-700">
          Showing
          <span class="font-medium">{{ (orderStore.currentPage - 1) * orderStore.itemsPerPage + 1 }}</span>
          to
          <span class="font-medium">{{ Math.min(orderStore.currentPage * orderStore.itemsPerPage, orderStore.totalItems) }}</span>
          of
          <span class="font-medium">{{ orderStore.totalItems }}</span>
          results
        </div>
        <div class="flex space-x-2">
          <button
            @click="previousPage"
            :disabled="!orderStore.hasPrev"
            class="btn btn-sm bg-default-200 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            @click="nextPage"
            :disabled="!orderStore.hasNext"
            class="btn btn-sm bg-default-200 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useOrderStore } from "../../../../stores/order";
import type { Order } from "../../../../services/order.service";

const orderStore = useOrderStore();

// Emit events
defineEmits<{
  view: [order: Order];
  assignDriver: [order: Order];
  updateStatus: [order: Order];
  delete: [order: Order];
}>();

// Helper functions
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

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function previousPage() {
  if (orderStore.hasPrev) {
    orderStore.fetchOrders({ page: orderStore.currentPage - 1 });
  }
}

function nextPage() {
  if (orderStore.hasNext) {
    orderStore.fetchOrders({ page: orderStore.currentPage + 1 });
  }
}
</script>

