<template>
  <Vertical>
    <PageTitle subtitle="Management" title="Drivers" />

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <p class="text-sm text-default-500">Drivers (loaded)</p>
            <h4 class="text-2xl font-semibold text-default-900">
              {{ stats.total }}
            </h4>
          </div>
          <div
            class="size-10 rounded-full bg-warning/10 text-warning flex items-center justify-center"
          >
            <Icon icon="lucide:truck" class="size-5"></Icon>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <p class="text-sm text-default-500">Active</p>
            <h4 class="text-2xl font-semibold text-default-900">
              {{ stats.active }}
            </h4>
          </div>
          <div
            class="size-10 rounded-full bg-success/10 text-success flex items-center justify-center"
          >
            <Icon icon="lucide:check-circle-2" class="size-5"></Icon>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <p class="text-sm text-default-500">Inactive</p>
            <h4 class="text-2xl font-semibold text-default-900">
              {{ stats.inactive }}
            </h4>
          </div>
          <div
            class="size-10 rounded-full bg-danger/10 text-danger flex items-center justify-center"
          >
            <Icon icon="lucide:x-circle" class="size-5"></Icon>
          </div>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h6 class="card-title">Drivers List</h6>
        <button
          @click="openAddDriverModal"
          class="btn btn-sm bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          <Icon icon="lucide:plus" class="size-4 me-1"></Icon>
          Add Driver
        </button>
      </div>

      <DriverTable />
    </div>

    <AddUserModal
      :isOpen="isModalOpen"
      title="Add Driver"
      @close="closeAddDriverModal"
      @userCreated="handleDriverCreated"
    />
  </Vertical>
</template>

<script setup lang="ts">
import Vertical from "@/layouts/vertical.vue";
import PageTitle from "@/components/PageTitle.vue";
import AddUserModal from "@/views/user/list/components/AddUserModal.vue";
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/user";
import DriverTable from "./components/DriverTable.vue";

const isModalOpen = ref(false);
const userStore = useUserStore();

const openAddDriverModal = () => {
  isModalOpen.value = true;
};

const closeAddDriverModal = () => {
  isModalOpen.value = false;
};

const handleDriverCreated = () => {
  // store refresh is handled in createUser()
};

const driverList = computed(() =>
  (userStore.users || []).filter((u) => u.role === "DRIVER")
);

const stats = computed(() => {
  const list = driverList.value;
  const active = list.filter((u) => u.isActive).length;
  const inactive = list.length - active;

  return {
    total: list.length,
    active,
    inactive,
  };
});
</script>
