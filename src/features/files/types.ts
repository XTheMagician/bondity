import type { File as DbFile } from "@/types"

export type JobFile = DbFile

export type FileStatus = "published" | "draft"

export type OwnedFile = {
  id: string
  source: "uploaded"
  name: string
  status: FileStatus
  preview_url: string | null
  downloads: number
  earnings: number
  avg_rating: number
  review_count: number
}

export type SavedFile = {
  id: string
  source: "saved"
  name: string
  preview_url: string | null
  seller_username: string
  saved_at: string
}

export type BrowseFile = {
  id: string
  source: "browse"
  name: string
  preview_url: string | null
  price: number
  seller_username: string
  downloads: number
  avg_rating: number
  review_count: number
}
