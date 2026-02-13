<script setup lang="ts">
useSeoMeta({
  title: "Log In — Flagit",
  ogTitle: "Log In — Flagit",
  description: "Log in to your Flagit account to report and track civic issues.",
  ogDescription: "Log in to your Flagit account to report and track civic issues.",
  ogImage: "https://flagit.mooo.com/logo.png",
  twitterCard: "summary",
});

useHead({
  link: [{ rel: "canonical", href: "https://flagit.mooo.com/auth/login" }],
});

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const refreshAuth = inject<() => Promise<void>>("refreshAuth");

async function handleLogin() {
  error.value = "";
  loading.value = true;

  try {
    await $fetch("/api/auth/login", {
      method: "POST",
      body: {
        email: email.value,
        password: password.value,
      },
    });

    if (refreshAuth) await refreshAuth();
    await navigateTo("/");
  } catch (e: any) {
    error.value = e.data?.message || "Invalid email or password.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div
    class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12"
  >
    <div class="w-full max-w-sm">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <AppIcon name="megaphone" :size="24" class="text-black" />
        </div>
        <h1 class="text-2xl font-bold text-white">Welcome back</h1>
        <p class="text-sm text-white/40 mt-1">
          Log in to your Flagit account
        </p>
      </div>

      <!-- Form -->
      <div class="card p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label
              for="email"
              class="block text-sm font-medium text-white/70 mb-1.5"
              >Email</label
            >
            <input
              id="email"
              v-model="email"
              type="email"
              required
              autocomplete="email"
              class="input-field"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              for="password"
              class="block text-sm font-medium text-white/70 mb-1.5"
              >Password</label
            >
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="input-field"
              placeholder="Enter your password"
            />
          </div>

          <div
            v-if="error"
            class="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-xl"
          >
            <AppIcon name="alert-circle" :size="16" class="flex-shrink-0" />
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary w-full">
            <AppIcon v-if="loading" name="spinner" :size="16" />
            {{ loading ? "Logging in..." : "Log In" }}
          </button>
        </form>
      </div>

      <p class="text-center text-sm text-white/30 mt-6">
        Don't have an account?
        <NuxtLink
          to="/auth/register"
          class="font-semibold text-amber-400 hover:text-amber-300"
        >
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
