import { uploadFile } from "@/lib/storage"
import { createFile } from "./fileService"
import type { File as FileRow } from "@/types"

const BUCKET = "print-files"
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

export async function uploadStlFile(
  file: File,
  ownerId: string
): Promise<FileRow> {
  if (!file.name.toLowerCase().endsWith(".stl")) {
    throw new Error("Only .stl files are allowed")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Maximum size is 25MB.")
  }

  const { path, publicUrl } = await uploadFile(BUCKET, file)

  return createFile({
    owner_id: ownerId,
    name: file.name,
    original_filename: file.name,
    size_bytes: file.size,
    mime_type: file.type || "application/octet-stream",
    storage_bucket: BUCKET,
    storage_path: path,
    file_url: publicUrl,
  })
}
