import React, { useState } from "react";
import LoginForm from "../../organisms/login-form/LoginForm";
import RegisterForm from "../../organisms/login-form/RegisterForm";
import "./LoginPage.css";

export default function LoginRegister() {
  const [active, setActive] = useState(false);

  return (
    <div className="login-register">
      <div className={`containerLogin${active ? " active" : ""}`}>
        <LoginForm />
        <RegisterForm />

        <div className="toggle-box">
          <div className="toggle-panel toggle-left">
            <h1>Hello, Welcome</h1>
            <p>Don't have an account?</p>
            <button
              className="login-page-btn register-btn"
              onClick={() => setActive(true)}
            >
              Register
            </button>
          </div>
          <div className="toggle-panel toggle-right">
            <h1>Welcome Back!</h1>
            <p>Already have an account?</p>
            <button
              className="login-page-btn login-btn"
              onClick={() => setActive(false)}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
