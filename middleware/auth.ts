export default defineNuxtRouteMiddleware(async (to, from) => {
  if (import.meta.server) return

  try {
    await $fetch('/api/auth/me')
  } catch {
    return navigateTo('/auth/login')
  }
})
