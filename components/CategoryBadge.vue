<script setup lang="ts">
const props = defineProps<{
  category: string;
}>();

const categoryConfig: Record<
  string,
  { color: string; icon: string; label: string }
> = {
  roads: {
    color: "text-amber-400",
    icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
    label: "Roads & Bridges",
  },
  water: {
    color: "text-sky-400",
    icon: "M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z",
    label: "Water Supply",
  },
  electricity: {
    color: "text-violet-400",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
    label: "Street Lighting",
  },
  sanitation: {
    color: "text-emerald-400",
    icon: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
    label: "Sanitation",
  },
  "health care": {
    color: "text-red-400",
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    label: "Health Care",
  },
  education: {
    color: "text-green-400",
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    label: "Education",
  },
  transportation: {
    color: "text-blue-400",
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    label: "Transportation",
  },
  "public services": {
    color: "text-purple-400",
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    label: "Public Services",
  },
  other: {
    color: "text-gray-400",
    icon: "M12 6v6m0 0v6m0-6h6m-6 0H6",
    label: "Other",
  },
};

const config = computed(
  () =>
    categoryConfig[props.category] || {
      color: "text-white/50",
      icon: "",
      label: props.category,
    },
);
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider',
      config.color,
    ]"
  >
    <svg
      class="w-3.5 h-3.5"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" :d="config.icon" />
    </svg>
    {{ config.label }}
  </span>
</template>
