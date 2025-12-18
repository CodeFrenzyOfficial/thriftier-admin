<template>
  <Vertical>
    <PageTitle subtitle="Driver Portal" title="Order Details" />

    <div class="card">
      <div class="card-header">
        <h6 class="card-title">Order Details</h6>
        <button class="btn btn-sm bg-default-200" @click="$router.back()">
          ← Back
        </button>
      </div>

      <div class="card-body">
        <div v-if="error" class="p-3 bg-danger/10 text-danger rounded mb-4">
          {{ error }}
        </div>

        <div v-if="loading" class="text-default-500">Loading order...</div>

        <div v-else-if="!order" class="text-default-500">
          Order not found.
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="p-4 rounded border border-default-200">
              <div class="flex items-center justify-between">
                <h6 class="font-semibold text-default-900">
                  {{ order.orderNumber || order.id }}
                </h6>
                <span
                  class="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium rounded"
                  :class="statusVariant(order.status)"
                >
                  {{ order.status }}
                </span>
              </div>
              <p class="text-sm text-default-500 mt-1">
                Created: {{ formatDate(order.createdAt) }}
              </p>
            </div>

            <div class="p-4 rounded border border-default-200">
              <h6 class="font-semibold text-default-900 mb-2">Customer</h6>
              <p class="text-sm text-default-700">
                Name: {{ order.user?.name || "—" }}
              </p>
              <p class="text-sm text-default-700">
                Email: {{ order.user?.email || "—" }}
              </p>
              <p class="text-sm text-default-700">
                Phone: {{ order.user?.phoneNumber || "—" }}
              </p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="p-4 rounded border border-default-200">
              <h6 class="font-semibold text-default-900 mb-2">Pickup</h6>
              <p class="text-sm text-default-700 break-words">
                {{ order.pickupAddress || "—" }}
              </p>
            </div>

            <div class="p-4 rounded border border-default-200">
              <h6 class="font-semibold text-default-900 mb-2">Delivery</h6>
              <p class="text-sm text-default-700 break-words">
                {{ order.deliveryAddress || "—" }}
              </p>
            </div>

            <div class="p-4 rounded border border-default-200">
              <h6 class="font-semibold text-default-900 mb-2">Package</h6>
              <p class="text-sm text-default-700 break-words">
                {{ order.packageDescription || "—" }}
              </p>
              <p class="text-sm text-default-500 mt-1">
                Weight: {{ order.packageWeight ?? "—" }}
              </p>
            </div>
          </div>
        </div>

        <div v-if="order" class="mt-6 p-4 rounded border border-default-200">
          <h6 class="font-semibold text-default-900 mb-2">Order Images</h6>
          <p class="text-sm text-default-500">
            Images will appear here when the backend provides `packageImages`.
          </p>
        </div>
      </div>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Vertical from "@/layouts/vertical.vue";
import PageTitle from "@/components/PageTitle.vue";
import { useOrderStore } from "@/stores/order";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const orderStore = useOrderStore();
const authStore = useAuthStore();

const loading = ref(false);
const error = ref<string | null>(null);

const id = computed(() => route.params.id as string);

const order = computed(() => {
  const o = (orderStore.orders || []).find((x) => x.id === id.value) || null;
  if (!o) return null;
  // Security: only allow drivers to view their own assigned orders in portal
  if (o.driverId && authStore.user?.id && o.driverId !== authStore.user.id) {
    return null;
  }
  return o;
});

onMounted(async () => {
  if (order.value) return;
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

function statusVariant(status: string) {
  if (status === "PENDING") return "bg-warning/10 text-warning";
  if (status === "IN_PROGRESS") return "bg-info/10 text-info";
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


