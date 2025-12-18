<template>
  <Vertical>
    <div class="space-y-6">
      <PageTitle subtitle="Analytics" title="Dashboard" />

      <div class="card">
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
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-default-900">
            Analytics Dashboard
          </h3>
          <p class="mt-2 text-sm text-default-500">
            Advanced analytics and insights for your delivery business
          </p>
          <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <h4 class="font-medium text-default-900 dark:text-default-100">
                Order Analytics
              </h4>
              <ul
                class="mt-2 text-sm text-default-600 dark:text-default-400 space-y-1"
              >
                <li>• Total orders and trends</li>
                <li>• Status breakdown charts</li>
                <li>• Order completion rates</li>
                <li>• Average delivery time</li>
              </ul>
            </div>
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <h4 class="font-medium text-default-900 dark:text-default-100">
                Revenue Metrics
              </h4>
              <ul
                class="mt-2 text-sm text-default-600 dark:text-default-400 space-y-1"
              >
                <li>• Total revenue tracking</li>
                <li>• Revenue by period</li>
                <li>• Average order value</li>
                <li>• Growth trends</li>
              </ul>
            </div>
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <h4 class="font-medium text-default-900 dark:text-default-100">
                Customer Insights
              </h4>
              <ul
                class="mt-2 text-sm text-default-600 dark:text-default-400 space-y-1"
              >
                <li>• Top customers</li>
                <li>• Customer activity</li>
                <li>• Retention rates</li>
                <li>• Geographic distribution</li>
              </ul>
            </div>
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
            >
              <h4 class="font-medium text-default-900 dark:text-default-100">
                Driver Performance
              </h4>
              <ul
                class="mt-2 text-sm text-default-600 dark:text-default-400 space-y-1"
              >
                <li>• Driver leaderboard</li>
                <li>• Completion rates</li>
                <li>• Customer ratings</li>
                <li>• Earnings summary</li>
              </ul>
            </div>
          </div>
          <div class="mt-6">
            <span
              class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
            >
              Coming Soon
            </span>
          </div>
        </div>
      </div>
    </div>
  </Vertical>
</template>

<script setup lang="ts">
// Analytics dashboard - to be implemented
import Vertical from "@/layouts/vertical.vue";
import PageTitle from "@/components/PageTitle.vue";
</script>
