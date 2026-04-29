import type { Printer, Profile, Sort } from "@/types"

export type PrinterFilters = {
  minRating?: number
  material?: string
  city?: string
}

export type PrinterSortField = "rating"

export type PrinterSort = Sort<PrinterSortField>

export type PrinterListItem = Printer & {
  profiles: Pick<Profile, "full_name" | "avg_rating">
}
