import { useEffect, useState } from "react";
import { parseDate } from "../lib/parse_timestamptz";
import { fetchDeadlines, insertDeadline } from "../lib/supabase/deadlines";
import { logout } from "../lib/supabase/auth";
import DeadlineCard from "../components/deadline_card";

type Deadline = {
  id: string;
  title: string;
  description: string;
  due_date: string;
  is_completed: boolean;
}

export default function Page() {
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadDeadlines() {
      try {
        const data = await fetchDeadlines();
        if (!ignore) setDeadlines(data);
      } catch {
        if (!ignore) setErrorMessage("Could not load deadlines. Please try again.");
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadDeadlines();

    return () => { ignore = true; };
  }, []);

  function formatDate(date: string) {
    const { monthName, day, hour, minute } = parseDate(date);
    return `Due ${monthName} ${day} ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  }

  return (
    <div className="flex justify-center">
      <div className="w-4xl mt-26">
        <div className="mb-8">
          <div className="mb-8">
            <h1 className="text-4xl mb-3">Deadlines</h1>
            <p className="text-text-secondary">What's coming up, and how much time is left.</p>
          </div>

          <div className="flex gap-2">
            <button
              className="button_accent"
              type="button"
            >
              New Deadline
            </button>
            <button
              className="button_secondary"
              type="button"
              onClick={logout}
            >
              Log out
            </button>
          </div>
        </div>

        <div className="divider_default mb-6"></div>

        <div className="grid grid-cols-3 gap-2">
          {isLoading ? (
            <h2>skeleton loaderrr</h2>
          ) : (deadlines.map((task) => (
            <DeadlineCard
              key={task.id}
              title={task.title}
              description={task.description}
              due_date={formatDate(task.due_date)}
            />
          )))}
        </div>
      </div>
    </div>
  )
}