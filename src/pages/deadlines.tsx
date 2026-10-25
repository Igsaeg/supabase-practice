import { useEffect, useState } from "react";
import { parseDate } from "../lib/parse_timestamptz";
import { fetchDeadlines } from "../lib/supabase/deadlines";
import { logout } from "../lib/supabase/auth";
import DeadlineCard from "../components/deadline_card";
import Skeleton from "../components/skeleton_loader";

type Deadline = {
  id: string;
  title: string;
  description: string;
  tags: string[],
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
      } catch (error) {
        if (!ignore) setErrorMessage(error.message);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    void loadDeadlines();

    return () => { ignore = true; };
  }, []);

  function formatDate(date: string) {
    const { monthName, day, hour, minute } = parseDate(date);
    return `Due ${monthName} ${day} (${hour}:${String(minute).padStart(2, "0")})`;
  }

  return (
    <div className="flex justify-center mx-6">
      <div className="max-w-5xl mt-24">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ">
          {isLoading ? (
            <>
              <Skeleton variant="rounded" height={176} />
              <Skeleton variant="rounded" height={176} />
              <Skeleton variant="rounded" height={176} className="hidden lg:block" />
            </>
          ) : errorMessage ? (
            <p className="text-danger col-span-full">{errorMessage}. Try again later.</p>
          ) : deadlines.length === 0 ? (
            <p className="text-text-secondary col-span-full">No deadlines yet.</p>
          ) : (
            deadlines.map((task) => (
              <DeadlineCard
                key={task.id}
                title={task.title}
                description={task.description}
                tags={task.tags}
                due_date={formatDate(task.due_date)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}