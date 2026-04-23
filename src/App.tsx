import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import DashboardPage from "@/pages/DashboardPage"
import NotFoundPage from "@/pages/NotFoundPage"
import ProtectedRoute from "@/components/ProtectedRoute"
import AppLayout from "@/layouts/AppLayout"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
