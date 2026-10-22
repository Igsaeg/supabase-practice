import { Routes, Route, Navigate } from "react-router-dom";
import { useSession } from "../app/App"

import HomePage from "../pages/home"
import AuthPage from "../pages/auth"
import DashboardPage from "../pages/dashboard"

export default function _Routes() {
  const session = useSession();
  
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="*" element={<h1>404 Page not found.</h1>} />

      <Route path="/dashboard" element={session ? <DashboardPage /> : <Navigate to="/auth" replace />} />
    </Routes>
  )
}