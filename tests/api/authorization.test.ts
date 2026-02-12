import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import prisma from '~/server/utils/prisma'
import { TestClient } from '../helpers/testClient'

describe('Authorization Logic', async () => {
  await setup({
    server: true,
  })

  let user1Id: number
  let user2Id: number

  beforeAll(async () => {
    // Clean up before starting
    await prisma.complaint.deleteMany()
    await prisma.user.deleteMany()
  })

  beforeEach(async () => {
    // Clean up complaints before each test
    await prisma.complaint.deleteMany()

    // Ensure test users exist (might have been deleted by previous test suite)
    const existingUser1 = await prisma.user.findUnique({
      where: { email: 'user1@example.com' },
    })
    const existingUser2 = await prisma.user.findUnique({
      where: { email: 'user2@example.com' },
    })

    if (!existingUser1) {
      const user1Response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'User One',
          email: 'user1@example.com',
          password: 'password123',
        },
      })
      user1Id = user1Response.user.id
    } else {
      user1Id = existingUser1.id
    }

    if (!existingUser2) {
      const user2Response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'User Two',
          email: 'user2@example.com',
          password: 'password123',
        },
      })
      user2Id = user2Response.user.id
    } else {
      user2Id = existingUser2.id
    }
  })

  afterAll(async () => {
    // Clean up after all tests
    await prisma.complaint.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  describe('POST /api/complaints - Authentication', () => {
    it('requires authentication', async () => {
      const complaintData = {
        title: 'Broken road',
        body: 'There is a large pothole',
        category: 'roads',
        location: 'Main Street',
      }

      // Try to create complaint without authentication (using fresh client with no cookies)
      await expect(
        $fetch('/api/complaints', {
          method: 'POST',
          body: complaintData,
        })
      ).rejects.toThrow()
    })

    it('auto-sets authorName and userId from session', async () => {
      const client = new TestClient()

      // Login as user1
      await client.fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'user1@example.com',
          password: 'password123',
        },
      })

      const complaintData = {
        title: 'Broken road',
        body: 'There is a large pothole',
        category: 'roads',
        location: 'Main Street',
      }

      const response = await client.fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })

      expect(response).toBeDefined()
      expect(response.authorName).toBe('User One')
      expect(response.userId).toBe(user1Id)
      expect(response.title).toBe(complaintData.title)
    })

    it('does not accept authorName in the request body', async () => {
      const client = new TestClient()

      // Login as user1
      await client.fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'user1@example.com',
          password: 'password123',
        },
      })

      const complaintData = {
        title: 'Broken road',
        body: 'There is a large pothole',
        category: 'roads',
        location: 'Main Street',
        // Try to fake the author name
        authorName: 'Fake Name',
      }

      const response = await client.fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })

      // Should use authenticated user's name, not the provided one
      expect(response.authorName).toBe('User One')
      expect(response.authorName).not.toBe('Fake Name')
    })
  })

  describe('DELETE /api/complaints/:id - Authorization', () => {
    it('allows user to delete their own complaint', async () => {
      const client = new TestClient()

      // Login as user1
      await client.fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'user1@example.com',
          password: 'password123',
        },
      })

      // Create complaint as user1
      const complaint = await client.fetch('/api/complaints', {
        method: 'POST',
        body: {
          title: 'My complaint',
          body: 'This is my complaint',
          category: 'roads',
          location: 'Main Street',
        },
      })

      // Delete own complaint
      const response = await client.fetch(`/api/complaints/${complaint.id}`, {
        method: 'DELETE',
      })

      expect(response.success).toBe(true)

      // Verify complaint was deleted
      const dbComplaint = await prisma.complaint.findUnique({
        where: { id: complaint.id },
      })
      expect(dbComplaint).toBeNull()
    })

    it('prevents user from deleting another users complaint', async () => {
      const client1 = new TestClient()
      const client2 = new TestClient()

      // Login as user1 and create complaint
      await client1.fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'user1@example.com',
          password: 'password123',
        },
      })

      const complaint = await client1.fetch('/api/complaints', {
        method: 'POST',
        body: {
          title: 'User 1 complaint',
          body: 'This is user 1s complaint',
          category: 'roads',
          location: 'Main Street',
        },
      })

      // Login as user2
      await client2.fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'user2@example.com',
          password: 'password123',
        },
      })

      // Try to delete user1's complaint as user2
      await expect(
        client2.fetch(`/api/complaints/${complaint.id}`, {
          method: 'DELETE',
        })
      ).rejects.toThrow()

      // Verify complaint was NOT deleted
      const dbComplaint = await prisma.complaint.findUnique({
        where: { id: complaint.id },
      })
      expect(dbComplaint).toBeDefined()
    })

    it('returns 404 for non-existent complaint', async () => {
      const client = new TestClient()

      // Login as user1
      await client.fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'user1@example.com',
          password: 'password123',
        },
      })

      // Try to delete non-existent complaint
      await expect(
        client.fetch('/api/complaints/99999', {
          method: 'DELETE',
        })
      ).rejects.toThrow()
    })
  })
})
