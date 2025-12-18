<template>
  <Vertical>
    <PageTitle subtitle="Orders" title="Details" />

    <div class="card">
      <div class="card-header">
        <h6 class="card-title">Order Details</h6>
        <button
          @click="$router.push('/orders')"
          class="btn btn-sm bg-default-200"
        >
          ← Back to Orders
        </button>
      </div>

      <div class="card-body text-center">
        <svg
          class="mx-auto h-12 w-12 text-primary-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-default-900">
          Order Details Page
        </h3>
        <p class="mt-2 text-sm text-default-500">
          This page will show complete order information including:
        </p>
        <ul class="mt-4 text-sm text-default-600 space-y-2">
          <li>• Order timeline and status history</li>
          <li>• Customer and driver information</li>
          <li>• Pickup and delivery addresses</li>
          <li>• Package details and images</li>
          <li>• Pricing breakdown</li>
        </ul>
      </div>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
import PageTitle from "@/components/PageTitle.vue";
import Vertical from "@/layouts/vertical.vue";
</script>
