import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid complaint ID' })
  }

  const comments = await prisma.comment.findMany({
    where: { complaintId: Number(id) },
    orderBy: { createdAt: 'asc' },
  })

  return comments
})
