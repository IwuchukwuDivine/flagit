import prisma from '~/server/utils/prisma'

const PAGE_SIZE = 10

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const limit = Math.min(Number(query.limit) || PAGE_SIZE, 50)
  const cursor = query.cursor ? Number(query.cursor) : undefined
  const status = typeof query.status === 'string' && query.status !== 'recent' ? query.status : undefined

  const user = await getUserSession(event)

  // Build where clause
  const where: Record<string, unknown> = {}
  if (status) where.status = status
  if (cursor) where.id = { lt: cursor }

  // Fetch one extra to determine if there's a next page
  const complaints = await prisma.complaint.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit + 1,
    include: {
      _count: {
        select: { likes: true, comments: true },
      },
    },
  })

  const hasMore = complaints.length > limit
  const items = hasMore ? complaints.slice(0, limit) : complaints
  const nextCursor = hasMore ? items[items.length - 1]!.id : null

  // Get user's likes for these items
  let userLikes = new Set<number>()
  if (user && items.length > 0) {
    const likes = await prisma.like.findMany({
      where: {
        userId: user.id,
        complaintId: { in: items.map((c) => c.id) },
      },
      select: { complaintId: true },
    })
    userLikes = new Set(likes.map((l) => l.complaintId))
  }

  // Shape items with engagement data
  const feedItems = items.map((c) => {
    const { _count, ...complaint } = c
    return {
      ...complaint,
      likes: _count.likes,
      comments: _count.comments,
      liked: userLikes.has(c.id),
    }
  })

  // Stats + category counts (lightweight, computed from full dataset — only on first page)
  let stats = undefined
  let categoryCounts = undefined
  if (!cursor) {
    const allComplaints = await prisma.complaint.findMany({
      select: { status: true, category: true },
    })
    const total = allComplaints.length
    const pending = allComplaints.filter((c) => c.status === 'pending').length
    const resolved = allComplaints.filter((c) => c.status === 'resolved').length
    stats = { total, pending, resolved }

    const counts: Record<string, number> = {}
    for (const c of allComplaints) {
      counts[c.category] = (counts[c.category] || 0) + 1
    }
    categoryCounts = counts
  }

  return {
    items: feedItems,
    nextCursor,
    ...(stats && { stats }),
    ...(categoryCounts && { categoryCounts }),
  }
})
