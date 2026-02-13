<script setup lang="ts">
import type { Ref } from "vue";
import type { Complaint } from "~/utils/types/complaint";
import { CATEGORIES } from "~/utils/constants/categories";

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const complaintId = route.params.id;

const user =
  inject<Ref<{ id: number; name: string; email: string } | null>>(
    "currentUser",
  );

const { data: complaint, error: fetchError } = await useFetch<Complaint>(
  `/api/complaints/${complaintId}`,
);

// Redirect if not owner
if (
  complaint.value &&
  user?.value &&
  complaint.value.userId !== user.value.id
) {
  navigateTo(`/complaints/${complaintId}`);
}

const imageUploadRef = ref<{
  selectedFile: Ref<File | null>;
  clearSelection: () => void;
} | null>(null);

const formData = reactive({
  title: complaint.value?.title ?? "",
  body: complaint.value?.body ?? "",
  category: complaint.value?.category ?? "",
  location: complaint.value?.location ?? "",
});

const errors = reactive({
  title: "",
  body: "",
  category: "",
  location: "",
  general: "",
});

const isSubmitting = ref(false);

const categories = CATEGORIES;

function clearErrors() {
  errors.title = "";
  errors.body = "";
  errors.category = "";
  errors.location = "";
  errors.general = "";
}

function validateForm(): boolean {
  clearErrors();
  let isValid = true;

  if (!formData.title.trim()) {
    errors.title = "Title is required";
    isValid = false;
  }
  if (!formData.body.trim()) {
    errors.body = "Description is required";
    isValid = false;
  }
  if (!formData.category) {
    errors.category = "Category is required";
    isValid = false;
  }
  if (!formData.location.trim()) {
    errors.location = "Location is required";
    isValid = false;
  }

  return isValid;
}

async function handleSubmit() {
  if (!validateForm()) return;

  isSubmitting.value = true;
  clearErrors();

  try {
    let imageUrl: string | undefined | null;

    const imageRef = imageUploadRef.value;
    const file = imageRef?.selectedFile ? unref(imageRef.selectedFile) : null;
    if (file) {
      const formDataImg = new FormData();
      formDataImg.append("image", file);

      const uploadResponse = await $fetch<{ url: string }>("/api/upload", {
        method: "POST",
        body: formDataImg,
      });

      imageUrl = uploadResponse.url;
    }

    await $fetch("/api/complaints/" + complaintId, {
      method: "PATCH",
      body: {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        location: formData.location,
        ...(imageUrl !== undefined && { imageUrl }),
      },
    } as Record<string, unknown>);

    await navigateTo(`/complaints/${complaintId}`);
  } catch (error: any) {
    console.error("Error updating complaint:", error);
    errors.general =
      error.data?.message || "Failed to update complaint. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div>
    <!-- Sticky App Header -->
    <header
      class="sticky top-0 z-40 bg-[#0d0d0d]/90 backdrop-blur-lg border-b border-white/5"
    >
      <div
        class="max-w-2xl mx-auto flex items-center justify-between px-4 h-14"
      >
        <NuxtLink
          :to="`/complaints/${complaintId}`"
          class="flex items-center justify-center w-9 h-9 rounded-full hover:bg-white/5 transition-colors text-white/60"
        >
          <AppIcon name="chevron-left" :size="20" />
        </NuxtLink>

        <h1 class="text-sm font-bold text-white truncate px-3">
          Edit Complaint
        </h1>

        <div class="w-9" />
      </div>
    </header>

    <div class="max-w-2xl mx-auto px-5 py-6">
      <!-- Error loading -->
      <div v-if="fetchError || !complaint" class="card p-12 text-center">
        <h3 class="text-base font-semibold text-white/70 mb-1">
          Complaint not found
        </h3>
        <p class="text-sm text-white/30 mb-6">
          This complaint doesn't exist or has been removed.
        </p>
        <NuxtLink to="/" class="btn-primary">Back to Feed</NuxtLink>
      </div>

      <!-- Edit Form -->
      <div v-else class="card p-6">
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Error banner -->
          <div
            v-if="errors.general"
            class="flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm"
          >
            <AppIcon name="alert-circle" :size="20" class="flex-shrink-0" />
            {{ errors.general }}
          </div>

          <!-- Title -->
          <div>
            <label
              for="title"
              class="block text-sm font-medium text-white/70 mb-1.5"
            >
              Title <span class="text-amber-400">*</span>
            </label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              class="input-field"
              :class="{ 'input-error': errors.title }"
              placeholder="Brief summary of the issue"
            />
            <p v-if="errors.title" class="mt-1.5 text-sm text-red-400">
              {{ errors.title }}
            </p>
          </div>

          <!-- Description -->
          <div>
            <label
              for="body"
              class="block text-sm font-medium text-white/70 mb-1.5"
            >
              Description <span class="text-amber-400">*</span>
            </label>
            <textarea
              id="body"
              v-model="formData.body"
              rows="5"
              class="input-field resize-none"
              :class="{ 'input-error': errors.body }"
              placeholder="Describe the issue in detail..."
            />
            <p v-if="errors.body" class="mt-1.5 text-sm text-red-400">
              {{ errors.body }}
            </p>
          </div>

          <!-- Category + Location -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                for="category"
                class="block text-sm font-medium text-white/70 mb-1.5"
              >
                Category <span class="text-amber-400">*</span>
              </label>
              <select
                id="category"
                v-model="formData.category"
                class="input-field"
                :class="{ 'input-error': errors.category }"
              >
                <option value="" disabled>Select a category</option>
                <option
                  v-for="cat in categories"
                  :key="cat.value"
                  :value="cat.value"
                >
                  {{ cat.label }}
                </option>
              </select>
              <p v-if="errors.category" class="mt-1.5 text-sm text-red-400">
                {{ errors.category }}
              </p>
            </div>

            <div>
              <label
                for="location"
                class="block text-sm font-medium text-white/70 mb-1.5"
              >
                Location <span class="text-amber-400">*</span>
              </label>
              <input
                id="location"
                v-model="formData.location"
                type="text"
                class="input-field"
                :class="{ 'input-error': errors.location }"
                placeholder="Street address or area"
              />
              <p v-if="errors.location" class="mt-1.5 text-sm text-red-400">
                {{ errors.location }}
              </p>
            </div>
          </div>

          <!-- Current Image -->
          <div v-if="complaint.imageUrl" class="space-y-2">
            <p class="text-sm font-medium text-white/70">Current Image</p>
            <div
              class="rounded-xl overflow-hidden border border-white/5 max-w-xs"
            >
              <img
                :src="complaint.imageUrl"
                :alt="complaint.title"
                class="w-full h-32 object-cover"
              />
            </div>
          </div>

          <!-- New Image Upload -->
          <ImageUpload ref="imageUploadRef" />

          <!-- Actions -->
          <div class="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <NuxtLink
              :to="`/complaints/${complaintId}`"
              class="btn-secondary flex-1 sm:flex-none text-center"
            >
              Cancel
            </NuxtLink>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="btn-primary flex-1"
            >
              <AppIcon v-if="isSubmitting" name="spinner" :size="16" />
              {{ isSubmitting ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
