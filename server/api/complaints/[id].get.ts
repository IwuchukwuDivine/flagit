import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id || isNaN(Number(id))) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid ID',
      })
    }

    const complaint = await prisma.complaint.findUnique({
      where: {
        id: Number(id),
      },
    })

    if (!complaint) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Complaint not found',
      })
    }

    return complaint
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error',
    })
  }
})
