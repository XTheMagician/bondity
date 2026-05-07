import { supabase } from "@/lib/supabase"

export type UploadResult = {
  bucket: string
  path: string
}

export async function uploadToOwnFolder(
  bucket: string,
  ownerId: string,
  file: File,
  filename: string
): Promise<UploadResult> {
  const path = `${ownerId}/${crypto.randomUUID()}_${filename}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { contentType: file.type || undefined })

  if (error) throw error

  return { bucket, path }
}

export async function removeFromBucket(bucket: string, path: string) {
  await supabase.storage.from(bucket).remove([path])
}

export async function createSignedUrl(
  bucket: string,
  path: string,
  expiresInSeconds = 60 * 60
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds)
  if (error) throw error
  return data.signedUrl
}
