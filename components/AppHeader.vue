<template>
  <header
    class="sticky top-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-lg border-b border-white/5"
  >
    <div
      class="max-w-2xl mx-auto flex items-center justify-between px-4 h-14"
    >
      <!-- Back button -->
      <button
        class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors text-white/60"
        @click="goBack"
      >
        <AppIcon name="chevron-left" :size="20" />
      </button>

      <!-- Title -->
      <h1 class="text-sm font-bold text-white truncate px-3">
        {{ title }}
      </h1>

      <!-- Right slot or spacer -->
      <slot name="right">
        <div class="w-9" />
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string;
  to?: string;
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
});

const router = useRouter();

function goBack() {
  if (props.to) {
    navigateTo(props.to);
  } else if (window.history.length > 1) {
    router.back();
  } else {
    navigateTo("/");
  }
}
</script>
