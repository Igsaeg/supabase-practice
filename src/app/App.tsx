import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, createContext } from "react";
import { supabase } from "../lib/supabase"
import type { Session } from "@supabase/supabase-js"

import HomePage from "../pages/main"
import AboutPage from "../pages/test"
import AuthPage from "../pages/auth"

export const SessionContext = createContext<Session | null>(null);

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) return null
  
  return (
    <SessionContext.Provider value={session ?? null}>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/" element={session ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route path="/signup" element={<AboutPage />} />
            <Route path="/login" element={session ? <Navigate to="/" replace /> : <AuthPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SessionContext.Provider>
  );
}