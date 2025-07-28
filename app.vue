<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '~/composables/useAuth';

const router = useRouter();
const { isLoggedIn } = useAuth();


onMounted(() => {
  // Redirect to login page only if not logged in
  if (!isLoggedIn.value) {
    router.push('/login');
  }
});
</script>
