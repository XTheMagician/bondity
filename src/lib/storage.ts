import { supabase } from "@/lib/supabase"

export type UploadResult = {
  path: string
  publicUrl: string
}

export async function uploadFile(
  bucket: string,
  file: File,
  path?: string
): Promise<UploadResult> {
  const filePath = path ?? `${Date.now()}_${file.name}`

  const { error } = await supabase.storage.from(bucket).upload(filePath, file)

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath)
  return { path: filePath, publicUrl: data.publicUrl }
}
