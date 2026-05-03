import type { Tables, TablesInsert, TablesUpdate } from "./database.types"

export type Job = Tables<"jobs">
export type Printer = Tables<"printers">
export type Profile = Tables<"profiles">
export type Review = Tables<"reviews">
export type JobInvitation = Tables<"job_invitations">
export type PrinterMaterial = Tables<"printer_materials">
export type ProfileAddress = Tables<"profile_addresses">

export type JobInsert = TablesInsert<"jobs">
export type JobUpdate = TablesUpdate<"jobs">
export type PrinterInsert = TablesInsert<"printers">
export type PrinterUpdate = TablesUpdate<"printers">
export type ProfileInsert = TablesInsert<"profiles">
export type ProfileUpdate = TablesUpdate<"profiles">
export type ReviewInsert = TablesInsert<"reviews">
export type ReviewUpdate = TablesUpdate<"reviews">
export type JobInvitationInsert = TablesInsert<"job_invitations">
export type JobInvitationUpdate = TablesUpdate<"job_invitations">
export type PrinterMaterialInsert = TablesInsert<"printer_materials">
export type PrinterMaterialUpdate = TablesUpdate<"printer_materials">
export type ProfileAddressInsert = TablesInsert<"profile_addresses">
export type ProfileAddressUpdate = TablesUpdate<"profile_addresses">

export type PageResponse<T> = {
  data: T[]
  count: number | null
}

export type Sort<T extends string> = {
  by: T
  direction: "asc" | "desc"
}

export type ListParams<TFilters, TSort> = {
  filters?: TFilters
  sort?: TSort
  page?: number
  pageSize?: number
}
