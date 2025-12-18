<template>
  <div>
    <div v-if="loading" class="py-10 text-center">
      <div class="flex items-center justify-center gap-2">
        <Icon icon="lucide:loader-2" class="animate-spin size-5"></Icon>
        <span class="text-default-500">Loading orders...</span>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="py-10 text-center">
      <Icon icon="lucide:package" class="size-12 text-default-300 mx-auto"></Icon>
      <p class="mt-2 text-default-500">No assigned orders right now.</p>
      <button class="btn btn-sm bg-default-200 mt-4" @click="$emit('refresh')">
        Refresh
      </button>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-default-200">
        <thead class="bg-default-150">
          <tr class="text-sm font-normal text-default-700 whitespace-nowrap">
            <th class="px-3.5 py-3 text-start">Order #</th>
            <th class="px-3.5 py-3 text-start">Pickup</th>
            <th class="px-3.5 py-3 text-start">Delivery</th>
            <th class="px-3.5 py-3 text-start">Customer</th>
            <th class="px-3.5 py-3 text-start">Status</th>
            <th class="px-3.5 py-3 text-start">Created</th>
            <th class="px-3.5 py-3 text-end">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-default-200">
          <tr
            v-for="o in orders"
            :key="o.id"
            class="text-default-800 font-normal text-sm whitespace-nowrap hover:bg-default-150 transition-colors"
          >
            <td class="px-3.5 py-3 text-primary font-medium">
              {{ o.orderNumber || o.id }}
            </td>
            <td class="px-3.5 py-3 max-w-[18rem] truncate" :title="o.pickupAddress">
              {{ o.pickupAddress }}
            </td>
            <td
              class="px-3.5 py-3 max-w-[18rem] truncate"
              :title="o.deliveryAddress"
            >
              {{ o.deliveryAddress }}
            </td>
            <td class="px-3.5 py-3">
              <div class="text-default-800">{{ o.user?.name || "—" }}</div>
              <div class="text-xs text-default-500">{{ o.user?.email || "" }}</div>
            </td>
            <td class="px-3.5 py-3">
              <span
                class="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium rounded"
                :class="
                  o.status === 'PENDING'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-info/10 text-info'
                "
              >
                <Icon
                  :icon="o.status === 'PENDING' ? 'lucide:clock' : 'lucide:loader'"
                  class="size-3"
                ></Icon>
                {{ o.status === "PENDING" ? "Pending" : "In Progress" }}
              </span>
            </td>
            <td class="px-3.5 py-3 text-default-600">
              {{ formatDate(o.createdAt) }}
            </td>
            <td class="px-3.5 py-3 text-end">
              <button
                class="btn btn-sm bg-default-200"
                @click="$emit('view', o.id)"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Order } from "@/services/order.service";

defineProps<{
  orders: Order[];
  loading: boolean;
}>();

defineEmits<{
  view: [orderId: string];
  refresh: [];
}>();

function formatDate(date: any) {
  try {
    return new Date(date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
</script>


