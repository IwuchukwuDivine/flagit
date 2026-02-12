<script setup lang="ts">
import type { Complaint } from '~/utils/types/complaint'

const { data: complaints, error } = await useFetch<Complaint[]>('/api/complaints')
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Speak Up</h1>
            <p class="text-gray-600 mt-1">Civic complaints platform</p>
          </div>
          <NuxtLink
            to="/submit"
            class="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Submit Complaint
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error State -->
      <div v-if="error" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
        Failed to load complaints. Please try again later.
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!complaints || complaints.length === 0"
        class="text-center py-12"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No complaints yet</h3>
        <p class="mt-1 text-sm text-gray-500">
          Get started by submitting the first complaint.
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/submit"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Submit Complaint
          </NuxtLink>
        </div>
      </div>

      <!-- Complaints Feed -->
      <div v-else class="space-y-6">
        <ComplaintCard
          v-for="complaint in complaints"
          :key="complaint.id"
          :complaint="complaint"
        />
      </div>
    </main>
  </div>
</template>
