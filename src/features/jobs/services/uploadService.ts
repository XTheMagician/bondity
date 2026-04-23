import { uploadFile } from "@/lib/storage"

const BUCKET = "print-files"

export async function uploadPrintFile(file: File) {
  if (!file.name.toLowerCase().endsWith(".stl")) {
    throw new Error("Only .stl files are allowed")
  }

  return uploadFile(BUCKET, file)
}
