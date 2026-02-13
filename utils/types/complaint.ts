export interface Complaint {
  id: number
  title: string
  body: string
  imageUrl: string | null
  authorName: string
  category: string
  location: string
  status: string
  userId: number
  createdAt: string
  updatedAt: string
}

export interface Comment {
  id: number
  body: string
  authorName: string
  userId: number
  complaintId: number
  createdAt: string
}

export interface LikeStatus {
  count: number
  liked: boolean
}
