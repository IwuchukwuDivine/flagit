export interface Complaint {
  id: number
  title: string
  body: string
  imageUrl: string | null
  authorName: string
  category: string
  location: string
  status: string
  createdAt: string
  updatedAt: string
}
