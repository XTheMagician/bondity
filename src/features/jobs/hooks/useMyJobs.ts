import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { jobQueries } from "../queries"
import type { ListParams } from "@/types"
import type { JobFilters, JobSort } from "../types"

export function useMyJobs(params: ListParams<JobFilters, JobSort> = {}) {
  const { user } = useAuth()

  return useQuery({
    ...jobQueries.myList(user!.id, params),
    enabled: !!user,
  })
}
