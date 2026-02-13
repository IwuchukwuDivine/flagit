<script setup lang="ts">
const selectedFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const errorMessage = ref("");
const isDragging = ref(false);

const emit = defineEmits<{
  "update:imageUrl": [url: string];
  error: [message: string];
}>();

function validateAndSetFile(file: File) {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type)) {
    errorMessage.value =
      "Invalid file type. Only JPG, PNG, and WEBP are allowed.";
    emit("error", errorMessage.value);
    return;
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    errorMessage.value = "File size must be under 5MB.";
    emit("error", errorMessage.value);
    return;
  }

  errorMessage.value = "";
  selectedFile.value = file;

  const reader = new FileReader();
  reader.onload = (e) => {
    previewUrl.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);
}

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) validateAndSetFile(file);
}

function handleDrop(event: DragEvent) {
  isDragging.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) validateAndSetFile(file);
}

function clearSelection() {
  selectedFile.value = null;
  previewUrl.value = null;
  errorMessage.value = "";
}

defineExpose({
  selectedFile,
  clearSelection,
});
</script>

<template>
  <div class="space-y-3">
    <label class="block text-sm font-medium text-white/70">
      Photo Evidence <span class="text-white/30 font-normal">(optional)</span>
    </label>

    <!-- Preview -->
    <div
      v-if="previewUrl"
      class="relative group rounded-2xl overflow-hidden border border-white/10"
    >
      <img :src="previewUrl" alt="Preview" class="w-full h-52 object-cover" />
      <div
        class="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center"
      >
        <button
          type="button"
          class="opacity-0 group-hover:opacity-100 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium border border-white/10 hover:bg-white/20 transition-all"
          @click="clearSelection"
        >
          Remove photo
        </button>
      </div>
    </div>

    <!-- Drop zone -->
    <div
      v-else
      class="relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer"
      :class="
        isDragging
          ? 'border-amber-400/50 bg-amber-400/5'
          : 'border-white/10 hover:border-white/20 bg-white/[0.02]'
      "
      @dragover.prevent="isDragging = true"
      @dragleave="isDragging = false"
      @drop.prevent="handleDrop"
      @click="($refs.fileInput as HTMLInputElement)?.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        class="hidden"
        @change="handleFileSelect"
      />
      <div
        class="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-3"
      >
        <AppIcon name="photo" :size="24" class="text-white/20" />
      </div>
      <p class="text-sm text-white/50 mb-1">
        <span class="text-amber-400 font-medium">Click to upload</span> or drag
        and drop
      </p>
      <p class="text-xs text-white/20">JPG, PNG, or WEBP (max 5MB)</p>
    </div>

    <p v-if="errorMessage" class="text-sm text-red-400 font-medium">
      {{ errorMessage }}
    </p>
  </div>
</template>
