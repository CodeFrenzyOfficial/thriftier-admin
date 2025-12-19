/**
 * Contact Store
 * Manages contact form submissions state
 */

import { defineStore } from "pinia";
import { ref } from "vue";
import {
  contactService,
  type Contact,
  type ContactFilters,
} from "../services/contact.service";

export const useContactStore = defineStore("contact", () => {
  // State
  const contacts = ref<Contact[]>([]);
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
  const filters = ref<ContactFilters>({});

  // Actions
  async function fetchContacts(page: number = 1, limit: number = 10) {
    loading.value = true;
    error.value = null;

    try {
      const response = await contactService.getContacts(
        { page, limit },
        filters.value
      );

      contacts.value = response.data;
      currentPage.value = response.pagination.page;
      itemsPerPage.value = response.pagination.limit;
      totalPages.value = response.pagination.totalPages;
      totalItems.value = response.pagination.totalItems;
      hasNext.value = response.pagination.hasNext;
      hasPrev.value = response.pagination.hasPrev;
    } catch (err: any) {
      error.value = err.message || "Failed to fetch contacts";
      console.error("Error fetching contacts:", err);
    } finally {
      loading.value = false;
    }
  }

  async function deleteContact(contactId: string) {
    try {
      await contactService.deleteContact(contactId);
      // Refresh the contact list after deleting
      await fetchContacts(currentPage.value, itemsPerPage.value);
    } catch (err: any) {
      error.value = err.message || "Failed to delete contact";
      throw err;
    }
  }

  function setFilters(newFilters: ContactFilters) {
    filters.value = newFilters;
  }

  function clearFilters() {
    filters.value = {};
  }

  return {
    // State
    contacts,
    loading,
    error,
    currentPage,
    itemsPerPage,
    totalPages,
    totalItems,
    hasNext,
    hasPrev,
    filters,
    // Actions
    fetchContacts,
    deleteContact,
    setFilters,
    clearFilters,
  };
});
