import type { Job, Profile, Sort } from "@/types"
import type { PrinterFilters } from "@/features/printers/types"

export type JobStatus =
  | "draft"
  | "pending"
  | "active"
  | "completed"
  | "cancelled"

export type JobTargetType = "open" | "specific"

export type JobTarget =
  | { type: "open"; filters?: PrinterFilters }
  | { type: "specific"; printerIds: string[] }

export interface PrintSettings {
  infillPercent?: number
  layerHeightMm?: number
  supports?: boolean
  resolution?: "draft" | "standard" | "fine"
}

export const MATERIALS = ["PLA", "PETG", "ABS", "Resin"] as const
export const COLORS = [
  "White",
  "Black",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Yellow",
] as const

export type Material = (typeof MATERIALS)[number]
export type Color = (typeof COLORS)[number]

export type JobFilters = {
  status?: JobStatus
  material?: string
  customerId?: string
}

export type JobSortField = "created_at" | "estimated_price"

export type JobSort = Sort<JobSortField>

export type JobWithMaker = Job & {
  profiles: Pick<Profile, "full_name" | "avg_rating"> | null
}
