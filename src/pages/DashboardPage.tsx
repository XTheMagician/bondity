import { useAuth } from "@/features/auth/hooks/useAuth"
import ProfileForm from "@/components/ProfileForm"
import FileUpload from "@/features/jobs/components/FileUpload"

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col items-center gap-8 p-6 pt-20">
      <div className="w-full max-w-lg">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">{user?.email}</p>
      </div>
      <ProfileForm />
      <FileUpload />
    </div>
  )
}
