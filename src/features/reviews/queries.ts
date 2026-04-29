import { listReviewsForUser, getReviewForJob } from "./services/reviewService"
import type { ListParams } from "@/types"
import type { ReviewFilters, ReviewSort } from "./types"

export const reviewQueries = {
  all: () => ["reviews"] as const,

  forUser: (
    targetUserId: string,
    params: ListParams<ReviewFilters, ReviewSort> = {}
  ) => ({
    queryKey: [...reviewQueries.all(), "user", targetUserId, params] as const,
    queryFn: () =>
      listReviewsForUser(
        targetUserId,
        params.filters,
        params.sort,
        params.page,
        params.pageSize
      ),
  }),

  forJob: (jobId: string) => ({
    queryKey: [...reviewQueries.all(), "job", jobId] as const,
    queryFn: () => getReviewForJob(jobId),
  }),
}
