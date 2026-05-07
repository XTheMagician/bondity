import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { uploadStlFile } from "../services/fileUploadService"
import { fileQueries } from "../queries"

export function useUploadFile() {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (file: File) => {
      if (!user) throw new Error("Not authenticated")
      return uploadStlFile(file, user.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: fileQueries.lists() })
    },
  })
}
