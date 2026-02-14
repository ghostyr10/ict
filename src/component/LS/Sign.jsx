import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Sign.css";
import { signup } from "../../api/auth";

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const res = await signup(name, email, password); // calls backend /auth/signup
      console.log(res.data);

      if (!res.data.success) {
        alert(res.data.message || "Signup failed");
        return;
      }

      alert("Account created successfully");
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img
          src="https://www.brownandstorey.com/content/wp-content/uploads/2022/06/View-01.jpg"
          alt="Urban Connect"
          className="signup-image"
        />
      </div>

      <div className="signup-right">
        <h2>Create your account</h2>
        <p className="subtitle">Sign up to get started with Urban Connect</p>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-black1" onClick={handleSignup}>
          Sign Up
        </button>

        <p className="signup-text1">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
