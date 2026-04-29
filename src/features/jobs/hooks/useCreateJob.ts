import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createJob } from "../services/jobService"
import { jobQueries } from "../queries"

export function useCreateJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (fileUrl: string) => createJob(fileUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: jobQueries.lists() })
    },
  })
}
