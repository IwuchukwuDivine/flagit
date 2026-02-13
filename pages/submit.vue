<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});
</script>

<template>
  <div>
    <!-- Sticky App Header -->
    <header
      class="sticky top-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-lg border-b border-white/5"
    >
      <div class="max-w-2xl mx-auto flex items-center justify-between px-4 h-14">
        <NuxtLink
          to="/"
          class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors text-white/60"
        >
          <AppIcon name="chevron-left" :size="20" />
        </NuxtLink>

        <h1 class="text-sm font-bold text-white truncate px-3">
          Report an Issue
        </h1>

        <div class="w-9" />
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-5 py-6">
      <!-- Form -->
      <div class="card p-6">
        <ComplaintForm />
      </div>
    </div>
  </div>
</template>
