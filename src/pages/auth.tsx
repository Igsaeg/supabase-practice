import { useState } from "react"
import SignupForm from "../components/signup_form"
import LoginForm from "../components/login_form"

export default function Page() {
  const [createAccount, setCreateAccount] = useState(false);

  return (
    <div>
      {createAccount ? (
          <>
            <SignupForm />
            <p>
              Already have an account?&nbsp;
              <button type="button" onClick={() => setCreateAccount(false)}>Log in</button>
            </p>
          </> 
        ) : (
          <>
            <LoginForm />
            <p>
              Dont have an account?&nbsp;
              <button type="button" onClick={() => setCreateAccount(true)}>Sign up</button>
            </p>
          </> 
        )
      }
    </div>
  )
}