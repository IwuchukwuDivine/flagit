<script setup lang="ts">
import type { Ref } from "vue";
import { ref, reactive, computed, watch } from "vue";
import { CATEGORIES } from "~/utils/constants/categories";
import type { LocationValue } from "~/utils/types/location";

const imageUploadRef = ref<{
  selectedFile: Ref<File | null>;
  clearSelection: () => void;
} | null>(null);

const locationSelectorRef = ref<{
  validateLocation: () => boolean;
} | null>(null);

const formData = reactive({
  title: "",
  body: "",
  category: "",
});

const locationData = ref<LocationValue>({
  state: null,
  city: null,
  lga: null,
  street: "",
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
const searchCategory = ref("");
const openCategoryDropdown = ref(false);

const filteredCategories = computed(() => {
  const q = searchCategory.value.toLowerCase()
  return categories.filter((c) => c.label.toLowerCase().includes(q))
})

function clearErrors() {
  errors.title = "";
  errors.body = "";
  errors.category = "";
  errors.location = "";
  errors.general = "";
}

function selectCategory(cat: any) {
  formData.category = cat.value
  searchCategory.value = cat.label
  openCategoryDropdown.value = false
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

  // Validate location using component method
  if (locationSelectorRef.value && !locationSelectorRef.value.validateLocation()) {
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

    // Build location string from components
    const location = [
      locationData.value.state,
      locationData.value.city,
      locationData.value.lga,
      locationData.value.street,
    ]
      .filter(Boolean)
      .join(", ");

    await $fetch("/api/complaints", {
      method: "POST",
      body: {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        location,
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

// Sync category label when formData.category changes
watch(() => formData.category, (newVal) => {
  if (newVal) {
    const cat = categories.find(c => c.value === newVal)
    if (cat) searchCategory.value = cat.label
  }
}, { immediate: true })
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

    <!-- Category -->
    <div>
      <label class="block text-sm font-medium text-white/70 mb-1.5">
        Category <span class="text-amber-400">*</span>
      </label>
      <div class="relative">
        <input
          v-model="searchCategory"
          type="text"
          class="input-field"
          :class="{ 'input-error': errors.category }"
          placeholder="Select a category..."
          @focus="openCategoryDropdown = true"
          @blur="openCategoryDropdown = false"
        />
        <ul
          v-if="openCategoryDropdown"
          class="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-amber-400 rounded-lg max-h-48 overflow-y-auto shadow-lg"
        >
          <li
            v-for="cat in filteredCategories"
            :key="cat.value"
            class="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm"
            @mousedown.prevent="selectCategory(cat)"
          >
            {{ cat.label }}
          </li>
          <li
            v-if="filteredCategories.length === 0"
            class="px-3 py-2 text-white/40 text-sm"
          >
            No categories found
          </li>
        </ul>
      </div>
      <p v-if="errors.category" class="mt-1.5 text-sm text-red-400">
        {{ errors.category }}
      </p>
    </div>

    <!-- Location Selector -->
    <LocationSelector
      ref="locationSelectorRef"
      v-model="locationData"
    />

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
