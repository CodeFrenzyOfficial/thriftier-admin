/**
 * Order Store
 * Manages order state and actions
 */

import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  orderService,
  type Order,
  type CreateOrderData,
  type UpdateOrderData,
  type OrderFilters,
  type PaginationParams,
} from "../services/order.service";

export const useOrderStore = defineStore("order", () => {
  // State
  const orders = ref<Order[]>([]);
  const currentOrder = ref<Order | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Pagination
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const totalPages = ref(0);
  const totalItems = ref(0);
  const hasNext = ref(false);
  const hasPrev = ref(false);

  // Filters
  const filters = ref<OrderFilters>({});

  // Computed
  const pendingOrders = computed(() =>
    orders.value.filter((order) => order.status === "PENDING")
  );

  const inProgressOrders = computed(() =>
    orders.value.filter((order) => order.status === "IN_PROGRESS")
  );

  const completedOrders = computed(() =>
    orders.value.filter((order) => order.status === "COMPLETED")
  );

  // Actions
  async function fetchOrders(
    pagination?: PaginationParams,
    orderFilters?: OrderFilters
  ) {
    loading.value = true;
    error.value = null;

    try {
      const params = {
        page: pagination?.page || currentPage.value,
        limit: pagination?.limit || itemsPerPage.value,
        sortBy: pagination?.sortBy || "createdAt",
        sortOrder: pagination?.sortOrder || "desc",
      };

      const appliedFilters = orderFilters || filters.value;

      const response = await orderService.getOrders(params, appliedFilters);

      orders.value = response.data;
      currentPage.value = response.pagination.page;
      totalPages.value = response.pagination.totalPages;
      totalItems.value = response.pagination.totalItems;
      hasNext.value = response.pagination.hasNext;
      hasPrev.value = response.pagination.hasPrev;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch orders";
      console.error("Error fetching orders:", err);
    } finally {
      loading.value = false;
    }
  }

  async function fetchOrderById(id: string) {
    loading.value = true;
    error.value = null;

    try {
      currentOrder.value = await orderService.getOrderById(id);
    } catch (err: any) {
      error.value = err.message || "Failed to fetch order";
      console.error("Error fetching order:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function createOrder(data: CreateOrderData) {
    loading.value = true;
    error.value = null;

    try {
      const newOrder = await orderService.createOrder(data);
      orders.value.unshift(newOrder);
      return newOrder;
    } catch (err: any) {
      error.value = err.message || "Failed to create order";
      console.error("Error creating order:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateOrder(id: string, data: UpdateOrderData) {
    loading.value = true;
    error.value = null;

    try {
      const updatedOrder = await orderService.updateOrder(id, data);

      // Update in list
      const index = orders.value.findIndex((order) => order.id === id);
      if (index !== -1) {
        orders.value[index] = updatedOrder;
      }

      // Update current order if it's the same
      if (currentOrder.value?.id === id) {
        currentOrder.value = updatedOrder;
      }

      return updatedOrder;
    } catch (err: any) {
      error.value = err.message || "Failed to update order";
      console.error("Error updating order:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function assignDriver(orderId: string, driverId: string) {
    loading.value = true;
    error.value = null;

    try {
      const updatedOrder = await orderService.assignDriver(orderId, driverId);

      // Update in list
      const index = orders.value.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        orders.value[index] = updatedOrder;
      }

      // Update current order if it's the same
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = updatedOrder;
      }

      return updatedOrder;
    } catch (err: any) {
      error.value = err.message || "Failed to assign driver";
      console.error("Error assigning driver:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function updateStatus(
    orderId: string,
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
  ) {
    loading.value = true;
    error.value = null;

    try {
      const updatedOrder = await orderService.updateStatus(orderId, status);

      // Update in list
      const index = orders.value.findIndex((order) => order.id === orderId);
      if (index !== -1) {
        orders.value[index] = updatedOrder;
      }

      // Update current order if it's the same
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = updatedOrder;
      }

      return updatedOrder;
    } catch (err: any) {
      error.value = err.message || "Failed to update status";
      console.error("Error updating status:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  async function deleteOrder(id: string) {
    loading.value = true;
    error.value = null;

    try {
      await orderService.deleteOrder(id);
      orders.value = orders.value.filter((order) => order.id !== id);
    } catch (err: any) {
      error.value = err.message || "Failed to delete order";
      console.error("Error deleting order:", err);
      throw err;
    } finally {
      loading.value = false;
    }
  }

  function setFilters(newFilters: OrderFilters) {
    filters.value = newFilters;
  }

  function clearFilters() {
    filters.value = {};
  }

  function setCurrentOrder(order: Order | null) {
    currentOrder.value = order;
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    filters,

    // Computed
    pendingOrders,
    inProgressOrders,
    completedOrders,

    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrder,
    assignDriver,
    updateStatus,
    deleteOrder,
    setFilters,
    clearFilters,
    setCurrentOrder,
  };
});

