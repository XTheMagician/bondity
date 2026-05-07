import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createJob } from "../services/jobService"
import { jobQueries } from "../queries"

export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileId: string) => createJob(fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueries.lists() })
    },
  })
}
