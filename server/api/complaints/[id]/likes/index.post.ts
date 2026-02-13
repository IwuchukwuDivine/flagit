import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await requireAuth(event)

  const id = getRouterParam(event, 'id')
  if (!id || isNaN(Number(id))) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid complaint ID' })
  }

  const complaintId = Number(id)

  // Verify complaint exists
  const complaint = await prisma.complaint.findUnique({
    where: { id: complaintId },
  })
  if (!complaint) {
    throw createError({ statusCode: 404, statusMessage: 'Complaint not found' })
  }

  // Toggle: if already liked, remove; otherwise, add
  const existing = await prisma.like.findUnique({
    where: { userId_complaintId: { userId: user.id, complaintId } },
  })

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    const count = await prisma.like.count({ where: { complaintId } })
    return { liked: false, count }
  }

  await prisma.like.create({
    data: { userId: user.id, complaintId },
  })

  const count = await prisma.like.count({ where: { complaintId } })
  return { liked: true, count }
})
