import prisma from '~/server/utils/prisma'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const data = registerSchema.parse(body)

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw createError({
        statusCode: 400,
        message: 'Email already registered',
      })
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    })

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
        message: 'Validation error',
      })
    }
    console.error('Registration error:', error)
    throw error
  }
})
