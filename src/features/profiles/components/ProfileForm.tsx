import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMyProfile } from "../hooks/useMyProfile"
import { useUpdateProfile } from "../hooks/useUpdateProfile"
import { Button } from "@/components/ui/button"

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  full_name: z.string().max(100, "Full name must be at most 100 characters"),
  bio: z.string().max(300, "Bio must be at most 300 characters"),
  avatar_url: z.url("Must be a valid URL").or(z.literal("")),
  is_maker: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfileForm() {
  const { data: profile, isLoading } = useMyProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: "",
      full_name: "",
      bio: "",
      avatar_url: "",
      is_maker: false,
    },
  })

  // Populate form once profile data arrives
  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username ?? "",
        full_name: profile.full_name ?? "",
        bio: profile.bio ?? "",
        avatar_url: profile.avatar_url ?? "",
        is_maker: profile.is_maker ?? false,
      })
    }
  }, [profile, reset])

  const { mutateAsync, isSuccess, isError } = useUpdateProfile()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>
  }

  return (
    <form
      onSubmit={handleSubmit((values) => mutateAsync(values))}
      className="w-full max-w-lg space-y-5"
    >
      <h2 className="text-lg font-semibold">Your Profile</h2>

      <div className="space-y-1">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        {errors.username && (
          <p className="text-xs text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="full_name" className="text-sm font-medium">
          Full name
        </label>
        <input
          id="full_name"
          {...register("full_name")}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        {errors.full_name && (
          <p className="text-xs text-red-500">{errors.full_name.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="bio" className="text-sm font-medium">
          Bio
        </label>
        <textarea
          id="bio"
          rows={3}
          {...register("bio")}
          className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm"
        />
        {errors.bio && (
          <p className="text-xs text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <label htmlFor="avatar_url" className="text-sm font-medium">
          Avatar URL
        </label>
        <input
          id="avatar_url"
          {...register("avatar_url")}
          placeholder="https://…"
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        />
        {errors.avatar_url && (
          <p className="text-xs text-red-500">{errors.avatar_url.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          id="is_maker"
          type="checkbox"
          {...register("is_maker")}
          className="size-4 rounded border"
        />
        <label htmlFor="is_maker" className="text-sm font-medium">
          I am a maker
        </label>
      </div>

      {isSuccess && <p className="text-sm text-green-600">Profile saved.</p>}
      {isError && (
        <p className="text-sm text-red-500">Something went wrong. Try again.</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save profile"}
      </Button>
    </form>
  )
}
