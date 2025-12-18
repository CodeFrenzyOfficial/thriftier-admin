import { computed, ref, type Ref } from "vue";

export function useClientPagination<T>(items: Ref<T[]>, perPage = 10) {
  const itemsPerPage = perPage;
  const currentPage = ref(1);

  const totalItems = computed(() => items.value.length);
  const totalPages = computed(() =>
    totalItems.value > 0 ? Math.ceil(totalItems.value / itemsPerPage) : 0
  );

  const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
  const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage, totalItems.value)
  );

  const pagedItems = computed(() =>
    items.value.slice(startIndex.value, endIndex.value)
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

  const reset = () => {
    currentPage.value = 1;
  };

  return {
    itemsPerPage,
    currentPage,
    totalItems,
    totalPages,
    startIndex,
    endIndex,
    pagedItems,
    pageNumbers,
    goToPage,
    reset,
  };
}


