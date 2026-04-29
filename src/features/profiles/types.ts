import type { Sort } from "@/types"

export type ProfileFilters = {
  isMaker?: boolean
  username?: string
  fullName?: string
  city?: string
}

export type ProfileSortField =
  | "username"
  | "full_name"
  | "avg_rating"
  | "updated_at"

export type ProfileSort = Sort<ProfileSortField>
