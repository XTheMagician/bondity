import { useQuery } from "@tanstack/react-query"
import { jobQueries } from "../queries"

export function useJobs(jobId: string) {
  return useQuery(jobQueries.detail(jobId))
}
