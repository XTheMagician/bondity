import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import SignupPage from "@/pages/SignupPage"
import HomePage from "@/pages/HomePage"
import BrowsePage from "@/pages/BrowsePage"
import OrdersPage from "@/pages/OrdersPage"
import AvailableJobsPage from "@/pages/AvailableJobsPage"
import ProfilePage from "@/pages/ProfilePage"
import TestPage from "@/pages/TestPage"
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
          <Route path="/home" element={<HomePage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/available-jobs" element={<AvailableJobsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/test" element={<TestPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
