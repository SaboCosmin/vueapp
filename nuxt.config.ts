import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@vee-validate/nuxt',
    '@nuxt/icon',
    '@pinia/nuxt'
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  veeValidate: {
    autoImports: true,
    componentNames: {
      Form: 'VeeForm',
      Field: 'VeeField',
      FieldArray: 'VeeFieldArray',
      ErrorMessage: 'VeeErrorMessage',
    },
  },
  icon: {
    mode: 'css',
    cssLayer: 'base'
  },
  css: ["~/assets/app.css"],
})
