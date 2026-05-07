import { useQuery } from "@tanstack/react-query"
import { fileQueries } from "../queries"
import type { ListParams } from "@/types"
import type { FileFilters, FileSort } from "../types"

export function useFiles(params: ListParams<FileFilters, FileSort> = {}) {
  return useQuery(fileQueries.list(params))
}
