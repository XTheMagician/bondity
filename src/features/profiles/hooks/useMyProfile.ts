import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { profileQueries } from "../queries"

export function useMyProfile() {
  const { user } = useAuth()

  return useQuery({
    ...profileQueries.detail(user!.id),
    enabled: !!user,
  })
}
