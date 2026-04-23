import { useRef, useState } from "react"
import { uploadPrintFile } from "../services/uploadService"
import { Button } from "@/components/ui/button"

type Status = "idle" | "uploading" | "success" | "error"

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFileName(file?.name ?? null)
    setStatus("idle")
    setErrorMsg(null)
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setStatus("uploading")
    setErrorMsg(null)

    try {
      await uploadPrintFile(file)
      setStatus("success")
      setFileName(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch (err) {
      setStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Upload failed")
    }
  }

  return (
    <div className="w-full max-w-lg rounded-lg border p-6 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Upload Print File</h2>

      <div
        className="flex flex-col items-center justify-center rounded-md border-2 border-dashed p-8 cursor-pointer hover:bg-muted/40 transition-colors"
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
            <p className="text-sm text-muted-foreground">Click to select an STL file</p>
            <p className="text-xs text-muted-foreground mt-1">.stl only</p>
          </>
        )}
      </div>

      {status === "success" && (
        <p className="text-sm text-green-600 dark:text-green-400">File uploaded successfully!</p>
      )}
      {status === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button
        onClick={handleUpload}
        disabled={!fileName || status === "uploading"}
      >
        {status === "uploading" ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}
