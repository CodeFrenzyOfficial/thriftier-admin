<template>
  <Vertical>
    <PageTitle
      title="Contact Form Submissions"
      subtitle="View and manage customer inquiries"
    />

    <div class="space-y-6">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="card">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-sm font-medium text-default-600 dark:text-default-400"
                >
                  Total Submissions
                </p>
                <h3
                  class="text-2xl font-bold text-default-900 !dark:text-default-100 mt-2"
                >
                  {{ contactStore.totalItems }}
                </h3>
              </div>
              <div class="p-3 bg-blue-100 !dark:bg-blue-900/20 rounded-lg">
                <Icon
                  icon="lucide:mail"
                  class="w-6 h-6 text-blue-600 !dark:text-blue-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-sm font-medium text-default-600 !dark:text-default-400"
                >
                  This Week
                </p>
                <h3
                  class="text-2xl font-bold text-default-900 !dark:text-default-100 mt-2"
                >
                  {{ thisWeekCount }}
                </h3>
              </div>
              <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <Icon
                  icon="lucide:trending-up"
                  class="w-6 h-6 text-green-600 dark:text-green-400"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="p-6">
            <div class="flex items-center justify-between">
              <div>
                <p
                  class="text-sm font-medium text-default-600 !dark:text-default-400"
                >
                  This Month
                </p>
                <h3
                  class="text-2xl font-bold text-default-900 !dark:text-default-100 mt-2"
                >
                  {{ thisMonthCount }}
                </h3>
              </div>
              <div class="p-3 bg-purple-100 !dark:bg-purple-900/20 rounded-lg">
                <Icon
                  icon="lucide:calendar"
                  class="w-6 h-6 text-purple-600 !dark:text-purple-400"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-2"
              >
                Start Date
              </label>
              <input
                v-model="dateFilters.startDate"
                type="date"
                class="form-input"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-default-700 !dark:text-default-300 mb-2"
              >
                End Date
              </label>
              <input
                v-model="dateFilters.endDate"
                type="date"
                class="form-input"
              />
            </div>
            <div class="flex items-end">
              <button
                @click="applyFilters"
                class="btn bg-primary text-white hover:bg-primary-600 w-full transition-colors"
              >
                <Icon icon="lucide:filter" class="w-4 h-4 mr-2" />
                Apply Filters
              </button>
            </div>
          </div>
          <div v-if="dateFilters.startDate || dateFilters.endDate" class="mt-3">
            <button
              @click="clearFilters"
              class="text-sm text-default-600 !dark:text-default-400 hover:text-default-900 !dark:hover:text-default-100 transition-colors"
            >
              <Icon icon="lucide:x" class="w-4 h-4 inline mr-1" />
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Contacts Table -->
      <div class="card">
        <div class="card-header flex items-center justify-between">
          <h4 class="card-title !dark:text-default-100">Contact Submissions</h4>
          <div class="text-sm text-default-600 !dark:text-default-400">
            Total: {{ contactStore.totalItems }} submissions
          </div>
        </div>
        <div class="p-6">
          <div v-if="contactStore.loading" class="text-center py-8">
            <div
              class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"
            ></div>
            <p class="mt-2 text-default-600 !dark:text-default-400">
              Loading contacts...
            </p>
          </div>

          <div
            v-else-if="contactStore.contacts.length === 0"
            class="text-center py-12"
          >
            <Icon
              icon="lucide:inbox"
              class="w-16 h-16 mx-auto text-default-300 !dark:text-default-600 mb-4"
            />
            <p class="text-default-600 !dark:text-default-400">
              No contact submissions found
            </p>
          </div>

          <div v-else>
            <div class="overflow-x-auto">
              <table
                class="min-w-full divide-y divide-default-200 dark:divide-default-700"
              >
                <thead class="bg-default-50 !dark:bg-default-800/50">
                  <tr>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-default-700 !dark:text-default-300 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-default-700 !dark:text-default-300 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-default-700 !dark:text-default-300 uppercase tracking-wider"
                    >
                      Phone
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-default-700 !dark:text-default-300 uppercase tracking-wider"
                    >
                      Message
                    </th>
                    <th
                      class="px-4 py-3 text-left text-xs font-medium text-default-700 !dark:text-default-300 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      class="px-4 py-3 text-right text-xs font-medium text-default-700 !dark:text-default-300 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  class="bg-card divide-y divide-default-200 dark:divide-default-700"
                >
                  <tr
                    v-for="contact in contactStore.contacts"
                    :key="contact.id"
                    class="hover:bg-default-50 dark:hover:bg-default-800/30"
                  >
                    <td class="px-4 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <div
                            class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center"
                          >
                            <Icon
                              icon="lucide:user"
                              class="w-5 h-5 text-primary-600 dark:text-primary-400"
                            />
                          </div>
                        </div>
                        <div class="ml-4">
                          <div
                            class="text-sm font-medium text-default-900 !dark:text-default-100"
                          >
                            {{ contact.firstname }} {{ contact.lastname }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      class="px-4 py-4 whitespace-nowrap text-sm text-default-800 !dark:text-default-200"
                    >
                      {{ contact.email }}
                    </td>
                    <td
                      class="px-4 py-4 whitespace-nowrap text-sm text-default-800 !dark:text-default-200"
                    >
                      {{ contact.phoneNumber }}
                    </td>
                    <td
                      class="px-4 py-4 text-sm text-default-800 !dark:text-default-200"
                    >
                      <div class="max-w-xs truncate">
                        {{ contact.message }}
                      </div>
                    </td>
                    <td
                      class="px-4 py-4 whitespace-nowrap text-sm text-default-800 !dark:text-default-200"
                    >
                      {{ formatDate(contact.createdAt) }}
                    </td>
                    <td
                      class="px-4 py-4 whitespace-nowrap text-right text-sm space-x-2"
                    >
                      <button
                        @click="viewContact(contact)"
                        class="text-primary hover:text-primary-600 dark:hover:text-primary-500 font-medium transition-colors"
                      >
                        View
                      </button>
                      <button
                        @click="deleteContact(contact)"
                        class="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400 font-medium transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div
              class="flex items-center justify-between mt-4 pt-4 border-t border-default-200 dark:border-default-700"
            >
              <div class="text-sm text-default-700 !dark:text-default-300">
                Showing
                {{
                  (contactStore.currentPage - 1) * contactStore.itemsPerPage + 1
                }}
                to
                {{
                  Math.min(
                    contactStore.currentPage * contactStore.itemsPerPage,
                    contactStore.totalItems
                  )
                }}
                of {{ contactStore.totalItems }} results
              </div>
              <div class="flex gap-2">
                <button
                  @click="changePage(contactStore.currentPage - 1)"
                  :disabled="contactStore.currentPage === 1"
                  class="px-3 py-1 text-sm border border-default-300 !dark:border-default-600 rounded text-default-700 !dark:text-default-300 hover:bg-default-100 !dark:hover:bg-default-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  @click="changePage(page)"
                  class="px-3 py-1 text-sm border rounded transition-colors"
                  :class="
                    contactStore.currentPage === page
                      ? 'bg-primary text-white border-primary'
                      : 'border-default-300 !dark:border-default-600 text-default-700 !dark:text-default-300 hover:bg-default-100 !dark:hover:bg-default-800'
                  "
                >
                  {{ page }}
                </button>
                <button
                  @click="changePage(contactStore.currentPage + 1)"
                  :disabled="
                    contactStore.currentPage === contactStore.totalPages
                  "
                  class="px-3 py-1 text-sm border border-default-300 !dark:border-default-600 rounded text-default-700 !dark:text-default-300 hover:bg-default-100 !dark:hover:bg-default-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- View Contact Modal -->
    <ViewContactModal
      :is-open="isViewModalOpen"
      :contact="selectedContact"
      @close="closeViewModal"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteContactModal
      :is-open="isDeleteModalOpen"
      :contact="selectedContact"
      @close="closeDeleteModal"
      @deleted="handleContactDeleted"
    />
  </Vertical>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import Vertical from "@/layouts/vertical.vue";
import PageTitle from "@/components/PageTitle.vue";
import { useContactStore } from "@/stores/contact";
import type { Contact } from "@/services/contact.service";
import ViewContactModal from "./components/ViewContactModal.vue";
import DeleteContactModal from "./components/DeleteContactModal.vue";

const contactStore = useContactStore();

const dateFilters = ref({
  startDate: "",
  endDate: "",
});

const isViewModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedContact = ref<Contact | null>(null);

// Stats
const thisWeekCount = computed(() => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return contactStore.contacts.filter((c) => new Date(c.createdAt) >= weekAgo)
    .length;
});

const thisMonthCount = computed(() => {
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  return contactStore.contacts.filter(
    (c) => new Date(c.createdAt) >= monthStart
  ).length;
});

// Pagination
const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(
    1,
    contactStore.currentPage - Math.floor(maxVisible / 2)
  );
  let end = Math.min(contactStore.totalPages, start + maxVisible - 1);

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const formatDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(date);
};

const applyFilters = () => {
  contactStore.setFilters({
    startDate: dateFilters.value.startDate || undefined,
    endDate: dateFilters.value.endDate || undefined,
  });
  contactStore.fetchContacts(1, contactStore.itemsPerPage);
};

const clearFilters = () => {
  dateFilters.value.startDate = "";
  dateFilters.value.endDate = "";
  contactStore.clearFilters();
  contactStore.fetchContacts(1, contactStore.itemsPerPage);
};

const changePage = (page: number) => {
  contactStore.fetchContacts(page, contactStore.itemsPerPage);
};

const viewContact = (contact: Contact) => {
  selectedContact.value = contact;
  isViewModalOpen.value = true;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
  selectedContact.value = null;
};

const deleteContact = (contact: Contact) => {
  selectedContact.value = contact;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  selectedContact.value = null;
};

const handleContactDeleted = () => {
  closeDeleteModal();
  // List will auto-refresh from store
};

onMounted(() => {
  contactStore.fetchContacts();
});
</script>
