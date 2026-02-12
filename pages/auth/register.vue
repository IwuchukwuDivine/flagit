<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleRegister() {
  error.value = ''
  loading.value = true

  try {
    const response = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        password: password.value,
      },
    })

    if (response) {
      await navigateTo('/')
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Registration failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Create an Account</h1>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            v-model="name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            minlength="6"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p class="text-xs text-gray-500 mt-1">At least 6 characters</p>
        </div>

        <div v-if="error" class="text-red-600 text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <p class="text-sm text-gray-600">
          Already have an account?
          <NuxtLink to="/auth/login" class="text-blue-600 hover:underline">
            Log in
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>
