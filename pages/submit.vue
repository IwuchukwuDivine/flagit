<script setup lang="ts">
definePageMeta({
  middleware: "auth",
});

useSeoMeta({
  title: "Report an Issue — Flagit",
  description: "Submit a civic complaint to help improve your community.",
  robots: "noindex, nofollow",
});
</script>

<template>
  <div>
    <AppHeader title="Report an Issue" to="/" />

    <div class="max-w-2xl mx-auto px-5 py-6">
      <!-- Form -->
      <div class="card p-6">
        <ComplaintForm />
      </div>
    </div>
  </div>
</template>
