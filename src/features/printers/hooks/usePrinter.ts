import { useQuery } from "@tanstack/react-query"
import { printerQueries } from "../queries"

export function usePrinter(printerId: string) {
  return useQuery(printerQueries.detail(printerId))
}
