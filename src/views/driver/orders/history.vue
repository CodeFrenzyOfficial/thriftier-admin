<template>
  <Vertical>
    <PageTitle subtitle="Driver Portal" title="Order History" />

    <div class="card">
      <div class="card-header">
        <h6 class="card-title">My Completed Orders</h6>
      </div>

      <div class="card-body">
        <div v-if="error" class="p-3 bg-danger/10 text-danger rounded mb-4">
          {{ error }}
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-default-200">
            <thead class="bg-default-150">
              <tr class="text-sm font-normal text-default-700 whitespace-nowrap">
                <th class="px-3.5 py-3 text-start">Order #</th>
                <th class="px-3.5 py-3 text-start">Customer</th>
                <th class="px-3.5 py-3 text-start">Pickup</th>
                <th class="px-3.5 py-3 text-start">Status</th>
                <th class="px-3.5 py-3 text-start">Completed</th>
                <th class="px-3.5 py-3 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" class="text-default-800 font-normal text-sm">
                <td colspan="6" class="text-center py-10">
                  <span class="text-default-500">Loading history...</span>
                </td>
              </tr>

              <tr v-else-if="paged.length === 0" class="text-default-800 font-normal text-sm">
                <td colspan="6" class="text-center py-10">
                  <span class="text-default-500">No order history yet</span>
                </td>
              </tr>

              <tr
                v-else
                v-for="o in paged"
                :key="o.id"
                class="text-default-800 font-normal text-sm whitespace-nowrap"
              >
                <td class="px-3.5 py-3 text-primary font-medium">
                  {{ o.orderNumber || o.id }}
                </td>
                <td class="px-3.5 py-3">{{ o.user?.name || "—" }}</td>
                <td class="px-3.5 py-3 max-w-[28rem] truncate">
                  {{ o.pickupAddress || "—" }}
                </td>
                <td class="px-3.5 py-3">
                  <span
                    class="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium rounded"
                    :class="statusVariant(o.status)"
                  >
                    {{ o.status }}
                  </span>
                </td>
                <td class="px-3.5 py-3">
                  {{ formatDate(o.deliveryTime || o.updatedAt || o.createdAt) }}
                </td>
                <td class="px-3.5 py-3">
                  <button
                    class="btn btn-sm bg-default-200"
                    @click="$router.push(`/driver/orders/${o.id}`)"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card-footer" v-if="totalPages > 1">
        <p class="text-default-500 text-sm">
          Showing <b>{{ startIndex + 1 }}</b> to <b>{{ endIndex }}</b> of
          <b>{{ totalItems }}</b> Results
        </p>

        <nav class="flex items-center gap-2" aria-label="Pagination">
          <button
            type="button"
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>

          <button
            v-for="p in pageNumbers"
            :key="p"
            type="button"
            @click="goToPage(p)"
            :class="[
              'btn size-7.5',
              p === currentPage
                ? 'bg-primary text-white'
                : 'bg-transparent border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10',
            ]"
          >
            {{ p }}
          </button>

          <button
            type="button"
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </nav>
      </div>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Vertical from "@/layouts/vertical.vue";
import PageTitle from "@/components/PageTitle.vue";
import { useAuthStore } from "@/stores/auth";
import { useOrderStore } from "@/stores/order";
import { useClientPagination } from "@/composables/useClientPagination";

const authStore = useAuthStore();
const orderStore = useOrderStore();

const loading = ref(false);
const error = ref<string | null>(null);

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    await orderStore.fetchOrders({ page: 1, limit: 1000 });
  } catch (e: any) {
    error.value = e?.message || "Orders API not available yet";
  } finally {
    loading.value = false;
  }
});

const driverId = computed(() => authStore.user?.id || "");
const historyOrders = computed(() =>
  (orderStore.orders || []).filter(
    (o) =>
      o.driverId === driverId.value &&
      (o.status === "COMPLETED" || o.status === "CANCELLED")
  )
);

const {
  currentPage,
  totalItems,
  totalPages,
  startIndex,
  endIndex,
  pagedItems,
  pageNumbers,
  goToPage,
  reset,
} = useClientPagination(historyOrders, 10);

const paged = computed(() => pagedItems.value);
watch(historyOrders, () => reset());

function statusVariant(status: string) {
  if (status === "COMPLETED") return "bg-success/10 text-success";
  if (status === "CANCELLED") return "bg-danger/10 text-danger";
  return "bg-default-200 text-default-700";
}

function formatDate(date: any) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
</script>


