import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import { login } from "../../api/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await login(email, password); // call backend /auth/login
      console.log(res.data);
            if (!res.data.success) {
        alert(res.data.message || "Login failed");
        return;
      }

      // Store JWT token
      localStorage.setItem("token", res.data.jwtToken);
      localStorage.setItem("isAdmin", res.data.isAdmin); // store admin status

      // Redirect based on role
      if (res.data.isAdmin) {
        navigate("/admin"); // admin dashboard route
      } else {
        navigate("/home"); // normal user route
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <h2>Welcome back?</h2>
        <p className="subtitle">
          The faster you fill up, the faster you get a ticket
        </p>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn-black" onClick={handleLogin}>
          Sign In
        </button>

        <p className="signup-text">
          Don’t have an account? <Link to="/sign">Sign up</Link>
        </p>
      </div>

      <div className="login-right"></div>
    </div>
  );
}
