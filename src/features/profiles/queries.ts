import { getProfile } from "./services/profileService"

export const profileQueries = {
  all: () => ["profiles"] as const,

  detail: (userId: string) => ({
    queryKey: [...profileQueries.all(), userId] as const,
    queryFn: () => getProfile(userId),
  }),
}
