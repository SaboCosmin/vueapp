<template>
  <div>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const logout = () => {
  // For now, just redirect back to the login page
  router.push('/login');
};
</script>
