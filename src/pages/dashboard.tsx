import { useSession } from "../app/App"
import { supabase } from "../lib/supabase"

async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error(error.message)
}

export default function Page() {
  const session = useSession();

  return (
    <div>
      <h1>if you are seeing this then you're logged in as {session?.user.user_metadata.display_name}</h1>
      <button type="button" onClick={logout}>logout</button>
    </div>
  )
}