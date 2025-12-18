<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="min-w-full inline-block align-middle">
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-default-200">
            <thead class="bg-default-150">
              <tr class="text-sm font-normal text-default-700 whitespace-nowrap">
                <th class="ps-4 text-start">
                  <input id="checkbox-all" type="checkbox" class="form-checkbox" />
                </th>
                <th scope="col" class="px-3.5 py-3 text-start">Driver ID</th>
                <th scope="col" class="px-3.5 py-3 text-start">Name</th>
                <th scope="col" class="px-3.5 py-3 text-start">Email</th>
                <th scope="col" class="px-3.5 py-3 text-start">Phone</th>
                <th scope="col" class="px-3.5 py-3 text-start">Status</th>
                <th scope="col" class="px-3.5 py-3 text-start">Assigned</th>
                <th scope="col" class="px-3.5 py-3 text-start">
                  Assigned Orders
                </th>
                <th scope="col" class="px-3.5 py-3 text-start">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="userStore.loading" class="text-default-800 font-normal text-sm">
                <td colspan="9" class="text-center py-10">
                  <div class="flex items-center justify-center gap-2">
                    <Icon icon="lucide:loader-2" class="animate-spin size-5"></Icon>
                    <span class="text-default-500">Loading drivers...</span>
                  </div>
                </td>
              </tr>

              <tr
                v-else-if="drivers.length === 0"
                class="text-default-800 font-normal text-sm"
              >
                <td colspan="9" class="text-center py-10">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <Icon icon="lucide:truck" class="size-12 text-default-300"></Icon>
                    <span class="text-default-500">No drivers found</span>
                  </div>
                </td>
              </tr>

              <tr
                v-else
                v-for="driver in pagedDrivers"
                :key="driver.id"
                class="text-default-800 font-normal text-sm whitespace-nowrap"
              >
                <td class="px-4 py-3">
                  <input type="checkbox" class="form-checkbox" />
                </td>

                <td class="px-3.5 py-3 text-sm text-primary">{{ driver.id }}</td>

                <td class="flex py-3 px-3.5 items-center gap-3">
                  <div
                    class="size-10 rounded-full bg-default-200 flex items-center justify-center font-semibold"
                  >
                    {{ driver.initials }}
                  </div>
                  <div>
                    <h6 class="mb-1.5 font-semibold">
                      <span class="text-default-800">{{ driver.name }}</span>
                    </h6>
                    <p class="text-default-500">DRIVER</p>
                  </div>
                </td>

                <td class="py-3 px-3.5">{{ driver.email }}</td>
                <td class="py-3 px-3.5">{{ driver.phoneNumber || "—" }}</td>

                <td class="px-3.5 py-3">
                  <span
                    class="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium rounded"
                    :class="driver.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'"
                  >
                    <Icon
                      :icon="driver.isActive ? 'lucide:check-circle-2' : 'lucide:x-circle'"
                      class="size-3"
                    ></Icon>
                    {{ driver.isActive ? "Active" : "Inactive" }}
                  </span>
                </td>

                <td class="px-3.5 py-3">
                  <span
                    class="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium rounded"
                    :class="
                      assignmentMap[driver.id]?.activeOrders.length
                        ? 'bg-info/10 text-info'
                        : 'bg-default-200 text-default-700'
                    "
                    :title="ordersMetaText"
                  >
                    <Icon
                      :icon="
                        assignmentMap[driver.id]?.activeOrders.length
                          ? 'lucide:link'
                          : 'lucide:unlink'
                      "
                      class="size-3"
                    ></Icon>
                    {{
                      assignmentMap[driver.id]?.activeOrders.length
                        ? 'Assigned'
                        : 'Not Assigned'
                    }}
                  </span>
                </td>

                <td class="py-3 px-3.5">
                  <div class="flex flex-wrap gap-1 max-w-[28rem]">
                    <template v-if="assignmentMap[driver.id]?.activeOrders.length">
                      <span
                        v-for="o in assignmentMap[driver.id]!.activeOrders"
                        :key="o.id"
                        class="py-0.5 px-2 inline-flex items-center text-xs font-medium rounded bg-primary/10 text-primary"
                        :title="`${o.orderNumber} • ${o.status}`"
                      >
                        {{ o.orderNumber }}
                      </span>
                    </template>
                    <span v-else class="text-default-500">—</span>
                  </div>
                </td>

                <td class="px-3.5 py-3">
                  <div class="hs-dropdown relative inline-flex [--placement:bottom-right]">
                    <button
                      type="button"
                      class="hs-dropdown-toggle btn size-7.5 bg-default-200 hover:bg-default-600 text-default-500"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Dropdown"
                    >
                      <Icon icon="lucide:ellipsis" class="iconify size-4"></Icon>
                    </button>
                    <div
                      class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-48 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-card shadow-md rounded-lg p-2 dark:bg-default-100"
                      role="menu"
                    >
                      <button
                        @click="handleEdit(driver)"
                        type="button"
                        class="flex items-center gap-1.5 py-2 px-3 text-sm font-medium text-default-600 hover:bg-default-100 dark:hover:bg-default-200 rounded w-full text-left"
                      >
                        <Icon icon="lucide:edit" class="size-4"></Icon>
                        Edit
                      </button>
                      <button
                        @click="handleDelete(driver)"
                        type="button"
                        class="flex items-center gap-1.5 py-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded w-full text-left"
                      >
                        <Icon icon="lucide:trash-2" class="size-4"></Icon>
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Pagination (client-side, 10 per page) -->
    <div class="card-footer">
      <p class="text-default-500 text-sm">
        <span v-if="totalDrivers > 0">
          Showing <b>{{ startIndex + 1 }}</b> to <b>{{ endIndex }}</b> of
          <b>{{ totalDrivers }}</b> Results
        </span>
        <span v-else>No results found</span>
      </p>

      <nav
        v-if="totalPages > 1"
        class="flex items-center gap-2"
        aria-label="Pagination"
      >
        <button
          type="button"
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icon icon="lucide:chevron-left" class="size-4 me-1"></Icon> Prev
        </button>

        <button
          v-for="page in pageNumbers"
          :key="page"
          type="button"
          @click="goToPage(page)"
          :class="[
            'btn size-7.5',
            page === currentPage
              ? 'bg-primary text-white'
              : 'bg-transparent border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10',
          ]"
        >
          {{ page }}
        </button>

        <button
          type="button"
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <Icon icon="lucide:chevron-right" class="size-4 ms-1"></Icon>
        </button>
      </nav>
    </div>

    <!-- Edit/Delete (reuse existing modals) -->
    <EditUserModal
      :isOpen="isEditModalOpen"
      :user="selectedUser"
      @close="closeEditModal"
      @userUpdated="handleUserUpdated"
    />

    <DeleteUserModal
      :isOpen="isDeleteModalOpen"
      :user="selectedUser"
      @close="closeDeleteModal"
      @userDeleted="handleUserDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed, onMounted, nextTick, ref, watch } from "vue";
import { useUserStore } from "@/stores/user";
import { useOrderStore } from "@/stores/order";
import EditUserModal from "@/views/user/list/components/EditUserModal.vue";
import DeleteUserModal from "@/views/user/list/components/DeleteUserModal.vue";

declare global {
  interface Window {
    HSStaticMethods?: { autoInit: () => void };
  }
}

const userStore = useUserStore();
const orderStore = useOrderStore();

// Modal states
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedUser = ref<any>(null);

// We’ll try to load orders so we can show assignments.
// If backend doesn’t have /orders yet, we’ll just show “—”.
const ordersLoaded = ref(true);
const itemsPerPage = 10;
const currentPage = ref(1);

onMounted(async () => {
  await userStore.fetchUsers(1, 1000);
  try {
    await orderStore.fetchOrders({ page: 1, limit: 1000 });
    ordersLoaded.value = true;
  } catch (e) {
    ordersLoaded.value = false;
  }

  setTimeout(() => {
    if (window.HSStaticMethods?.autoInit) window.HSStaticMethods.autoInit();
  }, 100);
});

const drivers = computed(() => {
  const list = (userStore.users || []).filter((u) => u.role === "DRIVER");
  return list.map((user) => {
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    return { ...user, initials };
  });
});

const totalDrivers = computed(() => drivers.value.length);
const totalPages = computed(() =>
  totalDrivers.value > 0 ? Math.ceil(totalDrivers.value / itemsPerPage) : 0
);

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() =>
  Math.min(startIndex.value + itemsPerPage, totalDrivers.value)
);

const pagedDrivers = computed(() =>
  drivers.value.slice(startIndex.value, endIndex.value)
);

const pageNumbers = computed(() => {
  const pages: number[] = [];
  const total = totalPages.value;
  const current = currentPage.value;
  const maxPages = 5;
  let startPage = Math.max(1, current - Math.floor(maxPages / 2));
  const endPage = Math.min(total, startPage + maxPages - 1);

  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }
  for (let i = startPage; i <= endPage; i++) pages.push(i);
  return pages;
});

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

type AssignedOrder = { id: string; orderNumber: string; status: string };

const assignmentMap = computed<Record<string, { activeOrders: AssignedOrder[] }>>(
  () => {
    const map: Record<string, { activeOrders: AssignedOrder[] }> = {};
    for (const d of drivers.value) map[d.id] = { activeOrders: [] };

    if (!ordersLoaded.value) return map;
    const orders = orderStore.orders || [];

    for (const o of orders) {
      if (!o.driverId) continue;
      const status = (o.status || "").toString();
      const isActive = status === "PENDING" || status === "IN_PROGRESS";
      if (!isActive) continue;
      if (!map[o.driverId]) map[o.driverId] = { activeOrders: [] };
      map[o.driverId].activeOrders.push({
        id: o.id,
        orderNumber: o.orderNumber || o.id,
        status,
      });
    }

    return map;
  }
);

const ordersMetaText = computed(() =>
  ordersLoaded.value
    ? "Based on active orders (Pending/In Progress)"
    : "Orders API not available yet"
);

watch(
  () => [userStore.users, currentPage.value, totalPages.value],
  async () => {
    if (currentPage.value > totalPages.value) currentPage.value = 1;
    await nextTick();
    setTimeout(() => {
      if (window.HSStaticMethods?.autoInit) window.HSStaticMethods.autoInit();
    }, 100);
  }
);

const handleEdit = (user: any) => {
  selectedUser.value = user;
  isEditModalOpen.value = true;
};
const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedUser.value = null;
};
const handleUserUpdated = () => {};

const handleDelete = (user: any) => {
  selectedUser.value = user;
  isDeleteModalOpen.value = true;
};
const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedUser.value = null;
};
const handleUserDeleted = () => {};
</script>


