import React, { useState } from "react";
import { BsPerson, BsEnvelope, BsLock } from "react-icons/bs";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import { register } from "../../apis/ProjectApi";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await register(formData);
      alert("Register success!");
      console.log(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại";
      alert(msg);
      console.error(err);
    }
  };
  return (
    <div className="form-box register">
      <form action="">
        <h1>Registration</h1>
        <div className="input-box">
          <input
            type="text"
            name="fullname"
            placeholder="Fullname"
            required
            onChange={handleChange}
          />
        </div>
        <div className="input-box">
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            onChange={handleChange}
          />
          <BsPerson className="icon" />
        </div>
        <div className="input-box">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleChange}
          />
          <BsEnvelope className="icon" />
        </div>
        <div className="input-box">
          <input
            type="password"
            name="password"
            placeholder=""
            required
            onChange={handleChange}
          />
          <BsLock className="icon" />
        </div>
        <button type="submit" className="login-page-btn" onClick={handleSubmit}>
          Registration
        </button>
        {/* <p>or Registration with social platform</p>
        <div className="social-icons">
          <a href="#">
            <FaGoogle />
          </a>
          <a href="#">
            <FaFacebook />
          </a>
        </div> */}
      </form>
    </div>
  );
}
