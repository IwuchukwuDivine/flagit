import { z } from 'zod'
import prisma from '~/server/utils/prisma'

const complaintSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
  category: z.enum(['roads', 'water', 'electricity', 'sanitation'], {
    message: 'Invalid category',
  }),
  location: z.string().min(1, 'Location is required'),
  imageUrl: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  // Require authentication (let auth errors propagate)
  const user = await requireAuth(event)

  try {
    const body = await readBody(event)
    const validated = complaintSchema.parse(body)

    const complaint = await prisma.complaint.create({
      data: {
        ...validated,
        authorName: user.name,
        userId: user.id,
        status: 'pending',
      },
    })

    return complaint
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: error.issues,
      })
    }
    console.error('Error creating complaint:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
      data: error instanceof Error ? error.message : 'Unknown error',
    })
  }
})
