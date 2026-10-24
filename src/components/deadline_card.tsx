type DeadlineCard = {
  title: string
  description: string;
  due_date: string;
};

export default function DeadlineCard({
  title,
  description,
  due_date,
}: DeadlineCard) {
  return (
    <div className="surface_interactive transition_default px-5 py-6 flex flex-col justify-between">
      <div>
        <h2 className="text-xl mb-2.5">{title}</h2>
        <p className="text-text-secondary">{description}</p>
      </div>

      <p className="mt-4">{due_date}</p>
    </div>
  );
}