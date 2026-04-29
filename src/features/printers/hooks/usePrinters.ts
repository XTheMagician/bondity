import { useQuery } from "@tanstack/react-query"
import { printerQueries } from "../queries"
import type { ListParams } from "@/types"
import type { PrinterFilters, PrinterSort } from "../types"

export function usePrinters(
  params: ListParams<PrinterFilters, PrinterSort> = {}
) {
  return useQuery(printerQueries.list(params))
}
