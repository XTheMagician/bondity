import { supabase } from "@/lib/supabase"
import { uploadToOwnFolder, removeFromBucket } from "@/lib/storage"
import { createFile } from "@/features/files/services/fileService"

const BUCKET = "print-files"
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

export type UploadedPrintFile = {
  fileId: string
  sizeBytes: number
}

export async function uploadPrintFile(file: File): Promise<UploadedPrintFile> {
  if (!file.name.toLowerCase().endsWith(".stl")) {
    throw new Error("Only .stl files are allowed")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Maximum size is 25MB.")
  }

  const { data: userData, error: userErr } = await supabase.auth.getUser()
  if (userErr) throw userErr
  const userId = userData.user?.id
  if (!userId) throw new Error("You must be signed in to upload a file")

  const uploaded = await uploadToOwnFolder(BUCKET, userId, file, file.name)

  try {
    const row = await createFile({
      owner_id: userId,
      name: file.name,
      original_filename: file.name,
      mime_type: file.type || "application/sla",
      size_bytes: file.size,
      storage_bucket: uploaded.bucket,
      storage_path: uploaded.path,
    })
    return { fileId: row.id, sizeBytes: file.size }
  } catch (err) {
    // Roll back the storage object so we don't leave orphaned blobs.
    await removeFromBucket(uploaded.bucket, uploaded.path)
    throw err
  }
}
