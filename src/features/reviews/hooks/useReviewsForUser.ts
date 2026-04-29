import { useQuery } from "@tanstack/react-query"
import { reviewQueries } from "../queries"
import type { ListParams } from "@/types"
import type { ReviewFilters, ReviewSort } from "../types"

export function useReviewsForUser(
  targetUserId: string,
  params: ListParams<ReviewFilters, ReviewSort> = {}
) {
  return useQuery(reviewQueries.forUser(targetUserId, params))
}
