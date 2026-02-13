import { z } from 'zod'
import prisma from '~/server/utils/prisma'

const commentSchema = z.object({
  body: z.string().min(1, 'Comment cannot be empty').max(1000, 'Comment is too long'),
})

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid complaint ID' })
  }

  // Verify complaint exists
  const complaint = await prisma.complaint.findUnique({
    where: { id: Number(id) },
  })
  if (!complaint) {
    throw createError({ statusCode: 404, statusMessage: 'Complaint not found' })
  }

  try {
    const body = await readBody(event)
    const validated = commentSchema.parse(body)

    const comment = await prisma.comment.create({
      data: {
        body: validated.body,
        authorName: user.name,
        userId: user.id,
        complaintId: Number(id),
      },
    })

    return comment
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation failed',
        data: error.issues,
      })
    }
    throw createError({ statusCode: 500, statusMessage: 'Internal server error' })
  }
})
