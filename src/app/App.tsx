import { BrowserRouter } from "react-router-dom";
import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "../lib/supabase/supabase_client"
import type { Session } from "@supabase/supabase-js"
import Routes from "./routes";

const SessionContext = createContext<Session | null>(null);

export const useSession = () => { return useContext(SessionContext); }

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
        {/* Navbar goes here */}
        <main>
          <Routes />
        </main>
        {/* Footer goes here */}
      </BrowserRouter>
    </SessionContext.Provider>
  );
}