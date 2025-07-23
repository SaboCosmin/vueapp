<template>
  <div class="min-h-screen bg-base-300">
    <!-- Conditionally render the navbar only when user is logged in -->
    <Navbar v-if="isLoggedIn" />

    <!-- Page content will be injected here -->
    <div class="p-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
import useAuth from '~/composables/useAuth';

// Get the isLoggedIn state from our auth composable
const { isLoggedIn } = useAuth();
</script>
