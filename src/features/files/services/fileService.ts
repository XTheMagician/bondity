import { supabase } from "@/lib/supabase"
import { createSignedUrl } from "@/lib/storage"
import type { File as DbFile, FileInsert } from "@/types"

export async function createFile(input: FileInsert): Promise<DbFile> {
  const { data, error } = await supabase
    .from("files")
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getFile(fileId: string): Promise<DbFile> {
  const { data, error } = await supabase
    .from("files")
    .select()
    .eq("id", fileId)
    .single()
  if (error) throw error
  return data
}

export async function getDownloadUrl(file: DbFile): Promise<string> {
  if (!file.storage_path) throw new Error("File has no storage_path")
  return createSignedUrl(file.storage_bucket, file.storage_path)
}
