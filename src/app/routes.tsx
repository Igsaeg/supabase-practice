import { Routes, Route, Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useSession } from "../app/App"

import HomePage from "../pages/home"
import AuthPage from "../pages/auth"

function ProtectedRoute({ children }: { children: ReactNode }) {
  const session = useSession();

  if (session === undefined) return <div>Loading...</div>;
  return session ? children : <Navigate to="/auth" replace />;
}

export default function _Routes() {
  const session = useSession();
  
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
      <Route path="/auth" element={session ? <Navigate to="/" replace /> : <AuthPage />} />

      <Route path="*" element={<h1>404 Page not found.</h1>} />
    </Routes>
  )
}
