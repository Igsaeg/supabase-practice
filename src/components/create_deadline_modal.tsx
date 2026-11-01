import React, { useState } from "react";
import { insertDeadline } from "../lib/supabase/deadlines";

type FieldName = "title" | "due_date";
type FieldErrors = Partial<Record<FieldName, string>>;

type CreateDeadlineModalProps = {
  setIsCreateDeadlineModalOpen: (isOpen: boolean) => void;
};

export default function CreateDeadlineModal({
  setIsCreateDeadlineModalOpen,
}: CreateDeadlineModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagsValue, setTagsValue] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (!title.trim()) errors.title = "Title is required.";
    if (!dueDate.trim()) errors.due_date = "Due date is required.";

    return errors;
  }

  const inputClass = (field: FieldName) =>
    `${fieldErrors[field] ? "input_error" : "input_default"} transition_default`;

  function clearFieldError(field: FieldName) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleTags(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const trimmed = value.trim();
    setTagsValue(value);
    
    if (!trimmed) return;
    if (value.endsWith(" ")) {
      setTags((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
      setTagsValue("");
    }
  }

  async function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      await insertDeadline(
        title,
        description,
        tags,
        new Date(dueDate).toISOString()
      );
      setIsCreateDeadlineModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="bg-surface/10 backdrop-blur fixed inset-0 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsCreateDeadlineModalOpen(false);
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-deadline-title"
        className="surface_default w-md px-10 py-12"
      >
        <h3 id="new-deadline-title" className="text-2xl text-center mb-6">New deadline</h3>

        <form className="flex flex-col gap-3" onSubmit={submitForm} noValidate>
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="input_label">Title</label>
            <input
              className={inputClass("title")}
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Design review"
              value={title}
              maxLength={80}
              autoComplete="off"
              aria-invalid={!!fieldErrors.title}
              aria-describedby={fieldErrors.title ? "title-error" : undefined}
              onChange={(e) => {
                setTitle(e.target.value);
                clearFieldError("title");
              }}
            />
            {fieldErrors.title && (
              <p id="title-error" className="input_hint_error">
                {fieldErrors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="description" className="input_label">Description</label>
            <textarea
              className="input_default h-22 resize-none"
              id="description"
              name="description"
              placeholder="Add a short reminder"
              value={description}
              maxLength={250}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="tags" className="input_label">Tags</label>
            <div className="input_default transition_default flex flex-wrap gap-2
                            focus-within:ring-3 focus-within:ring-accent-ring focus-within:border-accent-pressed"
            >
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <p key={tag} className="badge_accent w-fit line-clamp-1">
                      {tag}
                    </p>
                  ))}
                </div>
              )}
              <input
                className="min-w-10 flex-1 bg-transparent outline-none"
                id="tags"
                name="tags"
                type="text"
                placeholder="e.g. work, urgent"
                value={tagsValue}
                autoComplete="off"
                onChange={(e) => handleTags(e)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="deadlineDate" className="input_label">Due date</label>
            <input
              className={inputClass("due_date")}
              id="deadlineDate"
              name="due_date"
              type="datetime-local"
              value={dueDate}
              aria-invalid={!!fieldErrors.due_date}
              aria-describedby={fieldErrors.due_date ? "due-date-error" : undefined}
              onChange={(e) => {
                setDueDate(e.target.value);
                clearFieldError("due_date");
              }}
            />
            {fieldErrors.due_date && (
              <p id="due-date-error" className="input_hint_error">
                {fieldErrors.due_date}
              </p>
            )}
          </div>

          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          <div className="mt-2 flex gap-2">
            <button
              className="button_secondary flex-1"
              type="button"
              onClick={() => setIsCreateDeadlineModalOpen(false)}
            >Cancel
            </button>
            <button
              className={`${isSubmitting ? "button_disabled" : "button_accent"} transition_default flex-1 `}
              type="submit"
              disabled={isSubmitting}
            >{isSubmitting ? "Please wait..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}