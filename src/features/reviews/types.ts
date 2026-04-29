import type { Sort } from "@/types"

export type ReviewSortField = "created_at" | "rating"

export type ReviewSort = Sort<ReviewSortField>
