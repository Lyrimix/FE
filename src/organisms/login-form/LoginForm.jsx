import React, { useState } from "react";
import { BsPerson, BsLock } from "react-icons/bs";
import { login } from "../../apis/ProjectApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/context/UserContext";
import { toast } from "react-toastify";
import "../../style/ToastifyCustom.css";
export default function LoginForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      console.log("Updated formData:", updated);
      return updated;
    });
  };
  const navigate = useNavigate();
  const { setUser } = useUser();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(formData);
      const token = res.data.result.token || res.data.token;
      const user = res.data.result.user;

      localStorage.setItem("token", token);
      setUser(user);

      toast.success("Login successful!", {
        autoClose: 2000,
      });

      setTimeout(() => {
        navigate("/homepage");
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      toast.error(msg, {
        autoClose: 5000,
      });
      console.error(err);
    }
  };
  return (
    <div className="form-box login">
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input
            type="text"
            placeholder="Username"
            required
            name="username"
            onChange={handleChange}
          />
          <BsPerson className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            placeholder=""
            required
            name="password"
            onChange={handleChange}
          />
          <BsLock className="icon" />
        </div>
        <button type="submit" className="login-page-btn" onClick={handleSubmit}>
          Login
        </button>
      </form>
    </div>
  );
}
