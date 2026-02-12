<script setup lang="ts">
const user = ref<{ id: number; name: string; email: string } | null>(null)
const loading = ref(true)

async function fetchUser() {
  try {
    const response = await $fetch('/api/auth/me')
    user.value = response.user
  } catch {
    user.value = null
  } finally {
    loading.value = false
  }
}

async function logout() {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    await navigateTo('/auth/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

onMounted(() => {
  fetchUser()
})
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-blue-600">
              Speak Up
            </NuxtLink>
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-blue-600"
            >
              Feed
            </NuxtLink>
            <NuxtLink
              v-if="user"
              to="/submit"
              class="text-gray-700 hover:text-blue-600"
            >
              Submit Complaint
            </NuxtLink>
          </div>

          <div v-if="!loading" class="flex items-center space-x-4">
            <template v-if="user">
              <span class="text-sm text-gray-700">{{ user.name }}</span>
              <button
                @click="logout"
                class="text-sm text-gray-700 hover:text-blue-600"
              >
                Log Out
              </button>
            </template>
            <template v-else>
              <NuxtLink
                to="/auth/login"
                class="text-sm text-gray-700 hover:text-blue-600"
              >
                Log In
              </NuxtLink>
              <NuxtLink
                to="/auth/register"
                class="text-sm bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Register
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>
