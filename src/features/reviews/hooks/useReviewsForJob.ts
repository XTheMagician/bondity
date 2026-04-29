import { useQuery } from "@tanstack/react-query"
import { reviewQueries } from "../queries"
import type { ListParams } from "@/types"
import type { ReviewSort } from "../types"

export function useReviewsForJob(
  jobId: string,
  params: ListParams<never, ReviewSort> = {}
) {
  return useQuery(reviewQueries.forJob(jobId, params))
}
