<template>
  <div class="flex flex-col">
    <div class="overflow-x-auto">
      <div class="min-w-full inline-block align-middle">
        <div class="overflow-hidden">
          <table class="min-w-full divide-y divide-default-200">
            <thead class="bg-default-150">
              <tr
                class="text-sm font-normal text-default-700 whitespace-nowrap"
              >
                <th class="ps-4 text-start">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    class="form-checkbox"
                  />
                </th>
                <th scope="col" class="px-3.5 py-3 text-start">User ID</th>
                <th scope="col" class="px-3.5 py-3 text-start">Name</th>
                <th scope="col" class="px-3.5 py-3 text-start">Location</th>
                <th scope="col" class="px-3.5 py-3 text-start">Email</th>
                <th scope="col" class="px-3.5 py-3 text-start">Phone Number</th>
                <th scope="col" class="px-3.5 py-3 text-start">Joining Date</th>
                <th scope="col" class="px-3.5 py-3 text-start">Status</th>
                <th scope="col" class="px-3.5 py-3 text-start">Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="userStore.loading">
                <td colspan="9" class="text-center py-10">
                  <div class="flex items-center justify-center gap-2">
                    <Icon
                      icon="lucide:loader-2"
                      class="animate-spin size-5"
                    ></Icon>
                    <span class="text-default-500">Loading users...</span>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-else-if="users.length === 0">
                <td colspan="9" class="text-center py-10">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <Icon
                      icon="lucide:users"
                      class="size-12 text-default-300"
                    ></Icon>
                    <span class="text-default-500">No users found</span>
                  </div>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr
                v-else
                class="text-default-800 font-normal text-sm whitespace-nowrap"
                v-for="(item, idx) in users"
                :key="idx"
              >
                <td class="px-4 py-3">
                  <input
                    id="checkbox-all"
                    type="checkbox"
                    class="form-checkbox"
                  />
                </td>
                <td class="px-3.5 py-3 text-sm text-primary">{{ item.id }}</td>
                <td class="flex py-3 px-3.5 items-center gap-3">
                  <div
                    class="size-10 rounded-full bg-default-200 flex items-center justify-center font-semibold"
                  >
                    {{ item.initials }}
                  </div>
                  <div>
                    <h6 class="mb-1.5 font-semibold">
                      <RouterLink to="" class="text-default-800">{{
                        item.name
                      }}</RouterLink>
                    </h6>
                    <p class="text-default-500">{{ item.role }}</p>
                  </div>
                </td>
                <td class="py-3 px-3.5">{{ item.location }}</td>
                <td class="py-3 px-3.5">{{ item.email }}</td>
                <td class="py-3 px-3.5">{{ item.phoneNumber }}</td>
                <td class="py-3 px-3.5">{{ item.joined }}</td>
                <td class="px-3.5 py-3">
                  <span
                    class="py-0.5 px-2.5 inline-flex items-center gap-x-1 text-xs font-medium rounded"
                    :class="item.variant"
                  >
                    <Icon icon="lucide:check-circle-2" class="size-3"></Icon>
                    {{ item.status }}
                  </span>
                </td>
                <td class="px-3.5 py-3">
                  <div
                    class="hs-dropdown relative inline-flex [--placement:bottom-right]"
                  >
                    <button
                      type="button"
                      class="hs-dropdown-toggle btn size-7.5 bg-default-200 hover:bg-default-600 text-default-500"
                      aria-haspopup="menu"
                      aria-expanded="false"
                      aria-label="Dropdown"
                    >
                      <Icon
                        icon="lucide:ellipsis"
                        class="iconify size-4"
                      ></Icon>
                    </button>
                    <div
                      class="hs-dropdown-menu hs-dropdown-open:opacity-100 w-48 transition-[opacity,margin] duration opacity-0 hidden z-10 bg-card shadow-md rounded-lg p-2 dark:bg-default-100"
                      role="menu"
                    >
                      <button
                        @click="handleEdit(item)"
                        type="button"
                        class="flex items-center gap-1.5 py-2 px-3 text-sm font-medium text-default-600 hover:bg-default-100 dark:hover:bg-default-200 rounded w-full text-left"
                      >
                        <Icon icon="lucide:edit" class="size-4"></Icon>
                        Edit
                      </button>
                      <button
                        @click="handleDelete(item)"
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
    <div class="card-footer">
      <p class="text-default-500 text-sm">
        <span v-if="userStore.totalItems > 0">
          Showing
          <b>{{ (userStore.currentPage - 1) * userStore.itemsPerPage + 1 }}</b>
          to
          <b>{{
            Math.min(
              userStore.currentPage * userStore.itemsPerPage,
              userStore.totalItems
            )
          }}</b>
          of <b>{{ userStore.totalItems }}</b> Results
        </span>
        <span v-else>No results found</span>
      </p>
      <nav
        v-if="userStore.totalPages > 0"
        class="flex items-center gap-2"
        aria-label="Pagination"
      >
        <button
          type="button"
          @click="goToPage(userStore.currentPage - 1)"
          :disabled="!userStore.hasPrev"
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
            page === userStore.currentPage
              ? 'bg-primary text-white'
              : 'bg-transparent border border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10',
          ]"
        >
          {{ page }}
        </button>

        <button
          type="button"
          @click="goToPage(userStore.currentPage + 1)"
          :disabled="!userStore.hasNext"
          class="btn btn-sm border bg-transparent border-default-200 text-default-600 hover:bg-primary/10 hover:text-primary hover:border-primary/10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <Icon icon="lucide:chevron-right" class="size-4 ms-1"></Icon>
        </button>
      </nav>
    </div>

    <!-- Edit User Modal -->
    <EditUserModal
      :isOpen="isEditModalOpen"
      :user="selectedUser"
      @close="closeEditModal"
      @userUpdated="handleUserUpdated"
    />

    <!-- Delete User Modal -->
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
import { onMounted, computed, ref, watch, nextTick } from "vue";
import { useUserStore } from "@/stores/user";
import EditUserModal from "./EditUserModal.vue";
import DeleteUserModal from "./DeleteUserModal.vue";

const userStore = useUserStore();

// Modal states
const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedUser = ref<any>(null);

// Fetch users on component mount
onMounted(async () => {
  await userStore.fetchUsers(1, 10);

  // Initialize Preline dropdowns
  setTimeout(() => {
    if (window.HSStaticMethods?.autoInit) {
      window.HSStaticMethods.autoInit();
    }
  }, 100);
});

// Calculate page numbers to display
const pageNumbers = computed(() => {
  const pages: number[] = [];
  const total = userStore.totalPages;
  const current = userStore.currentPage;

  // Show max 5 page numbers
  const maxPages = 5;
  let startPage = Math.max(1, current - Math.floor(maxPages / 2));
  const endPage = Math.min(total, startPage + maxPages - 1);

  // Adjust start if we're near the end
  if (endPage - startPage < maxPages - 1) {
    startPage = Math.max(1, endPage - maxPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return pages;
});

// Go to specific page
const goToPage = async (page: number) => {
  if (page < 1 || page > userStore.totalPages) return;
  await userStore.fetchUsers(page, userStore.itemsPerPage);
};

// Use the users from the store (reactive)
const users = computed(() => {
  if (!userStore.users || userStore.users.length === 0) {
    return [];
  }

  return userStore.users.map((user) => {
    // Get initials from name
    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Format date
    const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Determine status and variant
    const isVerified = user.isVerified;
    const isActive = user.isActive;
    const status = isActive ? "Active" : "Inactive";
    const variant = isVerified
      ? "bg-success/10 text-success"
      : isActive
        ? "bg-success/10 text-success"
        : "bg-danger/10 text-danger";

    return {
      ...user,
      initials,
      joined: joinedDate,
      status,
      variant,
      phone: "N/A", // Not in API response
    };
  });
});

// Watch for users changes and reinitialize Preline
watch(
  () => userStore.users,
  async () => {
    await nextTick();
    setTimeout(() => {
      if (window.HSStaticMethods?.autoInit) {
        window.HSStaticMethods.autoInit();
      }
    }, 100);
  }
);

// Handle edit user
const handleEdit = (user: any) => {
  selectedUser.value = user;
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedUser.value = null;
};

const handleUserUpdated = () => {
  console.log("User updated successfully!");
};

// Handle delete user
const handleDelete = (user: any) => {
  selectedUser.value = user;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedUser.value = null;
};

const handleUserDeleted = () => {
  console.log("User deleted successfully!");
};
</script>
