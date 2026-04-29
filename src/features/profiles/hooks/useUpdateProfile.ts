import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { updateProfile } from "../services/profileService"
import { profileQueries } from "../queries"
import type { ProfileUpdate } from "@/types"

export function useUpdateProfile() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (updates: ProfileUpdate) => updateProfile(user!.id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileQueries.all() })
    },
  })
}
