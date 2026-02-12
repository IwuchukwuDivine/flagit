import { defineVitestConfig } from '@nuxt/test-utils/config'
import { join } from 'path'

export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    globals: true,
    env: {
      DATABASE_URL: `file:${join(process.cwd(), 'prisma', 'dev.db')}`,
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
