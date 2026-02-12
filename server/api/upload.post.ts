import { randomUUID } from 'crypto'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp']

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)

    if (!form || form.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    // Get the file from the form data
    const fileData = form.find(item => item.name === 'file' || item.filename)

    if (!fileData || !fileData.filename || !fileData.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    // Validate file type
    const fileExtension = fileData.filename.split('.').pop()?.toLowerCase()

    if (!fileExtension || !ALLOWED_EXTENSIONS.includes(fileExtension)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
      })
    }

    // Also check MIME type if available
    if (fileData.type && !ALLOWED_TYPES.includes(fileData.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`,
      })
    }

    // Validate file size
    if (fileData.data.length > MAX_FILE_SIZE) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File size exceeds 5MB limit',
      })
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Generate unique filename
    const uniqueFilename = `${randomUUID()}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFilename)

    // Save the file
    await writeFile(filePath, fileData.data)

    // Return the public URL
    return {
      url: `/uploads/${uniqueFilename}`,
    }
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    console.error('Error uploading file:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
