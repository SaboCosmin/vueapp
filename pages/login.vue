<template>
  <div class="flex items-center justify-center min-h-screen bg-base-300">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body">
        <!-- Logo/Icon -->
        <div class="flex justify-center mb-4">
          <div class="avatar placeholder">
            <div class="bg-primary text-primary-content rounded-full w-24">
              <span class="text-3xl">A</span>
            </div>
          </div>
        </div>

        <h2 class="card-title text-2xl font-bold text-center mx-auto mb-2">Admin Login</h2>
        <p class="text-center text-base-content/70 mb-6">Enter your credentials to access your account</p>

        <Form @submit="onSubmit" class="space-y-4">
          <div class="form-control">
            <label class="label" for="email">
              <span class="label-text">Email</span>
            </label>
            <div class="relative">
              <Field name="email" type="email" id="email" rules="required|email"
                     v-slot="{ field, errorMessage, handleChange, handleBlur }">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                </span>
                <input
                    v-bind="field"
                    @input="handleChange"
                    @blur="handleBlur"
                    type="email"
                    placeholder="your@email.com"
                    class="input input-bordered w-full pl-10"
                />
                <div v-if="errorMessage" class="text-error text-sm mt-1">{{ errorMessage }}</div>
              </Field>
            </div>
          </div>

          <div class="form-control">
            <label class="label" for="password">
              <span class="label-text">Password</span>
              <a href="#" class="label-text-alt link link-hover text-primary">Forgot password?</a>
            </label>
            <div class="relative">
              <Field name="password" type="password" id="password" rules="required|min:6"
                     v-slot="{ field, errorMessage, handleChange, handleBlur }">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-base-content/50" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </span>
                <input
                    v-bind="field"
                    @input="handleChange"
                    @blur="handleBlur"
                    type="password"
                    placeholder="Password"
                    class="input input-bordered w-full pl-10"
                />
                <div v-if="errorMessage" class="text-error text-sm mt-1">{{ errorMessage }}</div>
              </Field>
            </div>
          </div>

          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-2">
              <input type="checkbox" class="checkbox checkbox-primary checkbox-sm"/>
              <span class="label-text">Remember me</span>
            </label>
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary btn-block">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                   stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              Login
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup>
import {Form, Field, defineRule} from 'vee-validate';
import {required, email, min} from '@vee-validate/rules';
import {useRouter} from 'vue-router';
import useAuth from '~/composables/useAuth';

// Register the validation rules
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);

const router = useRouter();

const {login} = useAuth();

const onSubmit = (values) => {
  console.log('Form submitted:', values);
  // In a real app, you would validate credentials with an API
  // For now, just simulate a successful login
  login();
  router.push('/');
};
</script>
