import { supabase } from "./supabase_client"

export async function insertDeadline(
  title: string,
  description: string,
  due_date: string
) {
  const { error } = await supabase
    .from("deadlines")
    .insert({ title, description, due_date, is_completed: false });

  if (error) {
    console.error("Insert failed:", error.message);
    return;
  }
}

export async function fetchDeadlines() {
  const { data, error } = await supabase
    .from("deadlines")
    .select("id, title, description, due_date, is_completed");

  if (error) {
    console.error("Fetch failed:", error.message);
    return;
  }
  return data;
}