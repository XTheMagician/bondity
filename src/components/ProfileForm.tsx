import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/features/auth/hooks/useAuth"
import { Button } from "@/components/ui/button"

const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters"),
  full_name: z.string().max(100, "Full name must be at most 100 characters"),
  bio: z.string().max(300, "Bio must be at most 300 characters"),
  avatar_url: z.string().url("Must be a valid URL").or(z.literal("")),
  is_maker: z.boolean(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfileForm() {
  const { user } = useAuth()
  const [fetchLoading, setFetchLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

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

  useEffect(() => {
    if (!user) return

    supabase
      .from("profiles")
      .select("username, full_name, bio, avatar_url, is_maker")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          reset({
            username: data.username ?? "",
            full_name: data.full_name ?? "",
            bio: data.bio ?? "",
            avatar_url: data.avatar_url ?? "",
            is_maker: data.is_maker ?? false,
          })
        }
        setFetchLoading(false)
      })
  }, [user, reset])

  async function onSubmit(values: ProfileFormValues) {
    if (!user) return
    setSaveStatus("idle")

    const { error } = await supabase
      .from("profiles")
      .update({ ...values, updated_at: new Date().toISOString() })
      .eq("id", user.id)

    setSaveStatus(error ? "error" : "success")
  }

  if (fetchLoading) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg space-y-5">
      <h2 className="text-lg font-semibold">Your Profile</h2>

      <div className="space-y-1">
        <label htmlFor="username" className="text-sm font-medium">
          Username
        </label>
        <input
          id="username"
          {...register("username")}
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
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
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
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
          className="w-full rounded-md border px-3 py-2 text-sm bg-background resize-none"
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
          className="w-full rounded-md border px-3 py-2 text-sm bg-background"
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

      {saveStatus === "success" && (
        <p className="text-sm text-green-600">Profile saved.</p>
      )}
      {saveStatus === "error" && (
        <p className="text-sm text-red-500">Something went wrong. Try again.</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving…" : "Save profile"}
      </Button>
    </form>
  )
}
