import { getJob, listJobs } from "./services/jobService"
import type { ListParams } from "@/types"
import type { JobFilters, JobSort } from "./types"

export const jobQueries = {
  all: () => ["jobs"] as const,

  lists: () => [...jobQueries.all(), "list"] as const,

  list: (params: ListParams<JobFilters, JobSort>) => ({
    queryKey: [...jobQueries.lists(), params] as const,
    queryFn: () =>
      listJobs(params.filters, params.sort, params.page, params.pageSize),
  }),

  myList: (userId: string, params: ListParams<JobFilters, JobSort>) =>
    jobQueries.list({
      ...params,
      filters: { ...params.filters, customerId: userId },
    }),

  detail: (jobId: string) => ({
    queryKey: [...jobQueries.all(), jobId] as const,
    queryFn: () => getJob(jobId),
  }),
}
