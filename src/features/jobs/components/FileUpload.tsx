import { useRef, useState } from "react"
import { uploadPrintFile } from "../services/uploadService"
import { createJob } from "../services/jobService"
import { Button } from "@/components/ui/button"

type UploadStatus = "idle" | "uploading" | "error"

type Props = {
  onJobCreated: (jobId: string, fileSizeBytes: number) => void
}

export default function FileUpload({ onJobCreated }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFileName(file?.name ?? null)
    setUploadStatus("idle")
    setErrorMsg(null)
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setUploadStatus("uploading")
    setErrorMsg(null)

    try {
      const { fileId, sizeBytes } = await uploadPrintFile(file)
      const created = await createJob(fileId)
      onJobCreated(created.id, sizeBytes)
    } catch (err) {
      setUploadStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Upload failed")
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Upload Print File</h2>

      <div
        className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed p-8 transition-colors hover:bg-muted/40"
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".stl"
          className="hidden"
          onChange={handleFileChange}
        />
        {fileName ? (
          <p className="text-sm font-medium">{fileName}</p>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              Click to select an STL file
            </p>
            <p className="mt-1 text-xs text-muted-foreground">.stl only</p>
          </>
        )}
      </div>

      {uploadStatus === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button
        onClick={handleUpload}
        disabled={!fileName || uploadStatus === "uploading"}
      >
        {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}
