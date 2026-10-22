import { useEffect, useState } from "react";
import { useSession } from "../app/App"
import { supabase } from "../lib/supabase"

type Task = {
  id: string | number;
  title: string;
};

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const session = useSession();

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error.message)
  }

  async function insertTask(title: string, body: string) {
    const { error } = await supabase
      .from("tasks")
      .insert({ title, body, is_completed: false })
      .select();

    if (error) {
      console.error("Insert failed:", error.message);
      return null;
    }
  }

  useEffect(() => {
    async function getTasks() {
      const { data, error } = await supabase
        .from("tasks")
        .select("id, title, body");

      if (error) {
        console.error("Fetch failed:", error.message);
        return;
      }
      setTasks(data);
    }
    getTasks();
  }, []);

  return (
    <div>
      <h1>if you are seeing this then you're logged in as {session?.user.user_metadata.display_name}</h1>
      <button type="button" onClick={logout}>logout</button>

      <button className="button_accent" type="button" onClick={() => insertTask("asasdas", "hello hello")}>press</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title} {task.body}</li>
        ))}
      </ul>
    </div>
  )
}