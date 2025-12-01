<template>
  <Vertical>
    <PageTitle subtitle="Users" title="List View" />
    <div class="card">
      <div class="card-header">
        <h6 class="card-title">Users List</h6>
        <button
          @click="openAddUserModal"
          class="btn btn-sm bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          <Icon icon="lucide:plus" class="size-4 me-1"></Icon>
          Add user
        </button>
      </div>

      <UserTable />
    </div>

    <!-- Add User Modal -->
    <AddUserModal
      :isOpen="isModalOpen"
      @close="closeAddUserModal"
      @userCreated="handleUserCreated"
    />
  </Vertical>
</template>

<script setup lang="ts">
import { ref } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import Vertical from "@/layouts/vertical.vue";
import UserTable from "./components/UserTable.vue";
import AddUserModal from "./components/AddUserModal.vue";
import { Icon } from "@iconify/vue";

const isModalOpen = ref(false);

const openAddUserModal = () => {
  isModalOpen.value = true;
};

const closeAddUserModal = () => {
  isModalOpen.value = false;
};

const handleUserCreated = () => {
  // TODO: Refresh the user list
  console.log("User created successfully!");
  // You can add logic here to refresh the user table
};
</script>
