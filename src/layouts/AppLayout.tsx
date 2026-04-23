import { Outlet } from "react-router-dom"
import AppNavbar from "@/components/AppNavbar"

export default function AppLayout() {
  return (
    <div className="flex min-h-svh flex-col">
      <AppNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
