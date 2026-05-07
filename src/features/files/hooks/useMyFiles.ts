import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { fileQueries } from "../queries"
import type { ListParams } from "@/types"
import type { FileFilters, FileSort } from "../types"

export function useMyFiles(params: ListParams<FileFilters, FileSort> = {}) {
  const { user } = useAuth()

  return useQuery({
    ...fileQueries.myList(user!.id, params),
    enabled: !!user,
  })
}
