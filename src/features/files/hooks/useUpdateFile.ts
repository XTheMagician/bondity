import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateFile } from "../services/fileService"
import { fileQueries } from "../queries"
import type { FileUpdate } from "@/types"

export function useUpdateFile(fileId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: FileUpdate) => updateFile(fileId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: fileQueries.detail(fileId).queryKey,
      })
      queryClient.invalidateQueries({ queryKey: fileQueries.lists() })
    },
  })
}
