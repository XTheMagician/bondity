import { useQuery } from "@tanstack/react-query"
import { reviewQueries } from "../queries"
import type { ListParams } from "@/types"
import type { ReviewSort } from "../types"

export function useReviewsForUser(
  targetUserId: string,
  params: ListParams<never, ReviewSort> = {}
) {
  return useQuery(reviewQueries.forUser(targetUserId, params))
}
