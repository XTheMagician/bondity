import { Outlet } from "react-router-dom"
import AppNavbar from "@/components/AppNavbar"

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppNavbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4">
        <Outlet />
      </main>
    </div>
  )
}
