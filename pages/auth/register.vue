<script setup lang="ts">
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const refreshAuth = inject<() => Promise<void>>('refreshAuth')

async function handleRegister() {
  error.value = ''
  loading.value = true
  try {
    await $fetch('/api/auth/register', { method: 'POST', body: { name: name.value, email: email.value, password: password.value } })
    if (refreshAuth) await refreshAuth()
    await navigateTo('/')
  } catch (e: any) {
    error.value = e.data?.message || 'Registration failed.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-5rem)] flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="w-11 h-11 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-500/20">
          <AppIcon name="megaphone" :size="20" class="text-white" />
        </div>
        <h1 class="text-xl font-bold text-white">Join Flagit</h1>
        <p class="text-sm text-slate-500 mt-1">Start reporting issues in your community</p>
      </div>

      <div class="glass p-6">
        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-300 mb-1.5">Name</label>
            <input id="name" v-model="name" type="text" required autocomplete="name" class="input-field" placeholder="Your name" />
          </div>
          <div>
            <label for="email" class="block text-sm font-medium text-slate-300 mb-1.5">Email</label>
            <input id="email" v-model="email" type="email" required autocomplete="email" class="input-field" placeholder="you@example.com" />
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
            <input id="password" v-model="password" type="password" required minlength="6" autocomplete="new-password" class="input-field" placeholder="Min 6 characters" />
          </div>

          <div v-if="error" class="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-2.5 rounded-xl">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            {{ loading ? 'Creating account...' : 'Create account' }}
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-slate-600 mt-6">
        Have an account?
        <NuxtLink to="/auth/login" class="font-semibold text-teal-400 hover:text-teal-300">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>
