<script setup lang="ts">
const imageUploadRef = ref<{ selectedFile: Ref<File | null>; clearSelection: () => void } | null>(null)

const formData = reactive({
  title: '',
  body: '',
  category: '',
  location: '',
})

const errors = reactive({
  title: '',
  body: '',
  category: '',
  location: '',
  general: '',
})

const isSubmitting = ref(false)

const categories = [
  { value: 'roads', label: 'Roads' },
  { value: 'water', label: 'Water' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'sanitation', label: 'Sanitation' },
]

const clearErrors = () => {
  errors.title = ''
  errors.body = ''
  errors.category = ''
  errors.location = ''
  errors.general = ''
}

const validateForm = (): boolean => {
  clearErrors()
  let isValid = true

  if (!formData.title.trim()) {
    errors.title = 'Title is required'
    isValid = false
  }

  if (!formData.body.trim()) {
    errors.body = 'Description is required'
    isValid = false
  }

  if (!formData.category) {
    errors.category = 'Category is required'
    isValid = false
  }

  if (!formData.location.trim()) {
    errors.location = 'Location is required'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  clearErrors()

  try {
    let imageUrl: string | undefined

    // Upload image if selected
    if (imageUploadRef.value?.selectedFile?.value) {
      const formDataImg = new FormData()
      formDataImg.append('image', imageUploadRef.value.selectedFile.value)

      const uploadResponse = await $fetch<{ url: string }>('/api/upload', {
        method: 'POST',
        body: formDataImg,
      })

      imageUrl = uploadResponse.url
    }

    // Create complaint
    await $fetch('/api/complaints', {
      method: 'POST',
      body: {
        title: formData.title,
        body: formData.body,
        category: formData.category,
        location: formData.location,
        imageUrl,
      },
    })

    // Reset form
    formData.title = ''
    formData.body = ''
    formData.category = ''
    formData.location = ''
    imageUploadRef.value?.clearSelection()

    // Redirect to home
    await navigateTo('/')
  } catch (error: any) {
    console.error('Error submitting complaint:', error)
    errors.general = error.data?.message || 'Failed to submit complaint. Please try again.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div v-if="errors.general" class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
      {{ errors.general }}
    </div>

    <div>
      <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
        Title <span class="text-red-500">*</span>
      </label>
      <input
        id="title"
        v-model="formData.title"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.title }"
        placeholder="Brief summary of the issue"
      />
      <p v-if="errors.title" class="mt-1 text-sm text-red-600">
        {{ errors.title }}
      </p>
    </div>

    <div>
      <label for="body" class="block text-sm font-medium text-gray-700 mb-2">
        Description <span class="text-red-500">*</span>
      </label>
      <textarea
        id="body"
        v-model="formData.body"
        rows="5"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.body }"
        placeholder="Detailed description of the complaint"
      />
      <p v-if="errors.body" class="mt-1 text-sm text-red-600">
        {{ errors.body }}
      </p>
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-2">
        Category <span class="text-red-500">*</span>
      </label>
      <select
        id="category"
        v-model="formData.category"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.category }"
      >
        <option value="">Select a category</option>
        <option v-for="cat in categories" :key="cat.value" :value="cat.value">
          {{ cat.label }}
        </option>
      </select>
      <p v-if="errors.category" class="mt-1 text-sm text-red-600">
        {{ errors.category }}
      </p>
    </div>

    <div>
      <label for="location" class="block text-sm font-medium text-gray-700 mb-2">
        Location <span class="text-red-500">*</span>
      </label>
      <input
        id="location"
        v-model="formData.location"
        type="text"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        :class="{ 'border-red-500': errors.location }"
        placeholder="Street address or area name"
      />
      <p v-if="errors.location" class="mt-1 text-sm text-red-600">
        {{ errors.location }}
      </p>
    </div>

    <ImageUpload ref="imageUploadRef" />

    <div class="flex gap-4">
      <button
        type="submit"
        :disabled="isSubmitting"
        class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Complaint' }}
      </button>
      <NuxtLink
        to="/"
        class="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        Cancel
      </NuxtLink>
    </div>
  </form>
</template>
