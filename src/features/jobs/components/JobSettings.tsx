import { useState } from "react"
import { updateJob } from "../services/jobService"
import { Button } from "@/components/ui/button"
import { MATERIALS, COLORS, type Material, type Color } from "../types"
import { calcPrice } from "../utils"

type SaveStatus = "idle" | "saving" | "saved" | "error"

type Props = {
  jobId: string
  fileSizeBytes: number
  onComplete: () => void
}

export default function JobSettings({
  jobId,
  fileSizeBytes,
  onComplete,
}: Props) {
  const [material, setMaterial] = useState<Material>("PLA")
  const [color, setColor] = useState<Color>("White")
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle")

  const price = calcPrice(material, color, fileSizeBytes)

  async function handleSave() {
    const estimated_price = calcPrice(material, color, fileSizeBytes)
    setSaveStatus("saving")
    try {
      await updateJob(jobId, { color, material, estimated_price })
      setSaveStatus("saved")
      onComplete()
    } catch {
      setSaveStatus("error")
    }
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-4 rounded-lg border p-6">
      <h2 className="text-lg font-semibold">Job Settings</h2>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Material</label>
        <select
          value={material}
          onChange={(e) => {
            setMaterial(e.target.value as Material)
            setSaveStatus("idle")
          }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          {MATERIALS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Color</label>
        <select
          value={color}
          onChange={(e) => {
            setColor(e.target.value as Color)
            setSaveStatus("idle")
          }}
          className="rounded-md border bg-background px-3 py-2 text-sm"
        >
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center justify-between rounded-md bg-muted/40 px-4 py-3">
        <span className="text-sm font-medium">Estimated Price</span>
        <span className="text-lg font-bold">€{price.toFixed(2)}</span>
      </div>

      <Button
        onClick={handleSave}
        disabled={saveStatus === "saving" || saveStatus === "saved"}
      >
        {saveStatus === "saving" ? "Saving..." : "Confirm Settings"}
      </Button>

      {saveStatus === "error" && (
        <p className="text-sm text-destructive">
          Failed to save settings. Please try again.
        </p>
      )}
    </div>
  )
}
