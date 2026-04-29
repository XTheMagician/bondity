import { useQuery } from "@tanstack/react-query"
import { profileQueries } from "../queries"

export function useProfile(userId: string) {
  return useQuery(profileQueries.detail(userId))
}
