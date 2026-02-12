<script setup lang="ts">
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const errorMessage = ref<string>('')

const emit = defineEmits<{
  'update:imageUrl': [url: string]
  'error': [message: string]
}>()

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    return
  }

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (!validTypes.includes(file.type)) {
    errorMessage.value = 'Invalid file type. Only JPG, PNG, and WEBP are allowed.'
    emit('error', errorMessage.value)
    return
  }

  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    errorMessage.value = 'File size must be under 5MB.'
    emit('error', errorMessage.value)
    return
  }

  errorMessage.value = ''
  selectedFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const clearSelection = () => {
  selectedFile.value = null
  previewUrl.value = null
  errorMessage.value = ''
}

// Expose the file and methods to parent
defineExpose({
  selectedFile,
  clearSelection,
})
</script>

<template>
  <div class="space-y-4">
    <div>
      <label for="image-upload" class="block text-sm font-medium text-gray-700 mb-2">
        Photo Evidence (optional)
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        @change="handleFileSelect"
      />
      <p class="mt-1 text-xs text-gray-500">
        JPG, PNG, or WEBP. Max 5MB.
      </p>
    </div>

    <div v-if="errorMessage" class="text-sm text-red-600">
      {{ errorMessage }}
    </div>

    <div v-if="previewUrl" class="relative">
      <img :src="previewUrl" alt="Preview" class="w-full h-48 object-cover rounded-lg" />
      <button
        type="button"
        class="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
        @click="clearSelection"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </div>
</template>
