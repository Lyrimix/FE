import React, { useState } from "react";
import { BsPerson, BsLock } from "react-icons/bs";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { login } from "../../apis/ProjectApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/context/UserContext";
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
      const res = await login(formData); // Gọi API login
      const token = res.data.result.token || res.data.token;
      const user = res.data.result.user;
      
      localStorage.setItem("token", token); // Lưu token
      setUser(user); // Lưu user info vào context

      alert("Đăng nhập thành công!");
      navigate("/homepage"); // Chuyển trang
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại";
      alert(msg);
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
        <div className="forgot-link">
          <a href="#">Forgot password</a>
        </div>
        <button type="submit" className="login-page-btn" onClick={handleSubmit}>
          Login
        </button>
        {/* <p>or login with social platform</p> */}
        {/* <div className="social-icons">
          <a onClick={handleGoogleLogin} style={{ cursor: "pointer" }}>
            <FaGoogle />
          </a>
          <a onClick={handleFacebookLogin} style={{ cursor: "pointer" }}>
            <FaFacebook />
          </a>
        </div> */}
      </form>
    </div>
  );
}
