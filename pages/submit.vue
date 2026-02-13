<script setup lang="ts">
definePageMeta({
  middleware: "auth",
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
