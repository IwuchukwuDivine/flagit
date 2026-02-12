<script setup lang="ts">
import type { Complaint } from '~/utils/types/complaint'

const props = defineProps<{
  complaint: Complaint
}>()

const truncatedBody = computed(() => {
  const maxLength = 150
  if (props.complaint.body.length > maxLength) {
    return props.complaint.body.substring(0, maxLength) + '...'
  }
  return props.complaint.body
})

const timeAgo = computed(() => relativeTime(props.complaint.createdAt))
</script>

<template>
  <NuxtLink
    :to="`/complaints/${complaint.id}`"
    class="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
  >
    <div class="flex flex-col md:flex-row gap-4">
      <div v-if="complaint.imageUrl" class="md:w-1/3">
        <img
          :src="complaint.imageUrl"
          :alt="complaint.title"
          class="w-full h-48 object-cover rounded-lg"
        />
      </div>

      <div class="flex-1">
        <div class="flex items-start justify-between gap-4 mb-2">
          <h3 class="text-xl font-semibold text-gray-900 flex-1">
            {{ complaint.title }}
          </h3>
          <CategoryBadge :category="complaint.category" />
        </div>

        <p class="text-gray-600 mb-4">
          {{ truncatedBody }}
        </p>

        <div class="flex items-center justify-between text-sm text-gray-500">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ complaint.authorName }}
            </span>
            <span class="flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ complaint.location }}
            </span>
          </div>
          <span>{{ timeAgo }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
