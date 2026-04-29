import { listReviewsForUser, listReviewsForJob } from "./services/reviewService"
import type { ListParams } from "@/types"
import type { ReviewSort } from "./types"

export const reviewQueries = {
  all: () => ["reviews"] as const,

  forUser: (
    targetUserId: string,
    params: ListParams<never, ReviewSort> = {}
  ) => ({
    queryKey: [...reviewQueries.all(), "user", targetUserId, params] as const,
    queryFn: () =>
      listReviewsForUser(
        targetUserId,
        params.sort,
        params.page,
        params.pageSize
      ),
  }),

  forJob: (jobId: string, params: ListParams<never, ReviewSort> = {}) => ({
    queryKey: [...reviewQueries.all(), "job", jobId, params] as const,
    queryFn: () =>
      listReviewsForJob(jobId, params.sort, params.page, params.pageSize),
  }),
}
