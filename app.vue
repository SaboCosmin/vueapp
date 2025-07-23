<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import useAuth from '~/composables/useAuth';
import App from "~/app.vue";

const router = useRouter();
const { isLoggedIn } = useAuth();

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)

onMounted(() => {
  // Redirect to login page only if not logged in
  if (!isLoggedIn.value) {
    router.push('/login');
  }
});
</script>
