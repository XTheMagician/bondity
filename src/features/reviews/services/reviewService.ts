import { supabase } from "@/lib/supabase"
import { DEFAULT_PAGE_SIZE, pageRange, resolveSort } from "@/lib/pagination"
import type { Review, ReviewInsert, PageResponse } from "@/types"
import type { ReviewSort } from "../types"

export async function listReviewsForUser(
  targetUserId: string,
  sort?: ReviewSort,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PageResponse<Review>> {
  const { from, to } = pageRange(page, pageSize)

  let query = supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .eq("target_id", targetUserId)
    .range(from, to)

  const { field, ascending } = resolveSort(sort, "created_at")
  query = query.order(field, { ascending })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data ?? [], count }
}

export async function listReviewsForJob(
  jobId: string,
  sort?: ReviewSort,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PageResponse<Review>> {
  const { from, to } = pageRange(page, pageSize)

  let query = supabase
    .from("reviews")
    .select("*", { count: "exact" })
    .eq("job_id", jobId)
    .range(from, to)

  const { field, ascending } = resolveSort(sort, "created_at")
  query = query.order(field, { ascending })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data ?? [], count }
}

export async function createReview(review: ReviewInsert): Promise<Review> {
  const { data, error } = await supabase
    .from("reviews")
    .insert(review)
    .select()
    .single()

  if (error) throw error
  return data
}
