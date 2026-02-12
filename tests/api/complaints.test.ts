import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import prisma from '~/server/utils/prisma'

describe('Complaints API', async () => {
  await setup({
    server: true,
  })

  let testUserId: number

  beforeAll(async () => {
    // Clean up before starting
    await prisma.complaint.deleteMany()
    await prisma.user.deleteMany()
  })

  beforeEach(async () => {
    // Clean up complaints before each test
    await prisma.complaint.deleteMany()

    // Ensure test user exists (might have been deleted by previous test suite)
    const existingUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    })

    if (!existingUser) {
      const userResponse = await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        },
      })
      testUserId = userResponse.user.id
    } else {
      testUserId = existingUser.id
      // Login with existing user
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
        },
      })
    }
  })

  afterAll(async () => {
    // Clean up after all tests
    await prisma.complaint.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  describe('POST /api/complaints', () => {
    it('creates a complaint and returns it with status 200', async () => {
      const complaintData = {
        title: 'Broken road',
        body: 'There is a large pothole on Main Street',
        category: 'roads',
        location: 'Main Street',
      }

      const response = await $fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })

      expect(response).toBeDefined()
      expect(response.id).toBeDefined()
      expect(response.title).toBe(complaintData.title)
      expect(response.body).toBe(complaintData.body)
      expect(response.authorName).toBe('Test User') // Auto-set from session
      expect(response.userId).toBe(testUserId) // Auto-set from session
      expect(response.category).toBe(complaintData.category)
      expect(response.location).toBe(complaintData.location)
      expect(response.status).toBe('pending')
      expect(response.createdAt).toBeDefined()
      expect(response.updatedAt).toBeDefined()
    })

    it('returns 400 if title is missing', async () => {
      const complaintData = {
        body: 'There is a large pothole on Main Street',
        category: 'roads',
        location: 'Main Street',
      }

      await expect($fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })).rejects.toThrow()
    })

    it('returns 400 if body is missing', async () => {
      const complaintData = {
        title: 'Broken road',
        category: 'roads',
        location: 'Main Street',
      }

      await expect($fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })).rejects.toThrow()
    })

    it('returns 400 if category is missing', async () => {
      const complaintData = {
        title: 'Broken road',
        body: 'There is a large pothole on Main Street',
        location: 'Main Street',
      }

      await expect($fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })).rejects.toThrow()
    })

    it('returns 400 if location is missing', async () => {
      const complaintData = {
        title: 'Broken road',
        body: 'There is a large pothole on Main Street',
        category: 'roads',
      }

      await expect($fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })).rejects.toThrow()
    })

    it('returns 400 if category is invalid', async () => {
      const complaintData = {
        title: 'Broken road',
        body: 'There is a large pothole on Main Street',
        category: 'invalid-category',
        location: 'Main Street',
      }

      await expect($fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })).rejects.toThrow()
    })
  })

  describe('GET /api/complaints', () => {
    it('returns all complaints sorted by newest first', async () => {
      // Create multiple complaints with the test user
      const complaint1 = await prisma.complaint.create({
        data: {
          title: 'First complaint',
          body: 'First body',
          authorName: 'Test User',
          category: 'roads',
          location: 'Location 1',
          userId: testUserId,
        },
      })

      // Wait a bit to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 10))

      const complaint2 = await prisma.complaint.create({
        data: {
          title: 'Second complaint',
          body: 'Second body',
          authorName: 'Test User',
          category: 'water',
          location: 'Location 2',
          userId: testUserId,
        },
      })

      const response = await $fetch('/api/complaints')

      expect(response).toBeDefined()
      expect(Array.isArray(response)).toBe(true)
      expect(response.length).toBe(2)
      // Newest first
      expect(response[0].id).toBe(complaint2.id)
      expect(response[1].id).toBe(complaint1.id)
    })

    it('returns an empty array when no complaints exist', async () => {
      const response = await $fetch('/api/complaints')

      expect(response).toBeDefined()
      expect(Array.isArray(response)).toBe(true)
      expect(response.length).toBe(0)
    })
  })

  describe('GET /api/complaints/:id', () => {
    it('returns a single complaint by ID', async () => {
      const complaint = await prisma.complaint.create({
        data: {
          title: 'Test complaint',
          body: 'Test body',
          authorName: 'Test User',
          category: 'roads',
          location: 'Test location',
          userId: testUserId,
        },
      })

      const response = await $fetch(`/api/complaints/${complaint.id}`)

      expect(response).toBeDefined()
      expect(response.id).toBe(complaint.id)
      expect(response.title).toBe(complaint.title)
      expect(response.body).toBe(complaint.body)
    })

    it('returns 404 for a non-existent ID', async () => {
      await expect($fetch('/api/complaints/99999')).rejects.toThrow()
    })

    it('returns 400 for an invalid ID', async () => {
      await expect($fetch('/api/complaints/invalid')).rejects.toThrow()
    })
  })

  describe('DELETE /api/complaints/:id', () => {
    it('deletes the complaint and returns a success response', async () => {
      const complaint = await prisma.complaint.create({
        data: {
          title: 'Test complaint',
          body: 'Test body',
          authorName: 'Test User',
          category: 'roads',
          location: 'Test location',
          userId: testUserId,
        },
      })

      const response = await $fetch(`/api/complaints/${complaint.id}`, {
        method: 'DELETE',
      })

      expect(response).toBeDefined()
      expect(response.success).toBe(true)

      // Verify it was deleted
      const deletedComplaint = await prisma.complaint.findUnique({
        where: { id: complaint.id },
      })
      expect(deletedComplaint).toBeNull()
    })

    it('returns 404 for a non-existent ID', async () => {
      await expect($fetch('/api/complaints/99999', {
        method: 'DELETE',
      })).rejects.toThrow()
    })

    it('returns 400 for an invalid ID', async () => {
      await expect($fetch('/api/complaints/invalid', {
        method: 'DELETE',
      })).rejects.toThrow()
    })
  })
})
