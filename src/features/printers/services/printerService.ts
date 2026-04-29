import { supabase } from "@/lib/supabase"
import { DEFAULT_PAGE_SIZE, pageRange } from "@/lib/pagination"
import type { Printer, PageResponse, PrinterUpdate } from "@/types"
import type { PrinterFilters, PrinterSort, PrinterListItem } from "../types"

export async function listPrinters(
  filters: PrinterFilters = {},
  sort?: PrinterSort,
  page = 0,
  pageSize = DEFAULT_PAGE_SIZE
): Promise<PageResponse<PrinterListItem>> {
  const { from, to } = pageRange(page, pageSize)

  let query = supabase
    .from("printers")
    .select(
      `
      *,
      profiles!inner (full_name, avg_rating)
    `,
      { count: "exact" }
    )
    .eq("is_active", true)
    .range(from, to)

  if (filters.material) {
    query = query.contains("material_types", [filters.material])
  }

  if (filters.city) {
    query = query.ilike("location_city", `%${filters.city}%`)
  }

  if (filters.minRating != null) {
    query = query.filter("profiles.avg_rating", "gte", filters.minRating)
  }

  if (sort?.by === "rating") {
    query = query.order("avg_rating", {
      referencedTable: "profiles",
      ascending: sort.direction === "asc",
    })
  }

  const { data, error, count } = await query
  if (error) throw error

  return { data: (data ?? []) as PrinterListItem[], count }
}

export async function getPrinter(printerId: string): Promise<Printer> {
  const { data, error } = await supabase
    .from("printers")
    .select()
    .eq("id", printerId)
    .single()

  if (error) throw error
  return data
}

export async function updatePrinter(
  printerId: string,
  updates: PrinterUpdate
): Promise<Printer> {
  const { data, error } = await supabase
    .from("printers")
    .update({
      ...updates,
    })
    .eq("id", printerId)
    .select()
    .single()

  if (error) throw error
  if (!data) throw new Error("Printer not found after update")
  return data
}
