<script setup lang="ts">
import type { Complaint, Comment, LikeStatus } from "~/utils/types/complaint";

const route = useRoute();
const complaintId = route.params.id;

useHead({
  link: [
    {
      rel: "canonical",
      href: `https://flagit.mooo.com/complaints/${complaintId}`,
    },
  ],
});

const user =
  inject<Ref<{ id: number; name: string; email: string } | null>>(
    "currentUser",
  );

const { data: complaint, error } = await useFetch<Complaint>(
  `/api/complaints/${complaintId}`,
);

useSeoMeta({
  title: () =>
    complaint.value
      ? `${complaint.value.title} — Flagit`
      : "Complaint — Flagit",
  ogTitle: () =>
    complaint.value
      ? `${complaint.value.title} — Flagit`
      : "Complaint — Flagit",
  description: () =>
    complaint.value
      ? complaint.value.body.substring(0, 160)
      : "View complaint details on Flagit.",
  ogDescription: () =>
    complaint.value
      ? complaint.value.body.substring(0, 160)
      : "View complaint details on Flagit.",
  ogImage: () => complaint.value?.imageUrl || "https://flagit.mooo.com/logo.png",
  twitterCard: "summary_large_image",
});

// --- Comments ---
const {
  data: comments,
  refresh: refreshComments,
} = await useFetch<Comment[]>(`/api/complaints/${complaintId}/comments`);

const newComment = ref("");
const postingComment = ref(false);

async function submitComment() {
  if (!newComment.value.trim() || postingComment.value) return;
  postingComment.value = true;
  try {
    await $fetch(`/api/complaints/${complaintId}/comments`, {
      method: "POST",
      body: { body: newComment.value.trim() },
    });
    newComment.value = "";
    await refreshComments();
  } catch {
    // silently fail — user will see the comment didn't post
  } finally {
    postingComment.value = false;
  }
}

// --- Likes ---
const { data: likeStatus, refresh: refreshLikes } =
  await useFetch<LikeStatus>(`/api/complaints/${complaintId}/likes`);

const togglingLike = ref(false);

async function toggleLike() {
  if (togglingLike.value) return;
  if (!user?.value) {
    navigateTo("/auth/login");
    return;
  }
  togglingLike.value = true;
  // Optimistic update
  if (likeStatus.value) {
    likeStatus.value.liked = !likeStatus.value.liked;
    likeStatus.value.count += likeStatus.value.liked ? 1 : -1;
  }
  try {
    await $fetch(`/api/complaints/${complaintId}/likes`, { method: "POST" });
    await refreshLikes();
  } catch {
    // Revert on failure
    if (likeStatus.value) {
      likeStatus.value.liked = !likeStatus.value.liked;
      likeStatus.value.count += likeStatus.value.liked ? 1 : -1;
    }
  } finally {
    togglingLike.value = false;
  }
}

// --- Existing computed ---
const timeAgo = computed(() => {
  if (complaint.value) return relativeTime(complaint.value.createdAt);
  return "";
});

const formattedDate = computed(() => {
  if (complaint.value) {
    return new Date(complaint.value.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return "";
});

const initials = computed(() => {
  const name = complaint.value?.authorName || "?";
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
  const name = complaint.value?.authorName || "";
  const hash = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
});

function commentInitials(name: string) {
  return name.charAt(0).toUpperCase();
}

function commentAvatarColor(name: string) {
  const colors = [
    "bg-amber-500",
    "bg-sky-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-orange-500",
  ];
  const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// --- Owner menu ---
const isOwner = computed(
  () => !!user?.value && !!complaint.value && user.value.id === complaint.value.userId,
);

const menuOpen = ref(false);

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

// Close menu on outside click
function onClickOutside() {
  if (menuOpen.value) menuOpen.value = false;
}

onMounted(() => {
  document.addEventListener("click", onClickOutside);
});
onUnmounted(() => {
  document.removeEventListener("click", onClickOutside);
});

// Delete
const showDeleteModal = ref(false);
const deleting = ref(false);

function openDeleteModal() {
  menuOpen.value = false;
  showDeleteModal.value = true;
}

async function confirmDelete() {
  deleting.value = true;
  try {
    await $fetch("/api/complaints/" + complaintId, { method: "DELETE" } as Record<string, unknown>);
    showDeleteModal.value = false;
    navigateTo("/");
  } catch {
    deleting.value = false;
  }
}
</script>

<template>
  <div>
    <AppHeader title="Complaint" to="/">
      <template #right>
        <!-- Menu (only for complaint owner) -->
        <div v-if="isOwner" class="relative">
          <button
            class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors text-white/60"
            @click.stop="toggleMenu"
          >
            <AppIcon name="dots-vertical" :size="20" />
          </button>

          <!-- Dropdown -->
          <Transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="menuOpen"
              class="absolute right-0 top-11 w-40 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50"
              @click.stop
            >
              <NuxtLink
                :to="`/complaints/${complaintId}/edit`"
                class="flex items-center gap-2.5 px-4 py-3 text-sm text-white/70 hover:bg-white/5 transition-colors"
                @click="menuOpen = false"
              >
                <AppIcon name="pencil" :size="16" />
                Edit
              </NuxtLink>
              <button
                class="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-colors"
                @click="openDeleteModal"
              >
                <AppIcon name="trash" :size="16" />
                Delete
              </button>
            </div>
          </Transition>
        </div>

        <!-- Spacer when not owner (keeps title centered) -->
        <div v-else class="w-9" />
      </template>
    </AppHeader>

    <div class="max-w-2xl mx-auto px-5 py-6">
    <!-- Not Found -->
    <div v-if="error || !complaint" class="card p-12 text-center">
      <div
        class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5"
      >
        <AppIcon name="warning" :size="32" class="text-white/20" />
      </div>
      <h3 class="text-base font-semibold text-white/70 mb-1">
        Complaint not found
      </h3>
      <p class="text-sm text-white/30 mb-6">
        This complaint doesn't exist or has been removed.
      </p>
      <NuxtLink to="/" class="btn-primary"> Back to Feed </NuxtLink>
    </div>

    <!-- Detail -->
    <article v-else>
      <!-- Author header -->
      <div class="flex items-center gap-3 mb-5">
        <div
          :class="[
            'w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0',
            avatarColor,
          ]"
        >
          <span class="text-base font-bold text-white">{{ initials }}</span>
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-base font-bold text-white">{{
              complaint.authorName
            }}</span>
            <span class="text-xs text-white/30">{{ timeAgo }}</span>
          </div>
          <CategoryBadge :category="complaint.category" class="mt-0.5" />
        </div>
        <StatusBadge :status="complaint.status" />
      </div>

      <!-- Title -->
      <h1 class="text-2xl font-bold text-white mb-3">{{ complaint.title }}</h1>

      <!-- Body -->
      <p
        class="text-[15px] text-white/70 leading-relaxed whitespace-pre-wrap mb-5"
      >
        {{ complaint.body }}
      </p>

      <!-- Image -->
      <div v-if="complaint.imageUrl" class="mb-5">
        <div class="rounded-2xl overflow-hidden border border-white/5">
          <img
            :src="complaint.imageUrl"
            :alt="complaint.title"
            class="w-full max-h-[500px] object-cover"
          />
        </div>
      </div>

      <!-- Meta -->
      <div class="card p-4">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center"
            >
              <AppIcon name="location-pin" :size="16" class="text-white/30" />
            </div>
            <div>
              <p class="text-[10px] text-white/30 uppercase tracking-wider">
                Location
              </p>
              <p class="text-sm text-white/70">{{ complaint.location }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center"
            >
              <AppIcon name="calendar" :size="16" class="text-white/30" />
            </div>
            <div>
              <p class="text-[10px] text-white/30 uppercase tracking-wider">
                Submitted
              </p>
              <p class="text-sm text-white/70">{{ formattedDate }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div
              class="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center"
            >
              <AppIcon name="check-circle" :size="16" class="text-white/30" />
            </div>
            <div>
              <p class="text-[10px] text-white/30 uppercase tracking-wider">
                Status
              </p>
              <p class="text-sm text-white/70 capitalize">
                {{ complaint.status }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions: Like + Comment count -->
      <div class="flex items-center gap-5 mt-5 mb-8 pl-1">
        <button
          class="inline-flex items-center gap-1.5 text-sm transition-colors"
          :class="
            likeStatus?.liked
              ? 'text-red-500'
              : 'text-white/30 hover:text-red-400'
          "
          @click="toggleLike"
        >
          <AppIcon name="heart" :size="18" :filled="!!likeStatus?.liked" />
          <span v-if="likeStatus?.count" class="text-xs font-medium">{{
            likeStatus.count
          }}</span>
        </button>

        <span class="inline-flex items-center gap-1.5 text-sm text-white/30">
          <AppIcon name="comment" :size="18" />
          <span v-if="comments?.length" class="text-xs font-medium">{{
            comments.length
          }}</span>
        </span>
      </div>

      <!-- Comments Section -->
      <div>
        <h2
          class="text-sm font-bold text-white/50 uppercase tracking-wider mb-4"
        >
          Comments
        </h2>

        <!-- Comment Form -->
        <div v-if="user" class="mb-6">
          <div class="flex gap-3">
            <div
              :class="[
                'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                commentAvatarColor(user.name),
              ]"
            >
              <span class="text-xs font-bold text-white">{{
                commentInitials(user.name)
              }}</span>
            </div>
            <div class="flex-1">
              <textarea
                v-model="newComment"
                placeholder="Add a comment..."
                rows="3"
                class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 resize-none transition-colors"
                @keydown.meta.enter="submitComment"
                @keydown.ctrl.enter="submitComment"
              />
              <div class="flex justify-between items-center mt-2">
                <span class="text-[10px] text-white/20">Cmd+Enter to post</span>
                <button
                  class="btn-primary text-sm px-4 py-1.5 disabled:opacity-30"
                  :disabled="!newComment.trim() || postingComment"
                  @click="submitComment"
                >
                  {{ postingComment ? "Posting..." : "Comment" }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="card p-5 text-center mb-6">
          <p class="text-sm text-white/40 mb-3">
            Sign in to join the conversation.
          </p>
          <NuxtLink to="/auth/login" class="btn-primary text-sm px-4 py-1.5">
            Sign In
          </NuxtLink>
        </div>

        <!-- Comments List -->
        <div
          v-if="comments && comments.length > 0"
          class="space-y-0 divide-y divide-white/5"
        >
          <div
            v-for="comment in comments"
            :key="comment.id"
            class="flex gap-3 py-4 first:pt-0"
          >
            <div
              :class="[
                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                commentAvatarColor(comment.authorName),
              ]"
            >
              <span class="text-[10px] font-bold text-white">{{
                commentInitials(comment.authorName)
              }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-bold text-white">{{
                  comment.authorName
                }}</span>
                <span class="text-[11px] text-white/25">{{
                  relativeTime(comment.createdAt)
                }}</span>
              </div>
              <p class="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
                {{ comment.body }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-else-if="comments && comments.length === 0"
          class="text-center py-8"
        >
          <p class="text-sm text-white/25">
            No comments yet. Be the first to share your thoughts.
          </p>
        </div>
      </div>
    </article>
    </div>

    <!-- Delete Confirmation Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 z-[100] flex items-center justify-center px-5"
        >
          <!-- Backdrop -->
          <div
            class="absolute inset-0 bg-black/70 backdrop-blur-sm"
            @click="showDeleteModal = false"
          />

          <!-- Modal -->
          <div
            class="relative bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <div
              class="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <AppIcon name="trash" :size="24" class="text-red-400" />
            </div>

            <h3 class="text-base font-bold text-white text-center mb-1">
              Delete Complaint
            </h3>
            <p class="text-sm text-white/40 text-center mb-6">
              This action cannot be undone. All comments and likes will also be
              removed.
            </p>

            <div class="flex gap-3">
              <button
                class="btn-secondary flex-1 text-center"
                :disabled="deleting"
                @click="showDeleteModal = false"
              >
                Cancel
              </button>
              <button
                class="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                :disabled="deleting"
                @click="confirmDelete"
              >
                <AppIcon v-if="deleting" name="spinner" :size="16" />
                {{ deleting ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
