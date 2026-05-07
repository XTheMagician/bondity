import { supabase } from "@/lib/supabase"
import { DEFAULT_PAGE_SIZE, pageRange, resolveSort } from "@/lib/pagination"
import type { Job, JobUpdate, PageResponse } from "@/types"
import type {
  JobFilters,
  JobSort,
  JobStatus,
  JobTarget,
  JobTargetType,
} from "../types"

export async function createJob(fileId: string): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .insert([{ file_id: fileId, status: "draft" satisfies JobStatus }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getJob(jobId: string): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .select()
    .eq("id", jobId)
    .single()

  if (error) throw error
  return data
}

export async function listJobs(
  filters: JobFilters = {},
  sort?: JobSort,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PageResponse<Job>> {
  const { from, to } = pageRange(page, pageSize)

  let query = supabase
    .from("jobs")
    .select("*", { count: "exact" })
    .range(from, to)

  if (filters.customerId) {
    query = query.eq("customer_id", filters.customerId)
  }

  if (filters.status) {
    query = query.eq("status", filters.status)
  }

  if (filters.material) {
    query = query.ilike("material", `%${filters.material}%`)
  }

  const { field, ascending } = resolveSort(sort, "created_at")
  query = query.order(field, { ascending })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data ?? [], count }
}

export async function updateJob(
  jobId: string,
  details: JobUpdate
): Promise<Job> {
  const { data, error } = await supabase
    .from("jobs")
    .update({
      ...details,
    })
    .eq("id", jobId)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error("Job not found after update")
  return data
}

export async function assignJobTarget(
  jobId: string,
  target: JobTarget
): Promise<void> {
  if (target.type === "open") {
    const { error } = await supabase
      .from("jobs")
      .update({
        target_type: "open" satisfies JobTargetType,
        min_rating: target.filters?.minRating ?? null,
        status: "pending" satisfies JobStatus,
      })
      .eq("id", jobId)

    if (error) throw error
    return
  }

  const { error: jobError } = await supabase
    .from("jobs")
    .update({
      target_type: "specific" satisfies JobTargetType,
      status: "pending" satisfies JobStatus,
    })
    .eq("id", jobId)

  if (jobError) throw jobError

  const { error: invError } = await supabase
    .from("job_invitations")
    .insert(
      target.printerIds.map((printer_id) => ({ job_id: jobId, printer_id }))
    )

  if (invError) throw invError
}
