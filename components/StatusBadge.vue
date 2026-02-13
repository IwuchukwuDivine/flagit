<script setup lang="ts">
const props = defineProps<{
  status: string;
}>();

const statusConfig: Record<string, { bg: string; text: string; label: string }> =
  {
    pending: {
      bg: "bg-amber-400/10",
      text: "text-amber-400",
      label: "Pending",
    },
    resolved: {
      bg: "bg-emerald-400/10",
      text: "text-emerald-400",
      label: "Resolved",
    },
  };

const config = computed(
  () =>
    statusConfig[props.status] || {
      bg: "bg-white/5",
      text: "text-white/50",
      label: props.status,
    },
);
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider',
      config.bg,
      config.text,
    ]"
  >
    <span
      :class="['inline-block w-1.5 h-1.5 rounded-full', config.text === 'text-amber-400' ? 'bg-amber-400' : config.text === 'text-emerald-400' ? 'bg-emerald-400' : 'bg-white/50']"
    />
    {{ config.label }}
  </span>
</template>
