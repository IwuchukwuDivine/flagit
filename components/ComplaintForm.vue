<script setup lang="ts">
import type { Ref } from "vue";
import { CATEGORIES } from "~/utils/constants/categories";

const imageUploadRef = ref<{
  selectedFile: Ref<File | null>;
  clearSelection: () => void;
} | null>(null);

const formData = reactive({
  title: "",
  body: "",
  category: "",
  location: "",
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
    let imageUrl: string | undefined;

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

    await $fetch("/api/complaints", {
      method: "POST",
      body: {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        location: formData.location,
        imageUrl,
      },
    });

    await navigateTo("/");
  } catch (error: any) {
    console.error("Error submitting complaint:", error);
    errors.general =
      error.data?.message || "Failed to submit complaint. Please try again.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
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
      <label for="title" class="block text-sm font-medium text-white/70 mb-1.5">
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
      <label for="body" class="block text-sm font-medium text-white/70 mb-1.5">
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
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
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

    <!-- Image Upload -->
    <ImageUpload ref="imageUploadRef" />

    <!-- Actions -->
    <div class="flex flex-col-reverse sm:flex-row gap-3 pt-2">
      <NuxtLink to="/" class="btn-secondary flex-1 sm:flex-none text-center">
        Cancel
      </NuxtLink>
      <button type="submit" :disabled="isSubmitting" class="btn-primary flex-1">
        <AppIcon v-if="!isSubmitting" name="plus" :size="16" />
        <AppIcon v-else name="spinner" :size="16" />
        {{ isSubmitting ? "Submitting..." : "Submit Report" }}
      </button>
    </div>
  </form>
</template>
