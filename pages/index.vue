<script setup lang="ts">
import type { Complaint } from "~/utils/types/complaint";

const user =
  inject<Ref<{ id: number; name: string; email: string } | null>>(
    "currentUser",
  );

// --- Feed types ---
interface FeedItem extends Complaint {
  likes: number;
  comments: number;
  liked: boolean;
}

interface FeedResponse {
  items: FeedItem[];
  nextCursor: number | null;
  stats?: { total: number; pending: number; resolved: number };
  categoryCounts?: Record<string, number>;
}

// --- State ---
const feedItems = ref<FeedItem[]>([]);
const nextCursor = ref<number | null>(null);
const loading = ref(false);
const error = ref(false);
const stats = ref({ total: 0, pending: 0, resolved: 0 });
const rawCategoryCounts = ref<Record<string, number>>({});

const activeTab = ref("recent");
const tabs = [
  { id: "recent", label: "Recent" },
  { id: "pending", label: "Pending" },
  { id: "resolved", label: "Resolved" },
];

// SSR-safe fetch that forwards cookies (fixes hydration mismatch for liked state)
const requestFetch = useRequestFetch();

// --- Fetch a page ---
async function fetchPage(reset = false) {
  if (loading.value) return;
  if (!reset && nextCursor.value === null && feedItems.value.length > 0) return;

  loading.value = true;
  error.value = false;

  try {
    const params: Record<string, string | number> = { limit: 10 };
    if (!reset && nextCursor.value) params.cursor = nextCursor.value;
    if (activeTab.value !== "recent") params.status = activeTab.value;

    const data = await requestFetch<FeedResponse>("/api/complaints/feed", {
      params,
    });

    if (reset) {
      feedItems.value = data.items;
    } else {
      feedItems.value = [...feedItems.value, ...data.items];
    }

    nextCursor.value = data.nextCursor;

    // Stats come with the first page only
    if (data.stats) stats.value = data.stats;
    if (data.categoryCounts) rawCategoryCounts.value = data.categoryCounts;
  } catch {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

// Initial load (SSR-compatible)
await fetchPage(true);

// --- Tab switching resets the feed ---
watch(activeTab, () => {
  feedItems.value = [];
  nextCursor.value = null;
  fetchPage(true);
});

// --- Infinite scroll via IntersectionObserver ---
const sentinel = ref<HTMLElement | null>(null);

onMounted(() => {
  if (!sentinel.value) return;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting && !loading.value && nextCursor.value !== null) {
        fetchPage();
      }
    },
    { rootMargin: "200px" },
  );
  observer.observe(sentinel.value);
  onUnmounted(() => observer.disconnect());
});

// --- Like handler (optimistic) ---
async function handleLike(complaintId: number) {
  if (!user?.value) {
    navigateTo("/auth/login");
    return;
  }
  const item = feedItems.value.find((c) => c.id === complaintId);
  if (!item) return;

  // Optimistic
  item.liked = !item.liked;
  item.likes += item.liked ? 1 : -1;

  try {
    const result = await $fetch<{ liked: boolean; count: number }>(
      `/api/complaints/${complaintId}/likes`,
      { method: "POST" },
    );
    item.liked = result.liked;
    item.likes = result.count;
  } catch {
    // Revert
    item.liked = !item.liked;
    item.likes += item.liked ? 1 : -1;
  }
}

// --- Sidebar computed ---
const categoryCounts = computed(() => {
  return Object.entries(rawCategoryCounts.value).sort((a, b) => b[1] - a[1]);
});
</script>

<template>
  <div class="flex">
    <!-- Main Feed -->
    <div class="flex-1 max-w-2xl">
      <!-- Header -->
      <div
        class="sticky top-0 z-30 bg-[#0d0d0d]/90 backdrop-blur-lg border-b border-white/5"
      >
        <div class="px-5 pt-5 pb-0">
          <h1 class="text-xl font-bold text-white mb-4 flex items-center gap-2.5">
            <div class="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center lg:hidden">
              <AppIcon name="megaphone" :size="18" class="text-black" />
            </div>
            Flagit Live Feed
          </h1>

          <!-- Tabs -->
          <div class="flex gap-0">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'px-5 py-3 text-sm font-semibold relative transition-colors',
                activeTab === tab.id
                  ? 'text-amber-400'
                  : 'text-white/40 hover:text-white/60',
              ]"
              @click="activeTab = tab.id"
            >
              {{ tab.label }}
              <div
                v-if="activeTab === tab.id"
                class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-amber-400 rounded-full"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="p-6">
        <div class="card p-5 border-red-500/20">
          <div class="flex items-center gap-3">
            <AppIcon name="alert-circle" :size="20" class="text-red-400 flex-shrink-0" />
            <p class="text-sm text-red-400">
              Failed to load complaints. Please try again.
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="!loading && feedItems.length === 0"
        class="p-12 text-center"
      >
        <div
          class="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-5"
        >
          <AppIcon name="question-circle" :size="32" class="text-white/20" />
        </div>
        <h3 class="text-base font-semibold text-white/70 mb-1">
          No complaints found
        </h3>
        <p class="text-sm text-white/30 mb-6">
          {{
            activeTab === "recent"
              ? "Be the first to report a civic issue."
              : "No complaints with this status yet."
          }}
        </p>
        <NuxtLink
          v-if="activeTab === 'recent'"
          to="/submit"
          class="btn-primary"
        >
          Report an Issue
        </NuxtLink>
      </div>

      <!-- Feed -->
      <div v-else>
        <ComplaintCard
          v-for="item in feedItems"
          :key="item.id"
          :complaint="item"
          :likes="item.likes"
          :comments="item.comments"
          :liked="item.liked"
          @like="handleLike"
        />

        <!-- Infinite scroll sentinel -->
        <div ref="sentinel" class="py-6 text-center">
          <div
            v-if="loading"
            class="inline-flex items-center gap-2 text-sm text-white/30"
          >
            <AppIcon name="spinner" :size="16" />
            Loading more...
          </div>
          <p
            v-else-if="nextCursor === null && feedItems.length > 0"
            class="text-xs text-white/20"
          >
            You've reached the end
          </p>
        </div>
      </div>
    </div>

    <!-- Right Sidebar (Desktop) -->
    <aside
      class="hidden xl:block w-[300px] flex-shrink-0 p-5 space-y-5 sticky top-0 h-screen overflow-y-auto"
    >
      <!-- Search (placeholder) -->
      <div class="relative">
        <AppIcon name="search" :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          placeholder="Search complaints..."
          class="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-amber-400/50"
        />
      </div>

      <!-- Impact Meter -->
      <div class="card p-4">
        <h3
          class="text-xs font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2"
        >
          <AppIcon name="bar-chart" :size="16" class="text-amber-400" />
          Impact Meter
        </h3>

        <div class="space-y-3">
          <div v-for="[category, count] in categoryCounts" :key="category">
            <div class="flex items-center justify-between mb-1.5">
              <CategoryBadge :category="category" />
              <span class="text-xs text-white/30">{{ count }}</span>
            </div>
            <div class="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                class="h-full bg-amber-400 rounded-full transition-all duration-500"
                :style="{
                  width: `${Math.min((count / stats.total) * 100, 100)}%`,
                }"
              />
            </div>
          </div>

          <div
            v-if="categoryCounts.length === 0"
            class="text-xs text-white/20 text-center py-3"
          >
            No data yet
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="card p-4">
        <h3
          class="text-xs font-bold text-white/50 uppercase tracking-wider mb-4 flex items-center gap-2"
        >
          <AppIcon name="check-circle" :size="16" class="text-amber-400" />
          Community Stats
        </h3>
        <div class="grid grid-cols-3 gap-3">
          <div class="text-center">
            <p class="text-xl font-bold text-white">{{ stats.total }}</p>
            <p
              class="text-[10px] text-white/30 uppercase tracking-wider mt-0.5"
            >
              Total
            </p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-amber-400">{{ stats.pending }}</p>
            <p
              class="text-[10px] text-white/30 uppercase tracking-wider mt-0.5"
            >
              Pending
            </p>
          </div>
          <div class="text-center">
            <p class="text-xl font-bold text-emerald-400">
              {{ stats.resolved }}
            </p>
            <p
              class="text-[10px] text-white/30 uppercase tracking-wider mt-0.5"
            >
              Resolved
            </p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div
        class="card p-5 bg-gradient-to-br from-amber-400/10 to-amber-400/5 border-amber-400/10"
      >
        <h3 class="text-sm font-bold text-white flex items-center gap-2 mb-1.5">
          <AppIcon name="megaphone" :size="16" class="text-amber-400" />
          Flagit
        </h3>
        <p class="text-xs text-white/40 mb-4">
          Help improve your community by reporting issues.
        </p>
        <NuxtLink to="/submit" class="btn-primary w-full text-center">
          Report Issue
        </NuxtLink>
      </div>
    </aside>
  </div>
</template>
