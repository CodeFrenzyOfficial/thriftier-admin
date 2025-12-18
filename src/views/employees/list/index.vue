<template>
  <Vertical>
    <PageTitle subtitle="Management" title="Users" />

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <p class="text-sm text-default-500">Total (this page)</p>
            <h4 class="text-2xl font-semibold text-default-900">
              {{ stats.total }}
            </h4>
          </div>
          <div
            class="size-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"
          >
            <Icon icon="lucide:users" class="size-5"></Icon>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <p class="text-sm text-default-500">Users</p>
            <h4 class="text-2xl font-semibold text-default-900">
              {{ stats.users }}
            </h4>
          </div>
          <div
            class="size-10 rounded-full bg-default-200 text-default-700 flex items-center justify-center"
          >
            <Icon icon="lucide:user" class="size-5"></Icon>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <p class="text-sm text-default-500">Admins</p>
            <h4 class="text-2xl font-semibold text-default-900">
              {{ stats.admins }}
            </h4>
          </div>
          <div
            class="size-10 rounded-full bg-info/10 text-info flex items-center justify-center"
          >
            <Icon icon="lucide:shield" class="size-5"></Icon>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body flex items-center justify-between">
          <div>
            <p class="text-sm text-default-500">Drivers</p>
            <h4 class="text-2xl font-semibold text-default-900">
              {{ stats.drivers }}
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
        <h6 class="card-title">Users List</h6>
        <button
          @click="openAddEmployeeModal"
          class="btn btn-sm bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          <Icon icon="lucide:plus" class="size-4 me-1"></Icon>
          Add User
        </button>
      </div>

      <UserTable emptyText="No users found" />
    </div>

    <!-- Add Employee Modal (re-uses AddUserModal) -->
    <AddUserModal
      :isOpen="isModalOpen"
      title="Add User"
      @close="closeAddEmployeeModal"
      @userCreated="handleEmployeeCreated"
    />
  </Vertical>
</template>

<script setup lang="ts">
import Vertical from "@/layouts/vertical.vue";
import PageTitle from "@/components/PageTitle.vue";
import UserTable from "@/views/user/list/components/UserTable.vue";
import AddUserModal from "@/views/user/list/components/AddUserModal.vue";
import { Icon } from "@iconify/vue";
import { computed, ref } from "vue";
import { useUserStore } from "@/stores/user";

const isModalOpen = ref(false);
const userStore = useUserStore();

const openAddEmployeeModal = () => {
  isModalOpen.value = true;
};

const closeAddEmployeeModal = () => {
  isModalOpen.value = false;
};

const handleEmployeeCreated = () => {
  // UserTable auto-refreshes via store on createUser, so nothing required here.
  // We keep this hook for future toast/notifications.
};

const allList = computed(() => userStore.users || []);

const stats = computed(() => {
  const list = allList.value;
  const users = list.filter((u) => u.role === "USER").length;
  const admins = list.filter((u) => u.role === "ADMIN").length;
  const drivers = list.filter((u) => u.role === "DRIVER").length;
  const active = list.filter((u) => u.isActive).length;
  const inactive = list.length - active;

  return {
    total: list.length,
    users,
    admins,
    drivers,
    active,
    inactive,
  };
});
</script>
