import { useState } from 'nuxt/app';
import { useRouter } from 'vue-router';

export default function useAuth() {
  // Create a shared, reactive state for authentication status
  const isLoggedIn = useState('isLoggedIn', () => true);
  const router = useRouter();

  // Function to handle user login
  const login = () => {
    isLoggedIn.value = true;
  };

  // Function to handle user logout
  const logout = () => {
    isLoggedIn.value = false;
    router.push('/login');
  };

  return {
    isLoggedIn,
    login,
    logout
  };
}
