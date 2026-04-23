import { supabase } from "@/lib/supabase"

const BUCKET = "print-files"

export async function uploadPrintFile(file: File) {
  if (!file.name.toLowerCase().endsWith(".stl")) {
    throw new Error("Only .stl files are allowed")
  }

  const filePath = `${Date.now()}_${file.name}`

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file)

  if (error) throw error

  return data
}
