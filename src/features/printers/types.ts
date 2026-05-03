import type { Printer, Profile, Sort } from "@/types"

export type PrinterFilters = {
  minRating?: number
}

export type PrinterSortField = "rating"

export type PrinterSort = Sort<PrinterSortField>

export type PrinterMaterial = {
  material: string
  available_colors: string[]
}

export type PrinterListItem = Printer & {
  profiles: Pick<Profile, "full_name" | "avg_rating">
  printer_materials: PrinterMaterial[]
}
