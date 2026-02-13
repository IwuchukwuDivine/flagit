import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await getUserSession(event)

  const complaints = await prisma.complaint.findMany({
    select: {
      id: true,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  })

  // If user is logged in, get their likes
  let userLikes = new Set<number>()
  if (user) {
    const likes = await prisma.like.findMany({
      where: { userId: user.id },
      select: { complaintId: true },
    })
    userLikes = new Set(likes.map((l) => l.complaintId))
  }

  const engagement: Record<number, { likes: number; comments: number; liked: boolean }> = {}
  for (const c of complaints) {
    engagement[c.id] = {
      likes: c._count.likes,
      comments: c._count.comments,
      liked: userLikes.has(c.id),
    }
  }

  return engagement
})
