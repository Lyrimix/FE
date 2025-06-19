import React, { useState } from "react";
import { BsPerson, BsEnvelope, BsLock } from "react-icons/bs";
import { register } from "../../apis/ProjectApi";
import { toast } from "react-toastify";
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
      toast.success("Register successful!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      toast.error(msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.error(err);
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
      </form>
    </div>
  );
}
