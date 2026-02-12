<script setup lang="ts">
const props = defineProps<{
  category: string
}>()

const categoryColors: Record<string, string> = {
  roads: 'bg-blue-100 text-blue-800',
  water: 'bg-cyan-100 text-cyan-800',
  electricity: 'bg-yellow-100 text-yellow-800',
  sanitation: 'bg-green-100 text-green-800',
}

const colorClass = computed(() => categoryColors[props.category] || 'bg-gray-100 text-gray-800')
</script>

<template>
  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', colorClass]">
    {{ category }}
  </span>
</template>
