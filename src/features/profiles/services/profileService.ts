import { supabase } from "@/lib/supabase"
import type { Profile, ProfileUpdate, PageResponse } from "@/types"
import { DEFAULT_PAGE_SIZE, pageRange, resolveSort } from "@/lib/pagination"
import type { ProfileFilters, ProfileSort } from "../types"

export async function getProfile(userId: string): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select()
    .eq("id", userId)
    .single()

  if (error) throw error
  return data
}

export async function updateProfile(
  userId: string,
  updates: ProfileUpdate
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function listProfiles(
  filters: ProfileFilters = {},
  sort?: ProfileSort,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PageResponse<Profile>> {
  const { from, to } = pageRange(page, pageSize)

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .range(from, to)

  if (filters.isMaker != null) query = query.eq("is_maker", filters.isMaker)
  if (filters.username) query = query.ilike("username", `%${filters.username}%`)
  if (filters.fullName)
    query = query.ilike("full_name", `%${filters.fullName}%`)
  if (filters.city) query = query.ilike("location_city", `%${filters.city}%`)

  const { field, ascending } = resolveSort(sort, "updated_at")
  query = query.order(field, { ascending })

  const { data, error, count } = await query
  if (error) throw error
  return { data: data ?? [], count }
}
