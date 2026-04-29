import { useQuery } from "@tanstack/react-query"
import { jobQueries } from "../queries"
import type { ListParams } from "@/types"
import type { JobFilters, JobSort } from "../types"

export function useJobs(params: ListParams<JobFilters, JobSort> = {}) {
  return useQuery({
    ...jobQueries.list(params),
  })
}
