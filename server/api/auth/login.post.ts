import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = loginSchema.parse(body)

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password',
      })
    }

    // Verify password
    const isValid = await verifyPassword(data.password, user.password)
    if (!isValid) {
      throw createError({
        statusCode: 401,
        message: 'Invalid email or password',
      })
    }

    // Set session
    await setUserSession(event, {
      id: user.id,
      name: user.name,
      email: user.email,
    })

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: error.errors[0].message,
      })
    }
    throw error
  }
})
