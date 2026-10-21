import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Forms() {
  const [isSigningUp, setIsSigningUp] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submitForm(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isSigningUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName } },
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (!data.session) {
          setSuccessMessage("Check your email to confirm your account.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMessage(error.message);
          return;
        }
      }
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-surface px-10 py-12 w-md rounded-xl border border-border-subtle">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-medium mb-1">
          {isSigningUp ? "Let's get you started" : "Welcome back"}
        </h2>
        <p className="text-text-secondary">
          {isSigningUp ? "Takes less than a minute." : "Pick up right where you left off."}
        </p>
      </div>

      <form onSubmit={submitForm} className="flex flex-col gap-3">
        {isSigningUp && (
          <div className="flex flex-col gap-1">
            <label htmlFor="displayName">Display Name</label>
            <input
              className="input"
              type="text"
              id="displayName"
              name="displayName"
              placeholder="e.g., Alex Morgan"
              autoComplete="nickname"
              required
              aria-required="true"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor="email">Email Address</label>
          <input
            className="input"
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            aria-required="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <label htmlFor="password">Password</label>
            <button
              className="button_text w-fit text-text-secondary"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-controls="user_password"
              aria-pressed={showPassword}
            >
              {showPassword ? "Hide password" : "Show password"}
            </button>
          </div>

          <input
            className="input"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder={isSigningUp ? "Create a password" : "Enter your password"}
            autoComplete={isSigningUp ? "new-password" : "current-password"}
            required
            aria-required="true"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="button mt-4" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : isSigningUp ? "Create account" : "Log in"}
        </button>
      </form>

      <p className="text-center mt-6">
        {isSigningUp ? "Already have an account?" : "Dont have an account?"}&nbsp;
        <button
          className="button_text"
          type="button"
          onClick={() => setIsSigningUp((prev) => !prev)}
          aria-controls="user_password"
          aria-pressed={showPassword}
        >
          {isSigningUp ? "Log in" : "Sign up"}
        </button>
      </p>
    </div>
  );
}