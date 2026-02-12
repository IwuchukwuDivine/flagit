import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Require authentication
    const user = await requireAuth(event)

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

    // Check if the user is the author
    if (complaint.userId !== user.id) {
      throw createError({
        statusCode: 403,
        statusMessage: 'You can only delete your own complaints',
      })
    }

    await prisma.complaint.delete({
      where: {
        id: Number(id),
      },
    })

    return {
      success: true,
      message: 'Complaint deleted successfully',
    }
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
