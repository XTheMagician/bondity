import { supabase } from "@/lib/supabase"

const PAGE_SIZE = 10

export async function getAvailablePrinters(
  filters: { material?: string; city?: string; minRating?: number } = {},
  page = 0
) {
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
    .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

  if (filters.material) {
    query = query.contains("material_types", [filters.material])
  }

  if (filters.city) {
    query = query.ilike("location_city", `%${filters.city}%`)
  }

  if (filters.minRating != null) {
    query = query.gte("profiles.avg_rating", filters.minRating)
  }

  const { data, error, count } = await query
  if (error) throw error

  return { data, count }
}
