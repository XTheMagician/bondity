import { useState } from "react"
import { useAuth } from "@/features/auth/hooks/useAuth"
import ProfileForm from "@/features/profiles/components/ProfileForm"
import FileUpload from "@/features/jobs/components/FileUpload"
import JobSettings from "@/features/jobs/components/JobSettings"
import PrinterList from "@/features/printers/components/PrinterList"

type Step = "upload" | "settings" | "printers" | "done"

export default function DashboardPage() {
  const { user } = useAuth()
  const [step, setStep] = useState<Step>("upload")
  const [jobId, setJobId] = useState<string | null>(null)
  const [fileSizeBytes, setFileSizeBytes] = useState(0)

  function handleJobCreated(id: string, size: number) {
    setJobId(id)
    setFileSizeBytes(size)
    setStep("settings")
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6 pt-20">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>
      <ProfileForm />

      {step === "upload" && <FileUpload onJobCreated={handleJobCreated} />}

      {step === "settings" && jobId && (
        <JobSettings
          jobId={jobId}
          fileSizeBytes={fileSizeBytes}
          onComplete={() => setStep("printers")}
        />
      )}

      {step === "printers" && jobId && (
        <PrinterList jobId={jobId} onChoose={() => setStep("done")} />
      )}

      {step === "done" && (
        <div className="flex w-full max-w-lg flex-col items-center gap-2 rounded-lg border p-6 text-center">
          <p className="text-2xl">✓</p>
          <h2 className="text-lg font-semibold">You're all set!</h2>
          <p className="text-sm text-muted-foreground">
            Your job has been submitted. Printers will be notified and you'll
            hear back soon.
          </p>
        </div>
      )}
    </div>
  )
}
