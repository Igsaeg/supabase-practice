import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { signUp, logIn } from "../lib/supabase/auth";

type FieldName = "displayName" | "email" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export default function Forms() {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  function validate(): FieldErrors {
    const errors: FieldErrors = {};

    if (isSigningUp && !displayName.trim()) {
      errors.displayName = "Display name is required.";
    }

    if (!email.trim()) {
      errors.email = "Email is required.";
    } else if (!EMAIL_REGEX.test(email.trim())) {
      errors.email = "Please enter a valid email address.";
    }

    if (!password) {
      errors.password = "Password is required.";
    } else if (isSigningUp && password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    return errors;
  }

  function clearFieldError(field: FieldName) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function switchMode() {
    setIsSigningUp((prev) => !prev);
    setFieldErrors({});
    setErrorMessage("");
    setSuccessMessage("");
  }

  async function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);

    try {
      if (isSigningUp) await signUp(
        email,
        password,
        displayName,
        setErrorMessage,
        setSuccessMessage,
        navigate
      )
      else await logIn(
        email,
        password,
        setErrorMessage,
        navigate
      )
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = (field: FieldName) =>
    `${fieldErrors[field] ? "input_error" : "input_default"} transition_default`;

  return (
    <div className="surface_default px-10 py-12 w-md">
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-3">
          {isSigningUp ? "Let's get you started" : "Welcome back"}
        </h2>
        <p className="text-text-secondary">
          {isSigningUp ? "Takes less than a minute." : "Pick up right where you left off."}
        </p>
      </div>

      <form onSubmit={submitForm} noValidate className="flex flex-col gap-3">
        {isSigningUp && (
          <div className="flex flex-col gap-1">
            <label htmlFor="displayName" className="input_label">Display Name</label>
            <input
              className={inputClass("displayName")}
              type="text"
              id="displayName"
              name="displayName"
              placeholder="e.g., Alex Morgan"
              autoComplete="username"
              aria-invalid={!!fieldErrors.displayName}
              aria-describedby={fieldErrors.displayName ? "displayName-error" : undefined}
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                clearFieldError("displayName");
              }}
            />
            {fieldErrors.displayName && (
              <p id="displayName-error" className="input_hint_error">
                {fieldErrors.displayName}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="input_label">Email Address</label>
          <input
            className={inputClass("email")}
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
          />
          {fieldErrors.email && (
            <p id="email-error" className="input_hint_error">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label htmlFor="password" className="input_label">Password</label>
            <button
              className="button_text input_label text-sm"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-controls="password"
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <input
            className={inputClass("password")}
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder={isSigningUp ? "Create a password" : "Enter your password"}
            autoComplete={isSigningUp ? "new-password" : "current-password"}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
          />
          {fieldErrors.password && (
            <p id="password-error" className="input_hint_error">
              {fieldErrors.password}
            </p>
          )}
        </div>

        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        {successMessage && <p className="text-success">{successMessage}</p>}

        <button
          className={`transition_default w-full ${isSubmitting ? "button_disabled" : "button_accent"} ${errorMessage || successMessage ? "" : "mt-5"}`}
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Please wait..." : isSigningUp ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="text-center mt-6">
        {isSigningUp ? "Already have an account?" : "Don't have an account?"}&nbsp;
        <button
          className="button_text"
          type="button"
          onClick={switchMode}
          aria-pressed={showPassword}
        >
          {isSigningUp ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}