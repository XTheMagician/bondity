import { getPrinter, listPrinters } from "./services/printerService"
import type { ListParams } from "@/types"
import type { PrinterFilters, PrinterSort } from "./types"

export const printerQueries = {
  all: () => ["printers"] as const,

  lists: () => [...printerQueries.all(), "list"] as const,

  list: (params: ListParams<PrinterFilters, PrinterSort>) => ({
    queryKey: [...printerQueries.lists(), params] as const,
    queryFn: () =>
      listPrinters(params.filters, params.sort, params.page, params.pageSize),
  }),

  detail: (printerId: string) => ({
    queryKey: [...printerQueries.all(), printerId] as const,
    queryFn: () => getPrinter(printerId),
  }),
}
