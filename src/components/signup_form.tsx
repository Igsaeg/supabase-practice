import { useState } from "react";
import { supabase } from "../lib/supabase"; 

async function handleSignup(displayName: string, email: string, password: string) {
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName }
    }
  })

  if (error) {
    console.error(error.message)
    return
  }
}

export default function Form() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submitForm = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    handleSignup(displayName, email, password)

    setDisplayName("")
    setEmail("")
    setPassword("")
    setShowPassword(false)
  };
  
  return (
    <form onSubmit={submitForm}>
      <div className="flex flex-col">
        <label htmlFor="user_name">Display Name</label>
        <input
          type="text"
          id="user_name"
          value={displayName}
          onChange={(e) => {setDisplayName(e.target.value)}}
        />
      </div>

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