<script setup lang="ts">
import type { Complaint } from "~/utils/types/complaint";

const props = defineProps<{
  complaint: Complaint;
  likes?: number;
  comments?: number;
  liked?: boolean;
}>();

const emit = defineEmits<{
  like: [complaintId: number];
}>();

const truncatedBody = computed(() => {
  const maxLength = 140;
  if (props.complaint.body.length > maxLength) {
    return props.complaint.body.substring(0, maxLength) + "...";
  }
  return props.complaint.body;
});

const timeAgo = computed(() => relativeTime(props.complaint.createdAt));

const initials = computed(() => {
  const name = props.complaint.authorName || "?";
  return name.charAt(0).toUpperCase();
});

const avatarColor = computed(() => {
  const colors = [
    "bg-amber-500",
    "bg-sky-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-orange-500",
  ];
  const hash = props.complaint.authorName
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
});

function onLikeClick(e: Event) {
  e.preventDefault();
  e.stopPropagation();
  emit("like", props.complaint.id);
}
</script>

<template>
  <NuxtLink
    :to="`/complaints/${complaint.id}`"
    class="block border-b border-white/5 px-5 py-5 hover:bg-white/[0.02] transition-colors"
  >
    <!-- Header: Avatar + Name + Time + Status -->
    <div class="flex items-start gap-3 mb-3">
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
          avatarColor,
        ]"
      >
        <span class="text-sm font-bold text-white">{{ initials }}</span>
      </div>

      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <span class="text-sm font-bold text-white">{{
            complaint.authorName
          }}</span>
          <span class="text-xs text-white/30">{{ timeAgo }}</span>
          <StatusBadge
            :status="complaint.status"
            class="ml-auto flex-shrink-0"
          />
        </div>

        <!-- Category -->
        <CategoryBadge :category="complaint.category" class="mt-0.5" />
      </div>
    </div>

    <!-- Body -->
    <p class="text-[15px] text-white/70 leading-relaxed mb-3 pl-[52px]">
      {{ truncatedBody }}
    </p>

    <!-- Image -->
    <div v-if="complaint.imageUrl" class="pl-[52px] mb-3">
      <div class="rounded-2xl overflow-hidden border border-white/5">
        <img
          :src="complaint.imageUrl"
          :alt="complaint.title"
          class="w-full h-52 object-cover"
        />
      </div>
    </div>

    <!-- Footer: Location + Actions -->
    <div class="pl-[52px] flex items-center gap-5 text-xs text-white/30">
      <span class="flex items-center gap-1.5">
        <AppIcon name="location-pin" :size="14" />
        {{ complaint.location }}
      </span>

      <span class="flex-1" />

      <!-- Like button -->
      <button
        class="inline-flex items-center gap-1 transition-colors"
        :class="liked ? 'text-red-500' : 'text-white/30 hover:text-red-400'"
        @click="onLikeClick"
      >
        <AppIcon name="heart" :size="18" :filled="!!liked" />
        <span v-if="likes" class="text-[11px] font-medium">{{ likes }}</span>
      </button>

      <!-- Comment link -->
      <span class="inline-flex items-center gap-1 text-white/30">
        <AppIcon name="comment" :size="18" />
        <span v-if="comments" class="text-[11px] font-medium">{{
          comments
        }}</span>
      </span>
    </div>
  </NuxtLink>
</template>
