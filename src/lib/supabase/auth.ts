import type { NavigateFunction } from 'react-router-dom';
import { supabase } from "./supabase_client"

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  setSuccessMessage: (message: string) => void,
  navigate: NavigateFunction
) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
    options: { data: { display_name: displayName.trim() } },
  });

  if (error) throw new Error(error.message);

  if (data.session) {
    navigate("/deadlines", { replace: true });
  } else {
    setSuccessMessage("Check your email to confirm your account.");
  }
}

export async function logIn(
  email: string,
  password: string,
  navigate: NavigateFunction
) {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) throw new Error(error.message);
  navigate("/deadlines", { replace: true });
}

export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw new Error(error.message);
}