<script setup lang="ts">
const route = useRoute();

const { data: authData, refresh: refreshAuth } = await useFetch(
  "/api/auth/me",
  {
    onResponseError: () => {},
  },
);

const user = computed(() => authData.value?.user ?? null);
const isLoggedIn = computed(() => !!user.value);

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  await refreshAuth();
  await navigateTo("/");
}

provide("currentUser", user);
provide("isLoggedIn", isLoggedIn);
provide("refreshAuth", refreshAuth);

const navItems = [
  { to: "/", label: "Feed", icon: "feed" },
  { to: "/submit", label: "Report", icon: "report", auth: true },
];

function isActive(path: string) {
  return route.path === path;
}
</script>

<template>
  <div class="min-h-svh bg-[#0d0d0d] flex">
    <!-- Desktop Sidebar -->
    <aside
      class="hidden lg:flex flex-col w-[220px] fixed top-0 left-0 h-screen border-r border-white/5 bg-[#0d0d0d] z-40 px-4 py-6"
    >
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 px-4 mb-8">
        <div
          class="w-9 h-9 bg-amber-400 rounded-xl flex items-center justify-center"
        >
          <AppIcon name="megaphone" :size="20" />
        </div>
        <div>
          <span class="text-base font-bold text-white tracking-tight"
            >Flagit</span
          >
          <p class="text-[10px] text-white/30 uppercase tracking-widest">
            Community
          </p>
        </div>
      </NuxtLink>

      <!-- Nav -->
      <nav class="flex-1 space-y-1">
        <!-- Feed -->
        <NuxtLink
          to="/"
          :class="['sidebar-link', isActive('/') && 'sidebar-link-active']"
        >
          <AppIcon name="clipboard" :size="20" />
          Feed
        </NuxtLink>

        <!-- Report -->
        <NuxtLink
          v-if="isLoggedIn"
          to="/submit"
          :class="[
            'sidebar-link',
            isActive('/submit') && 'sidebar-link-active',
          ]"
        >
          <AppIcon name="plus" :size="20" />
          Report
        </NuxtLink>

        <!-- Profile -->
        <NuxtLink
          v-if="isLoggedIn"
          to="/profile"
          :class="[
            'sidebar-link',
            isActive('/profile') && 'sidebar-link-active',
          ]"
        >
          <AppIcon name="user" :size="20" />
          Profile
        </NuxtLink>
      </nav>

      <!-- User Section -->
      <div class="mt-auto pt-4 border-t border-white/5">
        <template v-if="isLoggedIn">
          <!-- Profile -->
          <div class="flex items-center gap-3 px-4 py-3 mb-1">
            <div
              class="w-8 h-8 bg-amber-400/20 rounded-full flex items-center justify-center flex-shrink-0"
            >
              <span class="text-xs font-bold text-amber-400">{{
                user?.name?.charAt(0)?.toUpperCase()
              }}</span>
            </div>
            <div class="min-w-0">
              <p class="text-sm font-medium text-white truncate">
                {{ user?.name }}
              </p>
              <p class="text-[11px] text-white/30 truncate">
                {{ user?.email }}
              </p>
            </div>
          </div>

          <button
            @click="logout"
            class="sidebar-link w-full text-white/30 hover:text-red-400"
          >
            <AppIcon name="arrow-right-exit" :size="20" />
            Sign Out
          </button>
        </template>

        <template v-else>
          <NuxtLink to="/auth/login" class="sidebar-link">
            <AppIcon name="arrow-right-enter" :size="20" />
            Log In
          </NuxtLink>
          <NuxtLink
            to="/auth/register"
            class="sidebar-link text-amber-400 hover:text-amber-300"
          >
            <AppIcon name="user-plus" :size="20" />
            Sign Up
          </NuxtLink>
        </template>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 lg:ml-[220px] min-h-svh pb-20 lg:pb-0">
      <slot />
    </div>

    <!-- Mobile Bottom Nav -->
    <nav
      class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-lg border-t border-white/5"
    >
      <div
        class="flex items-center justify-around h-16 max-w-md mx-auto relative"
      >
        <!-- Feed -->
        <NuxtLink
          to="/"
          class="flex flex-col items-center gap-1 p-2"
          :class="isActive('/') ? 'text-amber-400' : 'text-white/40'"
        >
          <AppIcon name="clipboard" :size="20" />
          <span class="text-[10px] font-medium">Feed</span>
        </NuxtLink>

        <!-- FAB: Report -->
        <NuxtLink
          v-if="isLoggedIn"
          to="/submit"
          class="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-colors"
        >
          <AppIcon name="plus" :size="28" class="text-black" />
        </NuxtLink>
        <NuxtLink
          v-else
          to="/auth/login"
          class="absolute -top-5 left-1/2 -translate-x-1/2 w-14 h-14 bg-amber-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-400/30 hover:bg-amber-300 transition-colors"
        >
          <AppIcon name="plus" :size="28" class="text-black" />
        </NuxtLink>

        <!-- Spacer for FAB -->
        <div class="w-14" />

        <!-- Profile / Auth -->
        <NuxtLink
          v-if="isLoggedIn"
          to="/profile"
          class="flex flex-col items-center gap-1 p-2"
          :class="isActive('/profile') ? 'text-amber-400' : 'text-white/40'"
        >
          <div
            class="w-6 h-6 bg-amber-400/20 rounded-full flex items-center justify-center"
          >
            <span class="text-[10px] font-bold text-amber-400">{{
              user?.name?.charAt(0)?.toUpperCase()
            }}</span>
          </div>
          <span class="text-[10px] font-medium">Profile</span>
        </NuxtLink>
        <NuxtLink
          v-else
          to="/auth/login"
          class="flex flex-col items-center gap-1 p-2 text-white/40"
        >
          <AppIcon name="user" :size="20" />
          <span class="text-[10px] font-medium">Log In</span>
        </NuxtLink>
      </div>
    </nav>
  </div>
</template>
