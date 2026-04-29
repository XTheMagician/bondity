import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { PrinterUpdate } from "@/types"
import { updatePrinter } from "@/features/printers/services/printerService.ts"
import { printerQueries } from "@/features/printers/queries.ts"

export function useUpdatePrinter(printerId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (details: PrinterUpdate) => updatePrinter(printerId, details),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: printerQueries.detail(printerId).queryKey,
      })
      queryClient.invalidateQueries({ queryKey: printerQueries.lists() })
    },
  })
}
