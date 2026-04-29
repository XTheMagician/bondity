import { uploadFile } from "@/lib/storage"

const BUCKET = "print-files"
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024

export async function uploadPrintFile(file: File): Promise<string> {
  if (!file.name.toLowerCase().endsWith(".stl")) {
    throw new Error("Only .stl files are allowed")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File is too large. Maximum size is 25MB.")
  }
  return uploadFile(BUCKET, file)
}
