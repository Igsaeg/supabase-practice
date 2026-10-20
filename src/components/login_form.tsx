import { useState } from "react";
import { supabase } from "../lib/supabase"; 

async function handleLogin(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    console.error(error.message)
    return
  }
}

export default function Form() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    handleLogin(email, password)

    setEmail("")
    setPassword("")
    setShowPassword(false)
  };
  
  return (
    <form onSubmit={submitForm}>
      <div className="flex flex-col">
        <label htmlFor="user_email">Email Address</label>
        <input
          type="email"
          id="user_email"
          value={email}
          onChange={(e) => {setEmail(e.target.value)}}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="user_password">Password</label>
        <input
          type={showPassword ? "text" : "password"}
          id="user_password"
          value={password}
          onChange={(e) => {setPassword(e.target.value)}}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}