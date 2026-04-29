import { getProfile, listProfiles } from "./services/profileService"
import type { ListParams } from "@/types"
import type { ProfileFilters, ProfileSort } from "./types"

export const profileQueries = {
  all: () => ["profiles"] as const,

  lists: () => [...profileQueries.all(), "list"] as const,

  list: (params: ListParams<ProfileFilters, ProfileSort>) => ({
    queryKey: [...profileQueries.lists(), params] as const,
    queryFn: () =>
      listProfiles(params.filters, params.sort, params.page, params.pageSize),
  }),

  detail: (userId: string) => ({
    queryKey: [...profileQueries.all(), userId] as const,
    queryFn: () => getProfile(userId),
  }),
}
