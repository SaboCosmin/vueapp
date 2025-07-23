<template xmlns="http://www.w3.org/1999/html">
  <div class="navbar bg-base-100 shadow-lg">
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">Admin Dashboard</a>
      <!-- Main navigation links -->
      <ul class="menu menu-horizontal px-1">
        <li><NuxtLink to="/">Dashboard</NuxtLink></li>

        <!-- Dropdown for dynamically generated "Manage" links -->
        <li>
          <details>
            <summary>Manage</summary>
            <ul class="p-2 bg-base-100 rounded-t-none z-10">
              <!-- Loop through the registered models from our config -->
              <li v-for="model in navigableModels" :key="model.key">
                <!-- Generate the link using the helper functions -->
                <NuxtLink :to="getManageLink(model.key)">{{ model.name }}</NuxtLink>
              </li>
            </ul>
          </details>
        </li>
      </ul>
    </div>
    <div class="flex-none">
      <ThemeSwitcher />
    </div>
  </div>
</template>



<script setup>
import useAuth from '~/composables/useAuth';
import { getNavigableModels, getManageLink } from '~/utils/models.config';

const navigableModels = getNavigableModels();


// Get the logout function from our auth composable
const { logout } = useAuth();

// Handle logout click
const handleLogout = () => {
  logout();
};
</script>