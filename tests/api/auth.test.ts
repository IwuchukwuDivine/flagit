import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import prisma from '~/server/utils/prisma'
import { TestClient } from '../helpers/testClient'

describe('Auth API', async () => {
  await setup({
    server: true,
  })

  beforeAll(async () => {
    // Database schema should already exist from Prisma
  })

  beforeEach(async () => {
    // Clean up database before each test
    await prisma.user.deleteMany()
    await prisma.complaint.deleteMany()
  })

  afterAll(async () => {
    // Clean up after all tests
    await prisma.user.deleteMany()
    await prisma.complaint.deleteMany()
    await prisma.$disconnect()
  })

  describe('POST /api/auth/register', () => {
    it('creates a user and returns a session', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData,
      })

      expect(response).toBeDefined()
      expect(response.user).toBeDefined()
      expect(response.user.id).toBeDefined()
      expect(response.user.name).toBe(userData.name)
      expect(response.user.email).toBe(userData.email)
      expect(response.user.createdAt).toBeDefined()
      // Password should not be in the response
      expect((response.user as any).password).toBeUndefined()

      // Verify user was created in database
      const dbUser = await prisma.user.findUnique({
        where: { email: userData.email },
      })
      expect(dbUser).toBeDefined()
      expect(dbUser?.name).toBe(userData.name)
      // Password should be hashed
      expect(dbUser?.password).not.toBe(userData.password)
      expect(dbUser?.password).toBeTruthy()
    })

    it('returns 400 for missing name', async () => {
      const userData = {
        email: 'john@example.com',
        password: 'password123',
      }

      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
        })
      ).rejects.toThrow()
    })

    it('returns 400 for missing email', async () => {
      const userData = {
        name: 'John Doe',
        password: 'password123',
      }

      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
        })
      ).rejects.toThrow()
    })

    it('returns 400 for invalid email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'not-an-email',
        password: 'password123',
      }

      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
        })
      ).rejects.toThrow()
    })

    it('returns 400 for short password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123',
      }

      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
        })
      ).rejects.toThrow()
    })

    it('returns 400 for duplicate email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      // Create first user
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: userData,
      })

      // Try to create duplicate
      await expect(
        $fetch('/api/auth/register', {
          method: 'POST',
          body: userData,
        })
      ).rejects.toThrow()
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user before login tests
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      })
    })

    it('authenticates and returns a session', async () => {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'john@example.com',
          password: 'password123',
        },
      })

      expect(response).toBeDefined()
      expect(response.user).toBeDefined()
      expect(response.user.email).toBe('john@example.com')
      expect(response.user.name).toBe('John Doe')
      // Password should not be in the response
      expect((response.user as any).password).toBeUndefined()
    })

    it('returns 401 for invalid email', async () => {
      await expect(
        $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'wrong@example.com',
            password: 'password123',
          },
        })
      ).rejects.toThrow()
    })

    it('returns 401 for invalid password', async () => {
      await expect(
        $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'john@example.com',
            password: 'wrongpassword',
          },
        })
      ).rejects.toThrow()
    })

    it('returns 400 for missing email', async () => {
      await expect(
        $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            password: 'password123',
          },
        })
      ).rejects.toThrow()
    })

    it('returns 400 for missing password', async () => {
      await expect(
        $fetch('/api/auth/login', {
          method: 'POST',
          body: {
            email: 'john@example.com',
          },
        })
      ).rejects.toThrow()
    })
  })

  describe('GET /api/auth/me', () => {
    it('returns the authenticated user profile', async () => {
      const client = new TestClient()

      // Register to create a user and get session
      await client.fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      })

      // The cookie should be automatically sent with the next request
      const response = await client.fetch('/api/auth/me')

      expect(response).toBeDefined()
      expect(response.user).toBeDefined()
      expect(response.user.email).toBe('john@example.com')
      expect(response.user.name).toBe('John Doe')
    })

    it('returns 401 when not authenticated', async () => {
      // Use a fresh client with no cookies
      await expect(
        $fetch('/api/auth/me')
      ).rejects.toThrow()
    })
  })

  describe('POST /api/auth/logout', () => {
    it('clears the session', async () => {
      const client = new TestClient()

      // Register first
      await client.fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        },
      })

      // Logout
      const response = await client.fetch('/api/auth/logout', {
        method: 'POST',
      })

      expect(response).toBeDefined()
      expect(response.success).toBe(true)
    })
  })
})
