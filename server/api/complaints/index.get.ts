import prisma from '~/server/utils/prisma'

export default defineEventHandler(async () => {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    return complaints
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
