<script setup lang="ts">
import type { Complaint } from "~/utils/types/complaint";

definePageMeta({
  middleware: "auth",
});

const user =
  inject<Ref<{ id: number; name: string; email: string } | null>>(
    "currentUser",
  );

const { data: allComplaints } = await useFetch<Complaint[]>("/api/complaints");

type Engagement = Record<number, { likes: number; comments: number; liked: boolean }>;
const { data: engagement, refresh: refreshEngagement } =
  await useFetch<Engagement>("/api/complaints/engagement");

async function handleLike(complaintId: number) {
  if (!user?.value) return;
  if (engagement.value?.[complaintId]) {
    const e = engagement.value[complaintId]!;
    e.liked = !e.liked;
    e.likes += e.liked ? 1 : -1;
  }
  try {
    await $fetch(`/api/complaints/${complaintId}/likes`, { method: "POST" });
    await refreshEngagement();
  } catch {
    if (engagement.value?.[complaintId]) {
      const e = engagement.value[complaintId]!;
      e.liked = !e.liked;
      e.likes += e.liked ? 1 : -1;
    }
  }
}

const myComplaints = computed(() => {
  if (!allComplaints.value || !user?.value) return [];
  return allComplaints.value.filter((c) => c.authorName === user.value?.name);
});

const stats = computed(() => {
  const complaints = myComplaints.value;
  return {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };
});

const memberSince = computed(() => {
  // Approximate from earliest complaint or just show current date
  if (myComplaints.value.length > 0) {
    const earliest = myComplaints.value[myComplaints.value.length - 1]!;
    return new Date(earliest.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
});

const initials = computed(
  () => user?.value?.name?.charAt(0)?.toUpperCase() || "?",
);

// Logout
const refreshAuth = inject<() => Promise<void>>("refreshAuth");

async function logout() {
  await $fetch("/api/auth/logout", { method: "POST" });
  if (refreshAuth) await refreshAuth();
  await navigateTo("/");
}
</script>

<template>
  <div>
    <AppHeader title="Profile" to="/" />

    <div class="max-w-2xl mx-auto px-5 py-8">
    <!-- Profile Header -->
    <div class="card p-6 mb-6">
      <div class="flex items-center gap-4 mb-6">
        <div
          class="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0"
        >
          <span class="text-2xl font-bold text-black">{{ initials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h1 class="text-xl font-bold text-white">{{ user?.name }}</h1>
          <p class="text-sm text-white/40">{{ user?.email }}</p>
          <p class="text-xs text-white/20 mt-1">
            Member since {{ memberSince }}
          </p>
        </div>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 mb-5">
        <div class="bg-white/5 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-white">{{ stats.total }}</p>
          <p class="text-[10px] text-white/30 uppercase tracking-wider mt-1">
            Reports
          </p>
        </div>
        <div class="bg-white/5 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-amber-400">{{ stats.pending }}</p>
          <p class="text-[10px] text-white/30 uppercase tracking-wider mt-1">
            Pending
          </p>
        </div>
        <div class="bg-white/5 rounded-xl p-4 text-center">
          <p class="text-2xl font-bold text-emerald-400">
            {{ stats.resolved }}
          </p>
          <p class="text-[10px] text-white/30 uppercase tracking-wider mt-1">
            Resolved
          </p>
        </div>
      </div>

      <!-- Sign Out -->
      <button
        class="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-sm font-medium text-white/40 hover:text-red-400 hover:border-red-400/20 transition-colors"
        @click="logout"
      >
        <AppIcon name="arrow-right-exit" :size="16" />
        Sign Out
      </button>
    </div>

    <!-- My Reports -->
    <div>
      <h2
        class="text-sm font-bold text-white/50 uppercase tracking-wider mb-4 px-1"
      >
        My Reports
      </h2>

      <div v-if="myComplaints.length === 0" class="card p-8 text-center">
        <div
          class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3"
        >
          <AppIcon name="clipboard" :size="24" class="text-white/20" />
        </div>
        <p class="text-sm text-white/40 mb-4">
          You haven't submitted any reports yet.
        </p>
        <NuxtLink to="/submit" class="btn-primary"> Report an Issue </NuxtLink>
      </div>

      <div v-else class="card overflow-hidden">
        <ComplaintCard
          v-for="complaint in myComplaints"
          :key="complaint.id"
          :complaint="complaint"
          :likes="engagement?.[complaint.id]?.likes ?? 0"
          :comments="engagement?.[complaint.id]?.comments ?? 0"
          :liked="engagement?.[complaint.id]?.liked ?? false"
          @like="handleLike"
        />
      </div>
    </div>
    </div>
  </div>
</template>
