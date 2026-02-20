<template>
  <div class="location-selector space-y-5">
    <!-- State Dropdown -->
    <div>
      <label class="block text-sm font-medium text-white/70 mb-1.5">
        State <span class="text-amber-400">*</span>
      </label>
      <div class="relative">
        <input
          v-model="search.state"
          type="text"
          class="input-field"
          :class="{ 'input-error': errors.state }"
          placeholder="Select state..."
          @focus="openDropdown = 'state'"
          @blur="openDropdown = null"
        />
        <ul
          v-if="openDropdown === 'state'"
          class="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-amber-400 rounded-lg max-h-48 overflow-y-auto shadow-lg"
        >
          <li
            v-for="state in filteredStates"
            :key="state.id"
            class="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm"
            @mousedown.prevent="selectState(state)"
          >
            {{ state.name }}
          </li>
          <li
            v-if="filteredStates.length === 0"
            class="px-3 py-2 text-white/40 text-sm"
          >
            No states found
          </li>
        </ul>
      </div>
      <p v-if="errors.state" class="mt-1.5 text-sm text-red-400">
        {{ errors.state }}
      </p>
    </div>

    <!-- City Dropdown (LGAs) -->
    <div>
      <label class="block text-sm font-medium text-white/70 mb-1.5">
        City / LGA <span class="text-amber-400">*</span>
      </label>
      <div class="relative">
        <input
          v-model="search.city"
          type="text"
          class="input-field"
          :class="{ 'input-error': errors.city }"
          :disabled="!location.state"
          placeholder="Select city/LGA..."
          @focus="openDropdown = 'city'"
          @blur="openDropdown = null"
        />
        <ul
          v-if="openDropdown === 'city' && location.state"
          class="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-amber-400 rounded-lg max-h-48 overflow-y-auto shadow-lg"
        >
          <li
            v-for="city in filteredCities"
            :key="city.id"
            class="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm"
            @mousedown.prevent="selectCity(city)"
          >
            {{ city.name }}
          </li>
          <li
            v-if="filteredCities.length === 0"
            class="px-3 py-2 text-white/40 text-sm"
          >
            {{ statesLoading ? "Loading..." : "No cities found" }}
          </li>
        </ul>
      </div>
      <p v-if="errors.city" class="mt-1.5 text-sm text-red-400">
        {{ errors.city }}
      </p>
    </div>

    <!-- LGA Dropdown -->
    <div>
      <label class="block text-sm font-medium text-white/70 mb-1.5">
        LGA <span class="text-amber-400">*</span>
      </label>
      <div class="relative">
        <input
          v-model="search.lga"
          type="text"
          class="input-field"
          :class="{ 'input-error': errors.lga }"
          :disabled="!location.city"
          placeholder="Select LGA..."
          @focus="openDropdown = 'lga'"
          @blur="openDropdown = null"
        />
        <ul
          v-if="openDropdown === 'lga' && location.city"
          class="absolute z-50 top-full mt-1 w-full bg-slate-800 border border-amber-400 rounded-lg max-h-48 overflow-y-auto shadow-lg"
        >
          <li
            v-for="lga in filteredLGAs"
            :key="lga.id"
            class="px-3 py-2 text-white/80 hover:bg-white/10 cursor-pointer text-sm"
            @mousedown.prevent="selectLGA(lga)"
          >
            {{ lga.name }}
          </li>
          <li
            v-if="filteredLGAs.length === 0"
            class="px-3 py-2 text-white/40 text-sm"
          >
            {{ citiesLoading ? "Loading..." : "No LGAs found" }}
          </li>
        </ul>
      </div>
      <p v-if="errors.lga" class="mt-1.5 text-sm text-red-400">
        {{ errors.lga }}
      </p>
    </div>

    <!-- Street (Free Text) -->
    <div>
      <label class="block text-sm font-medium text-white/70 mb-1.5">
        Street Address <span class="text-amber-400">*</span>
      </label>
      <input
        v-model="location.street"
        type="text"
        class="input-field"
        :class="{ 'input-error': errors.street }"
        placeholder="Building number, street name, etc."
      />
      <p v-if="errors.street" class="mt-1.5 text-sm text-red-400">
        {{ errors.street }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, unref, reactive } from 'vue'
import type { Ref } from 'vue'
import { useLocationStates, useLocationCities, useLocationLGAs } from '~/composables/useLocation'
import type { LocationValue, State, City, LGA } from '~/utils/types/location'

interface Props {
  modelValue: LocationValue
}

interface Emits {
  (e: 'update:modelValue', value: LocationValue): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const location = ref<LocationValue>({
  state: props.modelValue?.state || null,
  city: props.modelValue?.city || null,
  lga: props.modelValue?.lga || null,
  street: props.modelValue?.street || '',
})

// Data access
const selectedState = computed(() => location.value.state || null)
const selectedCity = computed(() => location.value.city || null)

const { states, loading: statesLoading } = useLocationStates()
const { cities, loading: citiesLoading } = useLocationCities(selectedState)
const { lgas, loading: lgasLoading } = useLocationLGAs(selectedCity)

// Search filtering
const search = ref({
  state: '',
  city: '',
  lga: '',
})

const filteredStates = computed(() => {
  const q = search.value.state.toLowerCase()
  return states.value.filter((s) => s.name.toLowerCase().includes(q))
})

const filteredCities = computed(() => {
  const q = search.value.city.toLowerCase()
  return cities.value.filter((c) => c.name.toLowerCase().includes(q))
})

const filteredLGAs = computed(() => {
  const q = search.value.lga.toLowerCase()
  return lgas.value.filter((l) => l.name.toLowerCase().includes(q))
})

const openDropdown = ref<'state' | 'city' | 'lga' | null>(null)

// Validation
const errors = reactive({
  state: '',
  city: '',
  lga: '',
  street: '',
})

function selectState(state: State) {
  location.value.state = state.name
  location.value.city = null
  location.value.lga = null
  search.value.state = state.name
  search.value.city = ''
  search.value.lga = ''
  openDropdown.value = null
  emitUpdate()
}

function selectCity(city: City) {
  location.value.city = city.name
  location.value.lga = null
  search.value.city = city.name
  search.value.lga = ''
  openDropdown.value = null
  emitUpdate()
}

function selectLGA(lga: LGA) {
  location.value.lga = lga.name
  search.value.lga = lga.name
  openDropdown.value = null
  emitUpdate()
}

function emitUpdate() {
  emit('update:modelValue', { ...location.value })
}

// Watch for street changes
watch(() => location.value.street, () => {
  emitUpdate()
})

// Watch for external value changes
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      location.value = { ...newVal }
      search.value.state = newVal.state || ''
      search.value.city = newVal.city || ''
      search.value.lga = newVal.lga || ''
    }
  }
)

function validateLocation(): boolean {
  let isValid = true
  errors.state = ''
  errors.city = ''
  errors.lga = ''
  errors.street = ''

  if (!location.value.state) {
    errors.state = 'State is required'
    isValid = false
  }
  if (!location.value.city) {
    errors.city = 'City/LGA is required'
    isValid = false
  }
  if (!location.value.lga) {
    errors.lga = 'LGA is required'
    isValid = false
  }
  if (!location.value.street?.trim()) {
    errors.street = 'Street address is required'
    isValid = false
  }

  return isValid
}

defineExpose({ validateLocation })
</script>

<style scoped>
/*inherits spacing from parent form */
</style>
