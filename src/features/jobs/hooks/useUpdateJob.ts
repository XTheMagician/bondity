import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateJob } from "../services/jobService"
import { jobQueries } from "../queries"
import type { JobUpdate } from "@/types"

export function useUpdateJob(jobId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (details: JobUpdate) => updateJob(jobId, details),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: jobQueries.detail(jobId).queryKey,
      })
      queryClient.invalidateQueries({ queryKey: jobQueries.lists() })
    },
  })
}
