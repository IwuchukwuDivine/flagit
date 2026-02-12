<script setup lang="ts">
import type { Complaint } from '~/utils/types/complaint'

const route = useRoute()
const complaintId = route.params.id

const { data: complaint, error } = await useFetch<Complaint>(`/api/complaints/${complaintId}`)

const timeAgo = computed(() => {
  if (complaint.value) {
    return relativeTime(complaint.value.createdAt)
  }
  return ''
})

const formattedDate = computed(() => {
  if (complaint.value) {
    return new Date(complaint.value.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
  return ''
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex items-center gap-4">
          <NuxtLink
            to="/"
            class="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </NuxtLink>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Speak Up</h1>
            <p class="text-gray-600 mt-1">Civic complaints platform</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Error / Not Found -->
      <div
        v-if="error || !complaint"
        class="bg-white shadow-md rounded-lg p-8 text-center"
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="mt-2 text-lg font-medium text-gray-900">Complaint not found</h3>
        <p class="mt-1 text-sm text-gray-500">
          The complaint you're looking for doesn't exist or has been removed.
        </p>
        <div class="mt-6">
          <NuxtLink
            to="/"
            class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Feed
          </NuxtLink>
        </div>
      </div>

      <!-- Complaint Details -->
      <article v-else class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Image -->
        <div v-if="complaint.imageUrl" class="w-full">
          <img
            :src="complaint.imageUrl"
            :alt="complaint.title"
            class="w-full h-96 object-cover"
          />
        </div>

        <!-- Content -->
        <div class="p-6 md:p-8">
          <!-- Header -->
          <div class="flex items-start justify-between gap-4 mb-4">
            <h1 class="text-3xl font-bold text-gray-900 flex-1">
              {{ complaint.title }}
            </h1>
            <CategoryBadge :category="complaint.category" />
          </div>

          <!-- Meta Info -->
          <div class="flex flex-wrap gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>{{ complaint.authorName }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{{ complaint.location }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ timeAgo }}</span>
            </div>
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="capitalize">{{ complaint.status }}</span>
            </div>
          </div>

          <!-- Body -->
          <div class="prose prose-lg max-w-none">
            <p class="text-gray-700 whitespace-pre-wrap">{{ complaint.body }}</p>
          </div>

          <!-- Footer -->
          <div class="mt-8 pt-6 border-t">
            <p class="text-xs text-gray-500">
              Submitted on {{ formattedDate }}
            </p>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>
