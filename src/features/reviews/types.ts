import type { Sort } from "@/types"

export type ReviewFilters = {
  minRating?: number
}

export type ReviewSortField = "created_at" | "rating"

export type ReviewSort = Sort<ReviewSortField>
