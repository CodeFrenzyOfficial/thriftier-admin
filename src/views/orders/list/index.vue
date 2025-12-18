<template>
  <Vertical>
    <PageTitle subtitle="Management" title="Orders" />

    <div class="card">
      <div class="card-header">
        <h6 class="card-title">Orders Management</h6>
      </div>

      <div class="card-body space-y-4">
        <!-- Filters -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label class="block font-medium text-default-900 text-sm mb-2"
              >Search</label
            >
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search orders..."
              class="form-input w-full"
              @input="handleSearch"
            />
          </div>

          <div>
            <label class="block font-medium text-default-900 text-sm mb-2"
              >Status</label
            >
            <select
              v-model="statusFilter"
              class="form-input w-full"
              @change="applyFilters"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label class="block font-medium text-default-900 text-sm mb-2"
              >From</label
            >
            <input
              v-model="dateFrom"
              type="date"
              class="form-input w-full"
              @change="applyFilters"
            />
          </div>

          <div>
            <label class="block font-medium text-default-900 text-sm mb-2"
              >To</label
            >
            <input
              v-model="dateTo"
              type="date"
              class="form-input w-full"
              @change="applyFilters"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button @click="clearFilters" class="btn btn-sm bg-default-200">
            Clear Filters
          </button>
        </div>

        <!-- Orders Table -->
        <OrdersTable
          @view="handleView"
          @assign-driver="handleAssignDriver"
          @update-status="handleUpdateStatus"
          @delete="handleDelete"
        />
      </div>
    </div>

    <!-- Modals -->

    <AssignDriverModal
      :is-open="isAssignDriverModalOpen"
      :order="selectedOrder"
      @close="closeAssignDriverModal"
      @assigned="handleDriverAssigned"
    />

    <UpdateStatusModal
      :is-open="isUpdateStatusModalOpen"
      :order="selectedOrder"
      @close="closeUpdateStatusModal"
      @updated="handleStatusUpdated"
    />
  </Vertical>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useOrderStore } from "../../../stores/order";
import { useRouter } from "vue-router";
import PageTitle from "@/components/PageTitle.vue";
import OrdersTable from "./components/OrdersTable.vue";
import AssignDriverModal from "./components/AssignDriverModal.vue";
import UpdateStatusModal from "./components/UpdateStatusModal.vue";
import type { Order } from "../../../services/order.service";
import Vertical from "@/layouts/vertical.vue";
import { Icon } from "@iconify/vue";

const router = useRouter();
const orderStore = useOrderStore();

// Search and Filters
const searchQuery = ref("");
const statusFilter = ref("");
const dateFrom = ref("");
const dateTo = ref("");

// Modals
const isAssignDriverModalOpen = ref(false);
const isUpdateStatusModalOpen = ref(false);
const selectedOrder = ref<Order | null>(null);

// Search debounce
let searchTimeout: ReturnType<typeof setTimeout>;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    applyFilters();
  }, 500);
}

function applyFilters() {
  orderStore.setFilters({
    search: searchQuery.value || undefined,
    status: statusFilter.value || undefined,
    startDate: dateFrom.value || undefined,
    endDate: dateTo.value || undefined,
  });
  orderStore.fetchOrders();
}

function clearFilters() {
  searchQuery.value = "";
  statusFilter.value = "";
  dateFrom.value = "";
  dateTo.value = "";
  orderStore.clearFilters();
  orderStore.fetchOrders();
}

function handleView(order: Order) {
  router.push(`/orders/${order.id}`);
}

function handleAssignDriver(order: Order) {
  selectedOrder.value = order;
  isAssignDriverModalOpen.value = true;
}

function closeAssignDriverModal() {
  isAssignDriverModalOpen.value = false;
  selectedOrder.value = null;
}

function handleDriverAssigned() {
  closeAssignDriverModal();
  orderStore.fetchOrders();
}

function handleUpdateStatus(order: Order) {
  selectedOrder.value = order;
  isUpdateStatusModalOpen.value = true;
}

function closeUpdateStatusModal() {
  isUpdateStatusModalOpen.value = false;
  selectedOrder.value = null;
}

function handleStatusUpdated() {
  closeUpdateStatusModal();
  orderStore.fetchOrders();
}

async function handleDelete(order: Order) {
  if (confirm(`Are you sure you want to delete order ${order.orderNumber}?`)) {
    try {
      await orderStore.deleteOrder(order.id);
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  }
}

onMounted(() => {
  orderStore.fetchOrders();
});
</script>
