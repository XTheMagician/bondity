import { useMutation, useQueryClient } from "@tanstack/react-query"
import { assignJobTarget } from "../services/jobService"
import { jobQueries } from "../queries"
import type { JobTarget } from "../types"

export function useAssignJobTarget(jobId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (target: JobTarget) => assignJobTarget(jobId, target),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobQueries.detail(jobId).queryKey,
      })
      queryClient.invalidateQueries({ queryKey: jobQueries.lists() })
    },
  })
}
