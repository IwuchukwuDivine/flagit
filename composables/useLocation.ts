/**
 * Location data access composable.
 * Fetchse Nigerian states, cities (as LGAs), and LGAs from external JSON.
 * Caches data client-side to avoid repeated fetches.
 */

import { ref, unref, watch, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import type { State, City, LGA, RawState } from '~/utils/types/location'

// Client-side cache
let cachedStates: State[] | null = null
let cachedData: RawState[] | null = null
let dataCachePromise: Promise<RawState[]> | null = null

// Fallback raw JSON URLs to try when the primary API doesn't return LGAs
const FALLBACK_URLS = [
  'https://raw.githubusercontent.com/olahol/nigeria-states-and-lgas/master/states.json',
  'https://raw.githubusercontent.com/seunkoko/Nigerian-States-and-LGAs/main/states.json',
]

/**
 * Attempt to load fallback data from a list of public raw JSON URLs.
 * Tries to parse a few common structures and returns the LGA list for the state.
 */
async function fetchFallbackForState(stateName: string): Promise<string[]> {
  for (const url of FALLBACK_URLS) {
    try {
      const resp = await fetch(url)
      if (!resp.ok) {
        console.debug('[useLocation] fallback URL failed', url, resp.status)
        continue
      }
      const json = await resp.json()

      // If JSON is an object mapping stateName -> lgas array 
      if (json && typeof json === 'object' && !Array.isArray(json)) {
        if (Array.isArray(json.states)) {
          // Some structures use { states: [...] }
          const found = json.states.find((s: any) => (s.name || s.state) === stateName)
          if (found) return found.lgas || found.cities || []
        }
        if (Array.isArray(json.data)) {
          // countriesnow-like payload stored raw
          const nigeria = json.data.find((c: any) => c.name === 'Nigeria')
          if (nigeria && Array.isArray(nigeria.states)) {
            const st = nigeria.states.find((s: any) => (s.name || s.state) === stateName)
            if (st) return st.lgas || st.cities || []
          }
        }
        // If it's a mapping directly from stateName to LGas
        if (Array.isArray(json[stateName])) {
          return json[stateName]
        }
      }

      // If JSON is an array of state objects
      if (Array.isArray(json)) {
        // Try to find the state in the array and return its LGAs
        const found = json.find((s: any) => (s.name || s.state) === stateName)
        if (found) return found.lgas || found.cities || []
        // If not found, but it's a countriesnow-like structure with a Nigeria entry, try that
        const nigeria = json.find((c: any) => c.name === 'Nigeria')
        if (nigeria && Array.isArray(nigeria.states)) {
          const st = nigeria.states.find((s: any) => (s.name || s.state) === stateName)
          if (st) return st.lgas || st.cities || []
        }
      }
    } catch (err) {
      console.debug('[useLocation] fallback fetch error', url, err)
      continue
    }
  }
  return []
}



async function fetchAndCacheData(): Promise<RawState[]> {
  if (cachedData) return cachedData

  try {
    const response = await fetch('https://countriesnow.space/api/v0.1/countries/states')
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const json = await response.json()
    
    const countries = json?.data || []
    const nigeria = countries.find((c: any) => c.name === 'Nigeria')
    
    if (nigeria?.states) {
      cachedData = nigeria.states.map((state: any) => ({
        name: state.name || '',
        state: state.name || '',
        lgas: state.lgas || [] // Some sources have lgas directly
      }))
      // Debug toshow how many states were loaded
      console.debug('[useLocation] fetched states count:', cachedData?.length ?? 0)
    } else {
      cachedData = []
      console.warn('[useLocation] no Nigeria entry found in countries/states response')
    }
  } catch (err) {
    console.error('fetchAndCacheData error:', err)
    cachedData = []
  }
  return cachedData || []
}

/**
 * Fetch all states once and cache 
 */
export const useLocationStates = () => {
  const states: Ref<State[]> = ref([])
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)

  const fetchStates = async () => {
    if (cachedStates) {
      states.value = cachedStates
      return
    }

    loading.value = true
    error.value = null

    try {
      const data = await fetchAndCacheData()
      cachedStates = data.map((s, i) => ({
        id: String(i),
        name: s.name || s.state || '',
      }))
      states.value = cachedStates
    } catch (err) {
      error.value = 'Failed to fetch states'
      console.error('useLocationStates error:', err)
    } finally {
      loading.value = false
    }
  }

  fetchStates()

  return { states, loading, error }
}

/**
 * Fetch cities (LGAs) for a given state.
 * Returns cities from countriesnow API, treated as LGAs
 */
export const useLocationCities = (stateName: Ref<string | null>) => {
  const cities: Ref<City[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  const fetchCities = async () => {
    const stateName_val = unref(stateName)
    if (!stateName_val) {
      cities.value = []
      return
    }

    loading.value = true

    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          country: 'Nigeria',
          state: stateName_val
        })
      })
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const json = await response.json()
      
      let cityList = json?.data || []
      if (!Array.isArray(cityList) || cityList.length === 0) {
        // Log response to help debugging when LGAs are missing for a state
        console.warn('[useLocation] no cities returned for state (primary API):', stateName_val, 'response:', json)
        // Try fallback sources that contain LGAs for this state
        const fallback = await fetchFallbackForState(stateName_val)
        if (Array.isArray(fallback) && fallback.length > 0) {
          cityList = fallback
          console.debug('[useLocation] using fallback LGAs for state:', stateName_val, 'count:', fallback.length)
        }
      }
      cities.value = (Array.isArray(cityList) ? cityList : []).map((city: string, i: number) => ({
        id: String(i),
        name: city,
      }))
    } catch (err) {
      console.error('useLocationCities error:', err)
      cities.value = []
    } finally {
      loading.value = false
    }
  }

  watch(
    () => stateName.value,
    () => {
      fetchCities()
    },
    { immediate: true }
  )

  return { cities, loading }
}

/**
 * Fetch LGAs for a given city (LGA).
 * Since we treat LGAs as cities,
 * this returns the selected LGA as a single-item list,
 * or an empty list if hierarchy doesn't support sub-LGAs.
 */
export const useLocationLGAs = (cityName: Ref<string | null>) => {
  const lgas: Ref<LGA[]> = ref([])
  const loading: Ref<boolean> = ref(false)

  const fetchLGAs = async () => {
    const name = unref(cityName)
    if (!name) {
      lgas.value = []
      return
    }

    loading.value = true

    try {
      // For now, return the selected city/LGA as itself.
      // If the data source supports sub-LGAs extend thes logic.
      lgas.value = [{ id: '0', name }]
    } catch (err) {
      console.error('useLocationLGAs error:', err)
      lgas.value = []
    } finally {
      loading.value = false
    }
  }

  watch(
    () => cityName.value,
    () => {
      fetchLGAs()
    },
    { immediate: true }
  )

  return { lgas, loading }
}
