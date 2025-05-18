import React, { useState } from "react";
import { BsPerson, BsEnvelope, BsLock } from "react-icons/bs";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import "./LoginPage.css";

export default function LoginRegister() {
  const [active, setActive] = useState(false);

  return (
    <div className="login-register">
      <div className={`containerLogin${active ? " active" : ""}`}>
        <div className="form-box login">
          <form action="">
            <h1>Login</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <BsPerson className="icon" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="" required />
              <BsLock className="icon" />
            </div>
            <div className="forgot-link">
              <a href="#">Forgot password</a>
            </div>
            <button type="submit" className="login-page-btn">
              Login
            </button>
            <p>or login with social platform</p>
            <div className="social-icons">
              <a href="#">
                <FaGoogle />
              </a>
              <a href="#">
                <FaFacebook />
              </a>
            </div>
          </form>
        </div>

        <div className="form-box register">
          <form action="">
            <h1>Registration</h1>
            <div className="input-box">
              <input type="text" placeholder="Username" required />
              <BsPerson className="icon" />
            </div>
            <div className="input-box">
              <input type="email" placeholder="Email" required />
              <BsEnvelope className="icon" />
            </div>
            <div className="input-box">
              <input type="password" placeholder="" required />
              <BsLock className="icon" />
            </div>
            <button type="submit" className="login-page-btn">
              Registration
            </button>
            <p>or Registration with social platform</p>
            <div className="social-icons">
              <a href="#">
                <FaGoogle />
              </a>
              <a href="#">
                <FaFacebook />
              </a>
            </div>
          </form>
        </div>

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
