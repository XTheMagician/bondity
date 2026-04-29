import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createReview } from "../services/reviewService"
import { reviewQueries } from "../queries"
import type { ReviewInsert } from "@/types"

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (review: ReviewInsert) => createReview(review),
    onSuccess: (newReview) => {
      queryClient.invalidateQueries({
        queryKey: reviewQueries.forUser(newReview.target_id).queryKey,
      })
      queryClient.invalidateQueries({
        queryKey: reviewQueries.forJob(newReview.job_id).queryKey,
      })
    },
  })
}
