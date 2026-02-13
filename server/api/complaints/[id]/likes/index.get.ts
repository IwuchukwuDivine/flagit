import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid complaint ID' })
  }

  const count = await prisma.like.count({
    where: { complaintId: Number(id) },
  })

  // Check if current user has liked (optional — not authenticated = not liked)
  const user = await getUserSession(event)
  let liked = false
  if (user) {
    const existing = await prisma.like.findUnique({
      where: { userId_complaintId: { userId: user.id, complaintId: Number(id) } },
    })
    liked = !!existing
  }

  return { count, liked }
})
