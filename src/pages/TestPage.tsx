import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useMyProfile } from "@/features/profiles/hooks/useMyProfile"
import { useUpdateProfile } from "@/features/profiles/hooks/useUpdateProfile"
import { useUploadFile } from "@/features/files/hooks/useUploadFile"
import { useMyFiles } from "@/features/files/hooks/useMyFiles"

export default function TestPage() {
  return (
    <div className="space-y-6 py-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Test page</h1>
        <p className="text-sm text-muted-foreground">
          Sandbox for verifying profile updates and file uploads end-to-end.
        </p>
      </div>

      <ProfileSection />
      <FilesSection />
    </div>
  )
}

function ProfileSection() {
  const { data: profile, isLoading, error } = useMyProfile()
  const updateProfile = useUpdateProfile()

  const [username, setUsername] = useState("")
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [city, setCity] = useState("")
  const [isMaker, setIsMaker] = useState(false)

  useEffect(() => {
    if (!profile) return
    setUsername(profile.username)
    setFullName(profile.full_name ?? "")
    setBio(profile.bio ?? "")
    setCity(profile.location_city ?? "")
    setIsMaker(profile.is_maker)
  }, [profile])

  function handleSave() {
    updateProfile.mutate({
      username,
      full_name: fullName || null,
      bio: bio || null,
      location_city: city || null,
      is_maker: isMaker,
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Profile</CardTitle>
          {updateProfile.isSuccess && (
            <Badge className="border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Saved
            </Badge>
          )}
          {updateProfile.isError && (
            <Badge variant="destructive">Update failed</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        )}
        {error && (
          <p className="text-sm text-destructive">
            {error instanceof Error ? error.message : "Failed to load profile"}
          </p>
        )}
        {profile && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field id="username" label="Username">
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>
              <Field id="full_name" label="Full name">
                <Input
                  id="full_name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </Field>
              <Field id="city" label="City">
                <Input
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </Field>
              <div className="flex items-center justify-between rounded-md border px-3 py-2">
                <Label htmlFor="is_maker" className="text-sm font-medium">
                  Is maker
                </Label>
                <Switch
                  id="is_maker"
                  checked={isMaker}
                  onCheckedChange={setIsMaker}
                />
              </div>
            </div>
            <Field id="bio" label="Bio">
              <Textarea
                id="bio"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Field>

            <div className="flex items-center justify-between border-t pt-4">
              <p className="text-xs text-muted-foreground">
                ID: <code className="text-[11px]">{profile.id}</code>
              </p>
              <Button
                onClick={handleSave}
                disabled={updateProfile.isPending || !username.trim()}
              >
                {updateProfile.isPending ? "Saving…" : "Save profile"}
              </Button>
            </div>

            {updateProfile.isError && (
              <p className="text-sm text-destructive">
                {updateProfile.error instanceof Error
                  ? updateProfile.error.message
                  : "Update failed"}
              </p>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function FilesSection() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const uploadFile = useUploadFile()
  const myFiles = useMyFiles()

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setSelectedFile(file)
    uploadFile.reset()
  }

  function handleUpload() {
    if (!selectedFile) return
    uploadFile.mutate(selectedFile, {
      onSuccess: () => {
        setSelectedFile(null)
        if (inputRef.current) inputRef.current.value = ""
      },
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="file">Upload an .stl file (max 25 MB)</Label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              ref={inputRef}
              id="file"
              type="file"
              accept=".stl"
              onChange={handleFileChange}
            />
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploadFile.isPending}
            >
              {uploadFile.isPending ? "Uploading…" : "Upload"}
            </Button>
          </div>
          {uploadFile.isSuccess && (
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Uploaded — file id <code>{uploadFile.data.id}</code>
            </p>
          )}
          {uploadFile.isError && (
            <p className="text-sm text-destructive">
              {uploadFile.error instanceof Error
                ? uploadFile.error.message
                : "Upload failed"}
            </p>
          )}
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">My files</h3>
            {myFiles.data && (
              <Badge variant="secondary">{myFiles.data.count ?? 0}</Badge>
            )}
          </div>

          {myFiles.isLoading && (
            <p className="text-sm text-muted-foreground">Loading…</p>
          )}
          {myFiles.error && (
            <p className="text-sm text-destructive">
              {myFiles.error instanceof Error
                ? myFiles.error.message
                : "Failed to load files"}
            </p>
          )}
          {myFiles.data && myFiles.data.data.length === 0 && (
            <p className="text-sm text-muted-foreground">No files yet.</p>
          )}
          {myFiles.data && myFiles.data.data.length > 0 && (
            <ul className="divide-y rounded-md border">
              {myFiles.data.data.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 text-sm"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{file.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {file.mime_type ?? "—"} ·{" "}
                      {file.size_bytes != null
                        ? `${(file.size_bytes / 1024).toFixed(1)} KB`
                        : "size unknown"}{" "}
                      · {file.storage_bucket}/{file.storage_path ?? "—"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {file.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  )
}
