import { uploadFile } from "@/lib/storage"
import { supabase } from "@/lib/supabase"

const BUCKET = "print-files"
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024 // 25MB

export async function uploadPrintFile(file: File) {
  if (!file.name.toLowerCase().endsWith(".stl")) {
    throw new Error("Only .stl files are allowed")
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Maximum size is 25MB.")
  }

  const fileUrl = uploadFile(BUCKET, file)

  const { data, error } = await supabase
    .from("jobs")
    .insert([
      {
        file_url: fileUrl,
        status: "draft",
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateJobSettings(
  jobId: string,
  settings: { color: string; material: string; price: number }
) {
  const { data, error } = await supabase
    .from("jobs")
    .update({
      color: settings.color,
      material: settings.material,
      estimated_price: settings.price,
      status: "pending",
    })
    .eq("id", jobId)
    .select()
    .single()

  if (error) throw error
  return data
}
