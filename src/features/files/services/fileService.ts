import { supabase } from "@/lib/supabase"
import { DEFAULT_PAGE_SIZE, pageRange, resolveSort } from "@/lib/pagination"
import type { File, FileInsert, FileUpdate, PageResponse } from "@/types"
import type { FileFilters, FileSort } from "../types"

export async function getFile(fileId: string): Promise<File> {
  const { data, error } = await supabase
    .from("files")
    .select()
    .eq("id", fileId)
    .single()

  if (error) throw error
  return data
}

export async function listFiles(
  filters: FileFilters = {},
  sort?: FileSort,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PageResponse<File>> {
  const { from, to } = pageRange(page, pageSize)

  let query = supabase
    .from("files")
    .select("*", { count: "exact" })
    .range(from, to)

  if (filters.ownerId) {
    query = query.eq("owner_id", filters.ownerId)
  }

  if (filters.status) {
    query = query.eq("status", filters.status)
  }

  const { field, ascending } = resolveSort(sort, "created_at")
  query = query.order(field, { ascending })

  const { data, error, count } = await query

  if (error) throw error
  return { data: data ?? [], count }
}

export async function createFile(insert: FileInsert): Promise<File> {
  const { data, error } = await supabase
    .from("files")
    .insert(insert)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateFile(
  fileId: string,
  updates: FileUpdate
): Promise<File> {
  const { data, error } = await supabase
    .from("files")
    .update({ ...updates })
    .eq("id", fileId)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error("File not found after update")
  return data
}
