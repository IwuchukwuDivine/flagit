import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    env: {
      DATABASE_URL: 'file:./dev.db',
    },
    environmentOptions: {
      nuxt: {
        mock: {
          intersectionObserver: true,
          indexedDb: true,
        },
      },
    },
  },
  resolve: {
    alias: {
      'bun:test': 'vitest',
    },
  },
})
