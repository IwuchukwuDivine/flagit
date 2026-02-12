<script setup lang="ts">
const { data: user, refresh } = await useFetch('/api/auth/me', {
  // Don't throw on 401 errors - just return null
  onResponseError: () => {},
})

const isLoggedIn = computed(() => !!user.value?.user)

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await refresh()
  await navigateTo('/')
}
</script>

<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo/Brand -->
        <NuxtLink to="/" class="flex items-center">
          <h1 class="text-2xl font-bold text-gray-900">Speak Up</h1>
        </NuxtLink>

        <!-- Navigation Links -->
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/submit"
            class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
          >
            Submit Complaint
          </NuxtLink>

          <!-- Logged Out State -->
          <template v-if="!isLoggedIn">
            <NuxtLink
              to="/auth/login"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/auth/register"
              class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Register
            </NuxtLink>
          </template>

          <!-- Logged In State -->
          <template v-else>
            <span class="text-gray-700 px-3 py-2 text-sm font-medium">
              {{ user?.user?.name }}
            </span>
            <button
              @click="logout"
              class="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>
