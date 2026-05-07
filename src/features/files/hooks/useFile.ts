import { useQuery } from "@tanstack/react-query"
import { fileQueries } from "../queries"

export function useFile(fileId: string) {
  return useQuery(fileQueries.detail(fileId))
}
