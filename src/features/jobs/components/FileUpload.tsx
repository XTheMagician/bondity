import { useRef, useState } from "react"
import { uploadPrintFile, updateJobSettings } from "../services/uploadService"
import { Button } from "@/components/ui/button"

type UploadStatus = "idle" | "uploading" | "success" | "error"
type SaveStatus = "idle" | "saving" | "saved" | "error"

const MATERIALS = ["PLA", "PETG", "ABS", "Resin"] as const
const COLORS = ["White", "Black", "Gray", "Red", "Blue", "Green", "Yellow"] as const

type Material = (typeof MATERIALS)[number]
type Color = (typeof COLORS)[number]

const MATERIAL_BASE_PRICE: Record<Material, number> = {
  PLA: 5,
  PETG: 8,
  ABS: 10,
  Resin: 15,
}

const COLOR_SURCHARGE: Record<Color, number> = {
  White: 0,
  Black: 0,
  Gray: 0,
  Red: 2,
  Blue: 2,
  Green: 2,
  Yellow: 2,
}

function calcPrice(material: Material, color: Color, fileSizeBytes: number): number {
  const base = MATERIAL_BASE_PRICE[material]
  const colorExtra = COLOR_SURCHARGE[color]
  const sizeExtra = (fileSizeBytes / (1024 * 1024)) * 0.1
  return parseFloat((base + colorExtra + sizeExtra).toFixed(2))
}

export default function FileUpload() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [job, setJob] = useState<{ id: string } | null>(null)
  const [fileSizeBytes, setFileSizeBytes] = useState(0)
  const [material, setMaterial] = useState<Material>("PLA")
  const [color, setColor] = useState<Color>("White")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    setFileName(file?.name ?? null)
    setUploadStatus("idle")
    setErrorMsg(null)
    setJob(null)
    setSaveStatus("idle")
  }

  async function handleUpload() {
    const file = inputRef.current?.files?.[0]
    if (!file) return

    setUploadStatus("uploading")
    setErrorMsg(null)

    try {
      const created = await uploadPrintFile(file)
      setJob(created)
      setFileSizeBytes(file.size)
      setUploadStatus("success")
      setFileName(null)
      if (inputRef.current) inputRef.current.value = ""
    } catch (err) {
      setUploadStatus("error")
      setErrorMsg(err instanceof Error ? err.message : "Upload failed")
    }
  }

  async function handleSaveSettings() {
    if (!job) return
    const price = calcPrice(material, color, fileSizeBytes)
    setSaveStatus("saving")
    try {
      await updateJobSettings(job.id, { color, material, price })
      setSaveStatus("saved")
    } catch {
      setSaveStatus("error")
    }
  }

  const price = calcPrice(material, color, fileSizeBytes)

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

      {uploadStatus === "error" && (
        <p className="text-sm text-destructive">{errorMsg}</p>
      )}

      <Button
        onClick={handleUpload}
        disabled={!fileName || uploadStatus === "uploading"}
      >
        {uploadStatus === "uploading" ? "Uploading..." : "Upload"}
      </Button>

      {job && (
        <div className="flex flex-col gap-4 border-t pt-4">
          <h3 className="text-base font-semibold">Job Settings</h3>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Material</label>
            <select
              value={material}
              onChange={(e) => { setMaterial(e.target.value as Material); setSaveStatus("idle") }}
              className="rounded-md border px-3 py-2 text-sm bg-background"
            >
              {MATERIALS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Color</label>
            <select
              value={color}
              onChange={(e) => { setColor(e.target.value as Color); setSaveStatus("idle") }}
              className="rounded-md border px-3 py-2 text-sm bg-background"
            >
              {COLORS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between rounded-md bg-muted/40 px-4 py-3">
            <span className="text-sm font-medium">Estimated Price</span>
            <span className="text-lg font-bold">€{price.toFixed(2)}</span>
          </div>

          <Button
            onClick={handleSaveSettings}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
          >
            {saveStatus === "saving" ? "Saving..." : saveStatus === "saved" ? "Saved!" : "Confirm Settings"}
          </Button>

          {saveStatus === "error" && (
            <p className="text-sm text-destructive">Failed to save settings. Please try again.</p>
          )}
        </div>
      )}
    </div>
  )
}
