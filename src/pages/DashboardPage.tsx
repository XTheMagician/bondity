import { useAuth } from "@/features/auth/hooks/useAuth"
import { useNavigate } from "react-router-dom"

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate("/login")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Logged in as {user?.email}</p>
      <button
        onClick={handleSignOut}
        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
      >
        Sign out
      </button>
    </div>
  )
}
