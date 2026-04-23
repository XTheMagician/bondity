import { supabase } from "@/lib/supabase"

export async function uploadFile(bucket: string, file: File, path?: string) {
  const filePath = path ?? `${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file)

  if (error) throw error

  return data
}
