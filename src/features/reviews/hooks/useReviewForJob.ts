import { useQuery } from "@tanstack/react-query"
import { reviewQueries } from "../queries"

export function useReviewForJob(jobId: string) {
  return useQuery(reviewQueries.forJob(jobId))
}
