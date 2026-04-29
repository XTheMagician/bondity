import { useQuery } from "@tanstack/react-query"
import { profileQueries } from "../queries"
import type { ListParams } from "@/types"
import type { ProfileFilters, ProfileSort } from "../types"

export function useProfiles(
  params: ListParams<ProfileFilters, ProfileSort> = {}
) {
  return useQuery(profileQueries.list(params))
}
