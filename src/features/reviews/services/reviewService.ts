import { supabase } from "@/lib/supabase"
import { DEFAULT_PAGE_SIZE, pageRange, resolveSort } from "@/lib/pagination"
import type { Review, ReviewInsert, PageResponse } from "@/types"
import type { ReviewFilters, ReviewSort } from "../types"

export async function getReviewForJob(jobId: string): Promise<Review | null> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("job_id", jobId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function listReviewsForUser(
  targetUserId: string,
  filters: ReviewFilters = {},
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

  if (filters.minRating != null) query = query.gte("rating", filters.minRating)

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
