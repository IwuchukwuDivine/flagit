import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils'
import { readFile, rm } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import prisma from '~/server/utils/prisma'

describe('Upload API', async () => {
  await setup({
    server: true,
  })

  let testUserId: number

  beforeAll(async () => {
    // Create a test user for auth-required operations
    const userResponse = await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      },
    })
    testUserId = userResponse.user.id
  })

  beforeEach(async () => {
    // Clean up complaints before each test
    await prisma.complaint.deleteMany()

    // Ensure we're logged in for tests that need auth
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'password123',
      },
    })
  })

  afterAll(async () => {
    // Clean up uploaded test files
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (existsSync(uploadsDir)) {
      await rm(uploadsDir, { recursive: true, force: true })
    }
    // Clean up database
    await prisma.complaint.deleteMany()
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  // Helper function to create a test image buffer
  function createTestImage(sizeInBytes: number = 1000): Buffer {
    // Create a minimal valid PNG file
    const header = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]) // PNG signature
    const padding = Buffer.alloc(sizeInBytes - header.length)
    return Buffer.concat([header, padding])
  }

  // Helper to create multipart form data for file upload
  function createMultipartFormData(fileBuffer: Buffer, filename: string, mimeType: string) {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).slice(2)
    const parts: Buffer[] = []

    parts.push(Buffer.from(`--${boundary}\r\n`))
    parts.push(Buffer.from(`Content-Disposition: form-data; name="file"; filename="${filename}"\r\n`))
    parts.push(Buffer.from(`Content-Type: ${mimeType}\r\n\r\n`))
    parts.push(fileBuffer)
    parts.push(Buffer.from(`\r\n--${boundary}--\r\n`))

    const body = Buffer.concat(parts)
    return { body, boundary }
  }

  describe('POST /api/upload', () => {
    it('accepts a valid image and returns the URL', async () => {
      const imageBuffer = createTestImage(1000)
      const { body, boundary } = createMultipartFormData(imageBuffer, 'test.png', 'image/png')

      const response = await $fetch('/api/upload', {
        method: 'POST',
        body,
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
      })

      expect(response).toBeDefined()
      expect(response.url).toBeDefined()
      expect(response.url).toMatch(/^\/uploads\/.*\.png$/)

      // Verify the file was actually saved
      const filePath = join(process.cwd(), 'public', response.url)
      expect(existsSync(filePath)).toBe(true)
    })

    it('generates unique filenames for each upload', async () => {
      const imageBuffer = createTestImage(1000)
      const { body: body1, boundary: boundary1 } = createMultipartFormData(imageBuffer, 'test.png', 'image/png')
      const { body: body2, boundary: boundary2 } = createMultipartFormData(imageBuffer, 'test.png', 'image/png')

      const response1 = await $fetch('/api/upload', {
        method: 'POST',
        body: body1,
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary1}`,
        },
      })

      const response2 = await $fetch('/api/upload', {
        method: 'POST',
        body: body2,
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary2}`,
        },
      })

      expect(response1.url).not.toBe(response2.url)
    })

    it('accepts jpg files', async () => {
      const imageBuffer = createTestImage(1000)
      const { body, boundary } = createMultipartFormData(imageBuffer, 'test.jpg', 'image/jpeg')

      const response = await $fetch('/api/upload', {
        method: 'POST',
        body,
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
      })

      expect(response.url).toMatch(/^\/uploads\/.*\.jpg$/)
    })

    it('accepts webp files', async () => {
      const imageBuffer = createTestImage(1000)
      const { body, boundary } = createMultipartFormData(imageBuffer, 'test.webp', 'image/webp')

      const response = await $fetch('/api/upload', {
        method: 'POST',
        body,
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
      })

      expect(response.url).toMatch(/^\/uploads\/.*\.webp$/)
    })

    it('rejects files that are not images (invalid extension)', async () => {
      const textBuffer = Buffer.from('This is not an image')
      const formData = new FormData()
      const blob = new Blob([textBuffer], { type: 'text/plain' })
      formData.append('file', blob, 'test.txt')

      await expect($fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })).rejects.toThrow()
    })

    it('rejects files larger than 5MB', async () => {
      const largeImageBuffer = createTestImage(6 * 1024 * 1024) // 6MB
      const formData = new FormData()
      const blob = new Blob([largeImageBuffer], { type: 'image/png' })
      formData.append('file', blob, 'large.png')

      await expect($fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })).rejects.toThrow()
    })

    it('returns 400 when no file is uploaded', async () => {
      const formData = new FormData()

      await expect($fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })).rejects.toThrow()
    })

    it('rejects pdf files', async () => {
      const pdfBuffer = Buffer.from('PDF content')
      const formData = new FormData()
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
      formData.append('file', blob, 'test.pdf')

      await expect($fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })).rejects.toThrow()
    })

    it('rejects svg files', async () => {
      const svgBuffer = Buffer.from('<svg></svg>')
      const formData = new FormData()
      const blob = new Blob([svgBuffer], { type: 'image/svg+xml' })
      formData.append('file', blob, 'test.svg')

      await expect($fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })).rejects.toThrow()
    })
  })

  describe('Complaint creation with imageUrl', () => {
    it('creates a complaint with an imageUrl', async () => {
      const imageBuffer = createTestImage(1000)
      const { body, boundary } = createMultipartFormData(imageBuffer, 'test.png', 'image/png')

      const uploadResponse = await $fetch('/api/upload', {
        method: 'POST',
        body,
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
      })

      const complaintData = {
        title: 'Broken road with photo',
        body: 'There is a large pothole on Main Street',
        category: 'roads',
        location: 'Main Street',
        imageUrl: uploadResponse.url,
      }

      const response = await $fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })

      expect(response).toBeDefined()
      expect(response.imageUrl).toBe(uploadResponse.url)
    })

    it('creates a complaint without an imageUrl', async () => {
      const complaintData = {
        title: 'Broken road without photo',
        body: 'There is a large pothole on Main Street',
        category: 'roads',
        location: 'Main Street',
      }

      const response = await $fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })

      expect(response).toBeDefined()
      expect(response.imageUrl).toBeNull()
    })

    it('returns the imageUrl when fetching a complaint', async () => {
      const imageBuffer = createTestImage(1000)
      const { body, boundary } = createMultipartFormData(imageBuffer, 'test.png', 'image/png')

      const uploadResponse = await $fetch('/api/upload', {
        method: 'POST',
        body,
        headers: {
          'content-type': `multipart/form-data; boundary=${boundary}`,
        },
      })

      const complaintData = {
        title: 'Broken road with photo',
        body: 'There is a large pothole on Main Street',
        category: 'roads',
        location: 'Main Street',
        imageUrl: uploadResponse.url,
      }

      const createResponse = await $fetch('/api/complaints', {
        method: 'POST',
        body: complaintData,
      })

      const fetchResponse = await $fetch(`/api/complaints/${createResponse.id}`)

      expect(fetchResponse).toBeDefined()
      expect(fetchResponse.imageUrl).toBe(uploadResponse.url)
    })
  })
})
